// tests/unit/encrypt.test.ts
import { describe, it, expect } from 'vitest';
import { hashPassword, comparePassword } from '../../src/utils/encrypt';

describe('🔐 加密工具测试 (Encrypt Utils)', () => {
    const plainPassword = 'MySecurePwd123!';

    it('1. hashPassword 应该返回一个字符串（哈希值）', async () => {
        const hashed = await hashPassword(plainPassword);
        expect(typeof hashed).toBe('string');
        expect(hashed.length).toBeGreaterThan(20); // bcrypt 哈希通常很长
    });

    it('2. 同一密码每次生成的哈希值不同（盐值随机）', async () => {
        const hash1 = await hashPassword(plainPassword);
        const hash2 = await hashPassword(plainPassword);
        expect(hash1).not.toBe(hash2);
    });

    it('3. 正确密码比对应返回 true', async () => {
        const hashed = await hashPassword(plainPassword);
        const result = await comparePassword(plainPassword, hashed);
        expect(result).toBe(true);
    });

    it('4. 错误密码比对应返回 false', async () => {
        const hashed = await hashPassword(plainPassword);
        const result = await comparePassword('WrongPassword', hashed);
        expect(result).toBe(false);
    });
});
