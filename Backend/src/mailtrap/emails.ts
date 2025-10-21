import {
	PASSWORD_RESET_REQUEST_TEMPLATE,
	PASSWORD_RESET_SUCCESS_TEMPLATE,
	PURCHASE_CONFIRMATION_TEMPLATE,
	VERIFICATION_EMAIL_TEMPLATE,
	WELCOME_EMAIL_TEMPLATE,
} from "./emailTemplates";
import { transporter, sender } from "./mailtrap.config";

export const sendVerificationEmail = async (email: string, verificationToken: string) => {
	try {
		const mailOptions = {
			from: sender.email,
			to: email,
			subject: "Verify your email",
			html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
		};

		const response = await transporter.sendMail(mailOptions);

		console.log("Email sent successfully", response);
	} catch (error) {
		console.error(`Error sending verification`, error);

		throw new Error(`Error sending verification email: ${error}`);
	}
};

export const sendWelcomeEmail = async (email: string, name: string) => {
	try {
		const mailOptions = {
			from: sender.email,
			to: email,
			subject: "Welcome to Auth Company",
			html: WELCOME_EMAIL_TEMPLATE.replace("{company_info_name}", "Auth Company").replace("{name}", name),
		};

		const response = await transporter.sendMail(mailOptions);

		console.log("Welcome email sent successfully", response);
	} catch (error) {
		console.error(`Error sending welcome email`, error);

		throw new Error(`Error sending welcome email: ${error}`);
	}
};

export const sendPasswordResetEmail = async (email: string, resetURL: string) => {
	try {
		const mailOptions = {
			from: sender.email,
			to: email,
			subject: "Reset your password",
			html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
		};

		const response = await transporter.sendMail(mailOptions);

		console.log("Password reset email sent successfully", response);
	} catch (error) {
		console.error(`Error sending password reset email`, error);

		throw new Error(`Error sending password reset email: ${error}`);
	}
};

export const sendResetSuccessEmail = async (email: string) => {
	try {
		const mailOptions = {
			from: sender.email,
			to: email,
			subject: "Password Reset Successful",
			html: PASSWORD_RESET_SUCCESS_TEMPLATE,
		};

		const response = await transporter.sendMail(mailOptions);

		console.log("Password reset success email sent successfully", response);
	} catch (error) {
		console.error(`Error sending password reset success email`, error);

		throw new Error(`Error sending password reset success email: ${error}`);
	}
};

export const sendPurchaseConfirmationEmail = async (
	email: string,
	name: string,
	courseTitle: string,
	instructor: string,
	duration: string,
	level: string,
	message: string,
	courseLink: string
) => {
	try {
		const mailOptions = {
			from: sender.email,
			to: email,
			subject: "Course Purchase Confirmation - E-Learning Platform",
			html: PURCHASE_CONFIRMATION_TEMPLATE
				.replace("{name}", name)
				.replace("{courseTitle}", courseTitle)
				.replace("{instructor}", instructor)
				.replace("{duration}", duration)
				.replace("{level}", level)
				.replace("{message}", message)
				.replace("{courseLink}", courseLink),
		};

		const response = await transporter.sendMail(mailOptions);

		console.log("Purchase confirmation email sent successfully", response);
	} catch (error) {
		console.error(`Error sending purchase confirmation email`, error);

		throw new Error(`Error sending purchase confirmation email: ${error}`);
	}
};
