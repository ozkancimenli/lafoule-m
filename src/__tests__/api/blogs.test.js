import { GET } from '../../app/api/blogs/route';

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
}));

describe('/api/blogs', () => {
  it('should return blogs data', async () => {
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
    expect(data[0]).toHaveProperty('title');
    expect(data[0]).toHaveProperty('slug');
  });
});
