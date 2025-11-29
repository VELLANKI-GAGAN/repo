# Quick Start Guide - Food Waste Platform

## ⚡ Quick Setup (5 minutes)

### Step 1: Install MongoDB

**Option A - MongoDB Community Server (Recommended for local development)**
1. Download from: https://www.mongodb.com/try/download/community
2. Install with default settings
3. MongoDB will start automatically

**Option B - MongoDB Atlas (Cloud - Free)**
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Create a free cluster
3. Get connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
4. Update `backend/.env` file with your connection string

### Step 2: Start MongoDB (if using local MongoDB)

**Windows:**
MongoDB should start automatically. If not:
```bash
# Open Services (services.msc) and start "MongoDB Server"
# Or run: net start MongoDB
```

**Mac:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

### Step 3: Start the Backend

```bash
# Open Terminal 1
cd backend
npm install  # Already done
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB Connected: localhost
```

### Step 4: Start the Frontend

```bash
# Open Terminal 2
cd frontend
npm run dev
```

You should see:
```
Local: http://localhost:5173/
```

### Step 5: Access the Application

1. Open browser: http://localhost:5173
2. Click "Register" to create your first account
3. Choose a role (Food Donor, Recipient Organization, Data Analyst, or Admin)
4. Complete registration and login

## 🎯 Test Drive

### As Food Donor:
1. Click "List Surplus Food"
2. Fill in details (title, category, quantity, expiration)
3. Add pickup location
4. Submit

### As Recipient Organization:
1. Browse available food listings
2. Click "Request Donation"
3. Enter quantity needed
4. Submit request

### As Food Donor (again):
1. View donation requests
2. Confirm or reject requests
3. Mark as completed when delivered

### As Data Analyst:
1. View analytics dashboard
2. See total waste reduced
3. Check top donors and recipients
4. Analyze trends

### As Admin:
1. View all users
2. Verify/activate users
3. Monitor platform statistics

## 🔧 Troubleshooting

### Backend won't start?
```bash
# Check if MongoDB is running
# Windows: services.msc (look for MongoDB)
# Mac/Linux: sudo systemctl status mongod
```

### Can't connect to MongoDB?
1. Check `.env` file in backend folder
2. Make sure `MONGODB_URI` is correct
3. For local: `mongodb://localhost:27017/food-waste-platform`
4. For Atlas: Use your connection string

### Frontend shows errors?
1. Make sure backend is running on port 5000
2. Check browser console for errors
3. Verify API_URL in `frontend/src/services/api.js`

### Port already in use?
```bash
# Backend (port 5000)
# Change PORT in backend/.env

# Frontend (port 5173)
# Vite will automatically use next available port
```

## 📱 Default Login (Create during registration)

No default users - you create them!

**Recommended test users:**
1. Admin: admin@test.com
2. Donor: donor@test.com  
3. Recipient: recipient@test.com
4. Analyst: analyst@test.com

Password: test123 (or any password ≥6 characters)

## 🚀 Features to Try

✅ Create food listings as a donor
✅ Request donations as a recipient
✅ Track donation status
✅ View analytics and reports
✅ Manage users as admin
✅ Update your profile
✅ Mark donations complete and track impact

## 📊 Sample Data

To test analytics features, create multiple donations and mark them as complete with impact data (people served, waste reduced).

## 🛠️ Development

**Backend runs on:** http://localhost:5000
**Frontend runs on:** http://localhost:5173
**API Base URL:** http://localhost:5000/api

Hot reload is enabled on both frontend and backend - changes are reflected automatically!

## 🎨 Project Features

- ✅ JWT Authentication
- ✅ Role-based Access Control
- ✅ Real-time Dashboards
- ✅ Impact Tracking
- ✅ Analytics & Reporting
- ✅ Responsive Design
- ✅ Donation Matching System

## 📝 Need Help?

Check the main README.md for detailed documentation!

---

**Happy coding! 🎉**
