// component & layout
import NavBarInit from '../../layouts/ClientHeader';
import FooterInit from '../../layouts/ClientFooter';
// interface

const login = () => {
    return (
        <div>
            <NavBarInit />
            <LoginAccount />
            <FooterInit />
        </div>
    );
};

export default login;
