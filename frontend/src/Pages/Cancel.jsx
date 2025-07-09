import { Link } from 'react-router-dom';
import { useEffect } from 'react';

function Cancel() {
  useEffect(() => {
    // Optional: Track cancelled payment for analytics
    console.log('Payment was cancelled by user');
  }, []);

  return (
    <div className="container mx-auto py-8 min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div className="text-red-500 text-6xl mb-4">❌</div>
        <h1 className="text-3xl font-bold text-red-600 mb-4">Payment Cancelled</h1>
        <p className="text-gray-600 mb-2">Your payment was cancelled.</p>
        <p className="text-gray-600 mb-6">No charges were made to your account.</p>
        
        <div className="bg-yellow-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-700">
            <span className="font-medium">Don't worry!</span> Your cart items are still saved.
          </p>
          <p className="text-xs text-yellow-600 mt-1">
            You can continue shopping or try the payment again.
          </p>
        </div>
        
        <div className="flex flex-col gap-3">
          <Link
            to="/checkout"
            className="bg-orange-400 hover:bg-orange-500 text-white px-6 py-2 rounded text-lg font-semibold transition-colors"
          >
            Try Again
          </Link>
          <Link
            to="/cart"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded text-lg font-semibold transition-colors"
          >
            Back to Cart
          </Link>
          <Link
            to="/"
            className="text-gray-500 hover:text-gray-700 text-sm underline transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Cancel;