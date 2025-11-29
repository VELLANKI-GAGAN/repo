import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import FoodListing from '../models/FoodListing.js';

const router = express.Router();

// @route   GET /api/food-listings
// @desc    Get all food listings
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { status, category } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (category) query.category = category;

    const listings = await FoodListing.find(query)
      .populate('donor', 'name email organizationName')
      .sort({ createdAt: -1 });

    res.json(listings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/food-listings/available
// @desc    Get available food listings
// @access  Private
router.get('/available', protect, async (req, res) => {
  try {
    const listings = await FoodListing.find({ 
      status: 'available',
      availableUntil: { $gte: new Date() }
    })
      .populate('donor', 'name email organizationName')
      .sort({ createdAt: -1 });

    res.json(listings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/food-listings/my-listings
// @desc    Get current user's food listings
// @access  Private/Food Donor
router.get('/my-listings', protect, authorize('food_donor'), async (req, res) => {
  try {
    const listings = await FoodListing.find({ donor: req.user._id })
      .sort({ createdAt: -1 });

    res.json(listings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/food-listings/:id
// @desc    Get single food listing
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const listing = await FoodListing.findById(req.params.id)
      .populate('donor', 'name email organizationName phone address');

    if (!listing) {
      return res.status(404).json({ message: 'Food listing not found' });
    }

    res.json(listing);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/food-listings
// @desc    Create food listing
// @access  Private/Food Donor
router.post('/', protect, authorize('food_donor'), async (req, res) => {
  try {
    const listing = await FoodListing.create({
      ...req.body,
      donor: req.user._id
    });

    res.status(201).json(listing);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/food-listings/:id
// @desc    Update food listing
// @access  Private/Food Donor
router.put('/:id', protect, authorize('food_donor'), async (req, res) => {
  try {
    const listing = await FoodListing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Food listing not found' });
    }

    // Check if user is the owner
    if (listing.donor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this listing' });
    }

    Object.assign(listing, req.body);
    const updatedListing = await listing.save();

    res.json(updatedListing);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/food-listings/:id
// @desc    Delete food listing
// @access  Private/Food Donor
router.delete('/:id', protect, authorize('food_donor'), async (req, res) => {
  try {
    const listing = await FoodListing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Food listing not found' });
    }

    // Check if user is the owner
    if (listing.donor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this listing' });
    }

    await listing.deleteOne();
    res.json({ message: 'Food listing removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
