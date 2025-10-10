export const emailTemplates = {
  newsletter: {
    subject: 'Welcome to Ozkan\'s Newsletter! 🎉',
    template: (data) => `
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
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #666; text-align: center;">
          You received this email because you subscribed to our newsletter.<br>
          <a href="${data.unsubscribeUrl}" style="color: #666;">Unsubscribe</a> | 
          <a href="${data.websiteUrl}" style="color: #666;">Visit Website</a>
        </p>
      </div>
    `
  },
  contact: {
    subject: 'Thank you for contacting Ozkan!',
    template: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">Thank you for reaching out!</h2>
        <p>Hi ${data.name},</p>
        <p>Thank you for reaching out to me. I have received your message and will get back to you as soon as possible.</p>
        <p>Here's a summary of your inquiry:</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Subject:</strong> Contact Form Submission</p>
          <p><strong>Message:</strong> ${data.details || 'No message provided'}</p>
        </div>
        <p>I typically respond within 24 hours. If you have any urgent questions, please don't hesitate to reach out.</p>
        <p>Best regards,<br>Ozkan Cimenli</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #666; text-align: center;">
          This is an automated response. Please do not reply to this email.<br>
          <a href="${data.websiteUrl}" style="color: #666;">Visit Website</a>
        </p>
      </div>
    `
  },
  notification: {
    subject: 'New Contact Form Submission from {name}',
    template: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">New Contact Form Submission</h2>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
          <p><strong>Message:</strong></p>
          <p style="background-color: white; padding: 10px; border-radius: 3px; border-left: 3px solid #007bff;">
            ${data.details || 'No message provided'}
          </p>
        </div>
        <p>Please respond to this inquiry as soon as possible.</p>
        <p>Best regards,<br>Website System</p>
      </div>
    `
  }
};

export const getEmailTemplate = (type, data = {}) => {
  const template = emailTemplates[type];
  if (!template) {
    throw new Error(`Email template '${type}' not found`);
  }
  
  return {
    subject: template.subject.replace('{name}', data.name || 'User'),
    htmlContent: template.template(data)
  };
};
