'use client';

import { useEffect, useRef } from 'react';

const AdsterraAd = () => {
  const scriptLoaded = useRef(false);

  useEffect(() => {
    // Prevent duplicate script loading
    if (scriptLoaded.current) return;
    if (document.querySelector('script[src*="effectivegatecpm.com"]')) {
      scriptLoaded.current = true;
      return;
    }

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src =
      '//pl28055281.effectivegatecpm.com/58/dc/40/58dc40324379ab05ae8441ed8c5a0817.js';
    script.async = true;
    script.defer = true;

    // Add error handling
    script.onerror = () => {
      console.warn('Adsterra script failed to load');
    };

    document.body.appendChild(script);
    scriptLoaded.current = true;

    // Cleanup function
    return () => {
      // Note: We don't remove the script on unmount to avoid breaking ads
      // The script will remain but won't reload on navigation
    };
  }, []);

  return (
    <div className='w-full my-8 flex justify-center items-center min-h-[250px] bg-light/50 dark:bg-dark/50 rounded-lg border border-dark/10 dark:border-light/10'>
      {/* Ad container - Adsterra will inject content here */}
      <div id='adsterra-container' className='w-full' />
    </div>
  );
};

export default AdsterraAd;

