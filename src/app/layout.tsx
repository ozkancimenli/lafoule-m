import './globals.css';
import { cx } from '../utils';
import { Inter, Manrope } from 'next/font/google';
import Header from '../components/Header';
import Footer from '../components/Footer';
import siteMetadata from '../utils/siteMetaData';
import Script from 'next/script';
import GoogleAnalytics from '../components/Analytics/GoogleAnalytics';
import SchemaMarkup from '../components/SEO/SchemaMarkup';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ReactNode } from 'react';
import ClientOnlyComponents from './ClientOnlyComponents';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-in',
  preload: true,
  adjustFontFallback: true,
});

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mr',
  preload: true,
  adjustFontFallback: true,
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
  other: {
    'dns-prefetch': 'https://fonts.googleapis.com https://fonts.gstatic.com',
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
          {`(function() {
  try {
    const theme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (theme === 'dark' || (!theme && prefersDark)) {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {}
})();`}
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
        <ClientOnlyComponents />
        <SpeedInsights />
      </body>
    </html>
  );
}
