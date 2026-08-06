import { useState, useEffect, useRef, useCallback } from 'react';
import './Navbar.css';

export interface NavLinkItem {
    label: string;
    href?: string;
    children?: NavLinkItem[];
}

export interface NavbarProps {
    logo: {
        src: string;
        alt: string;
    };
    links: NavLinkItem[];
    languageLabel?: string;
    onLanguageClick?: () => void;
    ctaLabel: string;
    onCtaClick?: () => void;
}

export function Navbar({
    logo,
    links,
    languageLabel = 'EN',
    onLanguageClick,
    ctaLabel,
    onCtaClick,
}: NavbarProps) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
    const [mobileExpanded, setMobileExpanded] = useState<Set<number>>(new Set());
    const navRef = useRef<HTMLElement>(null);

    // Close all menus when clicking outside
    const handleClickOutside = useCallback((e: MouseEvent) => {
        if (navRef.current && !navRef.current.contains(e.target as Node)) {
            setActiveDropdown(null);
            setMobileOpen(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [handleClickOutside]);

    // Close mobile menu on window resize to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setMobileOpen(false);
                setMobileExpanded(new Set());
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleDropdown = (index: number) => {
        setActiveDropdown((prev) => (prev === index ? null : index));
    };

    const toggleMobileExpand = (index: number) => {
        setMobileExpanded((prev) => {
            const next = new Set(prev);
            if (next.has(index)) {
                next.delete(index);
            } else {
                next.add(index);
            }
            return next;
        });
    };

    const handleLinkClick = (link: NavLinkItem) => {
        if (link.href) {
            window.location.href = link.href;
        }
    };

    return (
        <nav className="navbar" ref={navRef} role="navigation" aria-label="Main navigation">
            {/* ── Left section ── */}
            <div className="navbar__left">
                <a href="/" className="navbar__logo" aria-label="Home">
                    <img src={logo.src} alt={logo.alt} className="navbar__logo-img" />
                </a>

                {/* Desktop links */}
                <ul className="navbar__links" role="menubar">
                    {links.map((link, i) => (
                        <li key={i} className="navbar__link-item" role="none">
                            {link.children ? (
                                <div className="navbar__link-wrapper">
                                    <button
                                        className={`navbar__link navbar__link--dropdown ${activeDropdown === i ? 'navbar__link--active' : ''}`}
                                        onClick={() => toggleDropdown(i)}
                                        aria-expanded={activeDropdown === i}
                                        aria-haspopup="true"
                                        role="menuitem"
                                    >
                                        {link.label}
                                        <span
                                            className={`navbar__chevron ${activeDropdown === i ? 'navbar__chevron--open' : ''}`}
                                        >
                                            ▾
                                        </span>
                                    </button>
                                    <div
                                        className={`navbar__dropdown ${activeDropdown === i ? 'navbar__dropdown--open' : ''}`}
                                    >
                                        <ul className="navbar__dropdown-list" role="menu">
                                            {link.children.map((child, j) => (
                                                <li key={j} role="none">
                                                    <button
                                                        className="navbar__dropdown-item"
                                                        onClick={() => handleLinkClick(child)}
                                                        role="menuitem"
                                                    >
                                                        {child.label}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    className="navbar__link"
                                    onClick={() => handleLinkClick(link)}
                                    role="menuitem"
                                >
                                    {link.label}
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            {/* ── Right section ── */}
            <div className="navbar__right">
                <button
                    className="navbar__lang"
                    onClick={onLanguageClick}
                    aria-label="Switch language"
                >
                    {languageLabel}
                </button>
                <button className="navbar__cta" onClick={onCtaClick}>
                    {ctaLabel}
                </button>

                {/* Hamburger — visible only on mobile */}
                <button
                    className={`navbar__hamburger ${mobileOpen ? 'navbar__hamburger--open' : ''}`}
                    onClick={() => setMobileOpen((prev) => !prev)}
                    aria-expanded={mobileOpen}
                    aria-label="Toggle navigation menu"
                >
                    <span className="navbar__hamburger-bar" />
                    <span className="navbar__hamburger-bar" />
                    <span className="navbar__hamburger-bar" />
                </button>
            </div>

            {/* ── Mobile drawer ── */}
            <div
                className={`navbar__mobile ${mobileOpen ? 'navbar__mobile--open' : ''}`}
                role="menu"
            >
                <ul className="navbar__mobile-links">
                    {links.map((link, i) => (
                        <li key={i} className="navbar__mobile-item" role="none">
                            {link.children ? (
                                <div className="navbar__mobile-group">
                                    <button
                                        className={`navbar__mobile-link navbar__mobile-link--parent ${mobileExpanded.has(i) ? 'navbar__mobile-link--expanded' : ''}`}
                                        onClick={() => toggleMobileExpand(i)}
                                        aria-expanded={mobileExpanded.has(i)}
                                        role="menuitem"
                                    >
                                        {link.label}
                                        <span
                                            className={`navbar__chevron ${mobileExpanded.has(i) ? 'navbar__chevron--open' : ''}`}
                                        >
                                            ▾
                                        </span>
                                    </button>
                                    <div
                                        className={`navbar__mobile-sub ${mobileExpanded.has(i) ? 'navbar__mobile-sub--open' : ''}`}
                                    >
                                        {link.children.map((child, j) => (
                                            <button
                                                key={j}
                                                className="navbar__mobile-sublink"
                                                onClick={() => {
                                                    handleLinkClick(child);
                                                    setMobileOpen(false);
                                                }}
                                                role="menuitem"
                                            >
                                                {child.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <button
                                    className="navbar__mobile-link"
                                    onClick={() => {
                                        handleLinkClick(link);
                                        setMobileOpen(false);
                                    }}
                                    role="menuitem"
                                >
                                    {link.label}
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
}
