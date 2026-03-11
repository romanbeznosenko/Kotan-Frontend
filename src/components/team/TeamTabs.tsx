const PRIMARY = '#46a5fd';

export type TeamTab = 'senior' | 'kids' | 'girls';

const TABS: { id: TeamTab; label: string }[] = [
    { id: 'senior', label: 'Seniorzy' },
    { id: 'kids', label: 'Kotan Kids' },
    { id: 'girls', label: 'Kotan Girls' },
];

interface TeamTabsProps {
    active: TeamTab;
    onChange: (tab: TeamTab) => void;
}

const TeamTabs = ({ active, onChange }: TeamTabsProps) => (
    <div style={{
        marginBottom: '2.5rem',
        overflowX: 'auto',
        borderBottom: '1px solid #e2e8f0',
    }}>
        <div style={{
            display: 'flex',
            gap: '2rem',
            minWidth: 'max-content',
        }}>
            {TABS.map(({ id, label }) => {
                const isActive = active === id;
                return (
                    <button
                        key={id}
                        onClick={() => onChange(id)}
                        style={{
                            background: 'none',
                            border: 'none',
                            borderBottom: isActive ? `3px solid ${PRIMARY}` : '3px solid transparent',
                            padding: '0 0.5rem 1rem',
                            fontSize: '0.875rem',
                            fontWeight: 700,
                            color: isActive ? '#0f172a' : '#64748b',
                            cursor: 'pointer',
                            transition: 'color 0.2s, border-color 0.2s',
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

export default TeamTabs;
