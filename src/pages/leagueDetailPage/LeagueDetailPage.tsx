import { useState, useEffect } from "react";
import PageTemplate from "../../components/common/PageTemplate";

const PRIMARY = '#46a5fd';
const OWN_TEAM = 'Kotan Ozorków';

type CategoryKey = 'senior' | 'junior' | 'mlodzik' | 'orlik' | 'zak' | 'seniorki' | 'mlodziczki' | 'orliczki';

const CATEGORIES: { id: CategoryKey; label: string }[] = [
    { id: 'senior',     label: 'Seniorzy' },
    { id: 'junior',     label: 'Junior' },
    { id: 'mlodzik',    label: 'Młodzik' },
    { id: 'orlik',      label: 'Orlik' },
    { id: 'zak',        label: 'Żak' },
    { id: 'seniorki',   label: 'Seniorki' },
    { id: 'mlodziczki', label: 'Młodziczki' },
    { id: 'orliczki',   label: 'Orliczki' },
];

const TABLE = [
    { pos: 1,  team: 'Widzew Łódź',    p: 12, w: 10, d: 1, l: 1, gf: 42, ga: 10, pts: 31 },
    { pos: 2,  team: OWN_TEAM,          p: 12, w:  9, d: 2, l: 1, gf: 35, ga: 14, pts: 29 },
    { pos: 3,  team: 'ŁKS Łódź',        p: 12, w:  8, d: 1, l: 3, gf: 30, ga: 18, pts: 25 },
    { pos: 4,  team: 'GKS Bełchatów',   p: 12, w:  7, d: 2, l: 3, gf: 22, ga: 15, pts: 23 },
    { pos: 5,  team: 'Boruta Zgierz',   p: 12, w:  6, d: 1, l: 5, gf: 19, ga: 21, pts: 19 },
];

const UPCOMING = {
    date: '15 Maja, 2026',
    time: '16:00',
    home: OWN_TEAM,
    away: 'Widzew Łódź',
    location: 'Stadion Miejski, Ozorków',
};

const RESULTS = [
    { date: '10 Maja, 2026', home: OWN_TEAM, away: 'ŁKS Łódź',      homeGoals: 3, awayGoals: 1, win: true },
    { date: '3 Maja, 2026',  home: 'Boruta Zgierz', away: OWN_TEAM, homeGoals: 0, awayGoals: 2, win: true },
];

const STATS = [
    { value: '35', label: 'Bramki Zdobyte' },
    { value: '14', label: 'Bramki Stracone' },
    { value: '9',  label: 'Zwycięstwa' },
    { value: '75%', label: 'Skuteczność' },
];

// ── Sub-components ────────────────────────────────────────────────────────────

