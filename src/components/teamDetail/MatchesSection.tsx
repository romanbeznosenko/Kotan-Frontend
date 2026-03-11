const PRIMARY = '#46a5fd';

const MATCHES = [
    {
        date: '15 Maj 2025',
        time: '11:00',
        home: { name: 'Kotan Ozorków', logo: null },
        away: { name: 'Legia Warszawa', logo: null },
        isHome: true,
        competition: 'Liga Młodzieżowa',
        location: 'Stadion Miejski, Ozorków',
    },
    {
        date: '22 Maj 2025',
        time: '13:00',
        home: { name: 'Widzew Łódź', logo: null },
        away: { name: 'Kotan Ozorków', logo: null },
        isHome: false,
        competition: 'Puchar Regionu',
        location: 'Stadion Widzewa, Łódź',
    },
];

const MatchCard = ({ match }: { match: typeof MATCHES[0] }) => (
    <div style={{
        backgroundColor: '#fff',
        borderRadius: '0.75rem',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
    }}>
        <div style={{
            backgroundColor: match.isHome ? '#f0f9ff' : '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            padding: '0.5rem 1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        }}>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>{match.competition}</span>
            <span style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                backgroundColor: match.isHome ? PRIMARY : '#64748b',
                color: '#fff',
                padding: '0.2rem 0.5rem',
                borderRadius: '0.375rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
            }}>
                {match.isHome ? 'DOM' : 'WYJAZD'}
            </span>
        </div>

        <div style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                {/* Home team */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                    <div style={{
                        width: 48, height: 48,
                        borderRadius: '50%',
                        backgroundColor: '#e2e8f0',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 28, color: '#94a3b8' }}>shield</span>
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0f172a', textAlign: 'center' }}>
                        {match.home.name}
                    </span>
                </div>

                {/* VS */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                    <span style={{
                        fontSize: '1.25rem',
                        fontWeight: 800,
                        color: '#0f172a',
                        letterSpacing: '0.05em',
                    }}>VS</span>
                    <span style={{
                        fontSize: '0.75rem',
                        color: '#64748b',
                        backgroundColor: '#f1f5f9',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '0.375rem',
                        fontWeight: 500,
                    }}>{match.time}</span>
                </div>

                {/* Away team */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                    <div style={{
                        width: 48, height: 48,
                        borderRadius: '50%',
                        backgroundColor: '#e2e8f0',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 28, color: '#94a3b8' }}>shield</span>
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0f172a', textAlign: 'center' }}>
                        {match.away.name}
                    </span>
                </div>
            </div>

            <div style={{
                marginTop: '0.75rem',
                paddingTop: '0.75rem',
                borderTop: '1px solid #f1f5f9',
                display: 'flex',
                gap: '1rem',
                fontSize: '0.75rem',
                color: '#64748b',
            }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>calendar_today</span>
                    {match.date}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>location_on</span>
                    {match.location}
                </span>
            </div>
        </div>
    </div>
);

const MatchesSection = () => (
    <section id="mecze" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Najbliższe Mecze</h2>
            <button style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.875rem',
                color: PRIMARY,
                fontWeight: 600,
                padding: 0,
            }}>
                Wszystkie mecze →
            </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {MATCHES.map((m, i) => <MatchCard key={i} match={m} />)}
        </div>
    </section>
);

export default MatchesSection;
