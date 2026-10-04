export const metadata = {
  title: 'Admin unavailable | Ozkan Cimenli',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return (
    <main className='min-h-[70vh] flex items-center justify-center px-6'>
      <div className='max-w-xl rounded-2xl border border-solid border-dark/10 dark:border-light/10 p-8 text-center'>
        <p className='text-xs uppercase tracking-[0.2em] text-accent dark:text-accentDark'>
          Security gate
        </p>
        <h1 className='mt-3 text-3xl font-bold text-dark dark:text-light'>
          Admin access is disabled.
        </h1>
        <p className='mt-4 text-dark/70 dark:text-light/70'>
          The previous client-side password gate was not suitable for a
          production admin surface. This route stays closed until server-side
          authentication is installed.
        </p>
        <a
          href='/'
          className='mt-6 inline-block rounded-full bg-dark dark:bg-light px-6 py-3 text-light dark:text-dark font-semibold'
        >
          Return home
        </a>
      </div>
    </main>
  );
}
