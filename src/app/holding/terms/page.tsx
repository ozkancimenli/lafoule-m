import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Holding terms',
  description: 'Usage terms for the privately operated Holding media workflow.',
  alternates: { canonical: 'https://www.ozkancimenli.com/holding/terms' },
};

export default function HoldingTermsPage() {
  return (
    <>
      <h1>Holding terms</h1>
      <p>
        These terms describe the privately operated Holding workflow. Visiting
        these information pages does not grant access to that workflow.
      </p>
      <h2>Purpose and access</h2>
      <p>
        Holding is a privately operated workflow for media production,
        owner-authorized YouTube publishing and verification of selected archive
        files. These information pages do not offer public registration,
        subscriptions or access to the owner’s local system.
      </p>
      <h2>Accounts, content and authorization</h2>
      <p>
        Use an integration only with an account and content you are authorized
        to manage. Review the permissions shown by Google. The Drive verifier
        requests metadata read access; YouTube publishing uses separate read and
        upload permissions. A connection does not replace approval of the
        publishing or archive workflow.
      </p>
      <p>
        Check video rights, factual accuracy, descriptions, disclosures,
        visibility and scheduling before authorizing publication. An upload or
        checksum match does not establish copyright ownership or compliance with
        platform rules.
      </p>
      <h2>Operational limits</h2>
      <p>
        Tasks may pause when account access expires, another backup cannot be
        confirmed, disk safety checks fail or production work is active. The
        current archive workflow retains local originals. No uninterrupted
        service, permanent storage, automatic local deletion or complete
        disaster recovery is offered by these terms.
      </p>
      <h2>Third-party services</h2>
      <p>
        Google Drive and YouTube are separate services governed by their own
        applicable terms. YouTube API use is subject to the{' '}
        <a href='https://www.youtube.com/t/terms'>YouTube Terms of Service</a>.
        Revoking Google access does not automatically remove previously uploaded
        files or videos.
      </p>
      <h2>Privacy and contact</h2>
      <p>
        Review the <Link href='/holding/privacy'>Holding privacy notice</Link>.
        Questions about the workflow can be sent to{' '}
        <a href='mailto:info@ozkancimenli.com'>info@ozkancimenli.com</a>.
      </p>
      <p>
        No governing law, liability waiver, service-level commitment or deletion
        deadline is established by these terms. Changes to these terms will be
        reflected on this page.
      </p>
    </>
  );
}
