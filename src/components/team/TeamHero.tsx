interface TeamHeroProps {
    onMoreClick?: () => void;
}

const TeamHero = ({ }: TeamHeroProps) => (
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
    </div>
);

export default TeamHero;
