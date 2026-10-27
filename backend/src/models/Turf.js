const mongoose = require('mongoose');

const blockedSlotSchema = new mongoose.Schema(
  {
    date: {
      type: String, // 'YYYY-MM-DD'
      required: true,
    },
    startTime: {
      type: String, // 'HH:MM'
      required: true,
    },
    endTime: {
      type: String, // 'HH:MM'
      required: true,
    },
    reason: {
      type: String,
      default: 'Blocked by Facility Management',
    },
  },
  { _id: false }
);

const turfSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Turf name is required'],
      trim: true,
      maxlength: [150, 'Turf name cannot exceed 150 characters'],
      index: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    sports: {
      type: [String],
      required: [true, 'At least one sport type is required'],
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: 'At least one sport must be selected',
      },
      index: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      index: true,
    },
    area: {
      type: String,
      trim: true,
      default: '',
    },
    address: {
      type: String,
      required: [true, 'Physical address is required'],
      trim: true,
    },
    pricePerHour: {
      type: Number,
      required: [true, 'Price per hour is required'],
      min: [0, 'Hourly rate cannot be negative'],
      index: true,
    },
    rating: {
      type: Number,
      default: 5.0,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    reviewsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
      index: true,
    },
    images: {
      type: [String],
      default: [
        'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=1200&q=80',
      ],
    },
    facilities: {
      type: [String],
      default: ['Floodlights', 'Parking', 'Drinking Water'],
    },
    openingHours: {
      open: {
        type: String,
        default: '06:00',
      },
      close: {
        type: String,
        default: '23:00',
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Facility must be linked to an owner'],
      index: true,
    },
    cancellationPolicy: {
      type: String,
      default:
        'Free cancellation up to 4 hours before the reserved start time. 50% refund within 2 to 4 hours.',
    },
    blockedSlots: {
      type: [blockedSlotSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for ID mapping and clean response
turfSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
turfSchema.set('toJSON', { virtuals: true });
turfSchema.set('toObject', { virtuals: true });

// Compound text index for fast search queries
turfSchema.index({ name: 'text', city: 'text', area: 'text', address: 'text' });

module.exports = mongoose.model('Turf', turfSchema);
