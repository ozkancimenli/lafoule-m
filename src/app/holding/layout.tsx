import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function HoldingLayout({ children }: { children: ReactNode }) {
  return (
    <main className='mx-auto max-w-4xl px-5 py-12 text-dark dark:text-light sm:px-8'>
      <aside
        className='mb-8 rounded-xl border border-current p-4 text-sm'
        aria-label='Notice scope'
      >
        <strong>Holding integration information</strong>
        <p>
          Updated on 3 November 2026. These pages describe the current Holding
          integrations and the limits of their documented scope.
        </p>
      </aside>
      <nav
        aria-label='Holding pages'
        className='mb-10 flex flex-wrap gap-5 underline underline-offset-4'
      >
        <Link href='/holding'>Holding</Link>
        <Link href='/holding/privacy'>Privacy</Link>
        <Link href='/holding/terms'>Terms</Link>
      </nav>
      <article className='prose prose-lg max-w-none dark:prose-invert prose-a:underline prose-a:underline-offset-4'>
        {children}
      </article>
    </main>
  );
}
