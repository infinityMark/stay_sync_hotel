import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { EmailInput } from '../../inputs/Emailinput/EmailInput';
import { PasswordInput } from '../../inputs/PasswordInput/PasswordInput';
import './Login.css';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface LoginValues {
    email: string;
    password: string;
    rememberMe: boolean;
}

export interface LoginProps {
    /** Heading shown at the top of the card. */
    title?: string;
    /** Short supporting line under the heading. */
    subtitle?: string;
    /** Called with the validated values when the form is submitted successfully. */
    onSubmit?: (values: LoginValues) => void;
    /** Called when the "Forgot password?" link is clicked. */
    onForgotPassword?: () => void;
    /** Called when the "Sign up" link is clicked. */
    onSignUp?: () => void;
    /** Text for the submit button. */
    submitLabel?: string;
    /** Label of the forgot-password link. */
    forgotPasswordLabel?: string;
    /** Prompt shown before the sign-up link. */
    signUpPrompt?: string;
    /** Label of the sign-up link. */
    signUpLabel?: string;
    className?: string;
}

type FieldErrors = { email?: string; password?: string };

export function Login({
    title = 'Welcome back',
    subtitle,
    onSubmit,
    onForgotPassword,
    onSignUp,
    submitLabel = 'Sign in',
    forgotPasswordLabel = 'Forgot password?',
    signUpPrompt = "Don't have an account?",
    signUpLabel = 'Sign up',
    className,
}: LoginProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [errors, setErrors] = useState<FieldErrors>({});
    const [submitted, setSubmitted] = useState(false);

    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const validateEmail = (value: string): string | undefined => {
        const v = value.trim();
        if (!v) return 'Enter your email address.';
        if (!EMAIL_RE.test(v)) return 'Enter a valid email address.';
        return undefined;
    };

    const validatePassword = (value: string): string | undefined =>
        value ? undefined : 'Enter your password.';

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitted(true);

        const next: FieldErrors = {
            email: validateEmail(email),
            password: validatePassword(password),
        };
        setErrors(next);

        if (next.email) {
            emailRef.current?.focus();
            return;
        }
        if (next.password) {
            passwordRef.current?.focus();
            return;
        }

        onSubmit?.({ email: email.trim(), password, rememberMe });
    };

    return (
        <div className={`login${className ? ` ${className}` : ''}`}>
            <div className="login__card">
                <header className="login__header">
                    <h1 className="login__title">{title}</h1>
                    {subtitle && <p className="login__subtitle">{subtitle}</p>}
                </header>

                <form className="login__form" onSubmit={handleSubmit} noValidate>
                    <EmailInput
                        label="Email"
                        id="login-email"
                        value={email}
                        onChange={(v) => {
                            setEmail(v);
                            if (submitted) setErrors((p) => ({ ...p, email: validateEmail(v) }));
                        }}
                        onBlur={() => {
                            if (submitted)
                                setErrors((p) => ({ ...p, email: validateEmail(email) }));
                        }}
                        error={errors.email}
                        inputRef={emailRef}
                    />

                    <PasswordInput
                        label="Password"
                        id="login-password"
                        value={password}
                        onChange={(v) => {
                            setPassword(v);
                            if (submitted)
                                setErrors((p) => ({ ...p, password: validatePassword(v) }));
                        }}
                        onBlur={() => {
                            if (submitted)
                                setErrors((p) => ({
                                    ...p,
                                    password: validatePassword(password),
                                }));
                        }}
                        error={errors.password}
                        inputRef={passwordRef}
                    />

                    <div className="login__row">
                        <label className="login__remember">
                            <input
                                type="checkbox"
                                className="login__checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            Remember me
                        </label>
                        <button type="button" className="login__forgot" onClick={onForgotPassword}>
                            {forgotPasswordLabel}
                        </button>
                    </div>

                    <button type="submit" className="login__submit">
                        {submitLabel}
                    </button>
                </form>

                <p className="login__signup">
                    {signUpPrompt}{' '}
                    <button type="button" className="login__signup-link" onClick={onSignUp}>
                        {signUpLabel}
                    </button>
                </p>
            </div>
        </div>
    );
}

export default Login;
