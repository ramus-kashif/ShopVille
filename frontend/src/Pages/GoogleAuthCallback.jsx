import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function GoogleAuthCallback() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      // Handle OAuth error
      window.opener?.postMessage({
        type: 'GOOGLE_OAUTH_ERROR',
        error: error
      }, window.location.origin);
      window.close();
      return;
    }

    if (code) {
      // Exchange code for tokens and user info
      handleGoogleCallback(code);
    }
  }, [searchParams]);

  const handleGoogleCallback = async (code) => {
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
          error: data.message || 'Authentication failed'
        }, window.location.origin);
      }
    } catch (error) {
      // Send error message to parent window
      window.opener?.postMessage({
        type: 'GOOGLE_OAUTH_ERROR',
        error: 'Network error occurred'
      }, window.location.origin);
    }
    
    window.close();
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#FF6B00] mx-auto mb-4"></div>
        <p className="text-xl text-[#1C1C1E] font-semibold">Completing Google Sign In...</p>
        <p className="text-[#6C757D] mt-2">Please wait while we authenticate your account</p>
      </div>
    </div>
  );
} 