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
  return blogs
    .slice()
    .sort((a, b) =>
      compareDesc(parseISO(a.publishedAt), parseISO(b.publishedAt))
    );
};
