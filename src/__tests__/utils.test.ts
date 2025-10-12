import { cx } from '../utils';

describe('Utility Functions', () => {
  describe('cx function', () => {
    it('combines class names correctly', () => {
      expect(cx('class1', 'class2')).toBe('class1 class2');
    });

    it('handles conditional classes', () => {
      expect(cx('class1', { class2: true, class3: false })).toBe(
        'class1 class2'
      );
    });

    it('handles mixed types', () => {
      expect(cx('class1', { class2: true }, 'class3')).toBe(
        'class1 class2 class3'
      );
    });

    it('handles empty inputs', () => {
      expect(cx()).toBe('');
      expect(cx('')).toBe('');
    });

    it('handles undefined and null values', () => {
      expect(cx('class1', undefined, null, 'class2')).toBe('class1 class2');
    });
  });
});
