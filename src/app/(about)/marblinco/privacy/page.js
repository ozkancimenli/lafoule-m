export const metadata = {
  title: 'Marblinco — Privacy Policy',
  alternates: { canonical: '/marblinco/privacy' },
  description: 'Privacy policy for the iOS game Marblinco.',
};

export default function MarblincoPrivacy() {
  return (
    <article className='w-full px-5 xs:px-10 md:px-24 py-12 text-dark dark:text-light max-w-4xl'>
      <h1 className='font-bold text-3xl sm:text-4xl mb-2'>
        Marblinco — Privacy Policy
      </h1>
      <p className='opacity-70 mb-8'>Last updated: November 24, 2026</p>
      <p className='mb-4'>
        Marblinco (&quot;the game&quot;) is made by Ozkan Cimenli.
      </p>
      <h2 className='font-semibold text-xl mt-8 mb-3'>
        What we do not collect
      </h2>
      <p className='mb-4'>
        The game has no accounts, no sign-in and no chat. We do not ask for your
        name, email address, contacts, photos or location, and the game does not
        send any data to our own servers.
      </p>
      <h2 className='font-semibold text-xl mt-8 mb-3'>Saved on your device</h2>
      <p className='mb-4'>
        Your progress (coins, hacks, unlocked looks, missions, settings and best
        distance) is saved only on your device. Deleting the game deletes it.
      </p>
      <h2 className='font-semibold text-xl mt-8 mb-3'>In-app purchases</h2>
      <p className='mb-4'>
        Purchases are handled by Apple through the App Store. We never see or
        store your payment details; Apple only tells the game that a purchase
        was completed so the item can be delivered.
      </p>
      <h2 className='font-semibold text-xl mt-8 mb-3'>Advertising</h2>
      <p className='mb-4'>
        The free version of the game may show ads from Google AdMob. To show and
        measure ads, Google may use information such as your device&apos;s
        advertising identifier, IP address and ad interaction data. If you do
        not allow tracking when iOS asks, ads are shown without the advertising
        identifier. See how Google uses this data at{' '}
        <a
          className='underline'
          href='https://policies.google.com/technologies/partner-sites'
        >
          policies.google.com/technologies/partner-sites
        </a>
        . Buying &quot;No Ads&quot; turns these ads off.
      </p>
      <h2 className='font-semibold text-xl mt-8 mb-3'>
        Brands inside the game
      </h2>
      <p className='mb-4'>
        Some billboards and vehicles in the game show partner brand names. They
        are part of the game&apos;s artwork and do not collect any information.
      </p>
      <h2 className='font-semibold text-xl mt-8 mb-3'>Children</h2>
      <p className='mb-4'>
        The game is not directed at children under 13, and we do not knowingly
        collect personal information from children.
      </p>
      <p className='mb-4'>
        Questions: use the{' '}
        <a className='underline' href='/contact'>
          contact form
        </a>
        .
      </p>
    </article>
  );
}
