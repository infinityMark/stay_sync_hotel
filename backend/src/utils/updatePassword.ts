// src/utils/updatePassword.ts
import prisma from './prisma.js';
import { hashPassword, comparePassword } from './encrypt.js';
import { retrievePasswordUtil } from './retrieveData.js';

export const updatePasswordUtil = async (email: string, newPassword: string) => {
    const hashedNewPassword: string = await hashPassword(newPassword);
    prisma.account.update({
        where: { email: email },
        data: { password: hashedNewPassword },
    });
};

export const isSamePasswordUtil = async (
    email: string,
    inputPassword: string
): Promise<Boolean> => {
    const storedPassword: string = await retrievePasswordUtil(email);
    return await comparePassword(inputPassword, storedPassword);
};
