import { Navbar } from './navBarSource/navBar01.tsx';

const navBar = () => {
    return;
    <Navbar
        logo={{ src: '', alt: 'Stay Sync Hotel logo' }}
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
    />;
};

export default navBar;
