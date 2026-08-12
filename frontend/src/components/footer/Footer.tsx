import { useState } from 'react';
import './Footer.css';

export type SocialPlatform = 'facebook' | 'instagram' | 'wechat' | 'rednote';

export interface SocialLink {
    platform: SocialPlatform;
    href: string;
    label?: string;
}

export interface FooterLink {
    label: string;
    href: string;
}

export interface FooterLinkColumn {
    title: string;
    links: FooterLink[];
}

export interface FooterLegalLink {
    label: string;
    href: string;
}

export interface FooterProps {
    /** Company / brand name shown as the wordmark */
    companyName: string;
    /** Short tagline rendered in grey under the wordmark */
    slogan?: string;
    /** Quick-link groups rendered on the right-hand side */
    columns: FooterLinkColumn[];
    /** Social media icons rendered under the brand block */
    socials: SocialLink[];
    /** Legal links in the bottom bar (Privacy / Terms / Cookies) */
    legalLinks?: FooterLegalLink[];
    /** Custom copyright line; defaults to "© {year} {companyName}. All rights reserved." */
    copyright?: string;
}

const SOCIAL_LABELS: Record<SocialPlatform, string> = {
    facebook: 'Facebook',
    instagram: 'Instagram',
    wechat: 'WeChat',
    rednote: 'RedNote',
};

function SocialIcon({ platform }: { platform: SocialPlatform }) {
    switch (platform) {
        case 'facebook':
            return (
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M22.676 0H1.324C.593 0 0 .593 0 1.324v21.352C0 23.408.593 24 1.324 24h11.494v-9.294H9.689v-3.621h3.129V8.41c0-3.099 1.894-4.785 4.659-4.785 1.325 0 2.464.099 2.796.143v3.24l-1.918.001c-1.504 0-1.796.715-1.796 1.763v2.313h3.587l-.467 3.621h-3.12V24h6.116C23.407 24 24 23.407 24 22.676V1.324C24 .593 23.407 0 22.676 0z" />
                </svg>
            );
        case 'instagram':
            return (
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    aria-hidden="true"
                >
                    <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5.2" />
                    <circle cx="12" cy="12" r="3.9" />
                    <circle cx="17.1" cy="6.9" r="1.1" fill="currentColor" stroke="none" />
                </svg>
            );
        case 'wechat':
            return (
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M8.9 3.6c-3.4 0-6.2 2.5-6.2 5.6 0 1.7.9 3.2 2.2 4.2l-.5 2.2 2.6-1.4c.6.2 1.2.3 1.9.3h.3c-.1-.3-.1-.6-.1-1 0-3.3 2.7-6 6-6h.3a5.7 5.7 0 0 0-6.5-3.9z" />
                    <path d="M14.7 10.5c-3.2 0-5.8 2.4-5.8 5.3 0 2.9 2.6 5.3 5.8 5.3.6 0 1.2-.1 1.8-.2l2.4 1.3-.5-2.2c1.3-1 2.2-2.5 2.2-4.2 0-2.9-2.6-5.3-5.9-5.3z" />
                    <circle cx="8" cy="9.2" r="0.9" />
                    <circle cx="11.3" cy="9.2" r="0.9" />
                    <circle cx="14.2" cy="15.8" r="0.9" />
                    <circle cx="17.5" cy="15.8" r="0.9" />
                </svg>
            );
        case 'rednote':
            return (
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <rect x="4.6" y="4.6" width="12" height="12" rx="3.6" />
                    <rect x="8.6" y="8.6" width="11.4" height="11.4" rx="3.4" />
                </svg>
            );
        default:
            return null;
    }
}

export function Footer({
    companyName,
    slogan,
    columns,
    socials,
    legalLinks = [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Cookie Settings', href: '/cookies' },
    ],
    copyright,
}: FooterProps) {
    const year = new Date().getFullYear();
    const copyrightText = copyright ?? `© ${year} ${companyName}. All rights reserved.`;

    // On phones the link columns collapse into accordion sections; on larger
    // screens they stay open and the toggle is inert (handled in CSS).
    const [openColumns, setOpenColumns] = useState<number[]>([]);
    const toggleColumn = (index: number) => {
        setOpenColumns((prev) =>
            prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
        );
    };

    return (
        <footer className="footer">
            <div className="footer__inner">
                {/* ── Top region: brand block (left) + link columns (right) ── */}
                <div className="footer__main">
                    <div className="footer__brand">
                        <a className="footer__name" href="/">
                            {companyName}
                        </a>
                        {slogan && <p className="footer__slogan">{slogan}</p>}

                        <ul className="footer__socials">
                            {socials.map((social) => (
                                <li key={social.platform}>
                                    <a
                                        className="footer__social"
                                        href={social.href}
                                        aria-label={social.label ?? SOCIAL_LABELS[social.platform]}
                                    >
                                        <SocialIcon platform={social.platform} />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <nav className="footer__columns" aria-label="Footer">
                        {columns.map((column, index) => {
                            const isOpen = openColumns.includes(index);
                            const listId = `footer-col-${index}`;
                            return (
                                <div
                                    className={`footer__col${isOpen ? ' footer__col--open' : ''}`}
                                    key={column.title}
                                >
                                    <button
                                        type="button"
                                        className="footer__col-title"
                                        aria-expanded={isOpen}
                                        aria-controls={listId}
                                        onClick={() => toggleColumn(index)}
                                    >
                                        <span>{column.title}</span>
                                        <svg
                                            className="footer__col-chevron"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            aria-hidden="true"
                                        >
                                            <path d="M6 9l6 6 6-6" />
                                        </svg>
                                    </button>
                                    <ul id={listId} className="footer__col-list">
                                        {column.links.map((link) => (
                                            <li key={link.label}>
                                                <a className="footer__col-link" href={link.href}>
                                                    {link.label}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </nav>
                </div>

                {/* ── Bottom bar: copyright + legal links ── */}
                <div className="footer__legal">
                    <p className="footer__copyright">{copyrightText}</p>
                    <ul className="footer__legal-links">
                        {legalLinks.map((link) => (
                            <li key={link.label}>
                                <a className="footer__legal-link" href={link.href}>
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </footer>
    );
}
