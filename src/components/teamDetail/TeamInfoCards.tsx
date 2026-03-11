const PRIMARY = '#46a5fd';

interface TeamInfo {
    coach: string;
    league: string;
    location: string;
}

const InfoCard = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
    <div style={{
        backgroundColor: '#fff',
        padding: '1.25rem',
        borderRadius: '0.75rem',
        border: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
    }}>
        <div style={{
            width: 48, height: 48, borderRadius: '50%',
            backgroundColor: `rgba(70,165,253,0.1)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: PRIMARY, flexShrink: 0,
        }}>
            <span className="material-symbols-outlined">{icon}</span>
        </div>
        <div>
            <p style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 2px' }}>
                {label}
            </p>
            <p style={{ color: '#0f172a', fontWeight: 700, margin: 0, fontSize: '0.95rem' }}>{value}</p>
        </div>
    </div>
);

const TeamInfoCards = ({ coach, league, location }: TeamInfo) => (
    <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
    }}>
        <InfoCard icon="person" label="Trener" value={coach} />
        <InfoCard icon="trophy" label="Liga" value={league} />
        <InfoCard icon="location_on" label="Miejsce treningów" value={location} />
    </div>
);

export default TeamInfoCards;
