'use client';

import { useState, useEffect } from 'react';
import { BlogPost } from '../../lib/blog';

interface ContentPreviewProps {
  content: string;
  title: string;
  description: string;
  tags: string[];
}

export default function ContentPreview({
  content,
  title,
  description,
  tags,
}: ContentPreviewProps) {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [previewContent, setPreviewContent] = useState('');

  useEffect(() => {
    // Simulate MDX compilation for preview
    setPreviewContent(content);
  }, [content]);

  if (!isPreviewMode) {
    return (
      <div className='border rounded-lg p-4 bg-gray-50'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-lg font-semibold'>Content Preview</h3>
          <button
            onClick={() => setIsPreviewMode(true)}
            className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
          >
            Preview
          </button>
        </div>
        <div className='text-sm text-gray-600'>
          <p>
            <strong>Title:</strong> {title}
          </p>
          <p>
            <strong>Description:</strong> {description}
          </p>
          <p>
            <strong>Tags:</strong> {tags.join(', ')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4'>
      <div className='bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden'>
        <div className='flex items-center justify-between p-4 border-b'>
          <h2 className='text-xl font-semibold'>Content Preview</h2>
          <button
            onClick={() => setIsPreviewMode(false)}
            className='text-gray-500 hover:text-gray-700'
          >
            ✕
          </button>
        </div>
        <div className='p-6 overflow-y-auto max-h-[calc(90vh-80px)]'>
          <article className='prose max-w-none'>
            <h1>{title}</h1>
            <p className='text-gray-600'>{description}</p>
            <div className='flex flex-wrap gap-2 mb-6'>
              {tags.map(tag => (
                <span
                  key={tag}
                  className='px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded'
                >
                  {tag}
                </span>
              ))}
            </div>
            <div dangerouslySetInnerHTML={{ __html: previewContent }} />
          </article>
        </div>
      </div>
    </div>
  );
}
