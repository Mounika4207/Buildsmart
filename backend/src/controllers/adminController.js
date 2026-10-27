const Turf = require('../models/Turf');
const User = require('../models/User');

/**
 * @desc    Get all turfs with verification status filter
 * @route   GET /api/admin/turfs
 * @access  Private (Admin only)
 */
const getAdminTurfs = async (req, res, next) => {
  try {
    const { status = 'all' } = req.query;

    const filter = {};
    if (status === 'pending') {
      filter.isVerified = false;
    } else if (status === 'verified') {
      filter.isVerified = true;
    }

    const turfs = await Turf.find(filter)
      .sort({ createdAt: -1 })
      .populate('owner', 'name email phone');

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
 * @desc    Approve or reject turf verification status
 * @route   PATCH /api/admin/turfs/:id/verification
 * @access  Private (Admin only)
 */
const updateTurfVerification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isVerified } = req.body;

    const turf = await Turf.findById(id);
    if (!turf) {
      return res.status(404).json({
        success: false,
        message: 'Turf not found.',
      });
    }

    turf.isVerified = Boolean(isVerified);
    await turf.save();

    res.status(200).json({
      success: true,
      turf,
      message: `Turf status has been updated to ${turf.isVerified ? 'Verified' : 'Pending'}.`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get registered users directory
 * @route   GET /api/admin/users
 * @access  Private (Admin only)
 */
const getAdminUsers = async (req, res, next) => {
  try {
    const { search, role } = req.query;

    const filter = {};
    if (role && role !== 'all') {
      filter.role = role;
    }

    if (search && search.trim()) {
      const q = search.trim();
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { phone: { $regex: q, $options: 'i' } },
      ];
    }

    const users = await User.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminTurfs,
  updateTurfVerification,
  getAdminUsers,
};
