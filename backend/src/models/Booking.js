const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookingReference: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    customer: {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
      },
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        default: '',
      },
    },
    turf: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Turf',
      required: true,
      index: true,
    },
    date: {
      type: String, // 'YYYY-MM-DD'
      required: [true, 'Booking date is required'],
      index: true,
    },
    startTime: {
      type: String, // 'HH:MM'
      required: [true, 'Start time is required'],
      index: true,
    },
    endTime: {
      type: String, // 'HH:MM'
      required: [true, 'End time is required'],
    },
    duration: {
      type: Number,
      required: true,
      min: [1, 'Minimum booking duration is 1 hour'],
      default: 1,
    },
    sport: {
      type: String,
      default: 'football',
    },
    totalAmount: {
      type: Number,
      required: [true, 'Authoritative total amount is required'],
      min: [0, 'Total amount cannot be negative'],
    },
    status: {
      type: String,
      enum: {
        values: ['confirmed', 'completed', 'cancelled'],
        message: 'Status must be confirmed, completed, or cancelled',
      },
      default: 'confirmed',
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: {
        values: ['pending', 'paid', 'refunded'],
        message: 'Payment status must be pending, paid, or refunded',
      },
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      default: 'Pay at Venue',
    },
    cancellationReason: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for ID mapping
bookingSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
bookingSchema.set('toJSON', { virtuals: true });
bookingSchema.set('toObject', { virtuals: true });

// Compound index to quickly detect slot conflicts
bookingSchema.index({ turf: 1, date: 1, startTime: 1, status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
