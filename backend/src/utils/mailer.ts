// src/utils/mailer.ts

import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const nodemailer = require('nodemailer');

// Create a transporter using SMTP
export const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: Boolean(process.env.EMAIL_SECURITY), // use STARTTLS (upgrade connection to TLS after connecting)
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const emailTransporter = async (
    source: string,
    destination: [],
    subject: string,
    HTML: string
) => {
    const info = await transporter.sendMail({
        from: process.env.EMAIL_ADDRESS, // sender address
        to: destination, // list of recipients
        subject: subject, // subject line
        // text: 'Hello world?', // plain text body
        html: HTML, // HTML body
    });

    return info;
};

export const verifyAccessibility = async () => {
    // varify email service accessibility
    try {
        await transporter.verify();
        console.log('Server is ready to take our messages');
    } catch (err) {
        console.error('Verification failed:', err);
    }
};
