import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import Donation from '../models/Donation.js';
import Analytics from '../models/Analytics.js';
import FoodListing from '../models/FoodListing.js';
import User from '../models/User.js';

const router = express.Router();

// @route   GET /api/analytics/overview
// @desc    Get analytics overview
// @access  Private/Admin/Data Analyst
router.get('/overview', protect, authorize('admin', 'data_analyst'), async (req, res) => {
  try {
    const totalDonations = await Donation.countDocuments({ status: 'completed' });
    const totalWasteReduced = await Donation.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$wasteReduced' } } }
    ]);
    const totalPeopleServed = await Donation.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$peopleServed' } } }
    ]);
    const activeDonors = await User.countDocuments({ role: 'food_donor', isActive: true });
    const activeRecipients = await User.countDocuments({ role: 'recipient_org', isActive: true });
    const availableListings = await FoodListing.countDocuments({ status: 'available' });

    res.json({
      totalDonations,
      totalWasteReduced: totalWasteReduced[0]?.total || 0,
      totalPeopleServed: totalPeopleServed[0]?.total || 0,
      activeDonors,
      activeRecipients,
      availableListings
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/analytics/trends
// @desc    Get donation trends over time
// @access  Private/Admin/Data Analyst
router.get('/trends', protect, authorize('admin', 'data_analyst'), async (req, res) => {
  try {
    const { period = 'monthly', year, month } = req.query;

    let matchStage = { status: 'completed' };
    
    if (year) {
      matchStage.completionDate = {
        $gte: new Date(`${year}-01-01`),
        $lte: new Date(`${year}-12-31`)
      };
    }

    const groupBy = period === 'daily' ? {
      year: { $year: '$completionDate' },
      month: { $month: '$completionDate' },
      day: { $dayOfMonth: '$completionDate' }
    } : period === 'weekly' ? {
      year: { $year: '$completionDate' },
      week: { $week: '$completionDate' }
    } : {
      year: { $year: '$completionDate' },
      month: { $month: '$completionDate' }
    };

    const trends = await Donation.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: groupBy,
          count: { $sum: 1 },
          totalWaste: { $sum: '$wasteReduced' },
          totalPeople: { $sum: '$peopleServed' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    res.json(trends);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/analytics/category-breakdown
// @desc    Get food waste by category
// @access  Private/Admin/Data Analyst
router.get('/category-breakdown', protect, authorize('admin', 'data_analyst'), async (req, res) => {
  try {
    const categoryBreakdown = await FoodListing.aggregate([
      {
        $lookup: {
          from: 'donations',
          localField: '_id',
          foreignField: 'foodListing',
          as: 'donations'
        }
      },
      { $unwind: { path: '$donations', preserveNullAndEmptyArrays: false } },
      { $match: { 'donations.status': 'completed' } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalWeight: { $sum: '$donations.wasteReduced' },
          peopleServed: { $sum: '$donations.peopleServed' }
        }
      },
      { $sort: { totalWeight: -1 } }
    ]);

    res.json(categoryBreakdown);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/analytics/top-donors
// @desc    Get top donors by impact
// @access  Private/Admin/Data Analyst
router.get('/top-donors', protect, authorize('admin', 'data_analyst'), async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const topDonors = await Donation.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: '$donor',
          donationCount: { $sum: 1 },
          totalWaste: { $sum: '$wasteReduced' },
          totalPeople: { $sum: '$peopleServed' }
        }
      },
      { $sort: { totalWaste: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'donorInfo'
        }
      },
      { $unwind: '$donorInfo' },
      {
        $project: {
          donorId: '$_id',
          donorName: '$donorInfo.name',
          organizationName: '$donorInfo.organizationName',
          donationCount: 1,
          totalWaste: 1,
          totalPeople: 1
        }
      }
    ]);

    res.json(topDonors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/analytics/top-recipients
// @desc    Get top recipients by impact
// @access  Private/Admin/Data Analyst
router.get('/top-recipients', protect, authorize('admin', 'data_analyst'), async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const topRecipients = await Donation.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: '$recipient',
          donationsReceived: { $sum: 1 },
          totalWaste: { $sum: '$wasteReduced' },
          totalPeople: { $sum: '$peopleServed' }
        }
      },
      { $sort: { totalPeople: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'recipientInfo'
        }
      },
      { $unwind: '$recipientInfo' },
      {
        $project: {
          recipientId: '$_id',
          recipientName: '$recipientInfo.name',
          organizationName: '$recipientInfo.organizationName',
          donationsReceived: 1,
          totalWaste: 1,
          totalPeople: 1
        }
      }
    ]);

    res.json(topRecipients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/analytics/impact-report
// @desc    Generate comprehensive impact report
// @access  Private/Admin/Data Analyst
router.get('/impact-report', protect, authorize('admin', 'data_analyst'), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        completionDate: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    }

    const report = await Donation.aggregate([
      { $match: { status: 'completed', ...dateFilter } },
      {
        $facet: {
          summary: [
            {
              $group: {
                _id: null,
                totalDonations: { $sum: 1 },
                totalWasteReduced: { $sum: '$wasteReduced' },
                totalPeopleServed: { $sum: '$peopleServed' },
                avgWastePerDonation: { $avg: '$wasteReduced' },
                avgPeoplePerDonation: { $avg: '$peopleServed' }
              }
            }
          ],
          monthlyTrends: [
            {
              $group: {
                _id: {
                  year: { $year: '$completionDate' },
                  month: { $month: '$completionDate' }
                },
                count: { $sum: 1 },
                waste: { $sum: '$wasteReduced' },
                people: { $sum: '$peopleServed' }
              }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
          ]
        }
      }
    ]);

    res.json(report[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
