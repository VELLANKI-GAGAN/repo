import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import FoodListing from '../models/FoodListing.js';
import Donation from '../models/Donation.js';

dotenv.config();

const run = async () => {
  await connectDB();

  try {
    // Create sample donors
    const donors = [
      { name: 'Donor A', email: 'donorA@example.com', password: 'password123', role: 'food_donor', organizationName: 'Donor A Org' },
      { name: 'Donor B', email: 'donorB@example.com', password: 'password123', role: 'food_donor', organizationName: 'Donor B Bakery' }
    ];

    const recipients = [
      { name: 'Recipient X', email: 'recipientX@example.com', password: 'password123', role: 'recipient_org', organizationName: 'Community Center X', recipientType: 'community_center' },
      { name: 'Recipient Y', email: 'recipientY@example.com', password: 'password123', role: 'recipient_org', organizationName: 'Shelter Y', recipientType: 'shelter' }
    ];

    // Upsert users
    const donorDocs = [];
    for (const d of donors) {
      let u = await User.findOne({ email: d.email });
      if (!u) u = await User.create(d);
      donorDocs.push(u);
    }

    const recipientDocs = [];
    for (const r of recipients) {
      let u = await User.findOne({ email: r.email });
      if (!u) u = await User.create(r);
      recipientDocs.push(u);
    }

    // Create sample food listings for donors
    const sampleListings = [
      {
        donor: donorDocs[0]._id,
        title: 'Fresh Veg Box',
        description: 'Fresh seasonal vegetable boxes',
        category: 'produce',
        quantity: 20,
        unit: 'boxes',
        expirationDate: new Date(Date.now() + 3 * 24 * 3600 * 1000),
        availableFrom: new Date(),
        availableUntil: new Date(Date.now() + 5 * 24 * 3600 * 1000),
        storageRequirements: 'room_temperature'
      },
      {
        donor: donorDocs[1]._id,
        title: 'Baked Bread Loaves',
        description: 'Fresh bread loaves from bakery',
        category: 'bakery',
        quantity: 30,
        unit: 'items',
        expirationDate: new Date(Date.now() + 2 * 24 * 3600 * 1000),
        availableFrom: new Date(),
        availableUntil: new Date(Date.now() + 2 * 24 * 3600 * 1000),
        storageRequirements: 'room_temperature'
      }
    ];

    const listingDocs = [];
    for (const l of sampleListings) {
      let exist = await FoodListing.findOne({ title: l.title });
      if (!exist) exist = await FoodListing.create(l);
      listingDocs.push(exist);
    }

    // Create sample donation requests
    const sampleDonations = [
      {
        foodListing: listingDocs[0]._id,
        donor: donorDocs[0]._id,
        recipient: recipientDocs[0]._id,
        status: 'pending',
        requestedQuantity: 2
      },
      {
        foodListing: listingDocs[1]._id,
        donor: donorDocs[1]._id,
        recipient: recipientDocs[1]._id,
        status: 'confirmed',
        requestedQuantity: 8
      }
    ];

    for (const sd of sampleDonations) {
      let exist = await Donation.findOne({ foodListing: sd.foodListing, recipient: sd.recipient });
      if (!exist) exist = await Donation.create(sd);
    }

    console.log('Sample data seeded successfully');
    process.exit(0);
  } catch (err) {
    console.error('Failed to seed sample data:', err);
    process.exit(1);
  }
};

run();
