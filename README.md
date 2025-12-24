# 🏥 Care.xyz - Professional Caregiving Service Platform

> A comprehensive, full-stack caregiving service platform built with Next.js 15, MongoDB, NextAuth, Stripe, and Resend. Book professional caregivers for babies, elderly, and sick family members with seamless payment processing and automated email confirmations.

[![Next.js](https://img.shields.io/badge/Next.js-15.5.9-black?logo=next.js)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## ✨ Features

### 🔐 Authentication & Authorization

- **Multi-Provider Auth** - Email/password and Google OAuth 2.0 via NextAuth.js
- **Role-Based Access Control** - Admin and User roles with protected routes
- **Real-time Password Validation** - Live feedback on password requirements
- **Secure Sessions** - MongoDB session storage with automatic expiration

### 💳 Payment Integration

- **Stripe Payment Gateway** - Secure card payments with 3D Secure support
- **Payment Verification** - Server-side payment validation
- **Transaction History** - Track all payment activities
- **Payment Success Page** - Professional confirmation with booking details

### 📧 Email Notifications

- **Booking Confirmations** - Automated email invoices via Resend
- **Professional Templates** - Beautiful HTML email design with invoice details
- **Reliable Delivery** - Server-side email sending with error handling

### 📅 Service Booking System

- **3 Service Categories** - Baby Care, Elderly Care, Sick People Care
- **Flexible Pricing** - Hourly and daily rate options
- **Location Selection** - 8 divisions, 64 districts, full address support
- **Booking Management** - View, update, and cancel bookings
- **Payment Status Tracking** - Paid/Unpaid status with color indicators
- **Duplicate Prevention** - Smart detection of same-day duplicate bookings

### 👨‍💼 Admin Dashboard

- **User Management** - View, edit, suspend, and delete user accounts
- **Booking Overview** - Monitor all bookings with filtering options
- **Role Management** - Promote/demote users to admin
- **Account Suspension** - Temporarily suspend problematic accounts
- **Admin-Only Access** - Separate navbar and restricted features

### 🎨 User Experience

- **Dark/Light Theme** - Beautiful theme switcher with smooth transitions
- **Responsive Design** - Mobile-first approach for all devices
- **Professional UI** - Modern glassmorphism effects and gradients
- **Image Gallery** - Unsplash integration for service images
- **Password Visibility Toggle** - Enhanced form usability
- **Interactive Alerts** - Toast notifications for user feedback
- **Loading States** - Skeleton screens and spinners

### 🖼️ Media Management

- **Image Upload** - imgBB API integration for profile pictures
- **Automatic Compression** - Optimized image sizes
- **Secure Storage** - External CDN hosting

## 🚀 Tech Stack

### Frontend

- **Framework**: Next.js 15.5.9 (App Router)
- **Styling**: Tailwind CSS 3.4 + DaisyUI 5.0
- **Icons**: React Icons (Feather, Font Awesome)
- **Carousel**: Swiper.js 11.2
- **Notifications**: React Hot Toast
- **HTTP Client**: Axios

### Backend

- **Runtime**: Node.js with Next.js API Routes
- **Database**: MongoDB Atlas with Mongoose ODM
- **Authentication**: NextAuth.js v4
- **Password Security**: bcryptjs
- **Payment Processing**: Stripe SDK
- **Email Service**: Resend API
- **Image Hosting**: imgBB API

### DevOps & Deployment

- **Version Control**: Git & GitHub
- **Environment**: dotenv for configuration
- **Build Tool**: Next.js built-in compiler
- **Deployment Ready**: Vercel-optimized

## 📦 Installation

### Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account
- Stripe account (for payments)
- Resend account (for emails)
- imgBB API key (for image uploads)

### Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/shamim0183/care-xyz.git
   cd care-xyz
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   # Database (MongoDB Atlas)
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/caredb

   # NextAuth Configuration
   NEXTAUTH_SECRET=your_nextauth_secret_key
   NEXTAUTH_URL=http://localhost:3000

   # Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret

   # Resend Email Service
   RESEND_API_KEY=your_resend_api_key
   EMAIL_FROM=onboarding@resend.dev

   # Stripe Payment
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
   STRIPE_SECRET_KEY=sk_test_your_secret_key

   # imgbb API
   IMGBB_API_KEY=your_imgbb_api_key
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
care-xyz/
├── app/
│   ├── (auth)/              # Authentication pages
│   │   ├── login/           # Login page with Google OAuth
│   │   └── register/        # Registration with validation
│   ├── (protected)/         # Protected routes (require login)
│   │   ├── booking/         # Service booking pages
│   │   ├── my-bookings/     # User booking history
│   │   ├── profile/         # User profile management
│   │   ├── payment/         # Payment processing & success
│   │   └── admin/           # Admin-only dashboard
│   ├── (public)/            # Public pages
│   │   ├── about/           # About us page
│   │   ├── services/        # Service listing
│   │   └── service/         # Service detail pages
│   ├── api/                 # API routes
│   │   ├── auth/            # NextAuth endpoints
│   │   ├── bookings/        # Booking CRUD
│   │   ├── payment/         # Stripe integration
│   │   ├── upload/          # Image upload
│   │   └── user/            # User management
│   ├── components.css       # Global component styles
│   ├── globals.css          # Global styles & Tailwind
│   ├── layout.js            # Root layout with providers
│   └── page.js              # Home page
├── components/              # Reusable components
│   ├── Hero.jsx             # Hero carousel with Swiper
│   ├── Navbar.jsx           # Responsive navbar with theme
│   ├── Footer.jsx           # Footer with social links
│   ├── ServiceCard.jsx      # Service display cards
│   └── ThemeToggle.jsx      # Dark/light mode switcher
├── data/                    # JSON data files
│   ├── services.json        # Service definitions
│   ├── reviews.json         # Customer testimonials
│   ├── divisions.json       # Bangladesh divisions
│   └── districts.json       # District mappings
├── lib/                     # Utility functions
│   ├── auth.js              # NextAuth configuration
│   ├── mongodb.js           # MongoDB connection
│   ├── email.js             # Resend email templates
│   └── utils.js             # Helper functions
├── models/                  # Mongoose schemas
│   ├── User.js              # User model with roles
│   └── Booking.js           # Booking model
├── public/                  # Static assets
│   ├── icon.svg             # App icon
│   └── favicon.ico          # Browser favicon
└── middleware.js            # Route protection middleware
```

## 🔐 Environment Variables

| Variable                             | Description               | Required    | Example                            |
| ------------------------------------ | ------------------------- | ----------- | ---------------------------------- |
| `MONGODB_URI`                        | MongoDB connection string | ✅ Yes      | `mongodb+srv://user:pass@...`      |
| `NEXTAUTH_SECRET`                    | Secret for NextAuth.js    | ✅ Yes      | Random 32-char string              |
| `NEXTAUTH_URL`                       | Your app URL              | ✅ Yes      | `http://localhost:3000`            |
| `GOOGLE_CLIENT_ID`                   | Google OAuth Client ID    | ⚠️ Optional | `xxxxx.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET`               | Google OAuth Secret       | ⚠️ Optional | `GOCSPX-xxxxx`                     |
| `RESEND_API_KEY`                     | Resend email API key      | ✅ Yes      | `re_xxxxx`                         |
| `EMAIL_FROM`                         | Sender email address      | ✅ Yes      | `onboarding@resend.dev`            |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe public key         | ✅ Yes      | `pk_test_xxxxx`                    |
| `STRIPE_SECRET_KEY`                  | Stripe secret key         | ✅ Yes      | `sk_test_xxxxx`                    |
| `IMGBB_API_KEY`                      | imgBB image hosting key   | ✅ Yes      | `xxxxxxxxxxxxxxxx`                 |

## 💻 Usage

### For End Users

1. **Register** - Create account with NID, email, contact, password (or use Google)
2. **Browse Services** - Explore Baby Care, Elderly Care, Sick Care options
3. **Book Service** - Select duration (hourly/daily), provide location details
4. **Make Payment** - Secure Stripe checkout with card payment
5. **Receive Confirmation** - Get email invoice with booking details
6. **Manage Bookings** - View history, update details, track payment status

### For Admins

1. **Admin Dashboard** - Access `/admin/dashboard`
2. **User Management** - View all users, suspend/activate accounts
3. **Booking Oversight** - Monitor all bookings across platform
4. **Role Management** - Promote users to admin or demote back to user

### For Developers

```bash
# Development mode (hot reload)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Clean build cache
rm -rf .next
```

## 🎯 Key Features Explained

### Authentication Flow

```mermaid
graph LR
    A[User] -->|Register| B{Validation}
    B -->|Success| C[Hash Password]
    C --> D[Save to MongoDB]
    D --> E[Create Session]
    E --> F[Redirect to Home]
    B -->|Error| A
```

**Password Requirements:**

- Minimum 6 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character

### Booking Flow

```mermaid
graph TD
    A[Browse Services] --> B[View Service Details]
    B --> C[Click Book This Service]
    C --> D{Authenticated?}
    D -->|No| E[Redirect to Login]
    D -->|Yes| F[Fill Booking Form]
    F --> G[Submit Booking]
    G --> H[Redirect to Payment]
    H --> I[Stripe Checkout]
    I --> J{Payment Success?}
    J -->|Yes| K[Update Booking Status]
    K --> L[Send Email Confirmation]
    L --> M[Show Success Page]
    J -->|No| N[Show Error]
```

### Role-Based Access

| Feature                | User | Admin |
| ---------------------- | ---- | ----- |
| Book Services          | ✅   | ❌    |
| View Own Bookings      | ✅   | ✅    |
| Make Payments          | ✅   | ❌    |
| Update Profile         | ✅   | ✅    |
| Access Admin Dashboard | ❌   | ✅    |
| Manage Users           | ❌   | ✅    |
| View All Bookings      | ❌   | ✅    |
| Suspend Accounts       | ❌   | ✅    |

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**

   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import in Vercel**

   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository

3. **Configure Environment**

   - Add all environment variables from `.env.local`
   - Update `NEXTAUTH_URL` to your production domain

4. **Deploy**

   - Click "Deploy"
   - Wait for build to complete

5. **Post-Deployment**
   - Update Google OAuth redirect URIs
   - Update Stripe webhook endpoints
   - Test all features in production

### Environment Setup for Production

```env
NEXTAUTH_URL=https://care-xyz.vercel.app
# Update all other variables as needed
```

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Failed**

- Check `MONGODB_URI` is correct
- Ensure IP whitelist includes your deployment platform

**Google OAuth Not Working**

- Verify redirect URIs in Google Console
- Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

**Emails Not Sending**

- Resend requires `onboarding@resend.dev` as sender on free tier
- Check `RESEND_API_KEY` is valid

**Stripe Payments Failing**

- Ensure `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` starts with `pk_`
- Verify `STRIPE_SECRET_KEY` starts with `sk_`
- Use test cards: `4242 4242 4242 4242`

## 📊 Database Schema

### User Model

```javascript
{
  name: String,
  nid: String (unique),
  email: String (unique),
  contact: String,
  password: String (hashed),
  role: String (enum: ['user', 'admin']),
  status: String (enum: ['active', 'suspended']),
  image: String (URL),
  createdAt: Date
}
```

### Booking Model

```javascript
{
  userId: ObjectId (ref: 'User'),
  serviceId: String,
  serviceName: String,
  duration: { value: Number, unit: String },
  location: {
    division: String,
    district: String,
    city: String,
    area: String,
    address: String
  },
  totalCost: Number,
  status: String (enum: ['Pending', 'Confirmed', 'Cancelled']),
  paymentStatus: String (enum: ['Paid', 'Unpaid']),
  createdAt: Date
}
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

**Shamim Hossain**

- 🌐 Portfolio: [Coming Soon]
- 💼 GitHub: [@shamim0183](https://github.com/shamim0183)
- 📧 Email: [Your Email]

## 🙏 Acknowledgments

- **Next.js Team** - For the incredible React framework
- **Vercel** - For seamless deployment platform
- **Tailwind CSS** - For utility-first CSS framework
- **DaisyUI** - For beautiful component library
- **MongoDB** - For flexible database solution
- **Stripe** - For secure payment processing
- **Resend** - For reliable email delivery
- **Unsplash** - For high-quality professional images
- **imgBB** - For image hosting service

## 📈 Roadmap

- [ ] SMS notifications for booking confirmations
- [ ] Real-time chat between users and caregivers
- [ ] Calendar view for booking management
- [ ] Multi-language support (Bengali/English)
- [ ] Caregiver profiles and ratings
- [ ] Subscription plans for frequent users
- [ ] Mobile app (React Native)
- [ ] AI-powered caregiver recommendations

---

<p align="center">
  <strong>Made with ❤️ for professional caregiving services</strong>
  <br>
  <sub>Built with Next.js, MongoDB, Stripe & Resend</sub>
</p>
