const Review = require('../models/Review');
const Turf = require('../models/Turf');

/**
 * @desc    Get reviews for a turf
 * @route   GET /api/turfs/:turfId/reviews
 * @access  Public
 */
const getTurfReviews = async (req, res, next) => {
  try {
    const { turfId } = req.params;

    const reviews = await Review.find({ turf: turfId })
      .sort({ createdAt: -1 })
      .populate('user', 'name');

    // Format for frontend
    const formatted = reviews.map((r) => ({
      id: r._id,
      _id: r._id,
      userName: r.userName || r.user?.name || 'Verified Player',
      rating: r.rating,
      date: r.createdAt.toISOString().split('T')[0],
      comment: r.comment,
    }));

    res.status(200).json({
      success: true,
      count: formatted.length,
      reviews: formatted,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a review for a turf
 * @route   POST /api/turfs/:turfId/reviews
 * @access  Private
 */
const createReview = async (req, res, next) => {
  try {
    const { turfId } = req.params;
    const { rating, comment } = req.body;

    const turf = await Turf.findById(turfId);
    if (!turf) {
      return res.status(404).json({
        success: false,
        message: 'Turf not found.',
      });
    }

    const review = await Review.create({
      turf: turfId,
      user: req.user._id,
      userName: req.user.name,
      rating: Number(rating),
      comment: comment.trim(),
    });

    // Update turf average rating & reviewsCount
    const allReviews = await Review.find({ turf: turfId });
    const avgRating =
      allReviews.reduce((sum, item) => sum + item.rating, 0) / allReviews.length;

    turf.rating = Number(avgRating.toFixed(1));
    turf.reviewsCount = allReviews.length;
    await turf.save();

    res.status(201).json({
      success: true,
      review: {
        id: review._id,
        _id: review._id,
        userName: review.userName,
        rating: review.rating,
        date: review.createdAt.toISOString().split('T')[0],
        comment: review.comment,
      },
      message: 'Review posted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTurfReviews,
  createReview,
};
