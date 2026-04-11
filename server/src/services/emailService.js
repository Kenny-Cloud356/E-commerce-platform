const { transporter } = require("../config/email");
const logger = require("../config/logger");

const FROM = process.env.EMAIL_FROM || "noreply@store.com";

const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({ from: FROM, to, subject, html });
    logger.info(`Email sent to ${to}: ${subject}`);
  } catch (err) {
    logger.error(`Failed to send email to ${to}:`, err);
  }
};

const sendWelcome = async (user) => {
  await sendEmail({
    to: user.email,
    subject: "Welcome to our store!",
    html: `
      <h1>Welcome, ${user.name}!</h1>
      <p>Thank you for creating an account. Start shopping now!</p>
    `,
  });
};

const sendPasswordReset = async (user, resetUrl) => {
  await sendEmail({
    to: user.email,
    subject: "Password Reset Request",
    html: `
      <h1>Password Reset</h1>
      <p>You requested a password reset. Click the link below:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link expires in 1 hour. If you didn't request this, ignore this email.</p>
    `,
  });
};

const sendOrderConfirmation = async (user, order) => {
  await sendEmail({
    to: user.email,
    subject: `Order Confirmation #${order.id.slice(0, 8)}`,
    html: `
      <h1>Order Confirmed!</h1>
      <p>Hi ${user.name}, your order has been placed successfully.</p>
      <p><strong>Order ID:</strong> ${order.id}</p>
      <p><strong>Total:</strong> $${order.total}</p>
      <p>We'll notify you when your order ships.</p>
    `,
  });
};

module.exports = { sendWelcome, sendPasswordReset, sendOrderConfirmation };
