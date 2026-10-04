import HomeCoverSection from '../components/Home/HomeCoverSection';
import RecentPosts from '../components/Home/RecentPosts';
import { getAllBlogs, BlogPost } from '../lib/blog';

const ventures = [
  {
    name: 'OZ Solutions',
    href: 'https://ozsolutionsusa.com',
    label: 'Productized growth systems',
    description:
      'Fixed-scope software, conversion, marketplace, and automation sprints built around visible business bottlenecks.',
  },
  {
    name: 'CatalogOG',
    href: 'https://catalogog.com',
    label: 'Product presentation',
    description:
      'Branded catalog and product-visual systems designed to give product lines one consistent visual language.',
  },
  {
    name: 'OmniToolset',
    href: 'https://omnitoolset.com',
    label: 'Automation platform',
    description:
      'A modular suite for customer communication, workflow automation, and reusable operator tooling.',
  },
];

export default function Home(): JSX.Element {
  const blogs: BlogPost[] = getAllBlogs();

  return (
    <main className='flex flex-col items-center justify-center'>
      <section className='w-full px-5 sm:px-10 pt-6 sm:pt-10 pb-12'>
        <div className='mx-auto max-w-7xl rounded-3xl border border-solid border-dark/10 dark:border-light/10 bg-light dark:bg-dark p-6 sm:p-10 lg:p-14'>
          <p className='text-sm sm:text-base uppercase tracking-[0.22em] text-accent dark:text-accentDark font-semibold'>
            Founder · Builder · Operator
          </p>

          <div className='mt-5 grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-end'>
            <div>
              <h1 className='font-bold text-4xl sm:text-5xl lg:text-7xl leading-[1.02] text-dark dark:text-light'>
                I build systems that turn ideas into shipped products and
                revenue workflows.
              </h1>
              <p className='mt-6 max-w-3xl text-base sm:text-lg lg:text-xl text-dark/75 dark:text-light/75'>
                I am building a small portfolio of software, automation, and
                product-presentation businesses while documenting the
                engineering, operating systems, and lessons behind them.
              </p>

              <div className='mt-8 flex flex-wrap gap-3'>
                <a
                  href='https://ozsolutionsusa.com'
                  className='rounded-full bg-dark dark:bg-light px-6 py-3 text-light dark:text-dark font-semibold transition-transform hover:-translate-y-0.5'
                >
                  Explore OZ Solutions
                </a>
                <a
                  href='https://github.com/ozkancimenli'
                  className='rounded-full border border-solid border-dark/20 dark:border-light/20 px-6 py-3 text-dark dark:text-light font-semibold transition-colors hover:bg-dark/5 dark:hover:bg-light/10'
                >
                  GitHub
                </a>
                <a
                  href='mailto:info@ozkancimenli.com'
                  className='rounded-full border border-solid border-dark/20 dark:border-light/20 px-6 py-3 text-dark dark:text-light font-semibold transition-colors hover:bg-dark/5 dark:hover:bg-light/10'
                >
                  Contact
                </a>
                <a
                  href='https://calendly.com/ozkan'
                  className='rounded-full border border-solid border-dark/20 dark:border-light/20 px-6 py-3 text-dark dark:text-light font-semibold transition-colors hover:bg-dark/5 dark:hover:bg-light/10'
                >
                  Book a Consultation
                </a>
              </div>
            </div>

            <div className='rounded-2xl bg-dark text-light dark:bg-light dark:text-dark p-6 sm:p-8'>
              <p className='text-xs uppercase tracking-[0.2em] opacity-60'>
                Operating principle
              </p>
              <p className='mt-4 text-2xl sm:text-3xl font-bold leading-tight'>
                Build. Attack the work. Rebuild. Ship only what survives.
              </p>
              <p className='mt-4 text-sm sm:text-base opacity-75'>
                My current systems use independent evidence, skeptic, red-team,
                and commercial reviews before important work is treated as
                finished.
              </p>
            </div>
          </div>

          <div className='mt-12 grid gap-4 md:grid-cols-3'>
            {ventures.map(venture => (
              <a
                key={venture.name}
                href={venture.href}
                className='group rounded-2xl border border-solid border-dark/10 dark:border-light/10 p-5 sm:p-6 transition-transform hover:-translate-y-1'
              >
                <p className='text-xs uppercase tracking-[0.18em] text-accent dark:text-accentDark'>
                  {venture.label}
                </p>
                <h2 className='mt-2 text-2xl font-bold text-dark dark:text-light'>
                  {venture.name}
                </h2>
                <p className='mt-3 text-sm sm:text-base text-dark/70 dark:text-light/70'>
                  {venture.description}
                </p>
                <span className='mt-5 inline-block font-semibold text-dark dark:text-light'>
                  Visit{' '}
                  <span className='transition-transform inline-block group-hover:translate-x-1'>
                    →
                  </span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className='w-full'>
        <div className='px-5 sm:px-10 mb-5'>
          <p className='text-sm uppercase tracking-[0.2em] text-dark/60 dark:text-light/60'>
            Latest writing
          </p>
        </div>
        <HomeCoverSection blogs={blogs} />
      </section>

      <RecentPosts blogs={blogs} />
    </main>
  );
}
