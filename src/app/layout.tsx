import './globals.css';
import { cx } from '../utils';
import { Inter, Manrope } from 'next/font/google';
import Header from '../components/Header';
import Footer from '../components/Footer';
import siteMetadata from '../utils/siteMetaData';
import Script from 'next/script';
import GoogleAnalytics from '../components/Analytics/GoogleAnalytics';
import SchemaMarkup from '../components/SEO/SchemaMarkup';
import PWAInstallPrompt from '../components/PWA/PWAInstallPrompt';
import BackToTop from '../components/UI/BackToTop';
import { usePerformance } from '../hooks/usePerformance';
import { ReactNode } from 'react';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-in',
});

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mr',
});

export const metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    template: `%s | ${siteMetadata.title}`,
    default: siteMetadata.title, // a default is required when creating a template
  },
  description: siteMetadata.description,
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: siteMetadata.siteUrl,
    siteName: siteMetadata.title,
    images: [siteMetadata.socialBanner],
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    card: 'summary_large_image',
    title: siteMetadata.title,
    images: [siteMetadata.socialBanner],
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={cx(
          inter.variable,
          manrope.variable,
          'font-mr bg-light dark:bg-dark'
        )}
        suppressHydrationWarning
      >
        <Script id='theme-switcher' strategy='beforeInteractive'>
          {`if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }`}
        </Script>
        <GoogleAnalytics GA_TRACKING_ID={process.env.NEXT_PUBLIC_GA_ID} />
        <SchemaMarkup
          type='Person'
          name={siteMetadata.author}
          description={siteMetadata.description}
          url={siteMetadata.siteUrl}
          image={siteMetadata.socialBanner}
          author={siteMetadata.author}
          datePublished={new Date().toISOString()}
          dateModified={new Date().toISOString()}
          articleBody={siteMetadata.description}
        />
        <Header />
        {children}
        <Footer />
        <PWAInstallPrompt />
        <BackToTop />
      </body>
    </html>
  );
}
