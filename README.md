# Care.xyz - Professional Caregiving Service Platform

A modern, full-stack caregiving service platform built with Next.js, MongoDB, and NextAuth. Book professional caregivers for babies, elderly, and sick family members with ease.

## 🌟 Features

### Core Features

- **User Authentication** - Secure login/registration with email/password and Google OAuth
- **Service Booking** - Book caregiving services with flexible hourly/daily rates
- **Real-time Password Validation** - Live feedback on password requirements
- **Theme Support** - Beautiful light/dark mode with smooth transitions
- **Responsive Design** - Mobile-first design that works on all devices
- **Professional UI** - Modern glassmorphism effects and Unsplash imagery

### User Features

- Browse caregiving services (Baby Care, Elderly Care, Sick Care)
- View detailed service information with professional images
- Book services with date/time selection
- View booking history
- Manage profile and account settings

### Technical Features

- Server-side authentication with NextAuth.js
- MongoDB database integration
- Session management
- Protected routes and API endpoints
- SEO-optimized pages
- Real-time form validation

## 🚀 Tech Stack

### Frontend

- **Framework**: Next.js 15.1.3 (App Router)
- **Styling**: Tailwind CSS + DaisyUI
- **Icons**: React Icons (Feather Icons)
- **Carousel**: Swiper.js
- **Notifications**: React Hot Toast

### Backend

- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js v4
- **Password Hashing**: bcryptjs
- **API Routes**: Next.js API Routes

### Deployment Ready

- Environment variable configuration
- Production build optimized
- SEO metadata included

## 📦 Installation

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
   # MongoDB
   MONGODB_URI=your_mongodb_connection_string

   # NextAuth
   NEXTAUTH_SECRET=your_secret_key_here
   NEXTAUTH_URL=http://localhost:3000

   # Google OAuth (Optional)
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 Features Showcase

### Authentication

- Professional login/register pages with modern design
- Real-time password validation with visual feedback
- Google OAuth integration
- Secure session management

### Services

- **Baby Care**: Professional baby care with feeding, diaper changing, playtime
- **Elderly Care**: Compassionate care for senior citizens
- **Sick Care**: Specialized care for recovering individuals

### User Experience

- Smooth theme transitions (light/dark mode)
- Beautiful hero slider with Unsplash images
- Glassmorphism navbar design
- Mobile-responsive hamburger menu
- Intuitive booking flow

## 📁 Project Structure

```
care-xyz/
├── app/
│   ├── (auth)/           # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── (protected)/      # Protected routes
│   │   ├── booking/
│   │   └── my-bookings/
│   ├── (public)/         # Public pages
│   │   ├── about/
│   │   ├── services/
│   │   └── service/
│   └── api/              # API routes
│       ├── auth/
│       ├── bookings/
│       └── services/
├── components/           # Reusable components
│   ├── Hero.jsx
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── ServiceCard.jsx
│   └── ThemeToggle.jsx
├── data/                 # JSON data files
│   ├── services.json
│   └── reviews.json
├── lib/                  # Utility functions
│   ├── auth.js
│   ├── mongodb.js
│   └── utils.js
├── models/               # Mongoose models
│   ├── User.js
│   └── Booking.js
└── public/               # Static assets
```

## 🔐 Environment Variables

| Variable               | Description               | Required    |
| ---------------------- | ------------------------- | ----------- |
| `MONGODB_URI`          | MongoDB connection string | ✅ Yes      |
| `NEXTAUTH_SECRET`      | Secret for NextAuth.js    | ✅ Yes      |
| `NEXTAUTH_URL`         | Your app URL              | ✅ Yes      |
| `GOOGLE_CLIENT_ID`     | Google OAuth Client ID    | ⚠️ Optional |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Secret       | ⚠️ Optional |

## 📝 Usage

### For Users

1. **Register** - Create an account with email/password or Google
2. **Browse Services** - View available caregiving services
3. **Book Service** - Select service, date, time, and submit booking
4. **View Bookings** - Check your booking history

### For Developers

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 🎯 Key Components

### Authentication Flow

- User registers with NID, name, email, contact, and password
- Password must meet: 6+ chars, uppercase, lowercase, number, symbol
- Session stored in MongoDB
- Protected routes redirect to login

### Booking Flow

1. User selects service from Services page
2. Views service details with pricing
3. Clicks "Book This Service"
4. Fills booking form with date/time
5. Booking saved to database
6. Confirmation displayed

## 🌐 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Setup for Production

Update `NEXTAUTH_URL` and add production URLs to Google OAuth settings.

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Developer

**Shamim Hossain**

- GitHub: [@shamim0183](https://github.com/shamim0183)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for styling utilities
- DaisyUI for component library
- Unsplash for professional images
- MongoDB for database solution

---

**Made with ❤️ for professional caregiving services**
