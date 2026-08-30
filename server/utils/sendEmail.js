/**
 * sendEmail.js — Generic Brevo SMTP email sender
 * Used for one-off transactional emails (password reset, etc.)
 */
import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.BREVO_SMTP_USER,
      pass: process.env.BREVO_SMTP_KEY,
    },
  });

  const mailOptions = {
    from: `"${process.env.BREVO_FROM_NAME || 'EmberGas'}" <${process.env.BREVO_FROM_EMAIL || 'no-reply@embergas.ng'}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
    text: options.text,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
