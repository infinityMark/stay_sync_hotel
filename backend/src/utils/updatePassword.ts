// src/utils/updatePassword.ts
import prisma from './prisma.js';
import { hashPassword } from './encrypt.js';

export const updatePasswordUtil = async (email: string, newPassword: string) => {
    const hashedNewPassword: string = await hashPassword(newPassword);

    prisma.account.update({
        where: { email: email },
        data: { password: hashedNewPassword },
    });
};
