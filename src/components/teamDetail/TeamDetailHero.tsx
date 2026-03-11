const PRIMARY = '#46a5fd';

const HERO_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfibZGeY0lANytHCijUyVyFxeFnmwOV0zJ5ndMMJcOCUOTGIOHOcDbccPOU8Z7krFgmRItE8XOlPU8Q8lurGn2r_9bbdRZXGxZbc3RnoLzPxQa2c0OFt3rRNZ4aRB_Y6FTxhvXPPWsxv-OcQ1SEuG7YejVfrvIuETEWvv3spm0Inq8DWVQ4AMrEWfww5nLxWAP21YG80Dbyb8L96mFm63zCa1J7CoKDdD6_x0_FmSSEhvb3CHxby2RjXgE3iQgvnHjQyD3S4POx2A';

interface TeamDetailHeroProps {
    name: string;
    years: string;
}

const TeamDetailHero = ({ name, years }: TeamDetailHeroProps) => (
    <div style={{
        borderRadius: '0.75rem',
        overflow: 'hidden',
        minHeight: 400,
        backgroundImage: `linear-gradient(0deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 50%), url('${HERO_IMAGE}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
    }}>
        <div style={{ padding: '2rem' }}>
            <span style={{
                backgroundColor: PRIMARY,
                color: '#fff',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '4px 12px',
                borderRadius: 9999,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                display: 'inline-block',
                marginBottom: '0.5rem',
            }}>
                {years}
            </span>
            <h1 style={{
                color: '#fff',
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 800,
                margin: 0,
                lineHeight: 1.1,
            }}>
                {name}
            </h1>
        </div>
    </div>
);

export default TeamDetailHero;
