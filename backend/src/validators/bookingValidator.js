const mongoose = require('mongoose');

const validateBookingInput = (req, res, next) => {
  const { turfId, date, startTime, duration } = req.body;

  if (!turfId || !mongoose.Types.ObjectId.isValid(turfId)) {
    return res.status(400).json({
      success: false,
      message: 'A valid turfId is required to create a booking.',
    });
  }

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({
      success: false,
      message: 'Date must be formatted as YYYY-MM-DD.',
    });
  }

  // Check if date is in the past (allowing today in any timezone)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDate = new Date(date + 'T23:59:59');
  if (checkDate < today) {
    return res.status(400).json({
      success: false,
      message: 'Cannot create a booking for a past date.',
    });
  }

  if (!startTime || !/^\d{2}:\d{2}$/.test(startTime)) {
    return res.status(400).json({
      success: false,
      message: 'Start time must be formatted as HH:MM.',
    });
  }

  const numDuration = Number(duration || 1);
  if (isNaN(numDuration) || numDuration < 1 || numDuration > 8) {
    return res.status(400).json({
      success: false,
      message: 'Duration must be between 1 and 8 hours.',
    });
  }

  next();
};

module.exports = {
  validateBookingInput,
};
