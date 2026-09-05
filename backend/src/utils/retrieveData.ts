// src/utils/retrieveData.ts
import prisma from './prisma.js';

export const retrievePasswordUtil = async (email: string): Promise<string> => {
    const account = await prisma.account.findUnique({ where: { email: email } });
    return account?.password ?? '';
};
