# 🏗️ Food Waste Platform - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
│                    http://localhost:5173                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │    Login     │  │   Register   │  │  Dashboard   │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                            │                     │
│                    ┌───────────────────────┴───────┐           │
│                    │                               │           │
│         ┌──────────▼──────────┐         ┌─────────▼────────┐  │
│         │   Admin Dashboard   │         │  Donor Dashboard │  │
│         │  - Manage Users     │         │  - List Food     │  │
│         │  - View Analytics   │         │  - Track Impact  │  │
│         └─────────────────────┘         └──────────────────┘  │
│                    │                               │           │
│         ┌──────────▼──────────┐         ┌─────────▼────────┐  │
│         │ Recipient Dashboard │         │ Analyst Dashboard│  │
│         │  - Request Food     │         │  - View Reports  │  │
│         │  - Track Donations  │         │  - Analyze Data  │  │
│         └─────────────────────┘         └──────────────────┘  │
│                                                                  │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTP/AJAX (Axios)
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                    BACKEND (Node.js + Express)                   │
│                    http://localhost:5000/api                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                    API ROUTES                           │    │
│  │                                                         │    │
│  │  /auth          - Login, Register                      │    │
│  │  /users         - User Management                      │    │
│  │  /food-listings - Food Listing CRUD                    │    │
│  │  /donations     - Donation Requests & Tracking         │    │
│  │  /analytics     - Reports & Statistics                 │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                   MIDDLEWARE                            │    │
│  │                                                         │    │
│  │  • JWT Authentication                                   │    │
│  │  • Role Authorization                                   │    │
│  │  • Input Validation                                     │    │
│  │  • Error Handling                                       │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
└────────────────────────┬────────────────────────────────────────┘
                         │ Mongoose ODM
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                    DATABASE (MongoDB)                            │
│              mongodb://localhost:27017/food-waste-platform       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌────────────────┐ │
│  │     Users       │  │  Food Listings  │  │   Donations    │ │
│  │  - name         │  │  - title        │  │  - donor       │ │
│  │  - email        │  │  - category     │  │  - recipient   │ │
│  │  - password     │  │  - quantity     │  │  - status      │ │
│  │  - role         │  │  - expiration   │  │  - impact      │ │
│  │  - verified     │  │  - location     │  │  - dates       │ │
│  └─────────────────┘  └─────────────────┘  └────────────────┘ │
│                                                                  │
│  ┌─────────────────┐                                            │
│  │   Analytics     │                                            │
│  │  - metrics      │                                            │
│  │  - trends       │                                            │
│  │  - reports      │                                            │
│  └─────────────────┘                                            │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

## Data Flow

### User Registration & Login
```
User Input → Frontend Form → API Request → Backend Validation
    ↓
Password Hashing (bcrypt) → Save to MongoDB → Generate JWT
    ↓
Return Token → Store in LocalStorage → Redirect to Dashboard
```

### Creating Food Listing (Donor)
```
Donor Input → Form Validation → API POST /food-listings
    ↓
Auth Middleware → Check Role (food_donor) → Save to DB
    ↓
Return Success → Update UI → Show in Listings
```

### Requesting Donation (Recipient)
```
Recipient Selects Food → Request Quantity → API POST /donations
    ↓
Check Availability → Create Donation Record → Update Listing Status
    ↓
Notify Donor → Return Success → Show in My Requests
```

### Completing Donation
```
Update Status → Add Impact Data (people served, waste reduced)
    ↓
Update Donation Record → Update Food Listing → Save to Analytics
    ↓
Reflect in Reports → Update Dashboard Stats
```

## User Roles & Permissions

### Admin
- ✅ View all users
- ✅ Verify/activate users
- ✅ Access all analytics
- ✅ Monitor platform activity

### Food Donor
- ✅ Create food listings
- ✅ Manage own listings
- ✅ View donation requests
- ✅ Confirm/reject requests
- ✅ Track own impact

### Recipient Organization
- ✅ Browse available food
- ✅ Request donations
- ✅ Track request status
- ✅ Update people served
- ✅ Manage received donations