const CategoryTabs = ({ active, onChange }: { active: CategoryKey; onChange: (c: CategoryKey) => void }) => (
    <div style={{ marginBottom: '2rem', overflowX: 'auto' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', minWidth: 'max-content' }}>
            {CATEGORIES.map(({ id, label }) => {
                const isActive = active === id;
                return (
                    <button
                        key={id}
                        onClick={() => onChange(id)}
                        style={{
                            padding: '0.75rem 1.5rem',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            color: isActive ? PRIMARY : '#64748b',
                            background: isActive ? `rgba(70,165,253,0.05)` : 'none',
                            border: 'none',
                            borderBottom: isActive ? `2px solid ${PRIMARY}` : '2px solid transparent',
                            cursor: 'pointer',
                            transition: 'color 0.2s',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {label}
                    </button>
                );
            })}
        </div>
    </div>
);

const LeagueTable = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 0.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="material-symbols-outlined" style={{ color: PRIMARY, fontSize: 24 }}>table_chart</span>
                Tabela ligowa
            </h2>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>
                Ostatnia aktualizacja: Dzisiaj, 12:00
            </span>
        </div>

        <div style={{
            backgroundColor: '#fff',
            borderRadius: '0.75rem',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
        }}>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            {['Poz', 'Drużyna', 'M', 'W', 'R', 'P', 'Bramki', 'Pkt'].map((h, i) => (
                                <th key={i} style={{
                                    padding: '0.875rem 1.25rem',
                                    textAlign: i <= 1 ? 'left' : 'center',
                                    fontWeight: 700,
                                    color: '#64748b',
                                    fontSize: '0.6875rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.08em',
                                    whiteSpace: 'nowrap',
                                }}>
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {TABLE.map((row) => {
                            const isOwn = row.team === OWN_TEAM;
                            return (
                                <tr
                                    key={row.pos}
                                    style={{
                                        borderBottom: '1px solid #f1f5f9',
                                        backgroundColor: isOwn ? `rgba(70,165,253,0.05)` : 'transparent',
                                        borderLeft: isOwn ? `3px solid ${PRIMARY}` : '3px solid transparent',
                                    }}
                                >
                                    <td style={{ padding: '0.875rem 1.25rem', fontWeight: 700, color: isOwn ? PRIMARY : '#94a3b8' }}>
                                        {row.pos}
                                    </td>
                                    <td style={{ padding: '0.875rem 1.25rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{
                                                width: 32, height: 32,
                                                borderRadius: '50%',
                                                backgroundColor: isOwn ? PRIMARY : '#f1f5f9',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                flexShrink: 0,
                                            }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: 16, color: isOwn ? '#fff' : '#94a3b8' }}>
                                                    {isOwn ? 'sports_soccer' : 'shield'}
                                                </span>
                                            </div>
                                            <span style={{ fontWeight: isOwn ? 700 : 600, color: isOwn ? PRIMARY : '#0f172a' }}>
                                                {row.team}
                                            </span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '0.875rem 1.25rem', textAlign: 'center', fontWeight: isOwn ? 700 : 500 }}>{row.p}</td>
                                    <td style={{ padding: '0.875rem 1.25rem', textAlign: 'center' }}>{row.w}</td>
                                    <td style={{ padding: '0.875rem 1.25rem', textAlign: 'center' }}>{row.d}</td>
                                    <td style={{ padding: '0.875rem 1.25rem', textAlign: 'center' }}>{row.l}</td>
                                    <td style={{ padding: '0.875rem 1.25rem', textAlign: 'center', color: '#64748b' }}>{row.gf}:{row.ga}</td>
                                    <td style={{ padding: '0.875rem 1.25rem', textAlign: 'center', fontWeight: 700, color: PRIMARY }}>{row.pts}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div style={{
                padding: '1rem',
                backgroundColor: '#f8fafc',
                borderTop: '1px solid #f1f5f9',
                display: 'flex',
                justifyContent: 'center',
            }}>
                <button style={{
                    background: 'none',
                    border: 'none',
                    color: PRIMARY,
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                }}>
                    Pokaż pełną tabelę
                </button>
            </div>
        </div>
    </div>
);

const UpcomingMatch = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0 0.5rem' }}>
            <span className="material-symbols-outlined" style={{ color: '#22c55e', fontSize: 22 }}>event_upcoming</span>
            Nadchodzące mecze
        </h3>
        <div style={{
            backgroundColor: '#fff',
            borderRadius: '0.75rem',
            border: '1px solid #e2e8f0',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                <span>{UPCOMING.date}</span>
                <span>{UPCOMING.time}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', padding: '0.5rem 0' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.375rem' }}>
                    <div style={{
                        width: 48, height: 48,
                        borderRadius: '50%',
                        backgroundColor: `rgba(70,165,253,0.1)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <span className="material-symbols-outlined" style={{ color: PRIMARY, fontSize: 26 }}>sports_soccer</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, textAlign: 'center' }}>{UPCOMING.home}</span>
                </div>

                <span style={{ fontWeight: 700, fontSize: '1.25rem', color: '#cbd5e1' }}>VS</span>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.375rem' }}>
                    <div style={{
                        width: 48, height: 48,
                        borderRadius: '50%',
                        backgroundColor: '#f1f5f9',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <span className="material-symbols-outlined" style={{ color: '#94a3b8', fontSize: 26 }}>shield</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, textAlign: 'center' }}>{UPCOMING.away}</span>
                </div>
            </div>

            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.375rem',
                fontSize: '0.75rem',
                color: '#64748b',
                padding: '0.5rem',
                backgroundColor: '#f8fafc',
                borderRadius: '0.5rem',
            }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>location_on</span>
                {UPCOMING.location}
            </div>

            <button style={{
                width: '100%',
                padding: '0.5rem',
                backgroundColor: '#0f172a',
                color: '#fff',
                fontSize: '0.875rem',
                fontWeight: 700,
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
            }}>
                Szczegóły meczu
            </button>
        </div>
    </div>
);

const RecentResults = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0 0.5rem' }}>
            <span className="material-symbols-outlined" style={{ color: PRIMARY, fontSize: 22 }}>history</span>
            Ostatnie wyniki
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {RESULTS.map((r, i) => (
                <div key={i} style={{
                    backgroundColor: '#fff',
                    borderRadius: '0.75rem',
                    border: '1px solid #e2e8f0',
                    padding: '1rem',
                    opacity: i === 0 ? 1 : 0.8,
                }}>
                    <div style={{ fontSize: '0.625rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
                        {r.date}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: r.home === OWN_TEAM ? 700 : 600, fontSize: '0.875rem', flex: 1 }}>{r.home}</span>
                        <div style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: 9999,
                            backgroundColor: r.win ? 'rgba(34,197,94,0.1)' : '#f1f5f9',
                            color: r.win ? '#22c55e' : '#64748b',
                            fontWeight: 900,
                            fontSize: '1.125rem',
                            letterSpacing: '0.05em',
                        }}>
                            {r.homeGoals} : {r.awayGoals}
                        </div>
                        <span style={{ fontWeight: r.away === OWN_TEAM ? 700 : 600, fontSize: '0.875rem', flex: 1, textAlign: 'right', color: r.away === OWN_TEAM ? '#0f172a' : '#64748b' }}>
                            {r.away}
                        </span>
                    </div>
                </div>
            ))}
        </div>
        <button style={{
            width: '100%',
            padding: '0.5rem',
            background: 'none',
            border: 'none',
            color: PRIMARY,
            fontSize: '0.875rem',
            fontWeight: 700,
            cursor: 'pointer',
            borderRadius: '0.5rem',
        }}>
            Zobacz wszystkie wyniki
        </button>
    </div>
);

const StatsBanner = () => (
    <div style={{
        marginTop: '3rem',
        padding: '2rem',
        borderRadius: '1rem',
        background: `linear-gradient(135deg, #1d4ed8 0%, ${PRIMARY} 100%)`,
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
    }}>
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '2rem',
            position: 'relative',
            zIndex: 1,
        }}>
            {STATS.map(({ value, label }) => (
                <div key={label} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 900, lineHeight: 1.1 }}>{value}</div>
                    <div style={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.7, marginTop: '0.25rem' }}>
                        {label}
                    </div>
                </div>
            ))}
        </div>
        <span className="material-symbols-outlined" style={{
            position: 'absolute',
            right: -20,
            bottom: -20,
            fontSize: 160,
            opacity: 0.08,
            lineHeight: 1,
        }}>
            sports_soccer
        </span>
    </div>
);

// ── Page ──────────────────────────────────────────────────────────────────────

const LeagueDetailPage = () => {
    const [activeCategory, setActiveCategory] = useState<CategoryKey>('junior');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

    useEffect(() => {
        const handler = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handler);
        return () => window.removeEventListener('resize', handler);
    }, []);

    return (
        <PageTemplate>
            <div style={{
                width: '100%',
                maxWidth: '75rem',
                margin: '0 auto',
                padding: '2rem 1.5rem',
                fontFamily: "'Lexend', sans-serif",
                boxSizing: 'border-box',
            }}>
                <CategoryTabs active={activeCategory} onChange={setActiveCategory} />

                {/* Hero */}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    gap: '1rem',
                    marginBottom: '2.5rem',
                }}>
                    <div>
                        <div style={{ marginBottom: '0.5rem' }}>
                            <span style={{
                                padding: '0.25rem 0.75rem',
                                borderRadius: '0.375rem',
                                backgroundColor: 'rgba(34,197,94,0.15)',
                                color: '#16a34a',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.08em',
                            }}>
                                Juniorzy – Green Group
                            </span>
                        </div>
                        <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem', lineHeight: 1.15 }}>
                            Liga Wojewódzka Junior
                        </h1>
                        <p style={{ fontSize: '1.125rem', fontWeight: 500, color: '#64748b', margin: 0 }}>Sezon 2025/2026</p>
                    </div>
                    <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        height: 44,
                        padding: '0 1.25rem',
                        backgroundColor: PRIMARY,
                        color: '#fff',
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        border: 'none',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        boxShadow: `0 4px 12px rgba(70,165,253,0.3)`,
                    }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>calendar_today</span>
                        Terminarz
                    </button>
                </div>

                {/* Main grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr',
                    gap: '2rem',
                    alignItems: 'start',
                }}>
                    <LeagueTable />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <UpcomingMatch />
                        <RecentResults />
                    </div>
                </div>

                <StatsBanner />
            </div>
        </PageTemplate>
    );
};

export default LeagueDetailPage;
