'use client';

import { useState } from 'react';

interface ScheduledPost {
  id: string;
  title: string;
  description: string;
  scheduledDate: string;
  status: 'scheduled' | 'published' | 'cancelled';
}

interface ContentSchedulerProps {
  onSchedulePost: (post: Omit<ScheduledPost, 'id' | 'status'>) => void;
  scheduledPosts: ScheduledPost[];
}

export default function ContentScheduler({
  onSchedulePost,
  scheduledPosts,
}: ContentSchedulerProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    scheduledDate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.description && formData.scheduledDate) {
      onSchedulePost({
        title: formData.title,
        description: formData.description,
        scheduledDate: formData.scheduledDate,
      });
      setFormData({ title: '', description: '', scheduledDate: '' });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className='space-y-6'>
      <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
        <h2 className='text-lg font-semibold text-blue-800 mb-2'>
          Content Scheduler
        </h2>
        <p className='text-blue-700 text-sm'>
          Schedule your blog posts to be published automatically.
        </p>
      </div>

      {/* Schedule Form */}
      <form onSubmit={handleSubmit} className='bg-white border rounded-lg p-6'>
        <h3 className='text-lg font-semibold mb-4'>Schedule New Post</h3>
        <div className='grid gap-4 md:grid-cols-2'>
          <div>
            <label
              htmlFor='title'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Post Title
            </label>
            <input
              type='text'
              id='title'
              value={formData.title}
              onChange={e =>
                setFormData({ ...formData, title: e.target.value })
              }
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
            />
          </div>
          <div>
            <label
              htmlFor='scheduledDate'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Scheduled Date
            </label>
            <input
              type='datetime-local'
              id='scheduledDate'
              value={formData.scheduledDate}
              onChange={e =>
                setFormData({ ...formData, scheduledDate: e.target.value })
              }
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
            />
          </div>
        </div>
        <div className='mt-4'>
          <label
            htmlFor='description'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Description
          </label>
          <textarea
            id='description'
            value={formData.description}
            onChange={e =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={3}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            required
          />
        </div>
        <button
          type='submit'
          className='mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
        >
          Schedule Post
        </button>
      </form>

      {/* Scheduled Posts List */}
      <div className='bg-white border rounded-lg p-6'>
        <h3 className='text-lg font-semibold mb-4'>
          Scheduled Posts ({scheduledPosts.length})
        </h3>
        <div className='space-y-3'>
          {scheduledPosts.map(post => (
            <div
              key={post.id}
              className='border border-gray-200 rounded-lg p-4 flex items-center justify-between'
            >
              <div className='flex-1'>
                <h4 className='font-medium text-gray-800'>{post.title}</h4>
                <p className='text-sm text-gray-600 mt-1'>{post.description}</p>
                <div className='flex items-center gap-4 mt-2'>
                  <span className='text-xs text-gray-500'>
                    {formatDate(post.scheduledDate)}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                      post.status
                    )}`}
                  >
                    {post.status}
                  </span>
                </div>
              </div>
              <div className='flex gap-2'>
                {post.status === 'scheduled' && (
                  <>
                    <button className='px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700'>
                      Publish Now
                    </button>
                    <button className='px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700'>
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
          {scheduledPosts.length === 0 && (
            <p className='text-gray-500 text-sm'>No scheduled posts</p>
          )}
        </div>
      </div>
    </div>
  );
}
