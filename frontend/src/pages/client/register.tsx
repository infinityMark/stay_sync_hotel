import { useNavigate } from 'react-router-dom';
// component & layout
import NavBarInit from '../../layouts/Client/ClientHeader';
import FooterInit from '../../layouts/Client/ClientFooter';
import type { RefObject } from 'react';
// interface
import { RegisterAccount } from '../../components/forms/Register/register';
import type {
    RegisterAccountProps,
    RegisterAccountValues,
} from '../../components/forms/Register/register';

const register = () => {
    const navigate = useNavigate();

    const registerProps: RegisterAccountProps = {
        title: 'Create your account',
        subtitle: 'Please fill in the details below',
        onSubmit: (values) => {
            console.log(values);
        },
        onSignIn: () => {
            navigate('/login');
        },
        submitLabel: 'Create account',
        termsLabel: 'I agree to the Terms of Service and Privacy Policy',
        termsHref: '/terms',
        privacyHref: '/privacy',
        showPasswordStrength: true,
        signInPrompt: 'Already have an account?',
        signInLabel: 'Sign in',
        genderOptions: [
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
        ],
        className: 'my-register-form',
    };

    return (
        <div>
            <NavBarInit />
            <RegisterAccount {...registerProps} />
            <FooterInit />
        </div>
    );
};

export default register;
