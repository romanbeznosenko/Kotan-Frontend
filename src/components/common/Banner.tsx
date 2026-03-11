import { useState, useEffect } from "react";
import bannerPhoto1 from "../../assets/images/banner_photo_1.png";
import bannerPhoto2 from "../../assets/images/banner_photo_2.png";
import bannerPhoto3 from "../../assets/images/banner_photo_3.png";
import ozorkow_logo from "../../assets/images/ozorkow_logo.png";
import orlen_logo from "../../assets/images/orlen_logo.png";

const PRIMARY = '#46a5fd';

const PHOTO_CARDS = [
    { src: bannerPhoto1, label: 'Pasja od najmłodszych lat' },
    { src: bannerPhoto2, label: 'Duch rywalizacji' },
    { src: bannerPhoto3, label: 'Wspólnota i Drużyna' },
];

const PhotoCard = ({ src, label, isMobile }: { src: string; label: string; isMobile: boolean }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                position: 'relative',
                height: isMobile ? 200 : 500,
                flex: isMobile ? 'none' : 1,
                width: isMobile ? '100%' : 0,
                borderRadius: '0.75rem',
                overflow: 'hidden',
                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)',
            }}
        >
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url(${src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transition: 'transform 0.5s ease',
                transform: hovered ? 'scale(1.1)' : 'scale(1)',
            }} />
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)',
                display: 'flex',
                alignItems: 'flex-end',
                padding: '1.5rem',
            }}>
                <h3 style={{ color: '#fff', fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>
                    {label}
                </h3>
            </div>
        </div>
    );
};

const Banner = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div style={{ fontFamily: "'Lexend', sans-serif" }}>

            {/* Title section */}
            <section style={{
                maxWidth: '80rem',
                margin: '0 auto',
                padding: '3rem 1rem',
                textAlign: 'center',
            }}>
                <h1 style={{
                    fontSize: 'clamp(2rem, 6vw, 3.75rem)',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '-0.05em',
                    lineHeight: 1,
                    marginBottom: '1rem',
                    margin: '0 0 1rem 0',
                }}>
                    KOTAN OZORKÓW{' '}
                    <span style={{ color: '#cbd5e1', margin: '0 0.5rem' }}>•</span>
                    <span style={{ display: 'inline-block' }}>
                        <span style={{ color: '#ef4444' }}>K</span>
                        <span style={{ color: '#eab308' }}>I</span>
                        <span style={{ color: '#22c55e' }}>D</span>
                        <span style={{ color: '#a855f7' }}>S</span>
                    </span>
                    <span style={{ color: '#cbd5e1', margin: '0 0.5rem' }}>•</span>
                    <span style={{ color: '#ec4899' }}>GIRLS</span>
                </h1>
                <p style={{
                    color: '#64748b',
                    fontSize: '1.125rem',
                    maxWidth: '42rem',
                    margin: '0 auto',
                }}>
                    Budujemy sportową przyszłość regionu. Profesjonalne szkolenie dzieci i młodzieży w sercu Ozorkowa.
                </p>
            </section>

            {/* Photo grid */}
            <section style={{ padding: '0 1rem 3rem', width: '100%', boxSizing: 'border-box' }}>
                <div style={{
                    maxWidth: '80rem',
                    margin: '0 auto',
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: '1rem',
                }}>
                    {PHOTO_CARDS.map(({ src, label }) => (
                        <PhotoCard key={label} src={src} label={label} isMobile={isMobile} />
                    ))}
                </div>
            </section>

            {/* Partners bar */}
            <section style={{
                backgroundColor: '#fff',
                borderTop: '1px solid #e2e8f0',
                borderBottom: '1px solid #e2e8f0',
                padding: '1.5rem 1rem',
                marginBottom: '3rem',
            }}>
                <div style={{
                    maxWidth: '80rem',
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '2rem',
                }}>
                    {/* Left: city tagline */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1.5rem',
                        opacity: 0.8,
                    }}>
                        <img src={ozorkow_logo} alt="Ozorków" style={{ height: 56, width: 'auto', objectFit: 'contain' }} />
                        <div style={{ width: 1, height: 48, backgroundColor: '#e2e8f0' }} />
                        <div>
                            <p style={{ fontWeight: 700, fontSize: '1.125rem', margin: 0, color: '#0f172a' }}>
                                Piłkarska przyszłość z Orlenem.
                            </p>
                            <p style={{ color: PRIMARY, fontWeight: 500, margin: 0 }}>Dołącz do nas.</p>
                        </div>
                    </div>

                    {/* Right: logos */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#94a3b8', marginBottom: 4 }}>
                                Partner Strategiczny
                            </span>
                            <img src={orlen_logo} alt="Orlen" style={{ height: 40, width: 'auto', objectFit: 'contain' }} />
                        </div>
                        <div style={{ width: 1, height: 48, backgroundColor: '#e2e8f0' }} />
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#94a3b8', marginBottom: 4 }}>
                                Miasto
                            </span>
                            <div style={{
                                height: 40,
                                width: 96,
                                backgroundColor: `rgba(70,165,253,0.1)`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: PRIMARY,
                                fontWeight: 700,
                                fontStyle: 'italic',
                                borderRadius: '0.25rem',
                            }}>
                                OZORKÓW
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Banner;
