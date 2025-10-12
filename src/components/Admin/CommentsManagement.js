'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const CommentsManagement = () => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved
  const [message, setMessage] = useState('');

  const fetchComments = useCallback(async () => {
    try {
      let query = supabase
        .from('comments')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter === 'pending') {
        query = query.eq('is_approved', false);
      } else if (filter === 'approved') {
        query = query.eq('is_approved', true);
      }

      const { data, error } = await query;
      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setMessage('Error loading comments');
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleApprove = async commentId => {
    try {
      const { error } = await supabase
        .from('comments')
        .update({ is_approved: true })
        .eq('id', commentId);

      if (error) throw error;

      setMessage('Comment approved');
      fetchComments();
    } catch (error) {
      console.error('Error approving comment:', error);
      setMessage('Error approving comment');
    }
  };

  const handleDelete = async commentId => {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      setMessage('Comment deleted');
      fetchComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
      setMessage('Error deleting comment');
    }
  };

  const handleBulkAction = async (action, selectedIds) => {
    if (selectedIds.length === 0) {
      setMessage('Please select at least one comment');
      return;
    }

    try {
      if (action === 'approve') {
        const { error } = await supabase
          .from('comments')
          .update({ is_approved: true })
          .in('id', selectedIds);

        if (error) throw error;
        setMessage(`${selectedIds.length} comments approved`);
      } else if (action === 'delete') {
        if (
          !confirm(
            `Are you sure you want to delete ${selectedIds.length} comments?`
          )
        ) {
          return;
        }

        const { error } = await supabase
          .from('comments')
          .delete()
          .in('id', selectedIds);

        if (error) throw error;
        setMessage(`${selectedIds.length} comments deleted`);
      }

      fetchComments();
    } catch (error) {
      console.error('Error in bulk action:', error);
      setMessage('Toplu işlem sırasında hata oluştu');
    }
  };

  if (isLoading) {
    return (
      <div className='flex justify-center items-center py-12'>
        <div className='text-lg'>Loading comments...</div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
          Comment Management ({comments.length})
        </h2>
        <div className='flex space-x-4'>
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className='px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white'
          >
            <option value='all'>All</option>
            <option value='pending'>Pending</option>
            <option value='approved'>Approved</option>
          </select>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className='bg-blue-100 dark:bg-blue-900/20 border border-blue-400 text-blue-700 dark:text-blue-400 px-4 py-3 rounded'>
          {message}
        </div>
      )}

      {/* Comments List */}
      <div className='bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md'>
        {comments.length === 0 ? (
          <div className='text-center py-12 text-gray-500 dark:text-gray-400'>
            {filter === 'all'
              ? 'No comments yet'
              : filter === 'pending'
                ? 'No pending comments'
                : 'No approved comments'}
          </div>
        ) : (
          <ul className='divide-y divide-gray-200 dark:divide-gray-700'>
            {comments.map(comment => (
              <li key={comment.id} className='px-6 py-4'>
                <div className='flex items-start justify-between'>
                  <div className='flex-1'>
                    <div className='flex items-center space-x-2 mb-2'>
                      <h3 className='text-sm font-medium text-gray-900 dark:text-white'>
                        {comment.author_name}
                      </h3>
                      <span className='text-xs text-gray-500 dark:text-gray-400'>
                        {comment.author_email}
                      </span>
                      <span className='text-xs text-gray-500 dark:text-gray-400'>
                        {new Date(comment.created_at).toLocaleString('tr-TR')}
                      </span>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          comment.is_approved
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                        }`}
                      >
                        {comment.is_approved ? 'Approved' : 'Pending'}
                      </span>
                    </div>
                    <p className='text-sm text-gray-600 dark:text-gray-300 mb-2'>
                      <strong>Blog:</strong> {comment.blog_slug}
                    </p>
                    <p className='text-sm text-gray-700 dark:text-gray-200'>
                      {comment.content}
                    </p>
                  </div>
                  <div className='flex space-x-2 ml-4'>
                    {!comment.is_approved && (
                      <button
                        onClick={() => handleApprove(comment.id)}
                        className='bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500'
                      >
                        Approve
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className='bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500'
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CommentsManagement;
