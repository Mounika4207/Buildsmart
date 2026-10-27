const Booking = require('../models/Booking');
const Turf = require('../models/Turf');

/**
 * Generate a unique booking reference (e.g. PA-2026-8492)
 */
const generateReference = async () => {
  let unique = false;
  let reference = '';
  while (!unique) {
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    reference = `PA-2026-${randomCode}`;
    const exists = await Booking.findOne({ bookingReference: reference });
    if (!exists) {
      unique = true;
    }
  }
  return reference;
};

/**
 * @desc    Create a new booking with server-side slot & price validation
 * @route   POST /api/bookings
 * @access  Private (Authenticated users)
 */
const createBooking = async (req, res, next) => {
  try {
    const { turfId, date, startTime, duration = 1, sport, paymentMethod } = req.body;
    const numDuration = Number(duration);

    // 1. Fetch turf
    const turf = await Turf.findById(turfId);
    if (!turf) {
      return res.status(404).json({
        success: false,
        message: 'Sports turf not found.',
      });
    }

    // 2. Validate operating hours
    const startHour = parseInt(startTime.split(':')[0], 10);
    const endHour = startHour + numDuration;
    const openHour = parseInt((turf.openingHours?.open || '06:00').split(':')[0], 10);
    const closeHour = parseInt((turf.openingHours?.close || '23:00').split(':')[0], 10);

    if (startHour < openHour || endHour > closeHour) {
      return res.status(400).json({
        success: false,
        message: `Booking must fall within facility operating hours (${turf.openingHours?.open} - ${turf.openingHours?.close}).`,
      });
    }

    const calculatedEndTime = `${endHour < 10 ? `0${endHour}` : endHour}:00`;

    // 3. Concurrency & Overlap Prevention: Check existing active bookings
    const activeBookings = await Booking.find({
      turf: turfId,
      date,
      status: { $ne: 'cancelled' },
    });

    const isOverlap = activeBookings.some((b) => {
      const bStart = parseInt(b.startTime.split(':')[0], 10);
      const bEnd = parseInt(b.endTime.split(':')[0], 10);
      // Overlap condition: startHour < bEnd && endHour > bStart
      return startHour < bEnd && endHour > bStart;
    });

    if (isOverlap) {
      return res.status(409).json({
        success: false,
        message: 'The selected slot has already been reserved. Please pick another available time.',
      });
    }

    // 4. Check owner maintenance blocks
    const isBlocked = (turf.blockedSlots || []).some((bs) => {
      if (bs.date !== date) return false;
      const bsStart = parseInt(bs.startTime.split(':')[0], 10);
      const bsEnd = parseInt(bs.endTime.split(':')[0], 10);
      return startHour < bsEnd && endHour > bsStart;
    });

    if (isBlocked) {
      return res.status(409).json({
        success: false,
        message: 'This slot is blocked by the venue management for maintenance or private event.',
      });
    }

    // 5. Authoritative Price Calculation (NEVER trust frontend price totals)
    const authoritativeTotal = turf.pricePerHour * numDuration;

    // 6. Generate Unique Booking Reference
    const reference = await generateReference();

    // 7. Create and persist booking
    const booking = await Booking.create({
      bookingReference: reference,
      customer: {
        user: req.user._id,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone || req.body.customerPhone || '',
      },
      turf: turf._id,
      date,
      startTime,
      endTime: calculatedEndTime,
      duration: numDuration,
      sport: sport || turf.sports[0] || 'football',
      totalAmount: authoritativeTotal,
      status: 'confirmed',
      paymentStatus: paymentMethod === 'Simulated UPI' ? 'paid' : 'pending',
      paymentMethod: paymentMethod || 'Pay at Venue',
    });

    // Populate turf details for immediate frontend consumption
    await booking.populate('turf');

    res.status(201).json({
      success: true,
      booking,
      message: 'Booking confirmed successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all bookings for the currently authenticated customer
 * @route   GET /api/bookings/my
 * @access  Private
 */
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ 'customer.user': req.user._id })
      .sort({ createdAt: -1 })
      .populate('turf');

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get details of a single booking
 * @route   GET /api/bookings/:id
 * @access  Private
 */
const getBookingById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Support lookup by MongoDB _id or bookingReference (e.g. PA-2026-1024)
    const isMongoId = id.match(/^[0-9a-fA-F]{24}$/);
    const query = isMongoId ? { _id: id } : { bookingReference: id };

    const booking = await Booking.findOne(query).populate('turf');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.',
      });
    }

    // Authorization check: User must be customer, facility owner, or admin
    const isCustomer = booking.customer.user.toString() === req.user._id.toString();
    const isOwner = booking.turf?.owner?.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isCustomer && !isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this booking.',
      });
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cancel an existing booking
 * @route   PATCH /api/bookings/:id/cancel
 * @access  Private
 */
const cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const isMongoId = id.match(/^[0-9a-fA-F]{24}$/);
    const query = isMongoId ? { _id: id } : { bookingReference: id };

    const booking = await Booking.findOne(query).populate('turf');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.',
      });
    }

    // Authorization check: Must be the customer who booked, or admin/owner
    const isCustomer = booking.customer.user.toString() === req.user._id.toString();
    const isOwner = booking.turf?.owner?.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isCustomer && !isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to cancel this booking.',
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This booking has already been cancelled.',
      });
    }

    booking.status = 'cancelled';
    booking.cancellationReason = reason || 'Cancelled by user request';
    await booking.save();

    res.status(200).json({
      success: true,
      booking,
      message: 'Booking has been cancelled successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
};
