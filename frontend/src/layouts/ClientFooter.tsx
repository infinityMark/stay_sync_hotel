import { Footer } from '../components/footer/Footer';
import type { FooterLinkColumn, SocialLink } from '../components/footer/Footer';

const footerLinkColum: FooterLinkColumn[] = [
    {
        title: 'Service',
        links: [
            { label: 'Concierge', href: '' },
            { label: 'Spa', href: '' },
            { label: 'Dining', href: '' },
            { label: 'Events', href: '' },
        ],
    },
    {
        title: 'Rooms',
        links: [
            { label: 'Classic Room', href: '' },
            { label: 'Deluxe Room', href: '' },
            { label: 'Single Room', href: '' },
            { label: 'Signature Suite', href: '' },
        ],
    },
    {
        title: 'Contact',
        links: [
            { label: 'phone', href: '' },
            { label: 'instagram', href: '' },
            { label: 'Guest Support', href: '' },
            { label: 'email', href: '' },
        ],
    },
];

const footerSocial: SocialLink[] = [
    { platform: 'facebook', href: 'https://www.facebook.com/ThePeninsulaHongKong/?locale=en' },
    { platform: 'instagram', href: 'https://www.instagram.com/' },
    { platform: 'wechat', href: 'https://www.wechat.com/' },
    { platform: 'rednote', href: 'https://www.rednote.com/' },
];

const FooterInit = () => {
    return (
        <Footer
            companyName="Stay Sync Hotel"
            slogan="live happy"
            columns={footerLinkColum}
            socials={footerSocial}
        />
    );
};

export default FooterInit;
