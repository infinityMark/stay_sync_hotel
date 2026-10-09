// component & layout
import NavBarInit from '../../layouts/Client/ClientHeader';
import FooterInit from '../../layouts/Client/ClientFooter';
// interface
import { useNavigate } from 'react-router-dom';
import VerifyEmail from '../../components/forms/VarifyEmail/VerifyEmail';

const VerifyEmailPage = () => {
    const navigate = useNavigate();

    return (
        <div>
            <NavBarInit />
            <VerifyEmail />
            <FooterInit />
        </div>
    );
};

export default VerifyEmailPage;
