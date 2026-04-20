const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ toEmail, userName, appointmentId }) => {
  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'MediPlus <noreply@mediplus.app>',
      to: toEmail,
      subject: 'Appointment Confirmation - MediPlus',
      html: `
        <p>Dear <strong>${userName}</strong>,</p>
        <p>Your appointment has been successfully booked!</p>
        <p><strong>Appointment ID:</strong> ${appointmentId}</p>
        <p>We look forward to serving you at MediPlus.</p>
        <p>Regards,<br/>MediPlus Team</p>
      `
    });
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw error; // Must throw to handle in route
  }
};

module.exports = sendEmail;
