import { Navbar } from '../components/navigationBars/ClientNavBar/NavBar01';
import logoImg from '../../assets/logo/full_logo_w.png';

const NavBarInit = () => {
    return (
        <Navbar
            logo={{ src: logoImg, alt: 'Stay Sync Hotel logo' }}
            links={[
                { label: 'Home', href: '' },
                {
                    label: 'Services',
                    children: [{ label: 'Morning call', href: '' }],
                },
            ]}
            languageLabel="EN"
            onLanguageClick={() => {}}
            ctaLabel="Reserve"
            onCtaClick={() => {}}
        />
    );
};

export default NavBarInit;
