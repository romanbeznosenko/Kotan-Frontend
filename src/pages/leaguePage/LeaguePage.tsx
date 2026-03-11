import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageTemplate from "../../components/common/PageTemplate";

const PRIMARY = '#46a5fd';

type FilterKey = 'all' | 'senior' | 'junior' | 'mlodzik' | 'girls';

const FILTERS: { id: FilterKey; label: string }[] = [
    { id: 'all',     label: 'Wszystkie' },
    { id: 'senior',  label: 'Seniorzy' },
    { id: 'junior',  label: 'Junior' },
    { id: 'mlodzik', label: 'Młodzik' },
    { id: 'girls',   label: 'Girls Teams' },
];

interface League {
    id: string;
    name: string;
    team: string;
    season: string;
    category: FilterKey;
    badge: string;
    badgeColor: string;
    image: string;
}

const LEAGUES: League[] = [
    {
        id: 'senior',
        name: 'Liga Seniorów',
        team: 'Senior',
        season: 'Sezon 2025/2026',
        category: 'senior',
        badge: 'Seniorzy',
        badgeColor: '#1e3a8a',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBiX157nqSBALn9B6lnXwE9R8iaMS2ytcb1le0n-ozxJD_IxolPoXD_BVIvzRoACgkRMKrkGuuQCtqMVLcm1TjUr673_irBlZHkPXUQ36HZrkby1MrU9aVLhhFwC2KkxdliVrDCU0Fl0Mis-I-Jr9cjHM_CJ3hwJV9TyUCSBRwZl9DwlBvkkebtnB0gbB-5lTbAsA00FwSoqv_757CGjCLIjKMF__sdcVFAnYYp9WkK9AZeGEN4d6btCreZBbl8Kir2p32tJlIWetU',
    },
    {
        id: 'junior',
        name: 'Liga Wojewódzka Junior',
        team: 'Junior',
        season: 'Sezon 2025/2026',
        category: 'junior',
        badge: 'Junior',
        badgeColor: '#16a34a',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBii8u6mfXxHgcbkve2fFf-QCq2xFGuvuNapPnFQFL01mfEB0ljVKw9mrVzxqnapIVdlHTw3Uk3tFWGLK9trHZF0WemP2EdEa_RqB8NOXXnM-OvZkQu99Z1_O6Bm2nQ2Z29RbiPHsPFizKc1bn3890aRqZ_m8AKiLgPNNaINKoRA40OVBeE9z5WHvOkx403zZrNnxhSDzOmYdNpXkoI1QPWioZRgNesgNuHLdn3MOPrvpyIfbTrUxCCyNQl75ZF6FReA2yRzuF6d6Y',
    },
    {
        id: 'mlodzik',
        name: 'Liga Młodzik',
        team: 'Młodzik',
        season: 'Sezon 2025/2026',
        category: 'mlodzik',
        badge: 'Młodzik',
        badgeColor: '#eab308',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3nHFyJtZuV4AGcvCQog4_Gj12MJfT0pC-MVOYjwvizuQZDvoCWH7hddPC5Jx-DGPpsHaX0y9dSSnU961qNoCA1w4U3QwezG35W2lM6l8AhG_wvuj7MRg64mSdtMWFbxP6yY9z7Bas8S4pmicnb-yu887nf0Nwley5X5M0XAigDDt8rnIJYP_fJpy4OW9bgJ13hjJLRy5HJnDv9Zx-xFU3X1Z-gRFaH3WHL4eNWodatTF6JjW5C4rCTN4ZZ0QLG7kgSFSsM7Z4aAE',
    },
    {
        id: 'orlik',
        name: 'Liga Orlik',
        team: 'Orlik',
        season: 'Sezon 2025/2026',
        category: 'mlodzik',
        badge: 'Orlik',
        badgeColor: '#ea580c',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMssXpExLc7Oa_xGXEcDkR_Exa3mORZkG9QLTQYca2NDmydmJP4QCqxBy485Fo2WAPvvrTpsPmdonvPGJAnOtZfSdRZoa61NOFYTj53u-MCdnrjJLUAWIsO__dStkZk_R2wCO5Z_ZA9spkJffYJTRLr2g6vZkHjM8lsKQLWXQ0AZcFT6zgZ7WsyXWTFu7Enq3epRfFL6pGXBi1tAWqnYF5hsTZhxRkL9HhTatbVqGlzxTT9S-Pakn8mlaDOd0Z0fyHGt8lMGZRpxc',
    },
    {
        id: 'zak',
        name: 'Liga Żak',
        team: 'Żak',
        season: 'Sezon 2025/2026',
        category: 'mlodzik',
        badge: 'Żak',
        badgeColor: '#60a5fa',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeSvXU70L-DqVR26K7qhTCH7kuySIEELbH6D3WTDyP3sHCG9TZ64Rx8-Zu8zG6vtObuIx5aHwalc-oCCEbYyyyKn20UQfVfrhRdEHRhmKI4Rc3nbfayuambNtRky2OeTXc5lMD6MS_B1I5NO16ZGFVWf9fwsZWKQEf1JmaH8cCZKTqYRMtlc5OdaWal6biuM74kOrpnuFrmEwTSpVxW1UZDfqZ1u6_W0cYBsoBhjA-JSbzRHaGgwY405mQjRhRxVLWqiO5Mx5-Wn8',
    },
    {
        id: 'seniorki',
        name: 'Liga Seniorki',
        team: 'Seniorki',
        season: 'Sezon 2025/2026',
        category: 'girls',
        badge: 'Girls',
        badgeColor: '#ec4899',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBW11h_RSI1ZUehN7BIyepV5hzr9DuSi8tusOMt2PV9zStqIn8ipM-koBXMqcRyoR2sKBtrIYrElJGc__X6djx2_u94X3hbbLstasHd5iCesfUmyFuOVamW3A2-mjGxXNYZ9b4tIyoRK5ZzXkR35jC0GFHxJzE7Jm7KHXuelwftLuEkbvvjWlMu_nzqmgD2VHUgilH9v_9corw3xhwAA--Py5PL7oH4JpJpEYnsUj-lT6CRplNcB_0TVz2kUwDILHmMSP1Ehao8oXE',
    },
    {
        id: 'mlodziczki',
        name: 'Liga Młodziczki',
        team: 'Młodziczki',
        season: 'Sezon 2025/2026',
        category: 'girls',
        badge: 'Girls',
        badgeColor: '#ec4899',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNMGOBKEJqYw9gYxQUmj_EX1algiek-TjrWPFYrnkQffj-k62ohtF8XPIGSJSEuEYZb87e2FET6KvCqrLNycrsl08UeJFg5nZ5SrCHdra7XgAD5fhJcSgDNH12-eyyQFaUYlhbZ0pKDfOyzkI5JbBiXz-fNEObzhMpkZMGgSRPa6RZKCUultfcru0cFq6i6P_YOrV2rDvKhPAV_zBoBl5fiSQCzujTTuSR-iOPii4pUK_yDPat8lAOSQpZtWT-VxwFOH-rY0ppOE8',
    },
    {
        id: 'orliczki',
        name: 'Liga Orliczki',
        team: 'Orliczki',
        season: 'Sezon 2025/2026',
        category: 'girls',
        badge: 'Girls',
        badgeColor: '#ec4899',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6Vm9_zawZzefNMvKAPP2ksf-XCgAa9qnROhrHgqa9Ks5eHUOoXtx3Q7jM7gyZlV_FU450e5tNTc99RXRrYthBjhfmhqP56XTcnSLX9qf_Gvw7EJL0pNhZWM4LLpgSkALHgJ6FwanVPHiPoJQ9hPjArKTrR5FjLVAFkqa1wr5ByHoZkmf_kOnbYrEROr-_wZtxaTvuTcQIuTOs-FI45IvkBTk8PN-csKuLXwtghiZmXhbCR3ag6MWfDnkNFes4puWcRL2qA5Ku83w',
    },
];

