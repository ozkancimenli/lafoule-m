import Link from "next/link";

const projects = [
  {
    title: "CollabCanvas",
    description:
      "Real-time collaboration canvas built with Next.js, Liveblocks, and Clerk Auth. Enables multiplayer drawing, shared cursors, and synced sessions with cloud persistence.",
    tech: ["Next.js", "TypeScript", "Liveblocks", "Clerk", "Shadcn-UI"],
    github: "https://github.com/ozkancimenli/collabcanvas",
    live: "https://colcanvas.vercel.app/",
    year: "2025",
    status: "Featured",
  },
  {
    title: "TeamSync",
    description:
      "AI-assisted scheduling platform integrating Google Calendar API and Supabase for real-time team coordination. Automates stand-up summaries and time-zone alignment.",
    tech: ["Next.js", "TypeScript", "Supabase", "Google API", "Clerk"],
    github: "https://github.com/ozkancimenli/teamsync",
    live: "https://team-sync-ashen.vercel.app",
    year: "2024",
    status: "In Progress",
  },
];

const ProjectsPage = () => {
  return (
    <main className="flex flex-col items-center justify-center">
      <section className="w-full mt-16 sm:mt-24 md:mt-32 px-5 sm:px-10 md:px-24 sxl:px-32 flex flex-col items-center justify-center">
        {/* Header */}
        <div className="w-full flex flex-col items-center text-center text-dark dark:text-light">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">Full-Stack Projects</h1>
          <p className="mt-4 max-w-2xl text-base sm:text-lg text-gray dark:text-light/70">
            A curated showcase of production-ready applications that demonstrate my approach to
            modern full-stack development — scalable backends, reactive frontends, and real-time
            collaboration features.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10 mt-16 w-full">
          {projects.map((project) => (
            <article
              key={project.title}
              className="group flex h-full flex-col justify-between rounded-3xl border border-dark/10 bg-light p-6 text-dark shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl dark:border-light/10 dark:bg-dark/80 dark:text-light dark:shadow-black/20"
            >
              <div className="flex flex-col gap-4">
                {/* Meta */}
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-gray dark:text-light/60">
                  <span>{project.year}</span>
                  <span className="rounded-full border border-dark/10 bg-light/60 px-3 py-1 text-[11px] text-dark transition-colors duration-200 group-hover:border-accent group-hover:text-accent dark:border-light/20 dark:bg-dark/60 dark:text-light dark:group-hover:border-accentDark dark:group-hover:text-accentDark">
                    {project.status}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-xl font-semibold sm:text-2xl">
                  <span
                    className="bg-gradient-to-r from-accent/40 to-accent/40 dark:from-accentDark/40 dark:to-accentDark/40 bg-[length:0px_6px]
                    group-hover:bg-[length:100%_6px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500"
                  >
                    {project.title}
                  </span>
                </h2>

                {/* Description */}
                <p className="text-sm text-gray dark:text-light/70 sm:text-base">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <ul className="mt-4 flex flex-wrap gap-2">
                  {project.tech.map((item) => (
                    <li
                      key={`${project.title}-${item}`}
                      className="rounded-full border border-dark/10 bg-light/70 px-3 py-1 text-xs font-semibold text-gray transition-colors duration-200 dark:border-light/20 dark:bg-dark/60 dark:text-light/70"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Buttons */}
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-dark px-5 py-2 text-xs font-semibold uppercase tracking-wide transition-colors duration-200 hover:bg-dark hover:text-light dark:border-light dark:hover:bg-light dark:hover:text-dark"
                >
                  GitHub
                </Link>
                {project.live && (
                  <Link
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-accent px-5 py-2 text-xs font-semibold uppercase tracking-wide text-accent transition-colors duration-200 hover:bg-accent hover:text-light dark:border-accentDark dark:text-accentDark dark:hover:bg-accentDark dark:hover:text-dark"
                  >
                    Live Demo
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default ProjectsPage;