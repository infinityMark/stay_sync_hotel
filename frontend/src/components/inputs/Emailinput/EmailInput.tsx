import { useState } from 'react';
import type { RefObject } from 'react';
import './EmailInput.css';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface EmailInputProps {
    /** Floating label text. Default "Email". */
    label?: string;
    /** Controlled value. */
    value?: string;
    /** Called with the new value on change. */
    onChange?: (value: string) => void;
    /** Called when the input loses focus. */
    onBlur?: () => void;
    /** Id for the input; also used to link the error message. Default "email". */
    id?: string;
    name?: string;
    required?: boolean;
    /** External error message; when present it overrides the built-in check. */
    error?: string;
    /** Ref forwarded to the underlying <input>. */
    inputRef?: RefObject<HTMLInputElement>;
}

export function EmailInput({
    label = 'Email',
    value,
    onChange,
    onBlur,
    id = 'email',
    name,
    required,
    error,
    inputRef,
}: EmailInputProps) {
    const [touched, setTouched] = useState(false);

    // Format check runs after the field is first blurred, then live.
    const trimmed = (value ?? '').trim();
    const formatInvalid = touched && trimmed !== '' && !EMAIL_RE.test(trimmed);

    const message = error ?? (formatInvalid ? 'Enter a valid email address.' : undefined);
    const invalid = Boolean(message);

    return (
        <div className="email-input">
            <div className="email-input__group">
                <input
                    ref={inputRef}
                    type="email"
                    required={required}
                    name={name}
                    id={id}
                    autoComplete="email"
                    className={`email-input__input${value ? ' email-input__input--has-value' : ''}${invalid ? ' email-input__input--error' : ''}`}
                    value={value}
                    onChange={(e) => onChange?.(e.target.value)}
                    onBlur={() => {
                        setTouched(true);
                        onBlur?.();
                    }}
                    aria-invalid={invalid ? true : undefined}
                    aria-describedby={message ? `${id}-error` : undefined}
                />
                <label className="email-input__label">{label}</label>
            </div>
            {message && (
                <p className="email-input__message" id={`${id}-error`}>
                    {message}
                </p>
            )}
        </div>
    );
}

export default EmailInput;
