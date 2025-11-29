import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['donation', 'waste_saved', 'people_served', 'food_category'],
    required: true
  },
  // Time period
  date: {
    type: Date,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  month: {
    type: Number,
    required: true
  },
  week: {
    type: Number
  },
  // Metrics
  totalDonations: {
    type: Number,
    default: 0
  },
  totalWeight: {
    type: Number, // in kg
    default: 0
  },
  totalPeopleServed: {
    type: Number,
    default: 0
  },
  // Category breakdown
  categoryBreakdown: {
    produce: { type: Number, default: 0 },
    dairy: { type: Number, default: 0 },
    meat: { type: Number, default: 0 },
    bakery: { type: Number, default: 0 },
    prepared_food: { type: Number, default: 0 },
    canned: { type: Number, default: 0 },
    other: { type: Number, default: 0 }
  },
  // Regional data
  region: {
    city: String,
    state: String,
    country: String
  },
  // Top contributors
  topDonors: [{
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    donationCount: Number,
    totalWeight: Number
  }],
  topRecipients: [{
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    donationsReceived: Number,
    peopleServed: Number
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create indexes for efficient querying
analyticsSchema.index({ type: 1, year: 1, month: 1 });
analyticsSchema.index({ date: 1 });

export default mongoose.model('Analytics', analyticsSchema);
