import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Holding — media production and archive tools',
  description:
    'Owner-operated tools for media production, YouTube publishing and verified Google Drive archiving.',
  alternates: { canonical: 'https://www.ozkancimenli.com/holding' },
};

export default function HoldingPage() {
  return (
    <>
      <h1>Holding</h1>
      <p>
        Holding is Ozkan Cimenli’s privately operated media production and
        archive workflow. It helps organize selected production files, publish
        authorized videos to YouTube and check the integrity of archive copies.
      </p>
      <p>
        The Google authorization screen currently identifies the shared
        application project as <strong>Alyssa</strong>. Holding uses separate
        clients for its Drive metadata verifier and YouTube publishing
        connection.
      </p>
      <h2>Google Drive archive verification</h2>
      <p>
        The verifier reads Drive file information, including file identifiers,
        names, folders, sizes and checksums, to confirm that selected archive
        copies match the originals. Its Google API permission is read-only
        metadata access; it does not permit downloading file contents,
        uploading, editing or deleting Drive files.
      </p>
      <p>
        Authorized archive uploads use the separately connected Google Drive for
        desktop application. The current worker is limited to selected completed
        production intermediates. It holds files when another cloud backup is
        uncertain, preserves active references and local originals, and respects
        disk and active-work checks.
      </p>
      <h2>YouTube publishing</h2>
      <p>
        A separate YouTube connection reads the authorized channel’s information
        and video processing status, and uploads selected videos with their
        titles, descriptions, tags and publication settings. Scheduled uploads
        follow the owner’s approved workflow. The public website does not start
        uploads or grant access to the local production system.
      </p>
      <h2>Control and contact</h2>
      <p>
        This is an owner-operated workflow, not a public account-registration
        service. Google access can be revoked through your{' '}
        <a href='https://myaccount.google.com/connections'>
          Google Account connections
        </a>
        .
      </p>
      <p>
        Read the <Link href='/holding/privacy'>privacy notice</Link> and{' '}
        <Link href='/holding/terms'>usage terms</Link>. For questions, contact{' '}
        <a href='mailto:info@ozkancimenli.com'>info@ozkancimenli.com</a>.
      </p>
    </>
  );
}
