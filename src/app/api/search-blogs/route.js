import { NextResponse } from 'next/server';
import { getAllBlogs } from '../../../lib/blog';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
      return NextResponse.json({ blogs: [] });
    }

    const allBlogs = getAllBlogs();
    const searchTerm = query.toLowerCase();

    const filteredBlogs = allBlogs.filter(blog => {
      const title = blog.title?.toLowerCase() || '';
      const description = blog.description?.toLowerCase() || '';
      const content = blog.content?.toLowerCase() || '';
      const tags = blog.tags?.join(' ').toLowerCase() || '';

      return (
        title.includes(searchTerm) ||
        description.includes(searchTerm) ||
        content.includes(searchTerm) ||
        tags.includes(searchTerm)
      );
    });

    // Limit results to 10 for performance
    const limitedResults = filteredBlogs.slice(0, 10);

    return NextResponse.json({
      blogs: limitedResults,
      total: filteredBlogs.length,
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ blogs: [] }, { status: 500 });
  }
}
