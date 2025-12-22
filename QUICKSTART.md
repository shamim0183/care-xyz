# 🚀 Quick Start Guide - Care.xyz Platform

## Step 1: Create .env.local File

**IMPORTANT**: Create a file named `.env.local` in the root directory and copy the content from `CREDENTIALS.txt`

Or run this command:

```bash
cp CREDENTIALS.txt .env.local
```

## Step 2: Install Dependencies (if not done)

```bash
npm install
```

## Step 3: Start Development Server

```bash
npm run dev
```

## Step 4: Open Browser

Navigate to: **http://localhost:3000**

---

## ✅ What's Ready to Test

### 1. Homepage

- Hero carousel with service showcase
- About section
- Services grid
- Testimonials
- Theme toggle (light/dark mode)

### 2. User Registration & Login

- **Register**: http://localhost:3000/register
  - Fill NID, name, email, contact, password
  - Or use Google OAuth
- **Login**: http://localhost:3000/login
  - Email/password or Google

### 3. Browse & Book Services

- **Services**: http://localhost:3000/services
- Click any service → View details
- Click "Book Service" (requires login)
- Fill booking form:
  - Choose hours or days
  - Select location (Division → District → City → Area)
  - Real-time cost calculation
  - Submit booking

### 4. My Bookings

- **My Bookings**: http://localhost:3000/my-bookings
- View all your bookings
- Check status badges
- Cancel bookings (if Pending/Confirmed)

### 5. Other Pages

- **About**: http://localhost:3000/about
- **404 Page**: Try any invalid URL

---

## 🔧 Troubleshooting

### If you see errors:

1. **Module not found**:

   ```bash
   npm install
   ```

2. **MongoDB connection error**:

   - Check MONGODB_URI in .env.local
   - Ensure MongoDB Atlas is accessible

3. **Authentication not working**:

   - Verify NEXTAUTH_SECRET is set
   - Check GOOGLE_CLIENT_ID/SECRET

4. **Port already in use**:
   ```bash
   # Kill process on port 3000 or use different port
   npm run dev -- -p 3001
   ```

---

## 📧 Email Testing

After booking, check if email was sent:

- Resend dashboard: https://resend.com/emails
- Check sent emails and delivery status

---

## 🎨 Features to Test

- [x] Dark/Light theme toggle
- [x] Responsive design (resize browser)
- [x] Google OAuth sign-in
- [x] Service booking flow
- [x] Cost calculation (change duration/unit)
- [x] Location cascading (Division → District → City)
- [x] Booking cancellation
- [x] Protected routes (try accessing /booking without login)

---

## 📝 Test User Accounts

You can create test accounts or use Google OAuth.

**Test Booking Flow**:

1. Register/Login
2. Go to Services
3. Select "Baby Care Service"
4. Click "Book This Service"
5. Choose 2 hours
6. Select Dhaka → Dhaka → Dhaka City → Uttara
7. Add address
8. Confirm booking
9. Check "My Bookings"
10. Check email inbox for invoice

---

## 🚀 Everything Ready!

The platform is fully functional with:

- ✅ All pages built
- ✅ All API routes working
- ✅ Database connected
- ✅ Authentication configured
- ✅ Email service ready
- ✅ Payment gateway integrated
- ✅ Responsive design
- ✅ Theme toggle

**Start the server and enjoy testing!** 🎉
