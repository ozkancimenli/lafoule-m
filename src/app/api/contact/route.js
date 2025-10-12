import { NextResponse } from 'next/server';
import createSupabaseServerClient from '../../../utils/supabaseServerClient';
import {
  sendContactNotificationEmail,
  sendContactAutoReplyEmail,
} from '../../../utils/brevoEmail';

const sanitizeString = value => (typeof value === 'string' ? value.trim() : '');

const sanitizeOptionalString = value => {
  const cleaned = sanitizeString(value);
  return cleaned.length > 0 ? cleaned : null;
};

export async function POST(request) {
  try {
    const payload = await request.json();

    const name = sanitizeString(payload?.name);
    const email = sanitizeString(payload?.email);
    const phone = sanitizeOptionalString(payload?.phone);
    const details = sanitizeOptionalString(payload?.details);

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required.' },
        { status: 422 }
      );
    }

    const supabase = createSupabaseServerClient();

    const { error } = await supabase.from('contact_requests').insert({
      name,
      email,
      phone,
      details,
    });

    if (error) {
      console.error('Supabase insert error (contact):', error);
      return NextResponse.json(
        { error: 'Unable to save your message right now. Please try again.' },
        { status: 500 }
      );
    }

    // Send emails
    try {
      const contactData = { name, email, phone, details };

      // Send notification email to admin
      await sendContactNotificationEmail(contactData);

      // Send auto-reply email to user
      await sendContactAutoReplyEmail(contactData);
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Don't fail the request if email fails, just log it
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form submission error:', error);
    return NextResponse.json(
      { error: 'Unexpected error while submitting the form.' },
      { status: 500 }
    );
  }
}
