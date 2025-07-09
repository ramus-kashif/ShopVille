import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Package, CheckCircle, XCircle } from 'lucide-react';

export default function GoogleCallback() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      // Handle OAuth error
      window.opener?.postMessage({
        type: 'GOOGLE_OAUTH_ERROR',
        error: 'Google authentication was cancelled or failed'
      }, window.location.origin);
      window.close();
      return;
    }

    if (code) {
      // Exchange code for token
      handleGoogleAuth(code);
    }
  }, [searchParams]);

  const handleGoogleAuth = async (code) => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/auth/google/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (data.success) {
        // Send success message to parent window
        window.opener?.postMessage({
          type: 'GOOGLE_OAUTH_SUCCESS',
          user: data.user
        }, window.location.origin);
      } else {
        // Send error message to parent window
        window.opener?.postMessage({
          type: 'GOOGLE_OAUTH_ERROR',
          error: data.message || 'Google authentication failed'
        }, window.location.origin);
      }
    } catch (error) {
      // Send error message to parent window
      window.opener?.postMessage({
        type: 'GOOGLE_OAUTH_ERROR',
        error: 'Network error during Google authentication'
      }, window.location.origin);
    }

    // Close the popup
    window.close();
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center p-8">
        <div className="w-24 h-24 bg-[#F8F9FA] rounded-full flex items-center justify-center mx-auto mb-6">
          <Package className="w-12 h-12 text-[#6C757D]" />
        </div>
        <h2 className="text-2xl font-bold text-[#1C1C1E] mb-2">
          Completing Google Login...
        </h2>
        <p className="text-[#6C757D] mb-6">
          Please wait while we complete your authentication
        </p>
        <div className="flex items-center justify-center gap-2 text-[#FF6B00]">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#FF6B00]"></div>
          <span>Processing...</span>
        </div>
      </div>
    </div>
  );
} 