### Data Analyst
- ✅ View all analytics
- ✅ Generate reports
- ✅ Analyze trends
- ✅ View top contributors
- ✅ Category breakdown

## API Endpoints Summary

| Method | Endpoint                        | Access      | Purpose                  |
|--------|---------------------------------|-------------|--------------------------|
| POST   | /api/auth/register              | Public      | Register new user        |
| POST   | /api/auth/login                 | Public      | Login user               |
| GET    | /api/users/profile              | Private     | Get user profile         |
| GET    | /api/users                      | Admin       | Get all users            |
| GET    | /api/food-listings/available    | Private     | Get available food       |
| POST   | /api/food-listings              | Donor       | Create food listing      |
| POST   | /api/donations                  | Recipient   | Request donation         |
| PUT    | /api/donations/:id/status       | Private     | Update donation status   |
| GET    | /api/analytics/overview         | Admin/Analyst| Platform statistics     |
| GET    | /api/analytics/trends           | Admin/Analyst| Donation trends         |

## Technology Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **Auth:** JWT (jsonwebtoken)
- **Security:** bcryptjs
- **Validation:** express-validator

### Frontend
- **Library:** React 18
- **Build Tool:** Vite
- **Router:** React Router v6
- **HTTP Client:** Axios
- **State:** Context API
- **Styling:** CSS3

## File Structure

```
FEDF_PROJECT/
├── backend/
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── middleware/
│   │   └── auth.js                  # JWT & authorization
│   ├── models/
│   │   ├── User.js                  # User schema
│   │   ├── FoodListing.js          # Food listing schema
│   │   ├── Donation.js             # Donation schema
│   │   └── Analytics.js            # Analytics schema
│   ├── routes/
│   │   ├── auth.js                  # Auth endpoints
│   │   ├── users.js                 # User endpoints
│   │   ├── foodListings.js         # Food listing endpoints
│   │   ├── donations.js            # Donation endpoints
│   │   └── analytics.js            # Analytics endpoints
│   ├── .env                         # Environment variables
│   ├── package.json                # Dependencies
│   └── server.js                   # Main server file
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx          # Main layout
│   │   │   └── PrivateRoute.jsx    # Protected route wrapper
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Auth state management
│   │   ├── pages/
│   │   │   ├── Login.jsx           # Login page
│   │   │   ├── Register.jsx        # Registration page
│   │   │   ├── Dashboard.jsx       # Main dashboard router
│   │   │   └── dashboards/
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── FoodDonorDashboard.jsx
│   │   │       ├── RecipientDashboard.jsx
│   │   │       └── DataAnalystDashboard.jsx
│   │   ├── services/
│   │   │   └── api.js              # API service layer
│   │   ├── App.jsx                 # Main app component
│   │   └── main.jsx                # Entry point
│   ├── package.json                # Dependencies
│   └── vite.config.js             # Vite configuration
│
├── README.md                       # Main documentation
├── QUICKSTART.md                  # Quick setup guide
└── PROJECT_SUMMARY.md             # Project overview
```

## Security Measures

1. **Password Security**
   - Hashed with bcryptjs (10 salt rounds)
   - Never stored in plain text
   - Never returned in API responses

2. **Authentication**
   - JWT tokens with 30-day expiration
   - Token stored in localStorage
   - Validated on every protected request

3. **Authorization**
   - Role-based access control
   - Middleware checks user roles
   - Protected routes in frontend

4. **Input Validation**
   - Express-validator on all inputs
   - Frontend form validation
   - Schema validation with Mongoose

5. **Error Handling**
   - Centralized error middleware
   - Appropriate HTTP status codes
   - User-friendly error messages

## Deployment Checklist

- [ ] Set up production MongoDB (Atlas)
- [ ] Update environment variables
- [ ] Change JWT secret
- [ ] Enable HTTPS
- [ ] Set up CORS properly
- [ ] Add rate limiting
- [ ] Set up logging
- [ ] Configure CDN for frontend
- [ ] Set up monitoring
- [ ] Backup strategy

---

*Architecture designed for scalability, security, and maintainability*
