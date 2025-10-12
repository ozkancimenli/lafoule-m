'use client';

import { useState, useEffect } from 'react';
import { BlogPost } from '../../lib/blog';

interface DraftModeProps {
  blogs: BlogPost[];
  onToggleDraft: (slug: string, isDraft: boolean) => void;
}

export default function DraftMode({ blogs, onToggleDraft }: DraftModeProps) {
  const [draftBlogs, setDraftBlogs] = useState<BlogPost[]>([]);
  const [publishedBlogs, setPublishedBlogs] = useState<BlogPost[]>([]);

  useEffect(() => {
    const drafts = blogs.filter(blog => !blog.isPublished);
    const published = blogs.filter(blog => blog.isPublished);
    setDraftBlogs(drafts);
    setPublishedBlogs(published);
  }, [blogs]);

  const handleToggleDraft = (slug: string, currentStatus: boolean) => {
    onToggleDraft(slug, !currentStatus);
  };

  return (
    <div className='space-y-6'>
      <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
        <h2 className='text-lg font-semibold text-yellow-800 mb-2'>
          Draft Mode
        </h2>
        <p className='text-yellow-700 text-sm'>
          Manage your blog posts and control their visibility.
        </p>
      </div>

      <div className='grid gap-6 md:grid-cols-2'>
        {/* Draft Posts */}
        <div>
          <h3 className='text-lg font-semibold mb-4 text-gray-800'>
            Draft Posts ({draftBlogs.length})
          </h3>
          <div className='space-y-3'>
            {draftBlogs.map(blog => (
              <div
                key={blog.slug}
                className='border border-gray-200 rounded-lg p-4 bg-gray-50'
              >
                <h4 className='font-medium text-gray-800'>{blog.title}</h4>
                <p className='text-sm text-gray-600 mt-1'>{blog.description}</p>
                <div className='flex items-center justify-between mt-3'>
                  <span className='text-xs text-gray-500'>
                    {blog.publishedAt}
                  </span>
                  <button
                    onClick={() => handleToggleDraft(blog.slug, false)}
                    className='px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700'
                  >
                    Publish
                  </button>
                </div>
              </div>
            ))}
            {draftBlogs.length === 0 && (
              <p className='text-gray-500 text-sm'>No draft posts</p>
            )}
          </div>
        </div>

        {/* Published Posts */}
        <div>
          <h3 className='text-lg font-semibold mb-4 text-gray-800'>
            Published Posts ({publishedBlogs.length})
          </h3>
          <div className='space-y-3'>
            {publishedBlogs.map(blog => (
              <div
                key={blog.slug}
                className='border border-gray-200 rounded-lg p-4 bg-white'
              >
                <h4 className='font-medium text-gray-800'>{blog.title}</h4>
                <p className='text-sm text-gray-600 mt-1'>{blog.description}</p>
                <div className='flex items-center justify-between mt-3'>
                  <span className='text-xs text-gray-500'>
                    {blog.publishedAt}
                  </span>
                  <button
                    onClick={() => handleToggleDraft(blog.slug, true)}
                    className='px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700'
                  >
                    Unpublish
                  </button>
                </div>
              </div>
            ))}
            {publishedBlogs.length === 0 && (
              <p className='text-gray-500 text-sm'>No published posts</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
