// src/services/userService.ts
import prisma from '../prisma';
import { hashPassword, comparePassword } from '../utils/encrypt';
import { transporter, emailTransporter, verifyAccessibility } from '../utils/mailer';
// const nodemailer = require('nodemailer');

// Account relative
export const registerUser = async (email: string, password: string) => {
    const hashedPwd = await hashPassword(password);
    return { email, password: hashedPwd };
};

export const verifyUser = async (email: string, password: string) => {
    const storedPwd = '1'; //retrive pwd from DB
    const isPassed = await comparePassword(storedPwd, password);
    return { verify: isPassed };
};

export const registerAccount = async () => {};

// System function relative
export const transportEmail = async (
    source: string,
    destination: [],
    subject: string,
    HTML: string
) => {
    // varify email service accessibility
    verifyAccessibility();
    // try {
    //     await transporter.verify();
    //     console.log('Server is ready to take our messages');
    // } catch (err) {
    //     console.error('Verification failed:', err);
    // }

    // send email actin
    try {
        const result = await emailTransporter(source, destination, subject, HTML);

        console.log('Message sent: %s', result.messageId);
        // Preview URL is only available when using an Ethereal test account
        // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    } catch (err) {
        console.error('Error while sending mail:', err);
    }
};
