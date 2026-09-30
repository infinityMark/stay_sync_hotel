// component & layout
import NavBarInit from '../../layouts/ClientHeader';
import FooterInit from '../../layouts/ClientFooter';
// interface
import { RegisterAccount } from '../../components/forms/register';

const register = () => {
    return (
        <div>
            <NavBarInit />
            <RegisterAccount />
            <FooterInit />
        </div>
    );
};

export default register;
