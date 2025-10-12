'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const NewsletterManagement = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, inactive

  const fetchSubscribers = useCallback(async () => {
    try {
      let query = supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter === 'active') {
        query = query.eq('is_active', true);
      } else if (filter === 'inactive') {
        query = query.eq('is_active', false);
      }

      const { data, error } = await query;
      if (error) throw error;
      setSubscribers(data || []);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      setMessage('Error loading subscribers');
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  const handleToggleActive = async (subscriberId, currentStatus) => {
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .update({ is_active: !currentStatus })
        .eq('id', subscriberId);

      if (error) throw error;

      setMessage(`Subscriber ${!currentStatus ? 'activated' : 'deactivated'}`);
      fetchSubscribers();
    } catch (error) {
      console.error('Error toggling subscriber:', error);
      setMessage('Error changing subscriber status');
    }
  };

  const handleDelete = async subscriberId => {
    if (!confirm('Are you sure you want to delete this subscriber?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .delete()
        .eq('id', subscriberId);

      if (error) throw error;

      setMessage('Subscriber deleted');
      fetchSubscribers();
    } catch (error) {
      console.error('Error deleting subscriber:', error);
      setMessage('Error deleting subscriber');
    }
  };

  const handleBulkAction = async (action, selectedIds) => {
    if (selectedIds.length === 0) {
      setMessage('Please select at least one subscriber');
      return;
    }

    try {
      if (action === 'activate') {
        const { error } = await supabase
          .from('newsletter_subscribers')
          .update({ is_active: true })
          .in('id', selectedIds);

        if (error) throw error;
        setMessage(`${selectedIds.length} subscribers activated`);
      } else if (action === 'deactivate') {
        const { error } = await supabase
          .from('newsletter_subscribers')
          .update({ is_active: false })
          .in('id', selectedIds);

        if (error) throw error;
        setMessage(`${selectedIds.length} subscribers deactivated`);
      } else if (action === 'delete') {
        if (
          !confirm(
            `Are you sure you want to delete ${selectedIds.length} subscribers?`
          )
        ) {
          return;
        }

        const { error } = await supabase
          .from('newsletter_subscribers')
          .delete()
          .in('id', selectedIds);

        if (error) throw error;
        setMessage(`${selectedIds.length} subscribers deleted`);
      }

      fetchSubscribers();
    } catch (error) {
      console.error('Error in bulk action:', error);
      setMessage('Toplu işlem sırasında hata oluştu');
    }
  };

  const exportSubscribers = () => {
    const csvContent = [
      ['Email', 'Name', 'Registration Date', 'Status', 'Source'],
      ...subscribers.map(sub => [
        sub.email,
        sub.name || '',
        new Date(sub.created_at).toLocaleDateString('en-US'),
        sub.is_active ? 'Active' : 'Inactive',
        sub.source || 'website',
      ]),
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredSubscribers = subscribers.filter(
    sub =>
      sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sub.name && sub.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className='flex justify-center items-center py-12'>
        <div className='text-lg'>Loading subscribers...</div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
          Newsletter Subscribers ({subscribers.length})
        </h2>
        <div className='flex space-x-4'>
          <button
            onClick={exportSubscribers}
            className='bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500'
          >
            Download CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className='flex space-x-4'>
        <input
          type='text'
          placeholder='Search by email or name...'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className='px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white'
        />
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className='px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white'
        >
          <option value='all'>All</option>
          <option value='active'>Active</option>
          <option value='inactive'>Inactive</option>
        </select>
      </div>

      {/* Message */}
      {message && (
        <div className='bg-blue-100 dark:bg-blue-900/20 border border-blue-400 text-blue-700 dark:text-blue-400 px-4 py-3 rounded'>
          {message}
        </div>
      )}

      {/* Subscribers List */}
      <div className='bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md'>
        {filteredSubscribers.length === 0 ? (
          <div className='text-center py-12 text-gray-500 dark:text-gray-400'>
            {searchTerm
              ? 'No subscribers found matching search criteria'
              : 'No subscribers yet'}
          </div>
        ) : (
          <ul className='divide-y divide-gray-200 dark:divide-gray-700'>
            {filteredSubscribers.map(subscriber => (
              <li key={subscriber.id} className='px-6 py-4'>
                <div className='flex items-center justify-between'>
                  <div className='flex-1'>
                    <div className='flex items-center space-x-2 mb-1'>
                      <h3 className='text-sm font-medium text-gray-900 dark:text-white'>
                        {subscriber.email}
                      </h3>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          subscriber.is_active
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        }`}
                      >
                        {subscriber.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className='text-sm text-gray-600 dark:text-gray-300'>
                      <p>
                        <strong>Name:</strong>{' '}
                        {subscriber.name || 'Not specified'}
                      </p>
                      <p>
                        <strong>Registration Date:</strong>{' '}
                        {new Date(subscriber.created_at).toLocaleString(
                          'en-US'
                        )}
                      </p>
                      <p>
                        <strong>Source:</strong>{' '}
                        {subscriber.source || 'website'}
                      </p>
                    </div>
                  </div>
                  <div className='flex space-x-2 ml-4'>
                    <button
                      onClick={() =>
                        handleToggleActive(subscriber.id, subscriber.is_active)
                      }
                      className={`px-3 py-1 rounded text-sm focus:outline-none focus:ring-2 ${
                        subscriber.is_active
                          ? 'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500'
                          : 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
                      }`}
                    >
                      {subscriber.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleDelete(subscriber.id)}
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

export default NewsletterManagement;
