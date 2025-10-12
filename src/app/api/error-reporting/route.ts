import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const errorData = await request.json();

    // Validate error data
    if (!errorData.message || !errorData.timestamp) {
      return NextResponse.json(
        { error: 'Invalid error data' },
        { status: 400 }
      );
    }

    // Log error to console (in production, send to external service)
    console.error('Error Report:', {
      ...errorData,
      ip:
        request.headers.get('x-forwarded-for') ||
        request.headers.get('x-real-ip'),
      userAgent: request.headers.get('user-agent'),
    });

    // In production, you would send this to your error tracking service
    // Examples:
    // - Sentry: Sentry.captureException(error)
    // - LogRocket: LogRocket.captureException(error)
    // - Bugsnag: Bugsnag.notify(error)
    // - Custom logging service

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to process error report:', error);
    return NextResponse.json(
      { error: 'Failed to process error report' },
      { status: 500 }
    );
  }
}
