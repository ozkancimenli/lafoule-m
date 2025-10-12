import { sortBlogs } from '../utils';

describe('Utils', () => {
  describe('sortBlogs', () => {
    it('should sort blogs by publishedAt date', () => {
      const blogs = [
        {
          title: 'Old Post',
          publishedAt: '2023-01-01',
          slug: 'old-post',
          tags: ['test'],
        },
        {
          title: 'New Post',
          publishedAt: '2023-12-01',
          slug: 'new-post',
          tags: ['test'],
        },
        {
          title: 'Middle Post',
          publishedAt: '2023-06-01',
          slug: 'middle-post',
          tags: ['test'],
        },
      ];

      const sorted = sortBlogs(blogs);

      expect(sorted).toHaveLength(3);
      expect(sorted[0].title).toBe('New Post');
      expect(sorted[1].title).toBe('Middle Post');
      expect(sorted[2].title).toBe('Old Post');
    });

    it('should handle empty array', () => {
      const result = sortBlogs([]);
      expect(result).toEqual([]);
    });

    it('should handle single blog', () => {
      const blogs = [
        {
          title: 'Single Post',
          publishedAt: '2023-01-01',
          slug: 'single-post',
          tags: ['test'],
        },
      ];

      const result = sortBlogs(blogs);
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Single Post');
    });
  });
});
