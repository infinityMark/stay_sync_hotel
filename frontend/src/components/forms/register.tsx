import { useRef, useState } from 'react';
import type { FormEvent, ReactNode, RefObject } from 'react';
import { Input1 } from '../Input1';
import './RegisterAccount.css';

export interface RegisterAccountValues {
    firstName: string;
    familyName: string;
    username: string;
    email: string;
    phonePrefix: string;
    phoneNumber: string;
    gender: string;
    birthday: string; // ISO date "yyyy-mm-dd"
    password: string;
    confirmPassword: string;
    acceptTerms: boolean;
}

export interface RegisterAccountProps {
    /** Heading shown at the top of the card. */
    title?: string;
    /** Short supporting line under the heading. */
    subtitle?: string;
    /** Called with the validated values when the form is submitted successfully. */
    onSubmit?: (values: RegisterAccountValues) => void;
    /** Called when the "Sign in" link is clicked. */
    onSignIn?: () => void;
    /** Text for the submit button. */
    submitLabel?: string;
    /** Full consent-label content; defaults to a "Terms of Service / Privacy Policy" sentence. */
    termsLabel?: ReactNode;
    /** Link target for the default Terms of Service anchor. */
    termsHref?: string;
    /** Link target for the default Privacy Policy anchor. */
    privacyHref?: string;
    /** Show the password strength meter. Default `true`. */
    showPasswordStrength?: boolean;
    /** Prompt shown before the sign-in link. */
    signInPrompt?: string;
    /** Label of the sign-in link. */
    signInLabel?: string;
    /** Options for the gender select, as `{ value, label }` pairs. */
    genderOptions?: { value: string; label: string }[];
    className?: string;
}

type FieldKey = keyof RegisterAccountValues;
type FieldErrors = Partial<Record<FieldKey, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_RE = /^[a-zA-Z0-9_]+$/;
const PHONE_PREFIX_RE = /^\+?\d{1,4}$/;
const PHONE_NUMBER_RE = /^[\d\s\-()]{6,20}$/;

const DEFAULT_GENDER_OPTIONS = [
    { value: 'female', label: 'Female' },
    { value: 'male', label: 'Male' },
    { value: 'non-binary', label: 'Non-binary' },
    { value: 'prefer-not-to-say', label: 'Prefer not to say' },
];

