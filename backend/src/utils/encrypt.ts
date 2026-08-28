// src/utils/encrypt.ts
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS_NUMBER);

/**
 * Encrypt the plaintext password
 * @param plainPassword The original password passed in by the user
 * @returns Returns the encrypted hash string
 */
export const hashPassword = async (plainPassword: string): Promise<string> => {
    return await bcrypt.hash(plainPassword, SALT_ROUNDS);
};

/**
 * Compares the plaintext password with the hashed password in the database.
 * @param plainPassword The plaintext password passed in by the user.
 * @param hashedPassword The hashed password stored in the database.
 * @returns boolean
 */
export const comparePassword = async (
    plainPassword: string,
    hashedPassword: string
): Promise<boolean> => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};
