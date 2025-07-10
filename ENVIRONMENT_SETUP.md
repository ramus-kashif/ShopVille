# Environment Setup Guide

## Frontend Environment Variables

Create a `.env` file in the `frontend` directory with the following variables:

```env
# Google OAuth (Optional - for Google login)
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here

# API Configuration
VITE_API_URL=http://localhost:8080
```

## Backend Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/shopville

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_EXP=7d

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
FRONTEND_URL=http://localhost:5173

# Email (Optional - for OTP)
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Cloudinary (Optional - for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Quick Setup

1. **For basic functionality** (without Google OAuth):
   - You only need the database and JWT variables
   - Google login will show a configuration error but won't break the app

2. **For Google OAuth**:
   - Follow the Google OAuth setup guide in `GOOGLE_CLOUD_VISION_SETUP.md`
   - Add the Google OAuth variables to both frontend and backend

3. **For email OTP**:
   - Configure SMTP settings for email OTP functionality
   - Without this, OTP will be logged to console only

## Testing Phone Login

To test phone login without actual SMS:

1. The OTP will be logged to the console
2. Check the backend console for the OTP code
3. Use that code to complete the login

## Troubleshooting

- **Phone login "User not found"**: Make sure you have a user with the phone number in the database
- **Google OAuth error**: Add the Google OAuth credentials or ignore Google login
- **404 errors**: Make sure both frontend and backend servers are running 