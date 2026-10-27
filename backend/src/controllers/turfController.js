const Turf = require('../models/Turf');
const Booking = require('../models/Booking');

/**
 * @desc    Get all turfs with filtering, search and sorting
 * @route   GET /api/turfs
 * @access  Public
 */
const getAllTurfs = async (req, res, next) => {
  try {
    const { search, sport, city, minPrice, maxPrice, sort, page = 1, limit = 50 } = req.query;

    // Marketplace exploration only displays admin-approved verified turfs
    const filter = { isVerified: true };

    // 1. Text search across name, city, area
    if (search && search.trim()) {
      const q = search.trim();
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { city: { $regex: q, $options: 'i' } },
        { area: { $regex: q, $options: 'i' } },
        { address: { $regex: q, $options: 'i' } },
      ];
    }

    // 2. Sport category filter
    if (sport && sport !== 'all') {
      filter.sports = { $in: [new RegExp(`^${sport}$`, 'i')] };
    }

    // 3. City filter
    if (city && city !== 'all') {
      filter.city = { $regex: new RegExp(`^${city}$`, 'i') };
    }

    // 4. Price range filter
    if (minPrice || maxPrice) {
      filter.pricePerHour = {};
      if (minPrice) filter.pricePerHour.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerHour.$lte = Number(maxPrice);
    }

    // 5. Sorting
    let sortOption = { isVerified: -1, createdAt: -1 };
    if (sort === 'price_asc') {
      sortOption = { pricePerHour: 1 };
    } else if (sort === 'price_desc') {
      sortOption = { pricePerHour: -1 };
    } else if (sort === 'rating') {
      sortOption = { rating: -1, reviewsCount: -1 };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [turfs, total] = await Promise.all([
      Turf.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit))
        .populate('owner', 'name email phone'),
      Turf.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      total,
      turfs,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get featured verified turfs for the homepage
 * @route   GET /api/turfs/featured
 * @access  Public
 */
const getFeaturedTurfs = async (req, res, next) => {
  try {
    const featured = await Turf.find({ isVerified: true })
      .sort({ rating: -1, reviewsCount: -1 })
      .limit(6)
      .populate('owner', 'name email phone');

    // If fewer than 4 verified turfs exist, include unverified ones to keep the demo lively
    let result = featured;
    if (result.length < 4) {
      result = await Turf.find()
        .sort({ rating: -1 })
        .limit(6)
        .populate('owner', 'name email phone');
    }

    res.status(200).json({
      success: true,
      turfs: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single turf by ID
 * @route   GET /api/turfs/:id
 * @access  Public
 */
const getTurfById = async (req, res, next) => {
  try {
    const turf = await Turf.findById(req.params.id).populate(
      'owner',
      'name email phone'
    );

    if (!turf) {
      return res.status(404).json({
        success: false,
        message: 'Sports turf or facility not found.',
      });
    }

    res.status(200).json({
      success: true,
      turf,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get hourly slot availability for a turf on a specific date
 * @route   GET /api/turfs/:id/availability
 * @access  Public
 */
const getTurfAvailability = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    const targetDate = date || new Date().toISOString().split('T')[0];

    const turf = await Turf.findById(id);
    if (!turf) {
      return res.status(404).json({
        success: false,
        message: 'Turf not found.',
      });
    }

    // 1. Fetch active bookings on that date
    const existingBookings = await Booking.find({
      turf: id,
      date: targetDate,
      status: { $ne: 'cancelled' },
    });

    // 2. Fetch owner maintenance blocked slots
    const blockedSlots = (turf.blockedSlots || []).filter(
      (slot) => slot.date === targetDate
    );

    // 3. Generate hourly slots based on turf operating hours
    const openHour = parseInt((turf.openingHours?.open || '06:00').split(':')[0], 10);
    const closeHour = parseInt((turf.openingHours?.close || '23:00').split(':')[0], 10);

    const slots = [];
    for (let h = openHour; h < closeHour; h++) {
      const startH = h < 10 ? `0${h}` : `${h}`;
      const endH = h + 1 < 10 ? `0${h + 1}` : `${h + 1}`;
      const startTime = `${startH}:00`;
      const endTime = `${endH}:00`;
      const timeLabel = `${startTime} - ${endTime}`;

      // Check if slot falls inside any active booking
      const booked = existingBookings.find((b) => {
        const bStart = parseInt(b.startTime.split(':')[0], 10);
        const bEnd = parseInt(b.endTime.split(':')[0], 10);
        return h >= bStart && h < bEnd;
      });

      // Check if slot falls inside any owner maintenance block
      const blocked = blockedSlots.find((bs) => {
        const bsStart = parseInt(bs.startTime.split(':')[0], 10);
        const bsEnd = parseInt(bs.endTime.split(':')[0], 10);
        return h >= bsStart && h < bsEnd;
      });

      let isAvailable = true;
      let reason = undefined;

      if (booked) {
        isAvailable = false;
        reason = 'Booked';
      } else if (blocked) {
        isAvailable = false;
        reason = blocked.reason || 'Blocked by Facility';
      }

      slots.push({
        time: timeLabel,
        startTime,
        endTime,
        isAvailable,
        ...(reason && { reason }),
      });
    }

    res.status(200).json({
      success: true,
      date: targetDate,
      slots,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTurfs,
  getFeaturedTurfs,
  getTurfById,
  getTurfAvailability,
};
