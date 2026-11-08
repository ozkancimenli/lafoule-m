import Link from 'next/link';

export const metadata = {
  title: 'Projects',
  description:
    'Products, channels and systems Ozkan Cimenli builds and runs — OmniToolset, an optical-illusion Shorts channel, CatalogOG, OZ Solutions — plus earlier full-stack work.',
  alternates: { canonical: '/projects' },
};

const ventures = [
  {
    title: 'OmniToolset',
    description:
      'Free online tools for images, PDFs, QR codes and developers that run entirely in the browser — files never leave the device. Ad-supported, no accounts.',
    tech: ['Next.js', 'Canvas API', 'pdf-lib', 'SEO'],
    links: [
      { label: 'Visit', href: 'https://www.omnitoolset.com' },
      { label: 'GitHub', href: 'https://github.com/ozkancimenli/omnitoolset' },
    ],
    year: '2026',
    status: 'Live',
  },
  {
    title: 'Optical Illusion Shorts',
    description:
      'A YouTube Shorts channel of forced-perspective and anamorphic illusions. Every scene is built procedurally in Blender and narrated with a local voice model — no stock footage.',
    tech: ['Blender', 'Python', 'Local TTS', 'YouTube API'],
    links: [{ label: 'Watch', href: 'https://www.youtube.com/@ozkaninthehouse' }],
    year: '2026',
    status: 'Publishing',
  },
  {
    title: 'Alyssa OS',
    description:
      'My private production system on a single Mac Studio: local language, voice, image, video and 3D models that write concepts, render, review and publish content on a schedule.',
    tech: ['Python', 'LM Studio', 'MLX', 'Blender', 'SQLite'],
    links: [],
    year: '2026',
    status: 'Private · daily use',
  },
  {
    title: 'CatalogOG',
    description:
      'Brand-locked product visuals and Open Graph images for ecommerce catalogs — one consistent visual system across every SKU.',
    tech: ['Image pipeline', 'Brand systems', 'Ecommerce'],
    links: [{ label: 'Visit', href: 'https://catalogog.com' }],
    year: '2026',
    status: 'Live',
  },
  {
    title: 'OZ Solutions',
    description:
      'Fixed-scope growth sprints for small businesses: storefront conversion fixes, marketplace listings and lead-capture flows.',
    tech: ['Productized services', 'Conversion', 'Automation'],
    links: [{ label: 'Visit', href: 'https://www.ozsolutionsusa.com' }],
    year: '2026',
    status: 'Live',
  },
  {
    title: 'Tiny Night Crew',
    description:
      'An animated brand of plush characters — Chester, Scout and Hugo — produced with a 3D and AI animation pipeline.',
    tech: ['3D', 'Animation', 'AI video'],
    links: [{ label: 'Visit', href: 'https://tinynightcrew.com' }],
    year: '2026',
    status: 'In development',
  },
  {
    title: 'Petmigo',
    description:
      'A mobile app connecting pet owners with groomers and vets, piloting in Los Angeles.',
    tech: ['Expo', 'React Native', 'Supabase'],
    links: [],
    year: '2026',
    status: 'In development',
  },
  {
    title: 'CastleSmash',
    description: 'A physics-based castle-destruction game for mobile, built in Unity.',
    tech: ['Unity', 'C#', 'iOS'],
    links: [],
    year: '2026',
    status: 'In development',
  },
];

const earlier = [
  {
    title: 'EchoMind',
    description:
      'AI-powered note-taking and knowledge management platform with intelligent search, automatic categorization, and cross-platform synchronization. Built with Next.js and advanced AI integration.',
    tech: ['Next.js', 'TypeScript', 'AI/ML', 'Supabase', 'OpenAI API'],
    links: [{ label: 'GitHub', href: 'https://github.com/ozkancimenli/echomind' }],
    // live demo 500 veriyor (2026-11-08); düzelene kadar yalnızca kod linki
    year: '2025',
    status: 'Featured',
  },
  {
    title: 'RateSetter Admin',
    description:
      'Professional admin dashboard for managing hourly rates by project and role. Features real-time search, inline editing, bulk operations, and comprehensive testing with Vitest and Playwright.',
    tech: [
      'Next.js',
      'TypeScript',
      'TanStack Query',
      'shadcn/ui',
      'React Hook Form',
      'Zod',
    ],
    links: [
      { label: 'Live demo', href: 'https://ratesetter-admin.vercel.app' },
      { label: 'GitHub', href: 'https://github.com/ozkancimenli/ratesetter-admin' },
    ],
    year: '2025',
    status: 'Live',
  },
  {
    title: 'ozkanUI Showcase',
    description:
      'Professional showcase website for the @ozkan/ui component library. Interactive component demonstrations with fully responsive design, showcasing all premium effects and real-world usage examples.',
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'App Router'],
    links: [
      { label: 'Live demo', href: 'https://ozkanui.vercel.app' },
      { label: 'GitHub', href: 'https://github.com/ozkancimenli/showcase' },
    ],
    year: '2025',
    status: 'Live',
  },
  {
    title: 'CollabCanvas',
    description:
      'Real-time collaboration canvas built with Next.js, Liveblocks, and Clerk Auth. Enables multiplayer drawing, shared cursors, and synced sessions with cloud persistence.',
    tech: ['Next.js', 'TypeScript', 'Liveblocks', 'Clerk', 'Shadcn-UI'],
    links: [
      { label: 'Live demo', href: 'https://colcanvas.vercel.app/' },
      { label: 'GitHub', href: 'https://github.com/ozkancimenli/collabcanvas' },
    ],
    year: '2024',
    status: 'Live',
  },
  {
    title: 'TeamSync',
    description:
      'AI-assisted scheduling platform integrating Google Calendar API and Supabase for real-time team coordination. Automates stand-up summaries and time-zone alignment.',
    tech: ['Next.js', 'TypeScript', 'Supabase', 'Google API', 'Clerk'],
    links: [
      { label: 'Live demo', href: 'https://team-sync-ashen.vercel.app' },
      { label: 'GitHub', href: 'https://github.com/ozkancimenli/teamsync' },
    ],
    year: '2025',
    status: 'In Progress',
  },
];

