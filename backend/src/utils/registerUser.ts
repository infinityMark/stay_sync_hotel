// src/utils/registerUser.ts
// import dotenv from 'dotenv';
// import path from 'path';
// import { fileURLToPath } from 'url';
import { hashPassword } from './encrypt.js';
import prisma from './prisma.js';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

export const registerAccount = async (
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
    const newConsumer = await prisma.consumer.create({
        data: {
            first_name: firstName,
            family_name: familyName,
            id_number: idNum,
            gender: gender,
            birthday: birthday,
        },
    });

    // Obtain new consumer ID
    const newConsumerID = newConsumer.consumerid;

    const hashPassowrd = await hashPassword(password);
    const registerDay: string = new Date().toISOString();

    const newAccount = await prisma.account.create({
        data: {
            consumerid: newConsumerID,
            username: username,
            password: hashPassowrd,
            email: email,
            phoneprefix: phonePrefix,
            phone: phone,
            register_day: registerDay,
        },
    });
};
