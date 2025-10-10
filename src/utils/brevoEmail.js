const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

export const sendEmail = async (to, subject, htmlContent, textContent = null) => {
  try {
    const response = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: 'Ozkan Cimenli',
          email: 'info@ozkancimenli.com'
        },
        to: Array.isArray(to) ? to : [{ email: to }],
        subject: subject,
        htmlContent: htmlContent,
        textContent: textContent || htmlContent.replace(/<[^>]*>/g, ''),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Brevo API error: ${errorData.message || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

// Newsletter welcome email
export const sendNewsletterWelcomeEmail = async (email) => {
  const subject = 'Welcome to Ozkan\'s Newsletter! 🎉';
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #333; text-align: center;">Welcome to Ozkan's Newsletter!</h2>
      <p>Thank you for subscribing to my personal newsletter! You'll now receive:</p>
      <ul>
        <li>Latest web development insights</li>
        <li>Personal coding tips and tricks</li>
        <li>Project updates and case studies</li>
        <li>Technology trends and tutorials</li>
      </ul>
      <p>I'm excited to have you on board!</p>
      <p>Best regards,<br>Ozkan Cimenli</p>
    </div>
  `;
  
  return await sendEmail(email, subject, htmlContent);
};

// Contact form notification email
export const sendContactNotificationEmail = async (contactData) => {
  const subject = `New Contact Form Submission from ${contactData.name}`;
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #333;">New Contact Form Submission</h2>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Name:</strong> ${contactData.name}</p>
        <p><strong>Email:</strong> ${contactData.email}</p>
        ${contactData.phone ? `<p><strong>Phone:</strong> ${contactData.phone}</p>` : ''}
        <p><strong>Message:</strong></p>
        <p style="background-color: white; padding: 10px; border-radius: 3px; border-left: 3px solid #007bff;">
          ${contactData.details || 'No message provided'}
        </p>
      </div>
      <p>Please respond to this inquiry as soon as possible.</p>
    </div>
  `;
  
  return await sendEmail('cimenliozkan1@gmail.com', subject, htmlContent);
};

// Contact form auto-reply email
export const sendContactAutoReplyEmail = async (contactData) => {
  const subject = 'Thank you for contacting Ozkan!';
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #333;">Thank you for reaching out!</h2>
      <p>Hi ${contactData.name},</p>
      <p>Thank you for reaching out to me. I have received your message and will get back to you as soon as possible.</p>
      <p>Here's a summary of your inquiry:</p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Subject:</strong> Contact Form Submission</p>
        <p><strong>Message:</strong> ${contactData.details || 'No message provided'}</p>
      </div>
      <p>I typically respond within 24 hours. If you have any urgent questions, please don't hesitate to reach out.</p>
      <p>Best regards,<br>Ozkan Cimenli</p>
    </div>
  `;
  
  return await sendEmail(contactData.email, subject, htmlContent);
};