const ProjectCard = ({ project }) => (
            <article
              
              className='group flex h-full flex-col justify-between rounded-3xl border border-dark/10 bg-light p-6 text-dark shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl dark:border-light/10 dark:bg-dark/80 dark:text-light dark:shadow-black/20'
            >
              <div className='flex flex-col gap-4'>
                {/* Meta */}
                <div className='flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-gray dark:text-light/60'>
                  <span>{project.year}</span>
                  <span className='rounded-full border border-dark/10 bg-light/60 px-3 py-1 text-[11px] text-dark transition-colors duration-200 group-hover:border-accent group-hover:text-accent dark:border-light/20 dark:bg-dark/60 dark:text-light dark:group-hover:border-accentDark dark:group-hover:text-accentDark'>
                    {project.status}
                  </span>
                </div>

                {/* Title */}
                <h3 className='text-xl font-semibold sm:text-2xl'>
                  <span
                    className='bg-gradient-to-r from-accent/40 to-accent/40 dark:from-accentDark/40 dark:to-accentDark/40 bg-[length:0px_6px]
                    group-hover:bg-[length:100%_6px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500'
                  >
                    {project.title}
                  </span>
                </h3>

                {/* Description */}
                <p className='text-sm text-gray dark:text-light/70 sm:text-base'>
                  {project.description}
                </p>

                {/* Tech Stack */}
                <ul className='mt-4 flex flex-wrap gap-2'>
                  {project.tech.map(item => (
                    <li
                      key={`${project.title}-${item}`}
                      className='rounded-full border border-dark/10 bg-light/70 px-3 py-1 text-xs font-semibold text-gray transition-colors duration-200 dark:border-light/20 dark:bg-dark/60 dark:text-light/70'
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Buttons */}
              {project.links.length > 0 && (
                <div className='mt-6 flex flex-wrap gap-3'>
                  {project.links.map((l, i) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      target='_blank'
                      rel='noopener noreferrer'
                      className={
                        i === 0
                          ? 'inline-flex items-center justify-center rounded-full border border-accent px-5 py-2 text-xs font-semibold uppercase tracking-wide text-accent transition-colors duration-200 hover:bg-accent hover:text-light dark:border-accentDark dark:text-accentDark dark:hover:bg-accentDark dark:hover:text-dark'
                          : 'inline-flex items-center justify-center rounded-full border border-dark px-5 py-2 text-xs font-semibold uppercase tracking-wide transition-colors duration-200 hover:bg-dark hover:text-light dark:border-light dark:hover:bg-light dark:hover:text-dark'
                      }
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              )}
            
            </article>);

const Grid = ({ title, intro, items }) => (
  <div className='w-full mt-16'>
    <h2 className='text-2xl sm:text-3xl font-bold text-dark dark:text-light'>{title}</h2>
    {intro && <p className='mt-2 text-gray dark:text-light/70'>{intro}</p>}
    <div className='grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10 mt-8 w-full'>
      {items.map(p => (
        <ProjectCard key={p.title} project={p} />
      ))}
    </div>
  </div>
);

const ProjectsPage = () => {
  return (
    <main className='flex flex-col items-center justify-center'>
      <section className='w-full mt-16 sm:mt-24 md:mt-32 px-5 sm:px-10 md:px-24 sxl:px-32 flex flex-col items-center justify-center'>
        {/* Header */}
        <div className='w-full flex flex-col items-center text-center text-dark dark:text-light'>
          <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold'>
            Projects & Ventures
          </h1>
          <p className='mt-4 max-w-2xl text-base sm:text-lg text-gray dark:text-light/70'>
            Products, channels and systems I build and run — plus earlier
            full-stack work.
          </p>
        </div>

        <Grid
          title='What I build and run'
          intro='Live products, channels and systems.'
          items={ventures}
        />
        <Grid
          title='Earlier full-stack work'
          intro='Client-style apps built while sharpening my full-stack skills.'
          items={earlier}
        />
      </section>
    </main>
  );
};

export default ProjectsPage;
