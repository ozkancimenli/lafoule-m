import { NextResponse } from 'next/server';

// Simple in-memory rate limiting
const rateLimitMap = new Map();

export function middleware(request) {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 100; // Max 100 requests per window

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
  } else {
    const userLimit = rateLimitMap.get(ip);
    
    if (now > userLimit.resetTime) {
      // Reset the window
      rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    } else if (userLimit.count >= maxRequests) {
      // Rate limit exceeded
      return new NextResponse('Too Many Requests', { status: 429 });
    } else {
      // Increment count
      userLimit.count++;
    }
  }

  // Clean up old entries periodically
  if (Math.random() < 0.01) { // 1% chance
    for (const [key, value] of rateLimitMap.entries()) {
      if (now > value.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/contact',
    '/api/newsletter',
  ],
};
