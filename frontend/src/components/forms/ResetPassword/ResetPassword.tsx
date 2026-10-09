import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { PasswordInput } from '../../inputs/PasswordInput/PasswordInput';
import './ResetPassword.css';

export interface ResetPasswordProps {
    /** Heading shown at the top of the card. */
    title?: string;
    /** Short supporting line under the heading. */
    subtitle?: string;
    resetLabel?: string;
    /** Called when the new password is submitted successfully. */
    onResetPassword?: (newPassword: string) => void;
    className?: string;
}

type FieldErrors = { newPassword?: string; confirmPassword?: string };

export function ResetPassword({
    title = 'Reset password',
    subtitle,
    resetLabel = 'Reset password',
    onResetPassword,
    className,
}: ResetPasswordProps) {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<FieldErrors>({});

    const newPasswordRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null);

    const validateNew = (value: string): string | undefined => {
        if (!value) return 'Enter your new password.';
        if (value.length < 8) return 'Password must be at least 8 characters.';
        return undefined;
    };

    const validateConfirm = (value: string): string | undefined => {
        if (!value) return 'Confirm your new password.';
        if (value !== newPassword) return 'Passwords do not match.';
        return undefined;
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const next: FieldErrors = {
            newPassword: validateNew(newPassword),
            confirmPassword: validateConfirm(confirmPassword),
        };
        setErrors(next);

        if (next.newPassword) {
            newPasswordRef.current?.focus();
            return;
        }
        if (next.confirmPassword) {
            confirmPasswordRef.current?.focus();
            return;
        }

        onResetPassword?.(newPassword);
    };

    return (
        <div className={`reset${className ? ` ${className}` : ''}`}>
            <div className="reset__card">
                <header className="reset__header">
                    <h1 className="reset__title">{title}</h1>
                    {subtitle && <p className="reset__subtitle">{subtitle}</p>}
                </header>

                <form className="reset__form" onSubmit={handleSubmit} noValidate>
                    <PasswordInput
                        label="New password"
                        id="reset-new"
                        value={newPassword}
                        onChange={(v) => {
                            setNewPassword(v);
                            if (errors.newPassword)
                                setErrors((p) => ({ ...p, newPassword: undefined }));
                        }}
                        error={errors.newPassword}
                        inputRef={newPasswordRef}
                    />

                    <PasswordInput
                        label="Confirm password"
                        id="reset-confirm"
                        value={confirmPassword}
                        onChange={(v) => {
                            setConfirmPassword(v);
                            if (errors.confirmPassword)
                                setErrors((p) => ({ ...p, confirmPassword: undefined }));
                        }}
                        error={errors.confirmPassword}
                        inputRef={confirmPasswordRef}
                        showStrength={false}
                    />

                    <button type="submit" className="reset__primary">
                        {resetLabel}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ResetPassword;
