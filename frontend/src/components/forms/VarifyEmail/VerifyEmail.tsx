import { useEffect, useRef, useState } from 'react';
import type { ClipboardEvent, CSSProperties, FormEvent, KeyboardEvent } from 'react';
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
    /** Button label while the code is being checked. */
    verifyingLabel?: string;
    /** Helper text above the code boxes. Defaults to a code-length sentence. */
    codeHint?: string;
    /** Message shown when the code is rejected. */
    invalidCodeMessage?: string;
    /**
     * Webpage to navigate to once the code is verified — e.g. the
     * reset-password page. Without it, verification just settles.
     */
    redirectTo?: string;
    /**
     * Navigation hook. Defaults to `window.location.assign(url)`; pass your
     * router's push (e.g. `useNavigate()`) to navigate without a reload.
     */
    navigate?: (url: string) => void;
    /** Called when the user requests the one-time code. */
    onSendCode?: (email: string) => void;
    /**
     * Verifies the code. Return `false` (or throw) to refuse it; resolve with
     * anything else to accept it, which navigates to `redirectTo`.
     */
    onVerify?: (email: string, code: string) => void | boolean | Promise<void | boolean>;
    className?: string;
}

type FieldErrors = { email?: string; code?: string };

/** How many digits are currently filled in. */
const filledCount = (value: string) => value.replace(/\D/g, '').length;

function CodeInput({
    length,
    value,
    onChange,
    error,
    focusSignal,
}: {
    length: number;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    focusSignal: number;
}) {
    const refs = useRef<(HTMLInputElement | null)[]>([]);

    // Focus the first box when the parent asks — e.g. after a rejected code.
    useEffect(() => {
        if (focusSignal > 0) refs.current[0]?.focus();
    }, [focusSignal]);

    const setDigit = (index: number, raw: string) => {
        const digit = raw.replace(/\D/g, '').slice(-1);
        // Pad to a fixed length so every box keeps its own slot.
        const slots = Array.from({ length }, (_, i) => value[i] ?? '');
        slots[index] = digit;
        onChange(slots.join(''));
        if (digit && index < length - 1) refs.current[index + 1]?.focus();
    };

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !value[index]?.trim() && index > 0) {
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
        <div className="verify__code" style={{ '--verify-code-count': length } as CSSProperties}>
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
                    value={(value[i] ?? '').trim()}
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
    verifyingLabel = 'Verifying…',
    codeHint,
    invalidCodeMessage = "That code isn't right. Check your email and try again.",
    redirectTo,
    navigate,
    onSendCode,
    onVerify,
    className,
}: VerifyEmailProps) {
    const length = Math.max(1, codeLength);

    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [codeSent, setCodeSent] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [focusSignal, setFocusSignal] = useState(0);
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

    const goTo = (url: string) => {
        if (navigate) navigate(url);
        else window.location.assign(url);
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (verifying) return;

        const entered = code.replace(/\D/g, '');
        const codeError =
            filledCount(code) === length ? undefined : `Enter the ${length}-digit code.`;

        if (codeError) {
            setErrors((p) => ({ ...p, code: codeError }));
            setFocusSignal((n) => n + 1);
            return;
        }

        setErrors((p) => ({ ...p, code: undefined }));
        setVerifying(true);

        let accepted = true;
        try {
            accepted = (await onVerify?.(email.trim(), entered)) !== false;
        } catch {
            accepted = false;
        }

        if (!accepted) {
            setErrors((p) => ({ ...p, code: invalidCodeMessage }));
            setFocusSignal((n) => n + 1);
            setVerifying(false);
            return;
        }

        setVerifying(false);

        // Verified — go to the specified page.
        if (redirectTo) goTo(redirectTo);
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

                    <button
                        type="button"
                        className="verify__send"
                        onClick={handleSendCode}
                        disabled={verifying}
                    >
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
                            focusSignal={focusSignal}
                        />
                        {errors.code && (
                            <p className="verify__error" role="alert">
                                {errors.code}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="verify__primary"
                        disabled={verifying}
                        aria-busy={verifying}
                    >
                        {verifying ? verifyingLabel : verifyLabel}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default VerifyEmail;
