'use client';

import { useState } from 'react';

const AndreWaitlist = () => {
  const [email, setEmail] = useState('');
  const [platform, setPlatform] = useState('iPhone');
  const [state, setState] = useState('idle'); // idle | sending | done | error
  const [message, setMessage] = useState('');

  const onSubmit = async e => {
    e.preventDefault();
    setState('sending');
    setMessage('');
    try {
      const res = await fetch('/api/andre-waitlist', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, platform }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setState('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
        return;
      }
      setState('done');
      setEmail('');
    } catch {
      setState('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  if (state === 'done') {
    return (
      <div className='rounded-2xl border border-dark/10 dark:border-light/10 bg-light/70 dark:bg-dark/60 p-6 text-center'>
        <p className='text-xl font-semibold mb-2'>You&apos;re on the list.</p>
        <p className='text-dark/70 dark:text-light/70'>
          We&apos;ll email you once — the day Andre is back on the App Store.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className='rounded-2xl border border-dark/10 dark:border-light/10 bg-light/70 dark:bg-dark/60 p-6 space-y-4'
    >
      <label htmlFor='andre-email' className='block font-semibold text-lg'>
        Get it the day it&apos;s back
      </label>
      <div className='flex flex-col sm:flex-row gap-3'>
        <input
          id='andre-email'
          type='email'
          required
          autoComplete='email'
          placeholder='you@example.com'
          value={email}
          onChange={e => setEmail(e.target.value)}
          className='flex-1 px-4 py-3 bg-light dark:bg-dark border border-dark/20 dark:border-light/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-accentDark'
        />
        <select
          aria-label='Device'
          value={platform}
          onChange={e => setPlatform(e.target.value)}
          className='px-3 py-3 bg-light dark:bg-dark border border-dark/20 dark:border-light/20 rounded-lg'
        >
          <option>iPhone</option>
          <option>iPad</option>
          <option>Mac</option>
        </select>
        <button
          type='submit'
          disabled={state === 'sending'}
          className='px-6 py-3 rounded-lg font-semibold bg-dark text-light dark:bg-light dark:text-dark hover:opacity-90 disabled:opacity-60'
        >
          {state === 'sending' ? 'Joining…' : 'Notify me'}
        </button>
      </div>
      {state === 'error' && (
        <p className='text-sm text-red-600' role='alert'>
          {message}
        </p>
      )}
      <p className='text-xs text-dark/60 dark:text-light/60'>
        One email when it launches. No spam, no sharing. Free to play — Chapter
        1 costs nothing.
      </p>
    </form>
  );
};

export default AndreWaitlist;
