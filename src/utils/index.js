import { compareDesc, parseISO } from 'date-fns';

export const cx = (...classNames) => {
  return classNames
    .filter(Boolean)
    .map(className => {
      if (typeof className === 'object' && className !== null) {
        return Object.entries(className)
          .filter(([, value]) => value)
          .map(([key]) => key)
          .join(' ');
      }
      return className;
    })
    .join(' ');
};

export const sortBlogs = blogs => {
  if (!Array.isArray(blogs)) {
    return [];
  }
  
  return blogs
    .filter(blog => blog && blog.publishedAt)
    .slice()
    .sort((a, b) => {
      try {
        return compareDesc(parseISO(a.publishedAt), parseISO(b.publishedAt));
      } catch (error) {
        console.error('Error sorting blogs:', error);
        return 0;
      }
    });
};
