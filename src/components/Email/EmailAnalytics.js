'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/src/utils/supabaseClient';

const EmailAnalytics = () => {
  const [stats, setStats] = useState({
    totalNewsletterSubscribers: 0,
    totalContactSubmissions: 0,
    recentNewsletterSubscribers: 0,
    recentContactSubmissions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Newsletter stats
        const { count: totalNewsletter } = await supabase
          .from('newsletter_subscriptions')
          .select('*', { count: 'exact', head: true });

        const { count: recentNewsletter } = await supabase
          .from('newsletter_subscriptions')
          .select('*', { count: 'exact', head: true })
          .gte(
            'created_at',
            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
          );

        // Contact stats
        const { count: totalContact } = await supabase
          .from('contact_requests')
          .select('*', { count: 'exact', head: true });

        const { count: recentContact } = await supabase
          .from('contact_requests')
          .select('*', { count: 'exact', head: true })
          .gte(
            'created_at',
            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
          );

        setStats({
          totalNewsletterSubscribers: totalNewsletter || 0,
          totalContactSubmissions: totalContact || 0,
          recentNewsletterSubscribers: recentNewsletter || 0,
          recentContactSubmissions: recentContact || 0,
        });
      } catch (error) {
        console.error('Error fetching email analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6'>
        <div className='animate-pulse'>
          <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4'></div>
          <div className='grid grid-cols-2 gap-4'>
            <div className='h-20 bg-gray-200 dark:bg-gray-700 rounded'></div>
            <div className='h-20 bg-gray-200 dark:bg-gray-700 rounded'></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6'>
      <h3 className='text-lg font-semibold text-dark dark:text-light mb-4'>
        Email Analytics
      </h3>

      <div className='grid grid-cols-2 gap-4'>
        <div className='bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg'>
          <div className='text-2xl font-bold text-blue-600 dark:text-blue-400'>
            {stats.totalNewsletterSubscribers}
          </div>
          <div className='text-sm text-blue-600 dark:text-blue-400'>
            Total Newsletter Subscribers
          </div>
          <div className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
            +{stats.recentNewsletterSubscribers} this week
          </div>
        </div>

        <div className='bg-green-50 dark:bg-green-900/20 p-4 rounded-lg'>
          <div className='text-2xl font-bold text-green-600 dark:text-green-400'>
            {stats.totalContactSubmissions}
          </div>
          <div className='text-sm text-green-600 dark:text-green-400'>
            Total Contact Submissions
          </div>
          <div className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
            +{stats.recentContactSubmissions} this week
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailAnalytics;
