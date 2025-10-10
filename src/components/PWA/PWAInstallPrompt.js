'use client';

import { useState, useEffect } from 'react';

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  if (!showInstallPrompt) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-dark dark:bg-light text-light dark:text-dark p-4 rounded-lg shadow-lg z-50 max-w-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-sm mb-1">Install App</h3>
          <p className="text-xs opacity-90">
            Install this app for a better experience
          </p>
        </div>
        <div className="flex gap-2 ml-4">
          <button
            onClick={handleInstallClick}
            className="bg-primary text-white px-3 py-1 rounded text-xs font-medium hover:bg-primary/90 transition-colors"
          >
            Install
          </button>
          <button
            onClick={() => setShowInstallPrompt(false)}
            className="text-xs opacity-70 hover:opacity-100 transition-opacity"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
