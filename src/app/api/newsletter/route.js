import { NextResponse } from 'next/server';
import createSupabaseServerClient from '../../../utils/supabaseServerClient';
import { sendNewsletterWelcomeEmail } from '../../../utils/brevoEmail';

const sanitizeEmail = value =>
  typeof value === 'string' ? value.trim().toLowerCase() : '';

export async function POST(request) {
  try {
    const payload = await request.json();
    const email = sanitizeEmail(payload?.email);

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'A valid email address is required.' },
        { status: 422 }
      );
    }

    const supabase = createSupabaseServerClient();

    const { error } = await supabase
      .from('newsletter_subscriptions')
      .insert({ email });

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Looks like you are already on the list!' },
          { status: 409 }
        );
      }

      console.error('Supabase insert error (newsletter):', error);
      return NextResponse.json(
        { error: "We couldn't save your email. Please try again." },
        { status: 500 }
      );
    }

    // Send welcome email
    try {
      await sendNewsletterWelcomeEmail(email);
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Don't fail the request if email fails, just log it
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Unexpected error while processing the subscription.' },
      { status: 500 }
    );
  }
}
