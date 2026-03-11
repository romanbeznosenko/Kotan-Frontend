import { ageGroupColors, AgeGroup } from "../../styles/colors";

const PRIMARY = '#46a5fd';

interface MatchCardProps {
    homeTeamName: string;
    homeTeamLogo?: string;
    awayTeamName: string;
    awayTeamLogo?: string;
    competition: string;
    stadium: string;
    matchDate: string;
    ageGroup: AgeGroup;
    isHome: boolean;
}

const TeamBlock = ({ name, logo, iconColor }: { name: string; logo?: string; iconColor: string }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flex: 1, textAlign: 'center' }}>
        <div style={{
            width: 64, height: 64, borderRadius: '50%',
            backgroundColor: '#f8fafc',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid #e2e8f0', flexShrink: 0, overflow: 'hidden',
        }}>
            {logo
                ? <img src={logo} alt={name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 6 }} />
                : <span className="material-symbols-outlined" style={{ fontSize: 32, color: iconColor }}>shield</span>
            }
        </div>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.3, maxWidth: 100, display: 'block' }}>
            {name.toUpperCase()}
        </span>
    </div>
);

const MatchCard = ({ homeTeamName, homeTeamLogo, awayTeamName, awayTeamLogo, competition, stadium, matchDate, ageGroup, isHome }: MatchCardProps) => {
    const barColor = ageGroupColors[ageGroup];

    return (
        <div style={{
            backgroundColor: '#fff',
            borderRadius: '0.75rem',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            border: '1px solid #e2e8f0',
            width: '100%',
            fontFamily: "'Lexend', sans-serif",
            transition: 'box-shadow 0.2s',
        }}>
            {/* Top bar */}
            <div style={{
                backgroundColor: barColor,
                padding: '0.5rem 1rem',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
                <span style={{ color: '#fff', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {competition}
                </span>
                <span style={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: '#fff',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '0.25rem',
                }}>
                    {isHome ? 'DOM' : 'WYJAZD'}
                </span>
            </div>

            {/* Teams */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '1.5rem 1.5rem 1rem' }}>
                <TeamBlock name={homeTeamName} logo={homeTeamLogo} iconColor={PRIMARY} />
                <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#cbd5e1', flexShrink: 0 }}>VS</span>
                <TeamBlock name={awayTeamName} logo={awayTeamLogo} iconColor={barColor} />
            </div>

            {/* Footer */}
            <div style={{ borderTop: '1px solid #f1f5f9', padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#64748b', fontSize: '0.875rem' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>calendar_today</span>
                    <span>{matchDate}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#64748b', fontSize: '0.875rem' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>location_on</span>
                    <span>{stadium}</span>
                </div>
            </div>
        </div>
    );
};

export default MatchCard;
