import { describe, it, expect } from 'vitest';
import { verifyAccessibility } from '../../src/utils/mailer';

describe('Mailer', () => {
    it('should verify email service', async () => {
        await expect(verifyAccessibility()).resolves.not.toThrow();
    });
});
