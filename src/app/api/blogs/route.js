import { NextResponse } from 'next/server';
import { getAllBlogs } from '../../../lib/blog';

export async function GET() {
  try {
    const blogs = getAllBlogs();
    return NextResponse.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}


