// src/services/userService.ts
import prisma from '../prisma';
import { hashPassword, comparePassword } from '../utils/encrypt';

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