const LeagueCard = ({ league }: { league: League }) => {
    const [hovered, setHovered] = useState(false);
    const [btnHovered, setBtnHovered] = useState(false);
    const navigate = useNavigate();

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                borderRadius: '0.75rem',
                border: '1px solid #e2e8f0',
                backgroundColor: '#fff',
                boxShadow: hovered ? '0 8px 24px rgba(0,0,0,0.1)' : 'none',
                transition: 'box-shadow 0.2s',
            }}
        >
            {/* Image */}
            <div style={{ aspectRatio: '16 / 9', position: 'relative', overflow: 'hidden' }}>
                <div style={{
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url('${league.image}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    transform: hovered ? 'scale(1.05)' : 'scale(1)',
                    transition: 'transform 0.4s ease',
                }} />
                <div style={{
                    position: 'absolute',
                    top: 12,
                    left: 12,
                    backgroundColor: league.badgeColor,
                    color: '#fff',
                    fontSize: '0.625rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    padding: '0 10px',
                    height: 28,
                    borderRadius: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                }}>
                    {league.badge}
                </div>
            </div>

            {/* Content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1.25rem' }}>
                <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: 700,
                    color: hovered ? PRIMARY : '#0f172a',
                    margin: '0 0 0.25rem',
                    transition: 'color 0.2s',
                }}>
                    {league.name}
                </h3>
                <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#64748b', margin: '0 0 0.25rem' }}>
                    Drużyna: {league.team}
                </p>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '0 0 1rem' }}>
                    {league.season}
                </p>
                <button
                    onMouseEnter={() => setBtnHovered(true)}
                    onMouseLeave={() => setBtnHovered(false)}
                    onClick={() => navigate(`/matches/${league.id}`)}
                    style={{
                        marginTop: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.375rem',
                        width: '100%',
                        padding: '0.625rem',
                        backgroundColor: PRIMARY,
                        color: '#fff',
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        border: 'none',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        opacity: btnHovered ? 0.88 : 1,
                        transition: 'opacity 0.2s',
                    }}
                >
                    Zobacz tabelę
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>trending_up</span>
                </button>
            </div>
        </div>
    );
};

const LeaguePage = () => {
    const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

    const filtered = activeFilter === 'all'
        ? LEAGUES
        : LEAGUES.filter((l) => l.category === activeFilter);

    return (
        <PageTemplate>
            <div style={{
                width: '100%',
                maxWidth: '75rem',
                margin: '0 auto',
                padding: '2.5rem 1.5rem',
                fontFamily: "'Lexend', sans-serif",
                boxSizing: 'border-box',
            }}>
                {/* Hero */}
                <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, color: '#0f172a', margin: 0, lineHeight: 1.1 }}>
                        Rozgrywki Akademii
                    </h1>
                    <p style={{ maxWidth: '42rem', fontSize: '1.125rem', color: '#475569', lineHeight: 1.75, margin: 0 }}>
                        Sprawdź rozgrywki, w których uczestniczą drużyny Kotan Ozorków, oraz aktualne tabele ligowe. Bądź na bieżąco z wynikami naszych zawodników.
                    </p>
                </div>

                {/* Filters */}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                    marginBottom: '2rem',
                }}>
                    {FILTERS.map(({ id, label }) => {
                        const isActive = activeFilter === id;
                        return (
                            <button
                                key={id}
                                onClick={() => setActiveFilter(id)}
                                style={{
                                    height: 40,
                                    padding: '0 1.5rem',
                                    borderRadius: 9999,
                                    fontSize: '0.875rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    border: isActive ? 'none' : '1px solid #e2e8f0',
                                    backgroundColor: isActive ? PRIMARY : '#fff',
                                    color: isActive ? '#fff' : '#475569',
                                    boxShadow: isActive ? `0 4px 12px rgba(70,165,253,0.25)` : 'none',
                                    transition: 'all 0.2s',
                                }}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>

                {/* Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                    gap: '1.5rem',
                }}>
                    {filtered.map((league) => (
                        <LeagueCard key={league.id} league={league} />
                    ))}
                </div>
            </div>
        </PageTemplate>
    );
};

export default LeaguePage;
