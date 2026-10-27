const express = require('express');
const router = express.Router();
const turfController = require('../controllers/turfController');
const reviewController = require('../controllers/reviewController');
const { authenticate } = require('../middleware/auth');
const { validateMongoId } = require('../validators/turfValidator');

// Public turf discovery
router.get('/', turfController.getAllTurfs);
router.get('/featured', turfController.getFeaturedTurfs);
router.get('/:id', validateMongoId('id'), turfController.getTurfById);
router.get('/:id/availability', validateMongoId('id'), turfController.getTurfAvailability);

// Turf reviews
router.get('/:turfId/reviews', validateMongoId('turfId'), reviewController.getTurfReviews);
router.post(
  '/:turfId/reviews',
  authenticate,
  validateMongoId('turfId'),
  reviewController.createReview
);

module.exports = router;
