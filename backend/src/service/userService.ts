// src/services/userService.ts
import prisma from '../prisma.js';
import { comparePassword } from '../utils/encrypt.js';
import { emailTransporter, verifyAccessibility } from '../utils/mailer.js';
import { registerAccount } from '../utils/registerUser.js';
import { updatePasswordUtil } from '../utils/updatePassword.js';

// Account relative
export const verifyUser = async (email: string, password: string) => {
    const storedPwd = '1'; //retrive pwd from DB
    const isPassed = await comparePassword(storedPwd, password);
    return { verify: isPassed };
};

export const registerUser = async (
    // consumer table
    firstName: string,
    familyName: string,
    idNum: string,
    gender: string,
    birthday: Date,

    // account table
    username: string,
    password: string,
    email: string,
    phonePrefix: string,
    phone: string
) => {
    try {
        prisma.$transaction(async () => {
            await registerAccount(
                // consumer table
                firstName,
                familyName,
                idNum,
                gender,
                birthday,

                // account table
                username,
                password,
                email,
                phonePrefix,
                phone
            );
        });
        console.log('Registration successfully.');
    } catch (error) {
        console.log('Registration failed:\n' + error + '\n');
    }
};

export const updatePassword = async (email: string, newPassword: string) => {
    try {
        prisma.$transaction(async () => {
            updatePasswordUtil(email, newPassword);
        });
    } catch (error) {
        console.log('Update password failed:\n' + error);
    }
};

// System function relative
export const transportEmail = async (
    source: string,
    destination: [],
    subject: string,
    HTML: string
) => {
    // varify email service accessibility
    verifyAccessibility();

    // send email actin
    try {
        const result = await emailTransporter(source, destination, subject, HTML);

        console.log('Message sent: %s', result.messageId);
    } catch (err) {
        console.error('Error while sending mail:', err);
    }
};
