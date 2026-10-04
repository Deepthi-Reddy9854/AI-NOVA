const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  let transporter;

  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  } else {
    // Development Fallback: Ethereal / Test Transporter
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
  }

  const message = {
    from: `"${process.env.FROM_NAME || 'Nova AI Support'}" <${process.env.FROM_EMAIL || 'noreply@nova.ai'}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html || `
      <div style="font-family: Arial, sans-serif; background-color: #0b0f19; color: #f1f5f9; padding: 30px; border-radius: 16px;">
        <h2 style="color: #38bdf8;">Nova.AI - Password Reset Request</h2>
        <p>You requested a password reset for your Nova AI student account.</p>
        <p>Click the button below to set a new password. This link is valid for 1 hour:</p>
        <div style="margin: 24px 0;">
          <a href="${options.resetUrl}" style="background: linear-gradient(90deg, #6366f1, #06b6d4); color: white; padding: 12px 24px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block;">
            Reset Password Now
          </a>
        </div>
        <p style="font-size: 12px; color: #94a3b8;">If you did not request a password reset, please ignore this email.</p>
      </div>
    `
  };

  const info = await transporter.sendMail(message);

  if (nodemailer.getTestMessageUrl(info)) {
    console.log('[Email Preview URL]:', nodemailer.getTestMessageUrl(info));
  }

  return info;
};

module.exports = sendEmail;
