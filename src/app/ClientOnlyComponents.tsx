'use client';

import dynamic from 'next/dynamic';

const PWAInstallPrompt = dynamic(
  () => import('../components/PWA/PWAInstallPrompt'),
  {
    ssr: false,
  }
);

const BackToTop = dynamic(() => import('../components/UI/BackToTop'), {
  ssr: false,
});

export default function ClientOnlyComponents() {
  return (
    <>
      <PWAInstallPrompt />
      <BackToTop />
    </>
  );
}
