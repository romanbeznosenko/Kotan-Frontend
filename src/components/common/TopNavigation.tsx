import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/images/kotan_logo.jpeg";

const PRIMARY = '#46a5fd';
const MOBILE_BREAKPOINT = 768;

const NAV_ITEMS: { path: string; label: string }[] = [
    { path: '/',        label: 'Strona główna' },
    { path: '/teams',   label: 'Zespoły' },
    { path: '/news',    label: 'Aktualności' },
    { path: '/matches', label: 'Rozgrywki' },
    { path: '/gallery', label: 'Galeria' },
];

const TopNavigation = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_BREAKPOINT);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < MOBILE_BREAKPOINT;
            setIsMobile(mobile);
            if (!mobile) setMobileMenuOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleNavClick = (path: string) => {
        navigate(path);
        setMobileMenuOpen(false);
    };

    const isActive = (path: string) =>
        path === '/' ? pathname === '/' : pathname.startsWith(path);

    return (
        <header style={{
            position: 'sticky',
            top: 0,
            zIndex: 50,
            width: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid #e2e8f0',
            fontFamily: "'Lexend', sans-serif",
        }}>
            <div style={{
                maxWidth: '80rem',
                margin: '0 auto',
                padding: '1rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                {/* Logo */}
                <div
                    onClick={() => handleNavClick('/')}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
                >
                    <img src={logo} alt="Kotan Ozorków" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: '0.5rem' }} />
                    <h1 style={{
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        letterSpacing: '-0.025em',
                        color: '#0f172a',
                        margin: 0,
                    }}>
                        Kotan <span style={{ color: PRIMARY }}>Ozorków</span>
                    </h1>
                </div>

                {/* Desktop nav */}
                {!isMobile && (
                    <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                        {NAV_ITEMS.map(({ path, label }) => (
                            <button
                                key={path}
                                onClick={() => handleNavClick(path)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '0.875rem',
                                    fontWeight: isActive(path) ? 600 : 500,
                                    color: isActive(path) ? PRIMARY : '#334155',
                                    padding: 0,
                                    transition: 'color 0.2s',
                                }}
                            >
                                {label}
                            </button>
                        ))}
                    </nav>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {!isMobile && (
                        <button style={{
                            backgroundColor: PRIMARY,
                            color: '#fff',
                            padding: '0.5rem 1.25rem',
                            borderRadius: '0.5rem',
                            fontSize: '0.875rem',
                            fontWeight: 700,
                            border: 'none',
                            cursor: 'pointer',
                        }}>
                            Strefa Rodzica
                        </button>
                    )}

                    {isMobile && (
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle menu"
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 40,
                                height: 40,
                                color: '#334155',
                                transition: 'color 0.2s',
                            }}
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: 32 }}>
                                {mobileMenuOpen ? 'close' : 'menu'}
                            </span>
                        </button>
                    )}
                </div>
            </div>

            {/* Mobile menu */}
            <div style={{
                overflow: 'hidden',
                maxHeight: mobileMenuOpen ? `${NAV_ITEMS.length * 56 + 16}px` : '0px',
                transition: 'max-height 0.5s ease',
                borderTop: mobileMenuOpen ? '1px solid #e2e8f0' : 'none',
                backgroundColor: 'rgba(255, 255, 255, 0.97)',
            }}>
                <nav style={{
                    maxWidth: '80rem',
                    margin: '0 auto',
                    padding: '0.5rem 1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                    {NAV_ITEMS.map(({ path, label }, i) => (
                        <button
                            key={path}
                            onClick={() => handleNavClick(path)}
                            style={{
                                background: 'none',
                                border: 'none',
                                borderBottom: i < NAV_ITEMS.length - 1 ? '1px solid #f1f5f9' : 'none',
                                cursor: 'pointer',
                                textAlign: 'left',
                                padding: '0.75rem 0',
                                fontSize: '0.875rem',
                                fontWeight: isActive(path) ? 600 : 500,
                                color: isActive(path) ? PRIMARY : '#334155',
                                transition: 'color 0.2s',
                            }}
                        >
                            {label}
                        </button>
                    ))}
                </nav>
            </div>
        </header>
    );
};

export default TopNavigation;
