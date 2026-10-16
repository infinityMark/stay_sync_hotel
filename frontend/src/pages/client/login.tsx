// component & layout
import NavBarInit from '../../layouts/Client/ClientHeader';
import FooterInit from '../../layouts/Client/ClientFooter';
// interface
import { useNavigate } from 'react-router-dom';
import Login from '../../components/forms/login/Login';
import type { LoginProps, LoginValues } from '../../components/forms/login/Login';

const login = () => {
    const navigate = useNavigate();

    const loginProps: LoginProps = {
        title: 'Welcome back',
        subtitle: 'Please enter your details to sign in',
        onSubmit: () => {},
        onForgotPassword: () => navigate('/VerifyEmailPage'),
        onSignUp: () => navigate('/signup'),
        submitLabel: 'Sign in',
        forgotPasswordLabel: 'Forgot password?',
        signUpPrompt: "Don't have an account?",
        signUpLabel: 'Sign up',
        className: '',
    };

    return (
        <div>
            <NavBarInit />
            <Login {...loginProps} />
            <FooterInit />
        </div>
    );
};

export default login;
