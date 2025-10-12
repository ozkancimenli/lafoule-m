import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'src/content');

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  author: string;
  tags: string[];
  image?: string;
  isPublished: boolean;
  readingTime: {
    text: string;
    minutes: number;
    time: number;
    words: number;
  };
  url: string;
  content: string;
}

export function getAllBlogs(): BlogPost[] {
  // Only run on server side
  if (typeof window !== 'undefined') {
    return [];
  }

  try {
    const fileNames = fs.readdirSync(postsDirectory);

    const allPostsData: BlogPost[] = [];

    for (const fileName of fileNames) {
      if (fileName.endsWith('.mdx')) {
        try {
          const slug = fileName.replace(/\.mdx$/, '');
          const fullPath = path.join(postsDirectory, fileName);
          const fileContents = fs.readFileSync(fullPath, 'utf8');
          const { data, content } = matter(fileContents);

          // Calculate reading time
          const wordsPerMinute = 200;
          const words = content.split(/\s+/).length;
          const minutes = Math.ceil(words / wordsPerMinute);

          const blogPost: BlogPost = {
            slug: slug || 'untitled',
            title: data.title || 'Untitled',
            description: data.description || '',
            publishedAt: data.publishedAt || new Date().toISOString(),
            updatedAt:
              data.updatedAt || data.publishedAt || new Date().toISOString(),
            author: data.author || 'Ozkan Cimenli',
            tags: Array.isArray(data.tags)
              ? data.tags.filter(tag => typeof tag === 'string')
              : [],
            image: data.image,
            isPublished: data.isPublished !== false,
            readingTime: {
              text: `${minutes} min read`,
              minutes,
              time: minutes * 60 * 1000,
              words,
            },
            url: `/blogs/${slug}`,
            content: content || '',
          };

          // Ensure tags is always an array
          if (!Array.isArray(blogPost.tags)) {
            blogPost.tags = [];
          }

          if (blogPost.isPublished) {
            allPostsData.push(blogPost);
          }
        } catch (fileError) {
          console.error(`Error processing file ${fileName}:`, fileError);
        }
      }
    }

    allPostsData.sort((a, b) => {
      return (
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    });

    console.log('All posts data:', allPostsData.length, allPostsData[0]);
    return allPostsData;
  } catch (error) {
    console.error('Error reading blog posts:', error);
    return [];
  }
}

export function getBlogBySlug(slug: string): BlogPost | null {
  // Only run on server side
  if (typeof window !== 'undefined') {
    return null;
  }

  try {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);

    return {
      slug: slug || 'untitled',
      title: data.title || 'Untitled',
      description: data.description || '',
      publishedAt: data.publishedAt || new Date().toISOString(),
      updatedAt: data.updatedAt || data.publishedAt || new Date().toISOString(),
      author: data.author || 'Ozkan Cimenli',
      tags: Array.isArray(data.tags)
        ? data.tags.filter(tag => typeof tag === 'string')
        : [],
      image: data.image,
      isPublished: data.isPublished !== false,
      readingTime: {
        text: `${minutes} min read`,
        minutes,
        time: minutes * 60 * 1000,
        words,
      },
      url: `/blogs/${slug}`,
      content: content || '',
    };
  } catch (error) {
    console.error('Error reading blog post:', error);
    return null;
  }
}

export function getAllTags(): string[] {
  const blogs = getAllBlogs();
  const tags = new Set<string>();

  blogs.forEach(blog => {
    if (blog.tags && Array.isArray(blog.tags)) {
      blog.tags.forEach(tag => tags.add(tag));
    }
  });

  return Array.from(tags).sort();
}

export function getBlogsByTag(tag: string): BlogPost[] {
  const blogs = getAllBlogs();
  return blogs.filter(
    blog => blog.tags && Array.isArray(blog.tags) && blog.tags.includes(tag)
  );
}
