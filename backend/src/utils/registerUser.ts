// src/utils/registerUser.ts

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import prisma from './prisma.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

export const registerAccount = async (
    // consumer table
    firstName: string,
    familyName: string,
    idNum: string,
    gender: string,
    birthday: Date,

    // account table
    consumerid: number,
    username: string,
    hashedPwd: string,
    phonePrefix: string,
    phone: string,
    registerDay: Date
) => {
    const newConsumer = await prisma.consumer.create({
        data: {
            first_name: firstName,
            family_name: familyName,
            id_number: idNum,
            gender: gender,
            birthday: birthday,
        },
    });

    // const newAccount = await prisma.console.log(newConsumer);
};
