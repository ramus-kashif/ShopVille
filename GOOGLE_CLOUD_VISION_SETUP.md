# Google Cloud Vision API Setup Guide

This guide will help you set up Google Cloud Vision API for image-based search functionality in ShopVille.

## Prerequisites

1. A Google Cloud Platform account
2. A project in Google Cloud Console
3. Billing enabled on your project

## Step 1: Enable the Vision API

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to "APIs & Services" > "Library"
4. Search for "Cloud Vision API"
5. Click on "Cloud Vision API" and then click "Enable"

## Step 2: Create a Service Account

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in the service account details:
   - Name: `shopville-vision-api`
   - Description: `Service account for ShopVille image search`
4. Click "Create and Continue"
5. Skip the optional steps and click "Done"

## Step 3: Generate a JSON Key

1. In the Credentials page, find your service account
2. Click on the service account email
3. Go to the "Keys" tab
4. Click "Add Key" > "Create new key"
5. Choose "JSON" format
6. Click "Create"
7. The JSON file will be downloaded automatically

## Step 4: Set Up the Key File

1. Rename the downloaded JSON file to `google-cloud-vision-key.json`
2. Place it in the `backend/` directory of your project
3. **Important**: Add this file to your `.gitignore` to keep it secure

## Step 5: Update Environment Variables

Add the following to your `.env` file:

```env
GOOGLE_CLOUD_VISION_KEY_FILE=./google-cloud-vision-key.json
```

## Step 6: Install Dependencies

Run the following command in the backend directory:

```bash
npm install @google-cloud/vision
```

## Step 7: Test the Setup

1. Start your backend server
2. Go to the shop page
3. Click the camera icon in the search bar
4. Upload an image to test the image search functionality

## Troubleshooting

### Common Issues:

1. **"Could not load the default credentials"**
   - Make sure the JSON key file is in the correct location
   - Verify the file path in your environment variables

2. **"API not enabled"**
   - Ensure the Cloud Vision API is enabled in your Google Cloud Console

3. **"Billing not enabled"**
   - Enable billing on your Google Cloud project

4. **"Quota exceeded"**
   - Check your Google Cloud billing and quota limits

### Alternative Setup (Without Google Cloud Vision)

If you don't want to use Google Cloud Vision, the system includes a fallback:

1. The image search will still work but with basic functionality
2. It will return a sample of products instead of analyzing the image
3. You can enhance this with other image analysis services

## Security Notes

- Never commit the JSON key file to version control
- Keep your service account credentials secure
- Consider using environment variables for production deployments
- Monitor your Google Cloud usage to avoid unexpected charges

## Cost Considerations

- Google Cloud Vision API has a free tier (1000 requests per month)
- After the free tier, you pay per request
- Monitor your usage in the Google Cloud Console
- Set up billing alerts to avoid unexpected charges

## Production Deployment

For production deployment:

1. Use environment variables instead of a JSON file
2. Set up proper IAM roles and permissions
3. Enable API quotas and monitoring
4. Consider using a CDN for image storage
5. Implement rate limiting for the image search API 