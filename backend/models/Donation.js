import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  foodListing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FoodListing',
    required: true
  },
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in_transit', 'completed', 'cancelled'],
    default: 'pending'
  },
  requestedQuantity: {
    type: Number,
    required: true
  },
  confirmedQuantity: {
    type: Number
  },
  pickupDate: {
    type: Date
  },
  completionDate: {
    type: Date
  },
  // Impact tracking
  peopleServed: {
    type: Number,
    default: 0
  },
  wasteReduced: {
    type: Number, // in kg
    default: 0
  },
  notes: {
    type: String
  },
  donorNotes: {
    type: String
  },
  recipientNotes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

donationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Donation', donationSchema);