function todayISO(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
        d.getDate()
    ).padStart(2, '0')}`;
}

function validateField(field: FieldKey, values: RegisterAccountValues): string | undefined {
    switch (field) {
        case 'firstName': {
            const name = values.firstName.trim();
            if (!name) return 'Enter your first name.';
            if (name.length < 2) return 'First name must be at least 2 characters.';
            return undefined;
        }
        case 'familyName': {
            const name = values.familyName.trim();
            if (!name) return 'Enter your family name.';
            if (name.length < 2) return 'Family name must be at least 2 characters.';
            return undefined;
        }
        case 'username': {
            const name = values.username.trim();
            if (!name) return 'Choose a username.';
            if (name.length < 3) return 'Username must be at least 3 characters.';
            if (!USERNAME_RE.test(name)) return 'Use only letters, numbers, and underscores.';
            return undefined;
        }
        case 'email': {
            const email = values.email.trim();
            if (!email) return 'Enter your email address.';
            if (!EMAIL_RE.test(email)) return 'Enter a valid email address.';
            return undefined;
        }
        case 'phonePrefix': {
            const prefix = values.phonePrefix.trim();
            if (!prefix) return 'Enter a country code.';
            if (!PHONE_PREFIX_RE.test(prefix)) return 'Use a code like +86.';
            return undefined;
        }
        case 'phoneNumber': {
            const number = values.phoneNumber.trim();
            if (!number) return 'Enter your phone number.';
            if (!PHONE_NUMBER_RE.test(number)) return 'Enter a valid phone number.';
            return undefined;
        }
        case 'gender': {
            if (!values.gender) return 'Select your gender.';
            return undefined;
        }
        case 'birthday': {
            if (!values.birthday) return 'Enter your birthday.';
            if (values.birthday > todayISO()) return "Birthday can't be in the future.";
            if (values.birthday < '1900-01-01') return 'Enter a valid birthday.';
            return undefined;
        }
        case 'password': {
            if (!values.password) return 'Create a password.';
            if (values.password.length < 8) return 'Password must be at least 8 characters.';
            return undefined;
        }
        case 'confirmPassword': {
            if (!values.confirmPassword) return 'Confirm your password.';
            if (values.confirmPassword !== values.password) return 'Passwords do not match.';
            return undefined;
        }
        case 'acceptTerms':
            return values.acceptTerms ? undefined : 'Accept the terms to continue.';
        default:
            return undefined;
    }
}

function validateAll(values: RegisterAccountValues): FieldErrors {
    const fields: FieldKey[] = [
        'firstName',
        'familyName',
        'username',
        'email',
        'gender',
        'birthday',
        'phonePrefix',
        'phoneNumber',
        'password',
        'confirmPassword',
        'acceptTerms',
    ];
    const errors: FieldErrors = {};
    for (const field of fields) {
        const message = validateField(field, values);
        if (message) errors[field] = message;
    }
    return errors;
}

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

export function RegisterAccount({
    title = 'Create your account',
    subtitle,
    onSubmit,
    onSignIn,
    submitLabel = 'Create account',
    termsLabel,
    termsHref = '/terms',
    privacyHref = '/privacy',
    showPasswordStrength = true,
    signInPrompt = 'Already have an account?',
    signInLabel = 'Sign in',
    genderOptions = DEFAULT_GENDER_OPTIONS,
    className,
}: RegisterAccountProps) {
    const [values, setValues] = useState<RegisterAccountValues>({
        firstName: '',
        familyName: '',
        username: '',
        email: '',
        phonePrefix: '',
        phoneNumber: '',
        gender: '',
        birthday: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false,
    });
    const [errors, setErrors] = useState<FieldErrors>({});
    const [submitted, setSubmitted] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [announcement, setAnnouncement] = useState('');

    const firstNameRef = useRef<HTMLInputElement>(null);
    const familyNameRef = useRef<HTMLInputElement>(null);
    const usernameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const genderRef = useRef<HTMLSelectElement>(null);
    const birthdayRef = useRef<HTMLInputElement>(null);
    const phonePrefixRef = useRef<HTMLInputElement>(null);
    const phoneNumberRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null);
    const termsRef = useRef<HTMLInputElement>(null);

    const fieldRefs: Record<FieldKey, RefObject<HTMLElement>> = {
        firstName: firstNameRef,
        familyName: familyNameRef,
        username: usernameRef,
        email: emailRef,
        gender: genderRef,
        birthday: birthdayRef,
        phonePrefix: phonePrefixRef,
        phoneNumber: phoneNumberRef,
        password: passwordRef,
        confirmPassword: confirmPasswordRef,
        acceptTerms: termsRef,
    };

    const setValue = <K extends keyof RegisterAccountValues>(
        key: K,
        value: RegisterAccountValues[K]
    ) => {
        const next = { ...values, [key]: value };
        setValues(next);
        // Re-validate live once the user has attempted a submit, so errors
        // resolve the moment they fix them.
        if (submitted) {
            setErrors((prev) => ({ ...prev, [key]: validateField(key, next) }));
        }
    };

    const handleBlur = (key: FieldKey) => {
        if (!submitted) return;
        setErrors((prev) => ({ ...prev, [key]: validateField(key, values) }));
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitted(true);

        const nextErrors = validateAll(values);
        setErrors(nextErrors);

        const fields: FieldKey[] = [
            'firstName',
            'familyName',
            'username',
            'email',
            'gender',
            'birthday',
            'phonePrefix',
            'phoneNumber',
            'password',
            'confirmPassword',
            'acceptTerms',
        ];
        const firstInvalid = fields.find((field) => nextErrors[field]);
        const errorCount = fields.filter((field) => nextErrors[field]).length;

        if (firstInvalid) {
            setAnnouncement(
                errorCount === 1
                    ? 'There is 1 error in the form.'
                    : `There are ${errorCount} errors in the form.`
            );
            fieldRefs[firstInvalid].current?.focus();
            return;
        }

        setAnnouncement('');
        onSubmit?.(values);
    };

    const strength = passwordStrength(values.password);

    const defaultTerms = (
        <>
            I agree to the <a href={termsHref}>Terms of Service</a> and{' '}
            <a href={privacyHref}>Privacy Policy</a>.
        </>
    );

    return (
        <div className={`register${className ? ` ${className}` : ''}`}>
            <div className="register__card">
                <header className="register__header">
                    <h1 className="register__title">{title}</h1>
                    {subtitle && <p className="register__subtitle">{subtitle}</p>}
                </header>

                {/* Live region announces the error count to assistive tech on submit. */}
                <p className="register__sr-only" aria-live="assertive">
                    {announcement}
                </p>

                <form className="register__form" onSubmit={handleSubmit} noValidate>
                    {/* ── First name / Family name ── */}
                    <div className="register__row">
                        <div className="register__field">
                            <Input1
                                label="First name"
                                id="ra-firstName"
                                autoComplete="given-name"
                                value={values.firstName}
                                onChange={(v) => setValue('firstName', v)}
                                onBlur={() => handleBlur('firstName')}
                                error={errors.firstName}
                                describedBy={errors.firstName ? 'ra-firstName-error' : undefined}
                                inputRef={firstNameRef}
                            />
                            {errors.firstName && (
                                <p className="register__error" id="ra-firstName-error">
                                    {errors.firstName}
                                </p>
                            )}
                        </div>

                        <div className="register__field">
                            <Input1
                                label="Family name"
                                id="ra-familyName"
                                autoComplete="family-name"
                                value={values.familyName}
                                onChange={(v) => setValue('familyName', v)}
                                onBlur={() => handleBlur('familyName')}
                                error={errors.familyName}
                                describedBy={errors.familyName ? 'ra-familyName-error' : undefined}
                                inputRef={familyNameRef}
                            />
                            {errors.familyName && (
                                <p className="register__error" id="ra-familyName-error">
                                    {errors.familyName}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* ── Username ── */}
                    <div className="register__field">
                        <Input1
                            label="Username"
                            id="ra-username"
                            autoComplete="username"
                            value={values.username}
                            onChange={(v) => setValue('username', v)}
                            onBlur={() => handleBlur('username')}
                            error={errors.username}
                            describedBy={errors.username ? 'ra-username-error' : undefined}
                            inputRef={usernameRef}
                        />
                        {errors.username && (
                            <p className="register__error" id="ra-username-error">
                                {errors.username}
                            </p>
                        )}
                    </div>

                    {/* ── Email ── */}
                    <div className="register__field">
                        <Input1
                            label="Email"
                            type="email"
                            id="ra-email"
                            autoComplete="email"
                            value={values.email}
                            onChange={(v) => setValue('email', v)}
                            onBlur={() => handleBlur('email')}
                            error={errors.email}
                            describedBy={errors.email ? 'ra-email-error' : undefined}
                            inputRef={emailRef}
                        />
                        {errors.email && (
                            <p className="register__error" id="ra-email-error">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* ── Gender / Birthday ── */}
                    <div className="register__row">
                        <div className="register__field">
                            <label className="register__label" htmlFor="ra-gender">
                                Gender
                            </label>
                            <select
                                ref={genderRef}
                                id="ra-gender"
                                className={`register__select${values.gender === '' ? ' register__select--placeholder' : ''}`}
                                value={values.gender}
                                onChange={(e) => setValue('gender', e.target.value)}
                                onBlur={() => handleBlur('gender')}
                                aria-invalid={errors.gender ? 'true' : undefined}
                                aria-describedby={errors.gender ? 'ra-gender-error' : undefined}
                            >
                                <option value="">Select…</option>
                                {genderOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            {errors.gender && (
                                <p className="register__error" id="ra-gender-error">
                                    {errors.gender}
                                </p>
                            )}
                        </div>

                        <div className="register__field">
                            <label className="register__label" htmlFor="ra-birthday">
                                Birthday
                            </label>
                            <input
                                ref={birthdayRef}
                                id="ra-birthday"
                                className="register__input"
                                type="date"
                                autoComplete="bday"
                                value={values.birthday}
                                onChange={(e) => setValue('birthday', e.target.value)}
                                onBlur={() => handleBlur('birthday')}
                                aria-invalid={errors.birthday ? 'true' : undefined}
                                aria-describedby={errors.birthday ? 'ra-birthday-error' : undefined}
                            />
                            {errors.birthday && (
                                <p className="register__error" id="ra-birthday-error">
                                    {errors.birthday}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* ── Phone prefix / Phone number ── */}
                    <div className="register__row register__row--phone">
                        <div className="register__field">
                            <Input1
                                label="Prefix"
                                id="ra-phonePrefix"
                                inputMode="tel"
                                autoComplete="tel-country-code"
                                value={values.phonePrefix}
                                onChange={(v) => setValue('phonePrefix', v)}
                                onBlur={() => handleBlur('phonePrefix')}
                                error={errors.phonePrefix}
                                describedBy={
                                    errors.phonePrefix ? 'ra-phonePrefix-error' : undefined
                                }
                                inputRef={phonePrefixRef}
                            />
                            {errors.phonePrefix && (
                                <p className="register__error" id="ra-phonePrefix-error">
                                    {errors.phonePrefix}
                                </p>
                            )}
                        </div>

                        <div className="register__field">
                            <Input1
                                label="Phone number"
                                type="tel"
                                id="ra-phoneNumber"
                                autoComplete="tel"
                                value={values.phoneNumber}
                                onChange={(v) => setValue('phoneNumber', v)}
                                onBlur={() => handleBlur('phoneNumber')}
                                error={errors.phoneNumber}
                                describedBy={
                                    errors.phoneNumber ? 'ra-phoneNumber-error' : undefined
                                }
                                inputRef={phoneNumberRef}
                            />
                            {errors.phoneNumber && (
                                <p className="register__error" id="ra-phoneNumber-error">
                                    {errors.phoneNumber}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* ── Password ── */}
                    <div className="register__field">
                        <Input1
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            id="ra-password"
                            autoComplete="new-password"
                            value={values.password}
                            onChange={(v) => setValue('password', v)}
                            onBlur={() => handleBlur('password')}
                            error={errors.password}
                            describedBy={errors.password ? 'ra-password-error' : undefined}
                            inputRef={passwordRef}
                            suffix={
                                <button
                                    type="button"
                                    className="register__toggle"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    aria-pressed={showPassword}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                            }
                        />

                        {showPasswordStrength && values.password.length > 0 && (
                            <div className="register__strength">
                                <div className="register__strength-bars" aria-hidden="true">
                                    {[0, 1, 2, 3].map((i) => (
                                        <span
                                            key={i}
                                            className={
                                                i < strength.score
                                                    ? 'register__strength-bar register__strength-bar--filled'
                                                    : 'register__strength-bar'
                                            }
                                        />
                                    ))}
                                </div>
                                <span className="register__strength-label">{strength.label}</span>
                            </div>
                        )}

                        {errors.password && (
                            <p className="register__error" id="ra-password-error">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    {/* ── Confirm password ── */}
                    <div className="register__field">
                        <Input1
                            label="Confirm password"
                            type={showConfirm ? 'text' : 'password'}
                            id="ra-confirmPassword"
                            autoComplete="new-password"
                            value={values.confirmPassword}
                            onChange={(v) => setValue('confirmPassword', v)}
                            onBlur={() => handleBlur('confirmPassword')}
                            error={errors.confirmPassword}
                            describedBy={
                                errors.confirmPassword ? 'ra-confirmPassword-error' : undefined
                            }
                            inputRef={confirmPasswordRef}
                            suffix={
                                <button
                                    type="button"
                                    className="register__toggle"
                                    onClick={() => setShowConfirm((prev) => !prev)}
                                    aria-pressed={showConfirm}
                                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                                >
                                    {showConfirm ? 'Hide' : 'Show'}
                                </button>
                            }
                        />
                        {errors.confirmPassword && (
                            <p className="register__error" id="ra-confirmPassword-error">
                                {errors.confirmPassword}
                            </p>
                        )}
                    </div>

                    {/* ── Terms consent ── */}
                    <div className="register__field">
                        <label className="register__terms">
                            <input
                                ref={termsRef}
                                className="register__checkbox"
                                type="checkbox"
                                checked={values.acceptTerms}
                                onChange={(e) => setValue('acceptTerms', e.target.checked)}
                                onBlur={() => handleBlur('acceptTerms')}
                                aria-invalid={errors.acceptTerms ? 'true' : undefined}
                                aria-describedby={
                                    errors.acceptTerms ? 'ra-acceptTerms-error' : undefined
                                }
                            />
                            <span className="register__terms-text">
                                {termsLabel ?? defaultTerms}
                            </span>
                        </label>
                        {errors.acceptTerms && (
                            <p className="register__error" id="ra-acceptTerms-error">
                                {errors.acceptTerms}
                            </p>
                        )}
                    </div>

                    <button type="submit" className="register__submit">
                        {submitLabel}
                    </button>
                </form>

                <p className="register__signin">
                    {signInPrompt}{' '}
                    <button type="button" className="register__signin-link" onClick={onSignIn}>
                        {signInLabel}
                    </button>
                </p>
            </div>
        </div>
    );
}
