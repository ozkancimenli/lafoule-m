'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { GithubIcon, LinkedinIcon, TwitterIcon } from '../Icons';
import siteMetadata from '../../utils/siteMetaData';
import { supabase } from '../../utils/supabaseClient';
import { sendNewsletterWelcomeEmail } from '../../utils/brevoEmail';
import { trackNewsletterSignup } from '../../hooks/useAnalytics';

const Footer = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      email: '',
    },
  });
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackVariant, setFeedbackVariant] = useState('neutral');

  const onSubmit = async data => {
    try {
      setFeedbackMessage('');
      setFeedbackVariant('neutral');

      const { error } = await supabase
        .from('newsletter_subscriptions')
        .insert({ email: data.email });

      if (error) {
        if (error.code === '23505') {
          throw new Error('Looks like you are already on the list!');
        }
        throw new Error("We couldn't save your email. Please try again.");
      }

      // Send welcome email
      try {
        await sendNewsletterWelcomeEmail(data.email);
      } catch (emailError) {
        console.error('Email sending error:', emailError);
        // Don't fail the form if email fails
      }

      // Track newsletter signup
      trackNewsletterSignup();

      setFeedbackVariant('success');
      setFeedbackMessage(
        "Welcome aboard! You'll start receiving updates soon."
      );
      reset();
    } catch (error) {
      setFeedbackVariant('error');
      setFeedbackMessage(
        error.message || 'We could not save your email. Try again later.'
      );
    }
  };

  return (
    <footer className='mt-16 rounded-2xl bg-dark dark:bg-accentDark/90 m-2 sm:m-10 flex flex-col items-center text-light dark:text-dark'>
      <h3 className='mt-16 font-medium dark:font-bold text-center capitalize text-2xl sm:text-3xl lg:text-4xl px-4'>
        Interesting Stories | Updates | Guides
      </h3>
      <p className='mt-5 px-4 text-center w-full sm:w-3/5 font-light dark:font-medium text-sm sm:text-base'>
        Subscribe to learn about new technology and updates. Join over 5000+
        members community to stay up to date with latest news.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className='mt-6 w-fit sm:min-w-[384px] flex items-stretch bg-light dark:bg-dark p-1 sm:p-2 rounded mx04'
      >
        <input
          type='email'
          placeholder='Enter your email'
          {...register('email', {
            required: 'Email is required',
            maxLength: {
              value: 120,
              message: 'Please use a shorter email address',
            },
            pattern: {
              value:
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i,
              message: 'Enter a valid email address',
            },
          })}
          className='outline-none w-full bg-transparent pl-2 sm:pl-0 text-dark dark:text-light focus:border-gray focus:ring-0 border-0 border-b mr-2 pb-1 disabled:cursor-not-allowed placeholder:text-gray-500 dark:placeholder:text-gray-400'
          disabled={isSubmitting}
          aria-invalid={errors.email ? 'true' : 'false'}
        />

        <button
          type='submit'
          className='bg-dark text-light dark:text-dark dark:bg-light cursor-pointer font-medium rounded px-3 sm:px-5 py-1 transition-colors duration-200 hover:bg-light hover:text-dark dark:hover:bg-dark dark:hover:text-light disabled:cursor-not-allowed disabled:opacity-70'
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Joining...' : 'Join'}
        </button>
      </form>
      <div className='mt-3 min-h-[1.5rem] text-sm font-light'>
        {errors.email && (
          <p className='text-rose-300 dark:text-rose-200'>
            {errors.email.message}
          </p>
        )}
        {feedbackMessage && (
          <p
            className={
              feedbackVariant === 'success'
                ? 'text-emerald-300 dark:text-emerald-200'
                : 'text-rose-300 dark:text-rose-200'
            }
          >
            {feedbackMessage}
          </p>
        )}
      </div>
      <div className='flex items-center mt-8'>
        <a
          href={siteMetadata.linkedin}
          className='inline-block w-6 h-6 mr-4'
          aria-label='Reach out to me via LinkedIn'
          target='_blank'
          rel='noopener noreferrer'
        >
          <LinkedinIcon className='hover:scale-125 transition-all ease duration-200' />
        </a>
        <a
          href={siteMetadata.twitter}
          className='inline-block w-6 h-6 mr-4'
          aria-label='Reach out to me via X'
          target='_blank'
          rel='noopener noreferrer'
        >
          <TwitterIcon className='hover:scale-125 transition-all ease duration-200' />
        </a>
        <a
          href={siteMetadata.github}
          className='inline-block w-6 h-6 mr-4 fill-light'
          aria-label='Check my profile on Github'
          target='_blank'
          rel='noopener noreferrer'
        >
          <GithubIcon className='fill-light dark:fill-dark  hover:scale-125 transition-all ease duration-200' />
        </a>
      </div>

      <div className='w-full  mt-16 md:mt-24 relative font-medium border-t border-solid border-light py-6 px-8 flex  flex-col md:flex-row items-center justify-between'>
        <span className='text-center'>
          &copy;2023 ozkancimenli. All rights reserved.
        </span>
        <div className='text-center'>
          Made with &hearts; by ozkancimenli
          <a
            href='/admin'
            className='ml-2 text-xs opacity-0 hover:opacity-100 transition-opacity'
            title='Admin Panel'
          >
            🔧
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
