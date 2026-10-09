import { useRef, useState } from 'react';
import type { ClipboardEvent, FormEvent, KeyboardEvent } from 'react';
import { EmailInput } from '../../inputs/Emailinput/EmailInput';
import './VerifyEmail.css';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface VerifyEmailProps {
    /** Heading shown at the top of the card. */
    title?: string;
    /** Short supporting line under the heading. */
    subtitle?: string;
    /** Number of digits in the one-time code. Default 6. */
    codeLength?: number;
    sendCodeLabel?: string;
    resendCodeLabel?: string;
    verifyLabel?: string;
    /** Helper text above the code boxes. Defaults to a code-length sentence. */
    codeHint?: string;
    /** Called when the user requests the one-time code. */
    onSendCode?: (email: string) => void;
    /** Called when the code is submitted. */
    onVerify?: (email: string, code: string) => void;
    className?: string;
}

type FieldErrors = { email?: string; code?: string };

function CodeInput({
    length,
    value,
    onChange,
    error,
}: {
    length: number;
    value: string;
    onChange: (value: string) => void;
    error?: string;
}) {
    const refs = useRef<(HTMLInputElement | null)[]>([]);

    const setDigit = (index: number, raw: string) => {
        const digit = raw.replace(/\D/g, '').slice(-1);
        const chars = value.split('');
        chars[index] = digit;
        onChange(chars.join(''));
        if (digit && index < length - 1) refs.current[index + 1]?.focus();
    };

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !value[index] && index > 0) {
            refs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
        onChange(text);
        const target = text.length === length ? length - 1 : text.length;
        refs.current[target]?.focus();
    };

    return (
        <div className="verify__code">
            {Array.from({ length }).map((_, i) => (
                <input
                    key={i}
                    ref={(el) => {
                        refs.current[i] = el;
                    }}
                    className={`verify__code-box${error ? ' verify__code-box--error' : ''}`}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={2}
                    value={value[i] ?? ''}
                    onChange={(e) => setDigit(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    onPaste={handlePaste}
                    aria-label={`Digit ${i + 1} of ${length}`}
                />
            ))}
        </div>
    );
}

export function VerifyEmail({
    title = 'Verify your email',
    subtitle,
    codeLength = 6,
    sendCodeLabel = 'Send code',
    resendCodeLabel = 'Resend code',
    verifyLabel = 'Verify',
    codeHint,
    onSendCode,
    onVerify,
    className,
}: VerifyEmailProps) {
    const length = Math.max(1, codeLength);

    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [codeSent, setCodeSent] = useState(false);
    const [errors, setErrors] = useState<FieldErrors>({});

    const emailRef = useRef<HTMLInputElement>(null);

    const validateEmail = (value: string): string | undefined => {
        const v = value.trim();
        if (!v) return 'Enter your email address.';
        if (!EMAIL_RE.test(v)) return 'Enter a valid email address.';
        return undefined;
    };

    const handleSendCode = () => {
        const emailError = validateEmail(email);
        if (emailError) {
            setErrors((p) => ({ ...p, email: emailError }));
            emailRef.current?.focus();
            return;
        }
        setErrors((p) => ({ ...p, email: undefined }));
        setCodeSent(true);
        onSendCode?.(email.trim());
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const codeError = code.length === length ? undefined : `Enter the ${length}-digit code.`;
        setErrors((p) => ({ ...p, code: codeError }));
        if (codeError) return;
        onVerify?.(email.trim(), code);
    };

    const hint = codeHint ?? `Enter the ${length}-digit code sent to your email.`;

    return (
        <div className={`verify${className ? ` ${className}` : ''}`}>
            <div className="verify__card">
                <header className="verify__header">
                    <h1 className="verify__title">{title}</h1>
                    {subtitle && <p className="verify__subtitle">{subtitle}</p>}
                </header>

                <form className="verify__form" onSubmit={handleSubmit} noValidate>
                    <EmailInput
                        label="Email"
                        id="verify-email"
                        value={email}
                        onChange={(v) => {
                            setEmail(v);
                            if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
                        }}
                        error={errors.email}
                        inputRef={emailRef}
                    />

                    <button type="button" className="verify__send" onClick={handleSendCode}>
                        {codeSent ? resendCodeLabel : sendCodeLabel}
                    </button>

                    {/* One-time code — always present, directly under the email */}
                    <div className="verify__code-block">
                        <p className="verify__hint">{hint}</p>
                        <CodeInput
                            length={length}
                            value={code}
                            onChange={(v) => {
                                setCode(v);
                                if (errors.code) setErrors((p) => ({ ...p, code: undefined }));
                            }}
                            error={errors.code}
                        />
                        {errors.code && <p className="verify__error">{errors.code}</p>}
                    </div>

                    <button type="submit" className="verify__primary">
                        {verifyLabel}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default VerifyEmail;
