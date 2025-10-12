'use client';

import { useEffect } from 'react';
import { trackEvent } from './useAnalytics';

export const usePerformance = () => {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      // Track page load performance
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0];
        const paint = performance.getEntriesByType('paint');

        const metrics = {
          loadTime: navigation.loadEventEnd - navigation.loadEventStart,
          domContentLoaded:
            navigation.domContentLoadedEventEnd -
            navigation.domContentLoadedEventStart,
          firstPaint:
            paint.find(entry => entry.name === 'first-paint')?.startTime || 0,
          firstContentfulPaint:
            paint.find(entry => entry.name === 'first-contentful-paint')
              ?.startTime || 0,
        };

        // Track performance metrics
        trackEvent(
          'performance',
          'page_load',
          'metrics',
          Math.round(metrics.loadTime)
        );

        // Log slow pages
        if (metrics.loadTime > 3000) {
          trackEvent(
            'performance',
            'slow_page',
            'load_time',
            Math.round(metrics.loadTime)
          );
        }
      });

      // Track Core Web Vitals
      if ('web-vitals' in window) {
        import('web-vitals').then(
          ({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
            getCLS(metric =>
              trackEvent(
                'performance',
                'web_vitals',
                'CLS',
                Math.round(metric.value * 1000)
              )
            );
            getFID(metric =>
              trackEvent(
                'performance',
                'web_vitals',
                'FID',
                Math.round(metric.value)
              )
            );
            getFCP(metric =>
              trackEvent(
                'performance',
                'web_vitals',
                'FCP',
                Math.round(metric.value)
              )
            );
            getLCP(metric =>
              trackEvent(
                'performance',
                'web_vitals',
                'LCP',
                Math.round(metric.value)
              )
            );
            getTTFB(metric =>
              trackEvent(
                'performance',
                'web_vitals',
                'TTFB',
                Math.round(metric.value)
              )
            );
          }
        );
      }
    }
  }, []);
};
