import { NextResponse } from 'next/server';
import createSupabaseServerClient from '../../../utils/supabaseServerClient';
import { sendEmail } from '../../../utils/brevoEmail';

// Andre: Dimension Shift is off the App Store while the next update is built.
// People who want it leave their email here; they are stored in contact_requests
// (tagged ANDRE_WAITLIST) so no new table or migration is needed.
const TAG = 'ANDRE_WAITLIST';

const sanitizeEmail = value =>
  typeof value === 'string' ? value.trim().toLowerCase() : '';

const isEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export async function POST(request) {
  try {
    const payload = await request.json();
    const email = sanitizeEmail(payload?.email);
    const platform =
      typeof payload?.platform === 'string'
        ? payload.platform.slice(0, 40)
        : '';

    if (!email || !isEmail(email) || email.length > 255) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 422 }
      );
    }

    // Saved to Supabase (contact_requests) when it is reachable and always to a
    // private Vercel Blob store, so one failing never loses a signup.
    let saved = false;
    const why = [];
    try {
      const supabase = createSupabaseServerClient();
      const { error } = await supabase.from('contact_requests').insert({
        name: 'Andre waitlist',
        email,
        details: `${TAG}${platform ? ` | platform: ${platform}` : ''}`,
      });
      if (error) {
        why.push(`db:${error.code || error.message}`);
        console.error(
          'Andre waitlist supabase error:',
          error.code,
          error.message
        );
      } else {
        saved = true;
      }
    } catch (dbError) {
      why.push(`db-x:${String(dbError?.message).slice(0, 60)}`);
      console.error('Andre waitlist supabase exception:', dbError?.message);
    }

    // Primary store: private Vercel Blob (andre-waitlist), one small JSON per signup.
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const pathname = `andre-waitlist/${Date.now()}.json`;
        const res = await fetch(
          `https://blob.vercel-storage.com/?pathname=${encodeURIComponent(pathname)}`,
          {
            method: 'PUT',
            headers: {
              authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
              'x-api-version': '11',
              'x-vercel-blob-access': 'private',
              'x-content-type': 'application/json',
              'x-add-random-suffix': '1',
            },
            body: JSON.stringify({
              email,
              platform,
              at: new Date().toISOString(),
            }),
          }
        );
        if (res.ok) {
          saved = true;
        } else {
          why.push(`blob:${res.status}`);
          console.error(
            'Andre waitlist blob error:',
            res.status,
            await res.text()
          );
        }
      } catch (blobError) {
        why.push('blob-x');
        console.error('Andre waitlist blob exception:', blobError?.message);
      }
    }

    if (!saved) {
      return NextResponse.json(
        {
          error: "We couldn't save your email. Please try again.",
          code: why.join(','),
        },
        { status: 500 }
      );
    }

    try {
      await sendEmail(
        email,
        "You're on the list — Andre: Dimension Shift",
        `<p>Thanks for signing up.</p>
<p><strong>Andre: Dimension Shift</strong> is getting a big update: a new boss room, a new mid-boss and a reworked fight system. We'll email you once, the day it's back on the App Store.</p>
<p>— Ozkan</p>
<p style="font-size:12px;color:#888">You got this because you joined the waitlist at ozkancimenli.com/andre. Reply "remove" and we'll delete your email.</p>`
      );
    } catch (emailError) {
      console.error('Andre waitlist confirmation email error:', emailError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Andre waitlist error:', error);
    return NextResponse.json(
      { error: 'Unexpected error. Please try again.' },
      { status: 500 }
    );
  }
}
