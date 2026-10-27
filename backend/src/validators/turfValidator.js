const mongoose = require('mongoose');

const validateTurfInput = (req, res, next) => {
  const { name, address, pricePerHour, sports } = req.body;

  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Venue name is required.',
    });
  }

  if (!address || typeof address !== 'string' || !address.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Physical address is required.',
    });
  }

  const numPrice = Number(pricePerHour);
  if (isNaN(numPrice) || numPrice <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid positive hourly price in INR.',
    });
  }

  if (!sports || !Array.isArray(sports) || sports.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Select at least one sport discipline supported by this facility.',
    });
  }

  next();
};

const validateMongoId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid identifier format for '${paramName}'.`,
      });
    }
    next();
  };
};

module.exports = {
  validateTurfInput,
  validateMongoId,
};
