import { useState, useEffect } from 'react';

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowConsent(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowConsent(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 backdrop-blur"></div>
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8 flex flex-col items-center animate-fadeIn">
        <div className="text-2xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <span>Choose your cookies</span> <span role="img" aria-label="cookie">🍪</span>
        </div>
        <div className="text-gray-600 text-center text-sm mb-4">
          We use some optional cookies to improve our services, tailor your experience and support our online marketing. To learn more about how we use cookies, read our
          <a href="/privacy-policy" className="text-orange-600 hover:underline ml-1 font-medium">Privacy Policy</a>.
        </div>
        <div className="flex gap-3 w-full mt-2">
          <button
            onClick={handleAccept}
            className="flex-1 px-4 py-2 rounded-lg bg-orange-500 text-white font-semibold shadow hover:bg-orange-600 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            Accept all
          </button>
          <button
            onClick={handleReject}
            className="flex-1 px-4 py-2 rounded-lg border-2 border-orange-500 text-orange-600 font-semibold bg-white hover:bg-orange-50 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-orange-200"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent; 