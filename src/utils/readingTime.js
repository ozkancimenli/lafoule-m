export const calculateReadingTime = (text) => {
  const wordsPerMinute = 200; // Average reading speed
  const words = text.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes;
};

export const formatReadingTime = (minutes) => {
  if (minutes === 1) {
    return '1 min read';
  }
  return `${minutes} min read`;
};
