import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import foodListingRoutes from './routes/foodListings.js';
import donationRoutes from './routes/donations.js';
import analyticsRoutes from './routes/analytics.js';
import User from './models/User.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Ensure a default super admin user exists (only created if no admin found)
const ensureSuperAdmin = async () => {
  try {
    const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL || 'admin@gmail.com';
    const SUPER_ADMIN_PASS = process.env.SUPER_ADMIN_PASSWORD || 'admin123';

    const existing = await User.findOne({ email: SUPER_ADMIN_EMAIL });
    if (!existing) {
      console.log('Super admin not found — creating default admin', SUPER_ADMIN_EMAIL);
      const user = await User.create({
        name: 'Super Admin',
        email: SUPER_ADMIN_EMAIL,
        password: SUPER_ADMIN_PASS,
        role: 'admin',
        isVerified: true
      });
      console.log('Default super admin created:', user.email);
    } else {
      console.log('Super admin exists:', existing.email);
      // If a super-admin exists but its password does not match the configured default
      // (useful during local development), overwrite it with the configured SUPER_ADMIN_PASS.
      // NOTE: This is intentional to help local development and should not be used
      // in production environments. Use env vars and secure rotation in production.
      try {
        // user.comparePassword uses bcrypt which is available via model method
        const matches = await existing.comparePassword(SUPER_ADMIN_PASS);
        if (!matches) {
          console.log('Super admin password mismatch — resetting password to the configured value');
          existing.password = SUPER_ADMIN_PASS;
          await existing.save();
          console.log('Super admin password updated');
        }
      } catch (err) {
        console.error('Error checking/updating super-admin password:', err.message || err);
      }
    }
  } catch (err) {
    console.error('Failed to ensure super admin', err.message || err);
  }
};

ensureSuperAdmin();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/food-listings', foodListingRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Food Waste Platform API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : {} 
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
