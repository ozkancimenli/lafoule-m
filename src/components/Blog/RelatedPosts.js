'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const RelatedPosts = ({ currentBlog, limit = 3 }) => {
  const [allBlogs, setAllBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('/api/blogs');
        const blogs = await response.json();
        setAllBlogs(blogs);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setAllBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className='mt-16 p-4 text-center text-gray-500'>
        Loading related articles...
      </div>
    );
  }

  // Find related posts based on tags
  const relatedPosts = allBlogs
    .filter(
      blog =>
        blog.slug !== currentBlog.slug &&
        blog.isPublished &&
        blog.tags.some(tag => currentBlog.tags.includes(tag))
    )
    .slice(0, limit);

  // If not enough related posts by tags, add recent posts
  if (relatedPosts.length < limit) {
    const recentPosts = allBlogs
      .filter(
        blog =>
          blog.slug !== currentBlog.slug &&
          blog.isPublished &&
          !relatedPosts.some(related => related.slug === blog.slug)
      )
      .slice(0, limit - relatedPosts.length);

    relatedPosts.push(...recentPosts);
  }

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <section className='mt-16 border-t border-dark/10 dark:border-light/10 pt-8'>
      <h3 className='text-2xl font-semibold text-dark dark:text-light mb-6'>
        Related Articles
      </h3>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {relatedPosts.map(blog => (
          <article
            key={blog.slug}
            className='group bg-light/50 dark:bg-dark/50 rounded-xl overflow-hidden border border-dark/10 dark:border-light/10 hover:shadow-lg transition-all duration-300 hover:-translate-y-1'
          >
            <Link href={blog.url} className='block'>
              <div className='relative h-48 overflow-hidden'>
                <Image
                  src={blog.image || '/blogs/default-blog.jpg'}
                  alt={blog.title}
                  fill
                  className='object-cover group-hover:scale-105 transition-transform duration-300'
                  sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />
              </div>

              <div className='p-4'>
                <h4 className='font-semibold text-lg text-dark dark:text-light mb-2 line-clamp-2 group-hover:text-accent dark:group-hover:text-accentDark transition-colors'>
                  {blog.title}
                </h4>

                <p className='text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2'>
                  {blog.description}
                </p>

                <div className='flex items-center justify-between text-xs text-gray-500 dark:text-gray-500'>
                  <span>{blog.readingTime.text}</span>
                  <span>
                    {new Date(blog.publishedAt).toLocaleDateString('tr-TR')}
                  </span>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
};

export default RelatedPosts;
