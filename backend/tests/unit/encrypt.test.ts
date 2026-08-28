// tests/unit/encrypt.test.ts
import { describe, it, expect } from 'vitest';
import { hashPassword, comparePassword } from '../../src/utils/encrypt';

describe('🔐 Encryption Utility Tests (Encrypt Utils)', () => {
    const plainPassword = 'MySecurePwd123!';

    it('1. hashPassword should return a string (hash value)', async () => {
        const hashed = await hashPassword(plainPassword);
        expect(typeof hashed).toBe('string');
        expect(hashed.length).toBeGreaterThan(20); // bcrypt hashes are usually quite long
    });

    it('2. The same password should generate different hashes each time (random salt)', async () => {
        const hash1 = await hashPassword(plainPassword);
        const hash2 = await hashPassword(plainPassword);
        expect(hash1).not.toBe(hash2);
    });

    it('3. Comparing the correct password should return true', async () => {
        const hashed = await hashPassword(plainPassword);
        const result = await comparePassword(plainPassword, hashed);
        expect(result).toBe(true);
    });

    it('4. Comparing an incorrect password should return false', async () => {
        const hashed = await hashPassword(plainPassword);
        const result = await comparePassword('WrongPassword', hashed);
        expect(result).toBe(false);
    });
});
