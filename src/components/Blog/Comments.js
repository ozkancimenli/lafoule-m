'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const Comments = ({ blogSlug }) => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    authorName: '',
    authorEmail: '',
    content: '',
  });

  useEffect(() => {
    fetchComments();
  }, [blogSlug]);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('blog_slug', blogSlug)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const { error } = await supabase.from('comments').insert([
        {
          blog_slug: blogSlug,
          author_name: formData.authorName.trim(),
          author_email: formData.authorEmail.trim(),
          content: formData.content.trim(),
        },
      ]);

      if (error) throw error;

      setMessage(
        'Your comment has been submitted successfully! It is pending approval.'
      );
      setIsSuccess(true);
      setFormData({ authorName: '', authorEmail: '', content: '' });
    } catch (error) {
      console.error('Error submitting comment:', error);
      setMessage('An error occurred. Please try again.');
      setIsSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (isLoading) {
    return (
      <div className='mt-8 p-4 text-center text-gray-500'>
        Loading comments...
      </div>
    );
  }

  return (
    <div className='mt-12 border-t border-dark/10 dark:border-light/10 pt-8'>
      <h3 className='text-2xl font-semibold text-dark dark:text-light mb-6'>
        Comments ({comments.length})
      </h3>

      {/* Comment Form */}
      <div className='mb-8'>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <input
                type='text'
                name='authorName'
                placeholder='Your name'
                value={formData.authorName}
                onChange={handleInputChange}
                required
                className='w-full px-4 py-2 bg-light dark:bg-dark border border-dark/20 dark:border-light/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-accentDark text-dark dark:text-light'
              />
            </div>
            <div>
              <input
                type='email'
                name='authorEmail'
                placeholder='Your email address'
                value={formData.authorEmail}
                onChange={handleInputChange}
                required
                className='w-full px-4 py-2 bg-light dark:bg-dark border border-dark/20 dark:border-light/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-accentDark text-dark dark:text-light'
              />
            </div>
          </div>

          <div>
            <textarea
              name='content'
              placeholder='Write your comment...'
              value={formData.content}
              onChange={handleInputChange}
              required
              rows={4}
              className='w-full px-4 py-2 bg-light dark:bg-dark border border-dark/20 dark:border-light/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-accentDark text-dark dark:text-light'
            />
          </div>

          <button
            type='submit'
            disabled={isSubmitting}
            className='bg-accent dark:bg-accentDark text-light dark:text-dark py-2 px-6 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity'
          >
            {isSubmitting ? 'Submitting...' : 'Submit Comment'}
          </button>
        </form>

        {message && (
          <div
            className={`mt-4 p-3 rounded-lg text-sm ${
              isSuccess
                ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
            }`}
          >
            {message}
          </div>
        )}
      </div>

      {/* Comments List */}
      <div className='space-y-6'>
        {comments.length === 0 ? (
          <p className='text-gray-500 dark:text-gray-400 text-center py-8'>
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map(comment => (
            <div
              key={comment.id}
              className='bg-light/50 dark:bg-dark/50 rounded-lg p-4 border border-dark/10 dark:border-light/10'
            >
              <div className='flex items-center justify-between mb-2'>
                <h4 className='font-semibold text-dark dark:text-light'>
                  {comment.author_name}
                </h4>
                <time className='text-sm text-gray-500 dark:text-gray-400'>
                  {new Date(comment.created_at).toLocaleDateString('tr-TR')}
                </time>
              </div>
              <p className='text-dark/80 dark:text-light/80'>
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Comments;
