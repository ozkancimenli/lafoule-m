import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Holding privacy',
  description:
    'How the current Holding Drive and YouTube integrations use and retain information.',
  alternates: { canonical: 'https://www.ozkancimenli.com/holding/privacy' },
};

export default function HoldingPrivacyPage() {
  return (
    <>
      <h1>Holding privacy</h1>
      <p>
        This notice describes the inspected Holding integrations operated by
        Ozkan Cimenli. Its scope is limited to the integrations described below.
      </p>
      <h2>Information used by the integrations</h2>
      <ul>
        <li>
          <strong>Drive:</strong> the connected account’s email address and
          storage quota; archive file IDs, names, parent folders, sizes and
          available checksums. The granted metadata permission can read
          information about files across the account; the worker’s verification
          queries are limited to the configured archive location.
        </li>
        <li>
          <strong>YouTube:</strong> the authorized channel’s ID, title and
          handle; selected video files and supplied titles, descriptions, tags,
          visibility, scheduling and disclosure settings; upload identifiers and
          processing/publication status returned by YouTube.
        </li>
        <li>
          <strong>Local records:</strong> source paths, sizes, hashes,
          verification results, timestamps, task and upload state, and error
          summaries used to operate and troubleshoot the workflow.
        </li>
        <li>
          <strong>Authorization:</strong> OAuth client credentials, access
          tokens and refresh tokens used to maintain the owner-approved
          connections.
        </li>
      </ul>
      <h2>Purpose and destinations</h2>
      <p>
        Drive metadata is used to check the connected account and verify archive
        integrity. Selected files are sent to Google Drive through Drive for
        desktop when the archive rules permit it. YouTube receives the videos
        and publishing information selected for upload. Videos become accessible
        according to their YouTube visibility settings.
      </p>
      <p>
        The inspected verifier and publisher communicate with Google’s official
        authorization and API endpoints. Local production tools can generate
        publishing text from production facts; the inspected text-generation
        path uses a local model. These integration paths do not contain
        advertising, data-sale or general-purpose model-training functions. This
        statement does not describe every other Holding tool or website service.
      </p>
      <h2>Storage and retention</h2>
      <p>
        Connection credentials are stored in local owner-restricted files
        excluded from the source repository. Operational records are stored in
        local files and the local production database. Tokens are not
        intentionally included in status responses or routine logs. This is not
        a claim that local files are encrypted at rest.
      </p>
      <p>
        The inspected archive records do not have a scheduled deletion period.
        Original production files and independent verification downloads remain
        local. Cloud copies remain in the connected Google services until
        separately managed by the owner. This notice does not establish a fixed
        retention period or automated deletion service.
      </p>
      <h2>Revoke access and request removal</h2>
      <p>
        You can revoke a connection at{' '}
        <a href='https://myaccount.google.com/connections'>
          Google Account connections
        </a>
        . Revocation prevents further authorized API access; it does not itself
        erase local records, Drive copies or uploaded YouTube videos. Manage
        cloud content in the relevant Google service, and contact{' '}
        <a href='mailto:info@ozkancimenli.com'>info@ozkancimenli.com</a> about
        local records. This notice does not promise an automatic deletion
        feature or a fixed response deadline.
      </p>
      <h2>This website is separate</h2>
      <p>
        Reading these pages does not authorize Google access. The live website
        includes a Google Analytics script and a newsletter form. Its source
        also includes Vercel performance measurement. The newsletter code stores
        the submitted email in Supabase and attempts to send a welcome email
        through Brevo. Successful delivery and provider retention settings have
        not been verified by this review.
      </p>
      <p>
        The website’s unsubscribe code deletes the matching newsletter
        subscription row in Supabase. This is separate from Google access
        revocation and does not establish deletion from email-provider records,
        logs or backups. No subscription or deletion was performed as part of
        this review. Website analytics consent and provider retention still
        require review before a complete site-wide notice can be published.
      </p>
      <h2>Scope of this notice</h2>
      <p>
        This notice covers the inspected Holding Drive verifier and YouTube
        publisher. The shared Alyssa Google project also lists an OpenClaw Gog
        Desktop client. Its data practices have not been verified here; this
        notice must not be treated as covering that client without further
        review.
      </p>
      <h2>Google policies</h2>
      <p>
        Google API use is governed by the{' '}
        <a href='https://developers.google.com/terms/api-services-user-data-policy'>
          Google API Services User Data Policy
        </a>
        , including its Limited Use requirements. YouTube use is also subject to
        the{' '}
        <a href='https://www.youtube.com/t/terms'>YouTube Terms of Service</a>.
        See{' '}
        <a href='https://policies.google.com/privacy'>
          Google’s Privacy Policy
        </a>{' '}
        for Google’s handling of information.
      </p>
    </>
  );
}
