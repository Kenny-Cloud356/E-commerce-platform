const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.mailtrap.io",
  port: parseInt(process.env.SMTP_PORT, 10) || 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const verifyConnection = async () => {
  try {
    await transporter.verify();
    console.log("Email transporter ready");
  } catch (err) {
    console.warn("Email transporter not configured:", err.message);
  }
};

module.exports = { transporter, verifyConnection };
