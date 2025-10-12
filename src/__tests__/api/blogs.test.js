import { GET as getAllBlogs } from '../../app/api/blogs/route';
import { GET as getBlogBySlug } from '../../app/api/blogs/[slug]/route';

// Mock the blog utility functions
jest.mock('../../lib/blog', () => ({
  getAllBlogs: jest.fn(() => [
    {
      slug: 'test-blog',
      title: 'Test Blog',
      description: 'Test Description',
      publishedAt: '2023-01-01',
      updatedAt: '2023-01-01',
      author: 'Test Author',
      tags: ['test'],
      url: '/blogs/test-blog',
      readingTime: { text: '1 min read', minutes: 1, time: 60000, words: 200 },
      isPublished: true,
      content: 'Test content',
      toc: [],
    },
  ]),
  getBlogBySlug: jest.fn((slug) => {
    if (slug === 'test-blog') {
      return {
        slug: 'test-blog',
        title: 'Test Blog',
        description: 'Test Description',
        publishedAt: '2023-01-01',
        updatedAt: '2023-01-01',
        author: 'Test Author',
        tags: ['test'],
        url: '/blogs/test-blog',
        readingTime: { text: '1 min read', minutes: 1, time: 60000, words: 200 },
        isPublished: true,
        content: 'Test content',
        toc: [],
      };
    }
    return null;
  }),
}));

describe('/api/blogs', () => {
  it('should return blogs data', async () => {
    const response = await getAllBlogs();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
    expect(data[0]).toHaveProperty('title');
    expect(data[0]).toHaveProperty('slug');
  });
});

describe('/api/blogs/[slug]', () => {
  it('should return specific blog data', async () => {
    const mockRequest = {};
    const mockParams = { params: Promise.resolve({ slug: 'test-blog' }) };
    
    const response = await getBlogBySlug(mockRequest, mockParams);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.title).toBe('Test Blog');
    expect(data.slug).toBe('test-blog');
  });

  it('should return 404 for missing blog', async () => {
    const mockRequest = {};
    const mockParams = { params: Promise.resolve({ slug: 'non-existent' }) };
    
    const response = await getBlogBySlug(mockRequest, mockParams);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('Blog not found');
  });
});
