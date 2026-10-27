const Turf = require('../models/Turf');
const Booking = require('../models/Booking');

/**
 * @desc    Get all turfs owned by the logged-in user
 * @route   GET /api/owner/turfs
 * @access  Private (Owner / Admin)
 */
const getOwnerTurfs = async (req, res, next) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { owner: req.user._id };
    const turfs = await Turf.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: turfs.length,
      turfs,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new turf facility
 * @route   POST /api/owner/turfs
 * @access  Private (Owner / Admin)
 */
const createTurf = async (req, res, next) => {
  try {
    const turfData = {
      ...req.body,
      owner: req.user._id,
      // All owner-submitted turfs start unverified until admin approves
      isVerified: req.user.role === 'admin' ? true : false,
    };

    const turf = await Turf.create(turfData);

    res.status(201).json({
      success: true,
      turf,
      message: 'Sports facility created successfully. Awaiting administrative verification.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update existing turf facility
 * @route   PATCH /api/owner/turfs/:id
 * @access  Private (Owner / Admin)
 */
const updateTurf = async (req, res, next) => {
  try {
    const turf = await Turf.findById(req.params.id);

    if (!turf) {
      return res.status(404).json({
        success: false,
        message: 'Turf not found.',
      });
    }

    // Ownership enforcement: Only the facility owner or admin can edit
    if (turf.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You are not authorized to edit this facility.',
      });
    }

    // Protect isVerified from unauthorized modification by owner
    const updateData = { ...req.body };
    if (req.user.role !== 'admin') {
      delete updateData.isVerified;
      delete updateData.owner;
    }

    const updatedTurf = await Turf.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      turf: updatedTurf,
      message: 'Facility details updated successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a sports facility
 * @route   DELETE /api/owner/turfs/:id
 * @access  Private (Owner / Admin)
 */
const deleteTurf = async (req, res, next) => {
  try {
    const turf = await Turf.findById(req.params.id);

    if (!turf) {
      return res.status(404).json({
        success: false,
        message: 'Turf not found.',
      });
    }

    // Ownership enforcement
    if (turf.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You are not authorized to delete this facility.',
      });
    }

    await Turf.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Facility listing removed successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get reservations across owner's venues
 * @route   GET /api/owner/bookings
 * @access  Private (Owner / Admin)
 */
const getOwnerBookings = async (req, res, next) => {
  try {
    const { turfId, status } = req.query;

    // 1. Get turfs owned by this user
    const ownerTurfs = await Turf.find({ owner: req.user._id }).select('_id');
    const ownerTurfIds = ownerTurfs.map((t) => t._id);

    // If admin, they can see all bookings or filter by owner
    const turfFilter = req.user.role === 'admin' ? {} : { turf: { $in: ownerTurfIds } };

    if (turfId && turfId !== 'all') {
      turfFilter.turf = turfId;
    }

    if (status && status !== 'all') {
      turfFilter.status = status;
    }

    const bookings = await Booking.find(turfFilter)
      .sort({ createdAt: -1 })
      .populate('turf', 'name city area pricePerHour');

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
 * @desc    Get schedule matrix for owner's turf on a given date
 * @route   GET /api/owner/schedule/:turfId
 * @access  Private (Owner / Admin)
 */
const getOwnerSchedule = async (req, res, next) => {
  try {
    const { turfId } = req.params;
    const { date } = req.query;
    const targetDate = date || new Date().toISOString().split('T')[0];

    const turf = await Turf.findById(turfId);
    if (!turf) {
      return res.status(404).json({
        success: false,
        message: 'Turf not found.',
      });
    }

    if (turf.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You are not authorized to view this facility schedule.',
      });
    }

    const bookings = await Booking.find({
      turf: turfId,
      date: targetDate,
    }).populate('customer.user', 'name email phone');

    res.status(200).json({
      success: true,
      date: targetDate,
      turfId,
      schedule: bookings,
      blockedSlots: turf.blockedSlots.filter((bs) => bs.date === targetDate),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle maintenance block for an hourly slot
 * @route   POST /api/owner/schedule/:turfId/block
 * @access  Private (Owner / Admin)
 */
const toggleBlockSlot = async (req, res, next) => {
  try {
    const { turfId } = req.params;
    const { date, startTime, reason = 'Maintenance' } = req.body;

    const turf = await Turf.findById(turfId);
    if (!turf) {
      return res.status(404).json({
        success: false,
        message: 'Turf not found.',
      });
    }

    if (turf.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden.',
      });
    }

    const startH = parseInt(startTime.split(':')[0], 10);
    const endH = startH + 1;
    const endTime = `${endH < 10 ? `0${endH}` : endH}:00`;

    // Check if slot is currently blocked
    const existingIndex = turf.blockedSlots.findIndex(
      (s) => s.date === date && s.startTime === startTime
    );

    if (existingIndex > -1) {
      // Unblock
      turf.blockedSlots.splice(existingIndex, 1);
      await turf.save();
      return res.status(200).json({
        success: true,
        message: `Slot ${startTime} unblocked successfully.`,
        isAvailable: true,
      });
    } else {
      // Check if slot is already booked by a customer
      const activeBooking = await Booking.findOne({
        turf: turfId,
        date,
        startTime,
        status: { $ne: 'cancelled' },
      });

      if (activeBooking) {
        return res.status(400).json({
          success: false,
          message: 'Cannot block a slot that has an active customer booking.',
        });
      }

      // Block
      turf.blockedSlots.push({ date, startTime, endTime, reason });
      await turf.save();
      return res.status(200).json({
        success: true,
        message: `Slot ${startTime} blocked for ${reason}.`,
        isAvailable: false,
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOwnerTurfs,
  createTurf,
  updateTurf,
  deleteTurf,
  getOwnerBookings,
  getOwnerSchedule,
  toggleBlockSlot,
};
