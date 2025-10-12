import { sortBlogs, cx } from '../utils';

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

    it('should filter out invalid blogs', () => {
      const blogs = [
        {
          title: 'Valid Post',
          publishedAt: '2023-01-01',
          slug: 'valid-post',
          tags: ['test'],
        },
        {
          title: 'Invalid Post - No Tags',
          publishedAt: '2023-01-02',
          slug: 'invalid-post',
          tags: null,
        },
        {
          title: 'Invalid Post - No PublishedAt',
          slug: 'invalid-post-2',
          tags: ['test'],
        },
      ];

      const result = sortBlogs(blogs);
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Valid Post');
    });
  });

  describe('cx', () => {
    it('should combine class names correctly', () => {
      const result = cx('class1', 'class2', 'class3');
      expect(result).toBe('class1 class2 class3');
    });

    it('should filter out falsy values', () => {
      const result = cx('class1', null, 'class2', undefined, 'class3');
      expect(result).toBe('class1 class2 class3');
    });

    it('should handle object syntax', () => {
      const result = cx('class1', {
        class2: true,
        class3: false,
        class4: true,
      });
      expect(result).toBe('class1 class2 class4');
    });

    it('should handle mixed syntax', () => {
      const result = cx('class1', { class2: true }, 'class3', {
        class4: false,
      });
      expect(result).toBe('class1 class2 class3');
    });

    it('should return empty string for no arguments', () => {
      const result = cx();
      expect(result).toBe('');
    });
  });
});
