import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/navigationBars/ClientNavBar/NavBar01';
import logoImg from '../assets/logo/full_logo_w.png';

const NavBarInit = () => {
    const navigate = useNavigate();
    return (
        <Navbar
            logo={{ src: logoImg, alt: 'Stay Sync Hotel logo', href: '../pages/client/home.tsx' }}
            links={[
                { label: 'Home', href: '../pages/client/index.tsx' },
                {
                    label: 'Services',
                    children: [{ label: 'Morning call', href: '' }],
                },
            ]}
            languageLabel="EN"
            onLanguageClick={() => {}}
            ctaLabel="Login"
            onCtaClick={() => navigate('/login')}
        />
    );
};

export default NavBarInit;
