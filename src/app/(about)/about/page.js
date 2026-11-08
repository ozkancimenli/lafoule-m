import AboutCoverSection from '../../../components/About/AboutCoverSection';
import Skills from '../../../components/About/Skills';
import Link from 'next/link';

export const metadata = {
  title: 'About',
  description:
    'About Ozkan Cimenli — a builder who designs and runs software, automation and AI production systems.',
  alternates: { canonical: '/about' },
};

export default function About() {
  return (
    <>
      <AboutCoverSection />
      <Skills />
      <h2 className='mt-8 font-semibold text-lg md:text-2xl self-start mx-5 xs:mx-10 sm:mx-12 md:mx-16 lg:mx-20 text-dark dark:text-light dark:font-normal'>
        Want to talk about a project or something I wrote? Reach out{' '}
        <Link href='/contact' className='!underline underline-offset-2'>
          here
        </Link>{' '}
        and let&apos;s make it happen.
      </h2>
    </>
  );
}
