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

    // Two places, so one failing never loses a signup: Supabase (contact_requests)
    // and a Brevo contact (Brevo can send the launch email later).
    let saved = false;
    try {
      const supabase = createSupabaseServerClient();
      const { error } = await supabase.from('contact_requests').insert({
        name: 'Andre waitlist',
        email,
        details: `${TAG}${platform ? ` | platform: ${platform}` : ''}`,
      });
      if (error) {
        console.error(
          'Andre waitlist supabase error:',
          error.code,
          error.message
        );
      } else {
        saved = true;
      }
    } catch (dbError) {
      console.error('Andre waitlist supabase exception:', dbError?.message);
    }

    if (process.env.BREVO_API_KEY) {
      try {
        const res = await fetch('https://api.brevo.com/v3/contacts', {
          method: 'POST',
          headers: {
            accept: 'application/json',
            'api-key': process.env.BREVO_API_KEY,
            'content-type': 'application/json',
          },
          body: JSON.stringify({ email, updateEnabled: true }),
        });
        if (res.ok || res.status === 204) {
          saved = true;
        } else {
          console.error(
            'Andre waitlist brevo error:',
            res.status,
            await res.text()
          );
        }
      } catch (brevoError) {
        console.error('Andre waitlist brevo exception:', brevoError?.message);
      }
    }

    if (!saved) {
      return NextResponse.json(
        { error: "We couldn't save your email. Please try again." },
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
