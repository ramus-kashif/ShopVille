# Google Cloud Vision and OAuth Setup Guide

## Google Cloud Vision API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Cloud Vision API
4. Create a service account and download the JSON key file
5. Place the JSON key file in the backend directory
6. Set the GOOGLE_APPLICATION_CREDENTIALS environment variable

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to "APIs & Services" > "Credentials"
3. Click "Create Credentials" > "OAuth 2.0 Client IDs"
4. Choose "Web application" as the application type
5. Add authorized redirect URIs:
   - `http://localhost:5173/auth/google/callback` (for development)
   - `https://yourdomain.com/auth/google/callback` (for production)
6. Copy the Client ID and Client Secret

## Environment Variables

Add these to your `.env` file:

```env
# Google Cloud Vision
GOOGLE_APPLICATION_CREDENTIALS=path/to/your/service-account-key.json

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FRONTEND_URL=http://localhost:5173
```

## Frontend Environment Variables

Add this to your frontend `.env` file:

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

## Troubleshooting

### OAuth Error 401: invalid_client
This error occurs when:
1. Google OAuth credentials are not properly configured
2. Client ID or Client Secret is incorrect
3. Redirect URI is not authorized
4. Environment variables are not set

### Solutions:
1. Verify your Google OAuth credentials in Google Cloud Console
2. Check that all environment variables are set correctly
3. Ensure the redirect URI matches exactly what's configured in Google Cloud Console
4. Restart your server after updating environment variables 