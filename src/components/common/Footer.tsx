import { useState } from "react";
import orlenLogo from "../../assets/images/orlen_logo.png";
import ozorkowLogo from "../../assets/images/ozorkow_logo.png";
import sponsor1 from "../../assets/images/sponsor_1.png";
import sponsor2 from "../../assets/images/sponsor_2.jpg";
import sponsor3 from "../../assets/images/sponsor_3.png";
import sponsor4 from "../../assets/images/sponsor_4.png";
import sponsor5 from "../../assets/images/sponsor_5.png";
import sponsor6 from "../../assets/images/sponsor_6.svg";

const PRIMARY = '#46a5fd';

const otherSponsors = [
    { id: 1, name: "Sponsor 1", logo: sponsor1 },
    { id: 2, name: "Sponsor 2", logo: sponsor2 },
    { id: 3, name: "Sponsor 3", logo: sponsor3 },
    { id: 4, name: "Sponsor 4", logo: sponsor4 },
    { id: 5, name: "Sponsor 5", logo: sponsor5 },
    { id: 6, name: "Sponsor 6", logo: sponsor6 },
];

// Duplicate for seamless scroll
const scrollItems = [...otherSponsors, ...otherSponsors];

const Footer = () => {
    const [socialHovered, setSocialHovered] = useState<number | null>(null);

    return (
        <footer style={{
            backgroundColor: '#0f172a',
            color: '#94a3b8',
            fontFamily: "'Lexend', sans-serif",
        }}>
            <style>{`
                @keyframes footerScroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .footer-scroll-track {
                    display: flex;
                    width: max-content;
                    animation: footerScroll 30s linear infinite;
                    gap: 3rem;
                    padding: 0 1.5rem;
                }
            `}</style>

            {/* 1. Main sponsors */}
            <div style={{
                backgroundColor: '#fff',
                padding: '3rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3rem',
                flexWrap: 'wrap',
            }}>
                <a href="https://www.orlen.pl" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                    <img src={orlenLogo} alt="Orlen" style={{ height: 96, objectFit: 'contain' }} />
                </a>
                <div style={{ width: 1, height: 72, backgroundColor: '#e2e8f0' }} />
                <a href="https://www.ozorkow.pl" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                    <img src={ozorkowLogo} alt="Ozorków" style={{ height: 96, objectFit: 'contain' }} />
                </a>
            </div>

            {/* 2. Other sponsors scrolling strip */}
            <div style={{ backgroundColor: '#f8fafc', padding: '2.5rem 0', overflow: 'hidden', borderTop: '1px solid #e2e8f0' }}>
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                    <div className="footer-scroll-track">
                        {scrollItems.map((s, i) => (
                            <div key={i} style={{
                                width: 128, height: 64, flexShrink: 0,
                                backgroundColor: '#e2e8f0',
                                borderRadius: '0.5rem',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <img src={s.logo} alt={s.name} style={{ maxHeight: 40, maxWidth: 100, objectFit: 'contain' }} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 3. Contact info + social */}
            <div style={{
                maxWidth: '80rem',
                margin: '0 auto',
                padding: '3rem 1.5rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '3rem',
            }}>
                {/* Brand */}
                <div style={{ gridColumn: 'span 2' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <div style={{
                            width: 32, height: 32,
                            backgroundColor: PRIMARY,
                            borderRadius: '0.25rem',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#fff',
                        }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>sports_soccer</span>
                        </div>
                        <h2 style={{
                            color: '#fff', fontSize: '1.25rem', fontWeight: 700,
                            fontStyle: 'italic', letterSpacing: '-0.025em',
                            textTransform: 'uppercase', margin: 0,
                        }}>
                            Kotan <span style={{ color: PRIMARY }}>Ozorków</span>
                        </h2>
                    </div>
                    <p style={{ fontSize: '0.875rem', lineHeight: 1.75, maxWidth: '28rem', margin: 0 }}>
                        Akademia Piłkarska Kotan Ozorków to miejsce, gdzie rodzą się piłkarskie talenty.
                        Zapraszamy dzieci od 4 roku życia do wspólnej zabawy i treningów pod okiem licencjonowanej kadry trenerskiej.
                    </p>
                </div>

                {/* Contact */}
                <div>
                    <h3 style={{ color: '#fff', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
                        Kontakt
                    </h3>
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {[
                            { icon: 'call', text: '+48 123 456 789' },
                            { icon: 'mail', text: 'biuro@kotanozorkow.pl' },
                            { icon: 'location_on', text: 'Ozorków, ul. Głowackiego 5' },
                        ].map(({ icon, text }) => (
                            <li key={icon} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                                <span className="material-symbols-outlined" style={{ color: PRIMARY, fontSize: 16 }}>{icon}</span>
                                {text}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Social */}
                <div>
                    <h3 style={{ color: '#fff', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
                        Obserwuj nas
                    </h3>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {[
                            { id: 0, icon: 'social_leaderboard', href: '#' },
                            { id: 1, icon: 'photo_camera', href: '#' },
                        ].map(({ id, icon, href }) => (
                            <a key={id} href={href}
                                onMouseEnter={() => setSocialHovered(id)}
                                onMouseLeave={() => setSocialHovered(null)}
                                style={{
                                    width: 40, height: 40,
                                    backgroundColor: socialHovered === id ? PRIMARY : '#1e293b',
                                    color: '#fff', borderRadius: '0.5rem',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'background-color 0.2s', textDecoration: 'none',
                                }}
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{icon}</span>
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* 4. Copyright */}
            <div style={{
                maxWidth: '80rem',
                margin: '0 auto',
                borderTop: '1px solid #1e293b',
                padding: '2rem 1.5rem',
                textAlign: 'center',
                fontSize: '0.75rem',
            }}>
                © {new Date().getFullYear()} Kotan Ozorków Football Academy. Wszelkie prawa zastrzeżone.
            </div>
        </footer>
    );
};

export default Footer;
