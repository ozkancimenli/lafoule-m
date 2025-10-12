'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const BlogSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const searchBlogs = async () => {
      if (searchTerm.length > 2) {
        setIsSearching(true);
        try {
          const response = await fetch(
            `/api/search-blogs?q=${encodeURIComponent(searchTerm)}`
          );
          const data = await response.json();
          setSearchResults(data.blogs || []);
        } catch (error) {
          console.error('Search error:', error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    };

    const debounceTimer = setTimeout(searchBlogs, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  return (
    <div className='relative'>
      <div className='relative'>
        <input
          type='text'
          placeholder='Search blog posts...'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className='w-full px-4 py-2 pl-10 pr-4 text-dark dark:text-light bg-light dark:bg-dark border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
        />
        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
          <svg
            className='h-5 w-5 text-gray-400'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
            />
          </svg>
        </div>
      </div>

      {searchTerm.length > 2 && (
        <div className='absolute top-full left-0 right-0 mt-1 bg-white dark:bg-dark border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto'>
          {isSearching ? (
            <div className='p-4 text-center text-gray-500'>Searching...</div>
          ) : searchResults.length > 0 ? (
            <div className='py-2'>
              {searchResults.map(blog => (
                <Link
                  key={blog.slug}
                  href={blog.url}
                  className='block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-dark dark:text-light'
                  onClick={() => setSearchTerm('')}
                >
                  <div className='font-medium'>{blog.title}</div>
                  <div className='text-sm text-gray-500 dark:text-gray-400'>
                    {blog.description}
                  </div>
                  {blog.tags?.length ? (
                    <div className='text-xs text-gray-400 dark:text-gray-500 mt-1'>
                      {blog.tags.join(', ')}
                    </div>
                  ) : null}
                </Link>
              ))}
            </div>
          ) : (
            <div className='p-4 text-center text-gray-500'>
              No results found for &quot;{searchTerm}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BlogSearch;
