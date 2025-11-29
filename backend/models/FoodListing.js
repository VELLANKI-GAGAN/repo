import mongoose from 'mongoose';

const foodListingSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['produce', 'dairy', 'meat', 'bakery', 'prepared_food', 'canned', 'other'],
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  reservedQuantity: {
    type: Number,
    default: 0
  },
  unit: {
    type: String,
    enum: ['kg', 'lbs', 'servings', 'items', 'boxes'],
    required: true
  },
  expirationDate: {
    type: Date,
    required: true
  },
  pickupLocation: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  availableFrom: {
    type: Date,
    required: true
  },
  availableUntil: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'reserved', 'completed', 'expired', 'cancelled'],
    default: 'available'
  },
  storageRequirements: {
    type: String,
    enum: ['refrigerated', 'frozen', 'room_temperature'],
    default: 'room_temperature'
  },
  images: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
foodListingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('FoodListing', foodListingSchema);
