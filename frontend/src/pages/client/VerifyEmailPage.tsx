// component & layout
import NavBarInit from '../../layouts/Client/ClientHeader';
import FooterInit from '../../layouts/Client/ClientFooter';
// interface
import { useNavigate } from 'react-router-dom';
import VerifyEmail from '../../components/forms/VarifyEmail/VerifyEmail';
import type { VerifyEmailProps } from '../../components/forms/VarifyEmail/VerifyEmail';

const VerifyEmailPage = () => {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate('/reset-password', { state: { verified: true } });
    };

    const onSendCode = (url: string) => {
        navigate('/reset-password', { state: { verified: true } });
    };

    const onVerify = (email: string, code: string) => {
        navigate('/reset-password', { state: { verified: true } });
    };

    const VerifyEmailProps: VerifyEmailProps = {
        title: 'Verify your email',
        subtitle: '',
        codeLength: 6,
        sendCodeLabel: 'Send code',
        resendCodeLabel: 'Resend code',
        verifyLabel: 'Verify',
        verifyingLabel: 'Verifying…',
        codeHint: '',
        invalidCodeMessage: "That code isn't right. Check your email and try again.",
        redirectTo: '',
        navigate: handleNavigate,
        onSendCode,
        onVerify,
        className: '',
    };

    return (
        <div>
            <NavBarInit />
            <VerifyEmail />
            <FooterInit />
        </div>
    );
};

export default VerifyEmailPage;
