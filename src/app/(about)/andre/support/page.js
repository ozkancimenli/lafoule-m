export const metadata = {
  title: 'Andre: Dimension Shift — Support',
  alternates: { canonical: '/andre/support' },
  description: 'Support for the iOS game Andre: Dimension Shift.',
};

export default function AndreSupport() {
  return (
    <article className='w-full px-5 xs:px-10 md:px-24 py-12 text-dark dark:text-light max-w-4xl'>
      <h1 className='font-bold text-3xl sm:text-4xl mb-6'>
        Andre: Dimension Shift — Support
      </h1>
      <p className='mb-4'>
        Andre: Dimension Shift is a story-driven action adventure for iPhone.
        This release contains Island 1, &quot;The Block&quot;.
      </p>
      <h2 className='font-semibold text-xl mt-8 mb-3'>Common questions</h2>
      <p className='mb-2'>
        <strong>Does it need an internet connection?</strong> No. The game plays
        fully offline.
      </p>
      <p className='mb-2'>
        <strong>Where is my progress saved?</strong> On your device. Deleting
        the game deletes your progress.
      </p>
      <p className='mb-2'>
        <strong>Can I use a controller?</strong> Yes. MFi, Xbox and PlayStation
        controllers are supported.
      </p>
      <p className='mb-6'>
        <strong>Are there ads or in-app purchases?</strong> No.
      </p>
      <p className='mb-4'>
        Found a bug or need help? Send a message through the{' '}
        <a className='underline' href='/contact'>
          contact form
        </a>{' '}
        and include your device model and iOS version.
      </p>
      <p>
        <a className='underline' href='/andre/privacy'>
          Privacy Policy
        </a>
      </p>
    </article>
  );
}
