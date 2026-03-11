const PRIMARY = '#46a5fd';

interface TeamHeroProps {
    onMoreClick?: () => void;
}

const TeamHero = ({ onMoreClick }: TeamHeroProps) => (
    <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1.5rem',
        marginBottom: '3rem',
        flexWrap: 'wrap',
    }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <h1 style={{
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                fontWeight: 900,
                color: '#0f172a',
                letterSpacing: '-0.025em',
                margin: 0,
                lineHeight: 1.1,
            }}>
                Zespoły Kotan Ozorków
            </h1>
            <p style={{ color: '#475569', fontSize: '1.125rem', margin: 0 }}>
                Poznaj drużyny akademii Kotan Ozorków oraz ich rozgrywki.
            </p>
        </div>
        <button
            onClick={onMoreClick}
            style={{
                height: 48,
                padding: '0 1.5rem',
                backgroundColor: PRIMARY,
                color: '#fff',
                fontSize: '0.875rem',
                fontWeight: 700,
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'opacity 0.2s',
            }}
        >
            Więcej o klubie
        </button>
    </div>
);

export default TeamHero;
