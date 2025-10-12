'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '../../utils/supabaseClient';

const UnsubscribeContent = () => {
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  useEffect(() => {
    const unsubscribe = async () => {
      if (!email) {
        setStatus('error');
        setMessage('Invalid unsubscribe link');
        return;
      }

      try {
        const { error } = await supabase
          .from('newsletter_subscriptions')
          .delete()
          .eq('email', email);

        if (error) {
          throw error;
        }

        setStatus('success');
        setMessage(
          'You have been successfully unsubscribed from our newsletter.'
        );
      } catch (error) {
        console.error('Unsubscribe error:', error);
        setStatus('error');
        setMessage(
          'An error occurred while unsubscribing. Please try again later.'
        );
      }
    };

    unsubscribe();
  }, [email]);

  return (
    <div className='min-h-screen flex items-center justify-center bg-light dark:bg-dark'>
      <div className='max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center'>
        <div className='mb-6'>
          {status === 'loading' && (
            <div className='w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
          )}
          {status === 'success' && (
            <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <svg
                className='w-8 h-8 text-green-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M5 13l4 4L19 7'
                />
              </svg>
            </div>
          )}
          {status === 'error' && (
            <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <svg
                className='w-8 h-8 text-red-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </div>
          )}
        </div>

        <h1 className='text-2xl font-bold text-dark dark:text-light mb-4'>
          {status === 'loading' && 'Processing...'}
          {status === 'success' && 'Unsubscribed Successfully'}
          {status === 'error' && 'Unsubscribe Failed'}
        </h1>

        <p className='text-gray-600 dark:text-gray-400 mb-6'>{message}</p>

        {status === 'success' && (
          <div className='space-y-4'>
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              We're sorry to see you go! If you change your mind, you can always
              subscribe again.
            </p>
            <a
              href='/'
              className='inline-block bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors'
            >
              Return to Website
            </a>
          </div>
        )}

        {status === 'error' && (
          <div className='space-y-4'>
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              If you continue to have issues, please contact us directly.
            </p>
            <a
              href='/contact'
              className='inline-block bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors'
            >
              Contact Support
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

const UnsubscribePage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UnsubscribeContent />
    </Suspense>
  );
};

export default UnsubscribePage;
