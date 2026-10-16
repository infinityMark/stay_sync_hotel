// component & layout
import NavBarInit from '../../layouts/Client/ClientHeader';
import FooterInit from '../../layouts/Client/ClientFooter';
// interface
import { useNavigate } from 'react-router-dom';
import { ResetPassword } from '../../components/forms/ResetPassword/ResetPassword';
// import type VerifyEmailProps from '../../components/forms/VarifyEmail/VerifyEmail';

export const ResetPasswordPage = () => {
    // const navigate = useNavigate();

    // const VerifyEmailProps: VerifyEmailProps = {
    //     title: 'Verify your email',
    //     subtitle,
    //     codeLength: 6,
    //     sendCodeLabel: 'Send code',
    //     resendCodeLabel: 'Resend code',
    //     verifyLabel: 'Verify',
    //     verifyingLabel: 'Verifying…',
    //     codeHint,
    //     invalidCodeMessage: "That code isn't right. Check your email and try again.",
    //     redirectTo,
    //     navigate,
    //     onSendCode,
    //     onVerify,
    //     className,
    // };

    return (
        <div>
            <NavBarInit />
            <ResetPassword />
            <FooterInit />
        </div>
    );
};

// export default VerifyEmailPage;
