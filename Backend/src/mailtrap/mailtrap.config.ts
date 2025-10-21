import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.MAILTRAP_SMTP_USER || !process.env.MAILTRAP_SMTP_PASS) {
  throw new Error("Mailtrap SMTP credentials not set. Add MAILTRAP_SMTP_USER and MAILTRAP_SMTP_PASS to your .env file.");
}

export const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_SMTP_USER,
    pass: process.env.MAILTRAP_SMTP_PASS
  }
});

export const sender = {
  email: "firungu114@gmail.com",
  name: "E-Learning App",
};
