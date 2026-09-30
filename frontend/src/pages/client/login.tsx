// component & layout
import NavBarInit from '../../layouts/ClientHeader';
import FooterInit from '../../layouts/ClientFooter';
// interface
import { Login } from '../../components/forms/login/Login';

const login = () => {
    return (
        <div>
            <NavBarInit />
            <Login />
            <FooterInit />
        </div>
    );
};

export default login;
