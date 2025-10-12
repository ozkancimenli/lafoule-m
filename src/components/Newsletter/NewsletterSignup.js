'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .insert([
          {
            email: email.toLowerCase().trim(),
            name: name.trim() || null,
            source: 'website',
          },
        ]);

      if (error) {
        if (error.code === '23505') {
          setMessage('This email address is already registered!');
          setIsSuccess(false);
        } else {
          throw error;
        }
      } else {
        setMessage('Successfully subscribed to newsletter! Thank you!');
        setIsSuccess(true);
        setEmail('');
        setName('');
      }
    } catch (error) {
      console.error('Newsletter signup error:', error);
      setMessage('An error occurred. Please try again.');
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='w-full max-w-md mx-auto'>
      <div className='bg-light/70 dark:bg-dark/60 backdrop-blur-sm rounded-2xl border border-dark/10 dark:border-light/10 p-6 shadow-sm'>
        <div className='text-center mb-6'>
          <h3 className='text-xl font-semibold text-dark dark:text-light mb-2'>
            Join Newsletter
          </h3>
          <p className='text-sm text-dark/70 dark:text-light/70'>
            Weekly content about web development, Next.js and productivity.
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <input
              type='text'
              placeholder='Your name (optional)'
              value={name}
              onChange={e => setName(e.target.value)}
              className='w-full px-4 py-2 bg-light dark:bg-dark border border-dark/20 dark:border-light/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-accentDark text-dark dark:text-light'
            />
          </div>

          <div>
            <input
              type='email'
              placeholder='Your email address'
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className='w-full px-4 py-2 bg-light dark:bg-dark border border-dark/20 dark:border-light/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-accentDark text-dark dark:text-light'
            />
          </div>

          <button
            type='submit'
            disabled={isLoading || !email}
            className='w-full bg-accent dark:bg-accentDark text-light dark:text-dark py-2 px-4 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity'
          >
            {isLoading ? 'Subscribing...' : 'Subscribe'}
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
    </div>
  );
};

export default NewsletterSignup;
