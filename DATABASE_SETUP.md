# 🗄️ Database Setup Guide - MongoDB Atlas

## ✅ Your MongoDB Configuration

Your MongoDB Atlas connection has been configured with:

```
Database URL: mongodb+srv://admin:admin@cluster0.fnll9ej.mongodb.net/
Database Name: food-waste-platform
```

## 📊 Database Collections & Schemas

When you start using the application, MongoDB will automatically create these collections:

### 1. **users** Collection
Stores all user information with role-based access.

**Schema:**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique, indexed),
  password: String (hashed),
  role: String (enum: 'admin', 'food_donor', 'recipient_org', 'data_analyst'),
  organizationName: String,
  recipientType: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  phone: String,
  isActive: Boolean (default: true),
  isVerified: Boolean (default: false),
  createdAt: Date,
  lastLogin: Date
}
```

**Indexes:**
- `email`: Unique index for fast lookups and authentication

**Relationships:**
- Has many `foodlistings` (if food_donor)
- Has many `donations` (as donor or recipient)

---

### 2. **foodlistings** Collection
Stores all food items listed by donors.

**Schema:**
```javascript
{
  _id: ObjectId,
  donor: ObjectId (ref: 'User'),
  title: String,
  description: String,
  category: String (enum: 'produce', 'dairy', 'meat', 'bakery', 'prepared_food', 'canned', 'other'),
  quantity: Number,
  unit: String (enum: 'kg', 'lbs', 'servings', 'items', 'boxes'),
  expirationDate: Date,
  pickupLocation: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  availableFrom: Date,
  availableUntil: Date,
  status: String (enum: 'available', 'reserved', 'completed', 'expired', 'cancelled'),
  storageRequirements: String (enum: 'refrigerated', 'frozen', 'room_temperature'),
  images: [String],
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `donor`: Index for fast queries
- `status`: Index for filtering available listings
- `availableUntil`: Index for expiration queries

**Relationships:**
- Belongs to `users` (donor)
- Has many `donations`

---

### 3. **donations** Collection
Tracks donation requests and their lifecycle.

**Schema:**
```javascript
{
  _id: ObjectId,
  foodListing: ObjectId (ref: 'FoodListing'),
  donor: ObjectId (ref: 'User'),
  recipient: ObjectId (ref: 'User'),
  status: String (enum: 'pending', 'confirmed', 'in_transit', 'completed', 'cancelled'),
  requestedQuantity: Number,
  confirmedQuantity: Number,
  pickupDate: Date,
  completionDate: Date,
  peopleServed: Number (default: 0),
  wasteReduced: Number (default: 0, in kg),
  notes: String,
  donorNotes: String,
  recipientNotes: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `donor`: Index for donor's donations
- `recipient`: Index for recipient's requests
- `foodListing`: Index for listing relationships
- `status`: Index for filtering by status
- `completionDate`: Index for analytics

**Relationships:**
- Belongs to `foodlistings`
- Belongs to `users` (as donor)
- Belongs to `users` (as recipient)

---

### 4. **analytics** Collection
Stores aggregated analytics data (optional, can be computed on-the-fly).

**Schema:**
```javascript
{
  _id: ObjectId,
  type: String (enum: 'donation', 'waste_saved', 'people_served', 'food_category'),
  date: Date,
  year: Number,
  month: Number,
  week: Number,
  totalDonations: Number,
  totalWeight: Number (in kg),
  totalPeopleServed: Number,
  categoryBreakdown: {
    produce: Number,
    dairy: Number,
    meat: Number,
    bakery: Number,
    prepared_food: Number,
    canned: Number,
    other: Number
  },
  region: {
    city: String,
    state: String,
    country: String
  },
  topDonors: [{
    donor: ObjectId (ref: 'User'),
    donationCount: Number,
    totalWeight: Number
  }],
  topRecipients: [{
    recipient: ObjectId (ref: 'User'),
    donationsReceived: Number,
    peopleServed: Number
  }],
  createdAt: Date
}
```

**Indexes:**
- `type`, `year`, `month`: Compound index for time-based queries
- `date`: Index for date range queries

---

## 🔗 Database Relationships Diagram

```
users (1) ────────────────> (many) foodlistings
  │                              │
  │                              │
  │                              ▼
  └──────> (many) donations <────┘
              │
              │
              ▼
          analytics (aggregated data)

Relationship Details:
1. User → FoodListings (1:many)
   - One donor can create many food listings
   
2. User → Donations (1:many as donor)
   - One donor can have many donations
   
3. User → Donations (1:many as recipient)
   - One recipient can receive many donations
   
4. FoodListing → Donations (1:many)
   - One food listing can have many donation requests
   
5. Donations → Analytics (computed)
   - Analytics are computed from donation data
```

---

## 🚀 Auto-Creation Process

The database and collections will be **automatically created** when you:

1. **Start the backend server** (already configured)
2. **Register your first user** - Creates `users` collection
3. **Create a food listing** - Creates `foodlistings` collection
4. **Request a donation** - Creates `donations` collection

**MongoDB Atlas will automatically:**
- Create the database named `food-waste-platform`
- Create collections as data is inserted
- Apply indexes defined in the Mongoose models
- Handle all relationships via ObjectId references

---

## ✅ Verification Steps

### Check if Connected:

1. **Look at your terminal** where backend is running
   - You should see: `MongoDB Connected: cluster0.fnll9ej.mongodb.net`

2. **Visit MongoDB Atlas Dashboard:**
   - Go to: https://cloud.mongodb.com/
   - Login with your credentials
   - Select your cluster: `Cluster0`
   - Click "Browse Collections"
   - You'll see the `food-waste-platform` database after first use

### Test the Connection:

```bash
# The backend should show:
Server running on port 5000
MongoDB Connected: cluster0.fnll9ej.mongodb.net
```

---

## 📝 Sample Data Flow

### When you register a user:
```
POST /api/auth/register
  ↓
Creates document in users collection:
{
  name: "John Doe",
  email: "john@example.com",
  role: "food_donor",
  ...
}
```

### When donor creates food listing:
```
POST /api/food-listings
  ↓
Creates document in foodlistings collection:
{
  donor: ObjectId("user_id"),
  title: "Fresh Vegetables",
  category: "produce",
  ...
}
```

### When recipient requests donation:
```
POST /api/donations
  ↓
Creates document in donations collection:
{
  foodListing: ObjectId("listing_id"),
  donor: ObjectId("donor_id"),
  recipient: ObjectId("recipient_id"),
  ...
}
```

---

## 🔍 MongoDB Atlas Interface

To view your data:

1. Go to: https://cloud.mongodb.com/
2. Login with your account
3. Click on your cluster: `Cluster0`
4. Click "Browse Collections"
5. Select database: `food-waste-platform`
6. View collections:
   - users
   - foodlistings
   - donations
   - analytics (if created)

---

## 🛠️ Database Features

✅ **Automatic Schema Validation** - Mongoose enforces schema
✅ **Indexed Fields** - Fast queries on email, status, dates
✅ **Referential Integrity** - ObjectId relationships
✅ **Auto-Timestamps** - createdAt, updatedAt tracked automatically
✅ **Computed Analytics** - Real-time aggregation pipelines
✅ **Cloud Backup** - MongoDB Atlas automatic backups

---

## 🔐 Security

- ✅ Password hashing before storage (bcryptjs)
- ✅ JWT token authentication
- ✅ MongoDB user: `admin` (change in production!)
- ✅ Network access configured in MongoDB Atlas
- ✅ Database-level authentication

---

## 🎯 Next Steps

1. **Verify backend is running** (check terminal)
2. **Open frontend**: http://localhost:5173
3. **Register first user** → Creates users collection
4. **Create food listing** → Creates foodlistings collection
5. **Request donation** → Creates donations collection
6. **Check MongoDB Atlas** to see your data!

---

**Your database is ready! Start using the application and collections will be created automatically! 🎉**
