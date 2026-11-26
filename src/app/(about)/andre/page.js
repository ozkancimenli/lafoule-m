import Image from 'next/image';
import AndreWaitlist from '../../../components/Andre/AndreWaitlist';

export const metadata = {
  title: 'Andre: Dimension Shift — Coming back soon',
  alternates: { canonical: '/andre' },
  description:
    'A story-driven action adventure for iPhone, iPad and Mac. Andre is getting a big update — join the waitlist and get it the day it returns.',
  openGraph: {
    title: 'Andre: Dimension Shift — Coming back soon',
    description:
      'Ink monsters, a shield-bearing mid-boss and a boss waiting in the Ink Cistern. Join the waitlist.',
    images: ['/andre/hero.jpg'],
  },
};

const shots = [
  {
    src: '/andre/fight1.jpg',
    alt: 'Andre blocks an ink monster with his shield',
  },
  {
    src: '/andre/fight2.jpg',
    alt: 'Andre fights two ink creatures in the square',
  },
  {
    src: '/andre/rift.jpg',
    alt: 'Andre in front of the rift to the broken world',
  },
];

export default function AndrePage() {
  return (
    <article className='w-full px-5 xs:px-10 md:px-24 py-12 text-dark dark:text-light max-w-5xl'>
      <div className='relative w-full aspect-[1600/736] rounded-2xl overflow-hidden mb-8'>
        <Image
          src='/andre/hero.jpg'
          alt='Andre walking down a rainy street at night'
          fill
          priority
          sizes='(max-width: 1024px) 100vw, 1024px'
          className='object-cover'
        />
      </div>

      <p className='uppercase tracking-widest text-sm text-dark/60 dark:text-light/60 mb-2'>
        iPhone · iPad · Mac — coming back soon
      </p>
      <h1 className='font-bold text-4xl sm:text-5xl mb-4'>
        Andre: Dimension Shift
      </h1>
      <p className='text-lg mb-8 max-w-3xl'>
        A hitman wakes up in a city that is tearing itself apart. Ink crawls out
        of the asphalt, the streets break into floating islands, and something
        is watching from under the square. Andre fights his way through with his
        fists and a shield.
      </p>

      <div className='max-w-3xl mb-12'>
        <AndreWaitlist />
      </div>

      <h2 className='font-semibold text-2xl mb-4'>What&apos;s in the update</h2>
      <ul className='list-disc pl-6 space-y-2 mb-10 max-w-3xl'>
        <li>
          <strong>The Ink Cistern</strong> — a real boss room under the square.
          Find the boss key, open the big door, go down.
        </li>
        <li>
          <strong>The Periscopes</strong> — a predatory boss that combos, leaps
          and charges. Parry it, bait it into the pillars, break its armor.
        </li>
        <li>
          <strong>The Bulwark</strong> — a shield-bearing mid-boss that only
          opens up when it attacks.
        </li>
        <li>
          Reworked combat camera, hit reactions and enemy attacks on both sides
          of every fight.
        </li>
      </ul>

      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12'>
        {shots.map(s => (
          <div
            key={s.src}
            className='relative aspect-[1600/736] rounded-xl overflow-hidden'
          >
            <Image
              src={s.src}
              alt={s.alt}
              fill
              sizes='(max-width: 640px) 100vw, 33vw'
              className='object-cover'
            />
          </div>
        ))}
      </div>

      <p className='text-sm text-dark/70 dark:text-light/70'>
        Already have the game? It stays on your device.{' '}
        <a className='underline' href='/andre/support'>
          Support
        </a>{' '}
        ·{' '}
        <a className='underline' href='/andre/privacy'>
          Privacy Policy
        </a>
      </p>
    </article>
  );
}
