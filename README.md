# Food Waste Reduction Platform (FEDF-PS09)

A comprehensive platform to track and reduce food waste, offering solutions to manage food resources more efficiently, help people understand the impact of food waste, and improve overall food security.

## Features

### User Roles

1. **Admin**
   - Manage platform content
   - Oversee user interactions
   - Ensure data accuracy
   - View comprehensive analytics

2. **Food Donor**
   - List surplus food
   - Coordinate donations
   - Track impact
   - Manage donation requests

3. **Recipient Organization**
   - Request food donations
   - Manage logistics
   - Distribute to those in need
   - Track people served

4. **Data Analyst**
   - Track food waste trends
   - Analyze data
   - Generate reports
   - View top donors and recipients

## Tech Stack

### Backend
- Node.js with Express
- MongoDB for database
- JWT for authentication
- bcryptjs for password hashing

### Frontend
- React with Vite
- React Router for navigation
- Axios for API calls
- CSS for styling

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Installation & Setup

### 1. Clone the Repository
```bash
cd FEDF_PROJECT
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env file with your configuration:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/food-waste-platform
# JWT_SECRET=your_secret_key_here
# NODE_ENV=development

# Start the backend server
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal:

```bash
# Navigate to frontend directory
cd frontend

# Dependencies are already installed
# If needed: npm install

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:5173`

### 4. MongoDB Setup

**Option A: Local MongoDB**
- Install MongoDB on your system
- Start MongoDB service
- The app will create the database automatically

**Option B: MongoDB Atlas (Cloud)**
- Create a free account at https://www.mongodb.com/cloud/atlas
- Create a new cluster
- Get your connection string
- Update `MONGODB_URI` in backend/.env

## Usage

### First Time Setup

1. **Access the Application**
   - Open your browser and go to `http://localhost:5173`

2. **Register Users**
   - Click "Register" to create accounts for different roles
   - Create at least one user for each role to test all features

3. **Test the Platform**
   - **As Food Donor**: Create food listings
   - **As Recipient Organization**: Browse and request donations
   - **As Admin**: Manage users and view analytics
   - **As Data Analyst**: View reports and trends

### Sample Workflow

1. **Food Donor** creates a food listing:
   - Title: "Fresh Vegetables"
   - Category: Produce
   - Quantity: 50 kg
   - Expiration date and pickup details

2. **Recipient Organization** requests the donation:
   - Browse available listings
   - Request specific quantity
   - Add notes

3. **Food Donor** confirms the request:
   - Review incoming requests
   - Confirm or reject
   - Mark as completed after delivery

4. **Recipient Organization** updates impact:
   - Mark donation complete
   - Add number of people served

5. **Data Analyst** views analytics:
   - See total waste reduced
   - View trends and reports
   - Analyze top contributors

6. **Admin** manages the platform:
   - Verify users
   - Monitor all activities
   - Ensure data accuracy

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users` - Get all users (Admin)
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/:id/verify` - Verify user (Admin)
- `PUT /api/users/:id/active` - Toggle user status (Admin)

### Food Listings
- `GET /api/food-listings` - Get all listings
- `GET /api/food-listings/available` - Get available listings
- `GET /api/food-listings/my-listings` - Get donor's listings
- `POST /api/food-listings` - Create listing (Donor)
- `PUT /api/food-listings/:id` - Update listing (Donor)
- `DELETE /api/food-listings/:id` - Delete listing (Donor)

### Donations
- `GET /api/donations` - Get all donations (Admin/Analyst)
- `GET /api/donations/my-donations` - Get donor's donations
- `GET /api/donations/my-requests` - Get recipient's requests
- `POST /api/donations` - Create donation request (Recipient)
- `PUT /api/donations/:id/status` - Update donation status

### Analytics
- `GET /api/analytics/overview` - Get platform overview
- `GET /api/analytics/trends` - Get donation trends
- `GET /api/analytics/category-breakdown` - Get waste by category
- `GET /api/analytics/top-donors` - Get top donors
- `GET /api/analytics/top-recipients` - Get top recipients
- `GET /api/analytics/impact-report` - Generate impact report

## Project Structure

```
FEDF_PROJECT/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── FoodListing.js
│   │   ├── Donation.js
│   │   └── Analytics.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── foodListings.js
│   │   ├── donations.js
│   │   └── analytics.js
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   ├── Layout.css
│   │   │   └── PrivateRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Auth.css
│   │   │   └── dashboards/
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── AdminDashboard.css
│   │   │       ├── FoodDonorDashboard.jsx
│   │   │       ├── FoodDonorDashboard.css
│   │   │       ├── RecipientDashboard.jsx
│   │   │       ├── RecipientDashboard.css
│   │   │       ├── DataAnalystDashboard.jsx
│   │   │       └── DataAnalystDashboard.css
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## Features Implemented

✅ User authentication with JWT
✅ Role-based access control (4 user types)
✅ Food listing management
✅ Donation request and tracking system
✅ Impact tracking (waste reduced, people served)
✅ Comprehensive analytics and reporting
✅ Real-time dashboard for each user role
✅ Responsive design
✅ Matching system connecting donors with recipients

## Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Protected routes
- Role-based authorization
- Input validation

## Future Enhancements

- Email notifications
- Real-time chat between donors and recipients
- Mobile app
- Image upload for food listings
- Geolocation-based matching
- Integration with food safety databases
- Multi-language support
- Advanced analytics with charts/graphs

## Contributing

This is a university project (FEDF-PS09) for reducing food wastage and improving food security.

## License

This project is for educational purposes.

## Support

For issues or questions, please contact the development team.
