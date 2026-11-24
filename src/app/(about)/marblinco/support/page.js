export const metadata = {
  title: 'Marblinco — Support',
  alternates: { canonical: '/marblinco/support' },
  description: 'Support for the iOS game Marblinco.',
};

export default function MarblincoSupport() {
  return (
    <article className='w-full px-5 xs:px-10 md:px-24 py-12 text-dark dark:text-light max-w-4xl'>
      <h1 className='font-bold text-3xl sm:text-4xl mb-6'>
        Marblinco — Support
      </h1>
      <p className='mb-4'>
        Marblinco is an endless runner for iPhone about a little robot who
        escaped a factory.
      </p>
      <h2 className='font-semibold text-xl mt-8 mb-3'>Common questions</h2>
      <p className='mb-2'>
        <strong>I bought something but didn&apos;t get it.</strong> Open the
        Shop and tap &quot;Restore purchases&quot;, signed in with the same
        Apple ID you used to buy.
      </p>
      <p className='mb-2'>
        <strong>How do I get more hacks?</strong> Pick up chips on the road,
        open the daily mission chest, keep your login streak, or get them in
        the Shop.
      </p>
      <p className='mb-2'>
        <strong>Where is my progress saved?</strong> On your device. Deleting
        the game deletes your progress.
      </p>
      <p className='mb-6'>
        <strong>How do I get a refund?</strong> Purchases are processed by
        Apple. Request a refund at{' '}
        <a className='underline' href='https://reportaproblem.apple.com'>
          reportaproblem.apple.com
        </a>
        .
      </p>
      <p className='mb-4'>
        Found a bug or need help? Send a message through the{' '}
        <a className='underline' href='/contact'>
          contact form
        </a>{' '}
        and include your device model and iOS version.
      </p>
      <p>
        <a className='underline' href='/marblinco/privacy'>
          Privacy Policy
        </a>
      </p>
    </article>
  );
}
