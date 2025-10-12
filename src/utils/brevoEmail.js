import { getEmailTemplate } from './emailTemplates';

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

export const sendEmail = async (
  to,
  subject,
  htmlContent,
  textContent = null
) => {
  try {
    const response = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: 'Ozkan Cimenli',
          email: 'info@ozkancimenli.com',
        },
        to: Array.isArray(to) ? to : [{ email: to }],
        subject: subject,
        htmlContent: htmlContent,
        textContent: textContent || htmlContent.replace(/<[^>]*>/g, ''),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Brevo API error: ${errorData.message || response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

// Newsletter welcome email
export const sendNewsletterWelcomeEmail = async email => {
  const template = getEmailTemplate('newsletter', {
    email,
    unsubscribeUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://ozkancimenli.com'}/unsubscribe?email=${encodeURIComponent(email)}`,
    websiteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://ozkancimenli.com',
  });

  return await sendEmail(email, template.subject, template.htmlContent);
};

// Contact form notification email
export const sendContactNotificationEmail = async contactData => {
  const template = getEmailTemplate('notification', contactData);

  return await sendEmail(
    'cimenliozkan1@gmail.com',
    template.subject,
    template.htmlContent
  );
};

// Contact form auto-reply email
export const sendContactAutoReplyEmail = async contactData => {
  const template = getEmailTemplate('contact', {
    ...contactData,
    websiteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://ozkancimenli.com',
  });

  return await sendEmail(
    contactData.email,
    template.subject,
    template.htmlContent
  );
};
