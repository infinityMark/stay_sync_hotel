import { useState } from 'react';
import type { RefObject } from 'react';
import './PasswordInput.css';

interface PasswordStrength {
    /** 0..4 — number of filled meter bars. */
    score: number;
    label: string;
}

function passwordStrength(value: string): PasswordStrength {
    if (!value) return { score: 0, label: '' };

    let score = 0;
    if (value.length >= 8) score += 1;
    if (value.length >= 12) score += 1;
    if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score += 1;
    if (/\d/.test(value)) score += 1;
    if (/[^A-Za-z0-9]/.test(value)) score += 1;
    score = Math.min(4, score);

    const labels = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];
    return { score, label: labels[score] };
}

export interface PasswordInputProps {
    /** Floating label text. Default "Password". */
    label?: string;
    /** Controlled value (the user's typed password). */
    value?: string;
    /** Called with the new value on change. */
    onChange?: (value: string) => void;
    /** Called when the input loses focus. */
    onBlur?: () => void;
    /** Id for the input; also used to link the error message. Default "password". */
    id?: string;
    name?: string;
    required?: boolean;
    /** Error message; when present, the field renders in its alert (red) state. */
    error?: string;
    /** Ref forwarded to the underlying <input>. */
    inputRef?: RefObject<HTMLInputElement>;
    /** Show the strength meter while the user types. Default `true`. */
    showStrength?: boolean;
    autoComplete?: string;
}

export function PasswordInput({
    label = 'Password',
    value,
    onChange,
    onBlur,
    id = 'password',
    name,
    required,
    error,
    inputRef,
    showStrength = true,
    autoComplete = 'new-password',
}: PasswordInputProps) {
    const [show, setShow] = useState(false);
    const strength = passwordStrength(value ?? '');
    const invalid = Boolean(error);

    return (
        <div className="password-input">
            <div className="password-input__group">
                <input
                    ref={inputRef}
                    type={show ? 'text' : 'password'}
                    required={required}
                    name={name}
                    id={id}
                    autoComplete={autoComplete}
                    className={`password-input__input${value ? ' password-input__input--has-value' : ''}${invalid ? ' password-input__input--error' : ''}`}
                    value={value}
                    onChange={(e) => onChange?.(e.target.value)}
                    onBlur={onBlur}
                    aria-invalid={invalid ? true : undefined}
                    aria-describedby={error ? `${id}-error` : undefined}
                />
                <label className="password-input__label">{label}</label>
                <button
                    type="button"
                    className="password-input__toggle"
                    onClick={() => setShow((prev) => !prev)}
                    aria-pressed={show}
                    aria-label={show ? 'Hide password' : 'Show password'}
                >
                    {show ? 'Hide' : 'Show'}
                </button>
            </div>

            {showStrength && (value ?? '').length > 0 && (
                <div className="password-input__strength">
                    <div className="password-input__strength-bars" aria-hidden="true">
                        {[0, 1, 2, 3].map((i) => (
                            <span
                                key={i}
                                className={
                                    i < strength.score
                                        ? 'password-input__strength-bar password-input__strength-bar--filled'
                                        : 'password-input__strength-bar'
                                }
                            />
                        ))}
                    </div>
                    <span className="password-input__strength-label">{strength.label}</span>
                </div>
            )}

            {error && (
                <p className="password-input__message" id={`${id}-error`}>
                    {error}
                </p>
            )}
        </div>
    );
}

export default PasswordInput;
