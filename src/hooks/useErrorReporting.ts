import { useCallback } from 'react';

interface ErrorReport {
  message: string;
  stack?: string;
  component?: string;
  userId?: string;
  userAgent: string;
  url: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export function useErrorReporting() {
  const reportError = useCallback(
    async (error: Error, context?: Record<string, any>) => {
      const errorReport: ErrorReport = {
        message: error.message,
        stack: error.stack,
        component: context?.component || 'Unknown',
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: new Date().toISOString(),
        severity: context?.severity || 'medium',
      };

      // In development, just log to console
      if (process.env.NODE_ENV === 'development') {
        console.error('Error Report:', errorReport);
        return;
      }

      // In production, send to error tracking service
      try {
        await fetch('/api/error-reporting', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(errorReport),
        });
      } catch (reportingError) {
        console.error('Failed to report error:', reportingError);
      }
    },
    []
  );

  const reportPerformanceIssue = useCallback(
    async (metric: string, value: number, threshold: number) => {
      const report = {
        type: 'performance',
        metric,
        value,
        threshold,
        url: window.location.href,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
      };

      if (process.env.NODE_ENV === 'development') {
        console.warn('Performance Issue:', report);
        return;
      }

      try {
        await fetch('/api/performance-reporting', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(report),
        });
      } catch (error) {
        console.error('Failed to report performance issue:', error);
      }
    },
    []
  );

  return {
    reportError,
    reportPerformanceIssue,
  };
}
