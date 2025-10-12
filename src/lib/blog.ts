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
      // Skip hidden files
      if (fileName.startsWith('.')) continue;

      try {
        const slug = fileName;
        const fullPath = path.join(postsDirectory, fileName, 'index.mdx');

        // Check if the file exists
        if (!fs.existsSync(fullPath)) continue;

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
            ? data.tags.filter((tag: any) => typeof tag === 'string')
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

    allPostsData.sort((a, b) => {
      return (
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    });

    console.log('All posts data:', allPostsData.length, allPostsData[0]);

    // Final validation - ensure all posts have required fields
    const validatedPosts = allPostsData.map(post => {
      const validatedPost = {
        ...post,
        tags: Array.isArray(post.tags) ? post.tags : [],
        title: post.title || 'Untitled',
        description: post.description || '',
        publishedAt: post.publishedAt || new Date().toISOString(),
        updatedAt:
          post.updatedAt || post.publishedAt || new Date().toISOString(),
        author: post.author || 'Ozkan Cimenli',
        content: post.content || '',
      };

      // Double check tags
      if (!Array.isArray(validatedPost.tags)) {
        validatedPost.tags = [];
      }

      // Ensure all required fields exist
      if (!validatedPost.slug) validatedPost.slug = 'untitled';
      if (!validatedPost.title) validatedPost.title = 'Untitled';
      if (!validatedPost.description) validatedPost.description = '';
      if (!validatedPost.publishedAt)
        validatedPost.publishedAt = new Date().toISOString();
      if (!validatedPost.updatedAt)
        validatedPost.updatedAt = validatedPost.publishedAt;
      if (!validatedPost.author) validatedPost.author = 'Ozkan Cimenli';
      if (!validatedPost.content) validatedPost.content = '';
      if (!validatedPost.url)
        validatedPost.url = `/blogs/${validatedPost.slug}`;
      if (!validatedPost.readingTime) {
        validatedPost.readingTime = {
          text: '1 min read',
          minutes: 1,
          time: 60000,
          words: 200,
        };
      }

      // Final safety check - ensure tags is always an array
      if (!Array.isArray(validatedPost.tags)) {
        validatedPost.tags = [];
      }

      return validatedPost;
    });

    // Final safety check - ensure all posts have valid tags
    const finalPosts = validatedPosts.map(post => {
      const safePost = {
        ...post,
        tags: Array.isArray(post.tags) ? post.tags : [],
      };

      // Ensure tags is always an array
      if (!Array.isArray(safePost.tags)) {
        safePost.tags = [];
      }

      return safePost;
    });

    // Final safety check - ensure all posts have valid tags
    const ultraSafePosts = validatedPosts.map(post => {
      const ultraSafePost = {
        ...post,
        tags: Array.isArray(post.tags) ? post.tags : [],
      };

      // Ensure tags is always an array
      if (!Array.isArray(ultraSafePost.tags)) {
        ultraSafePost.tags = [];
      }

      return ultraSafePost;
    });

    return ultraSafePosts;
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
        ? data.tags.filter((tag: any) => typeof tag === 'string')
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
