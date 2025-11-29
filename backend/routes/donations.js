import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import Donation from '../models/Donation.js';
import FoodListing from '../models/FoodListing.js';

const router = express.Router();

// @route   GET /api/donations
// @desc    Get all donations (Admin/Data Analyst)
// @access  Private
router.get('/', protect, authorize('admin', 'data_analyst'), async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate('donor', 'name email organizationName')
      .populate('recipient', 'name email organizationName')
      .populate('foodListing', 'title category quantity')
      .sort({ createdAt: -1 });

    res.json(donations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/donations/my-donations
// @desc    Get donations for current donor
// @access  Private/Food Donor
router.get('/my-donations', protect, authorize('food_donor'), async (req, res) => {
  try {
    const donations = await Donation.find({ donor: req.user._id })
      .populate('recipient', 'name email organizationName phone')
      .populate('foodListing', 'title category quantity')
      .sort({ createdAt: -1 });

    res.json(donations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/donations/my-requests
// @desc    Get donation requests for current recipient
// @access  Private/Recipient Org
router.get('/my-requests', protect, authorize('recipient_org'), async (req, res) => {
  try {
    const donations = await Donation.find({ recipient: req.user._id })
      .populate('donor', 'name email organizationName phone address')
      .populate('foodListing')
      .sort({ createdAt: -1 });

    res.json(donations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/donations/:id
// @desc    Get single donation
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate('donor', 'name email organizationName phone address')
      .populate('recipient', 'name email organizationName phone address')
      .populate('foodListing');

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    // Check authorization
    const userRole = req.user.role;
    const userId = req.user._id.toString();
    const isAuthorized = 
      userRole === 'admin' || 
      userRole === 'data_analyst' ||
      donation.donor.toString() === userId ||
      donation.recipient.toString() === userId;

    if (!isAuthorized) {
      return res.status(403).json({ message: 'Not authorized to view this donation' });
    }

    res.json(donation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/donations
// @desc    Create donation request
// @access  Private/Recipient Org
router.post('/', protect, authorize('recipient_org'), async (req, res) => {
  try {
    const { foodListingId, requestedQuantity, notes } = req.body;

    // Check if food listing exists and is available
    const foodListing = await FoodListing.findById(foodListingId);
    if (!foodListing) {
      return res.status(404).json({ message: 'Food listing not found' });
    }

    if (foodListing.status !== 'available') {
      return res.status(400).json({ message: 'Food listing is not available' });
    }

    // Calculate available quantity (total - reserved)
    const availableQuantity = foodListing.quantity - (foodListing.reservedQuantity || 0);
    
    if (requestedQuantity > availableQuantity) {
      return res.status(400).json({ 
        message: `Only ${availableQuantity} ${foodListing.unit} available. ${foodListing.reservedQuantity} already reserved.` 
      });
    }

    // Create donation
    const donation = await Donation.create({
      foodListing: foodListingId,
      donor: foodListing.donor,
      recipient: req.user._id,
      requestedQuantity,
      recipientNotes: notes
    });

    // Update reserved quantity
    foodListing.reservedQuantity = (foodListing.reservedQuantity || 0) + requestedQuantity;
    
    // Only mark as reserved if ALL quantity is taken
    if (foodListing.reservedQuantity >= foodListing.quantity) {
      foodListing.status = 'reserved';
    }
    
    await foodListing.save();

    const populatedDonation = await Donation.findById(donation._id)
      .populate('donor', 'name email organizationName')
      .populate('foodListing');

    res.status(201).json(populatedDonation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/donations/:id/status
// @desc    Update donation status
// @access  Private
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status, confirmedQuantity, pickupDate, completionDate, peopleServed, wasteReduced, notes } = req.body;

    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    // Check authorization
    const userRole = req.user.role;
    const userId = req.user._id.toString();
    const isDonor = donation.donor.toString() === userId;
    const isRecipient = donation.recipient.toString() === userId;

    if (userRole !== 'admin' && !isDonor && !isRecipient) {
      return res.status(403).json({ message: 'Not authorized to update this donation' });
    }

    // Update fields
    if (status) donation.status = status;
    if (confirmedQuantity !== undefined) donation.confirmedQuantity = confirmedQuantity;
    if (pickupDate) donation.pickupDate = pickupDate;
    if (completionDate) donation.completionDate = completionDate;
    if (peopleServed !== undefined) donation.peopleServed = peopleServed;
    if (wasteReduced !== undefined) donation.wasteReduced = wasteReduced;

    if (isDonor && notes) donation.donorNotes = notes;
    if (isRecipient && notes) donation.recipientNotes = notes;

    // Update food listing status if donation is completed or cancelled
    if (status === 'completed') {
      const foodListing = await FoodListing.findById(donation.foodListing);
      if (foodListing) {
        // Reduce reserved quantity and check if fully allocated
        const completedQty = confirmedQuantity !== undefined ? confirmedQuantity : donation.requestedQuantity;
        foodListing.reservedQuantity = Math.max(0, (foodListing.reservedQuantity || 0) - donation.requestedQuantity);
        
        // Mark as completed only if all quantity is used, otherwise keep available
        if (foodListing.reservedQuantity >= foodListing.quantity) {
          foodListing.status = 'completed';
        } else {
          foodListing.status = 'available';
        }
        await foodListing.save();
      }
    } else if (status === 'cancelled') {
      const foodListing = await FoodListing.findById(donation.foodListing);
      if (foodListing) {
        // Return reserved quantity back to available
        foodListing.reservedQuantity = Math.max(0, (foodListing.reservedQuantity || 0) - donation.requestedQuantity);
        
        // Mark as available if there's remaining quantity
        if (foodListing.reservedQuantity < foodListing.quantity) {
          foodListing.status = 'available';
        }
        await foodListing.save();
      }
    }

    const updatedDonation = await donation.save();
    res.json(updatedDonation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
