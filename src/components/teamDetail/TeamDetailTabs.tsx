const PRIMARY = '#46a5fd';

export type DetailTab = 'sklad' | 'mecze' | 'tabela' | 'galeria';

const TABS: { id: DetailTab; label: string }[] = [
    { id: 'sklad',   label: 'Skład' },
    { id: 'mecze',   label: 'Mecze' },
    { id: 'tabela',  label: 'Tabela' },
    { id: 'galeria', label: 'Galeria' },
];

interface TeamDetailTabsProps {
    active: DetailTab;
    onChange: (tab: DetailTab) => void;
}

const TeamDetailTabs = ({ active, onChange }: TeamDetailTabsProps) => (
    <div style={{
        backgroundColor: '#fff',
        borderRadius: '0.75rem',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        position: 'sticky',
        top: 80,
        zIndex: 40,
    }}>
        <div style={{ display: 'flex', borderBottom: '1px solid #f1f5f9' }}>
            {TABS.map(({ id, label }) => {
                const isActive = active === id;
                return (
                    <button
                        key={id}
                        onClick={() => onChange(id)}
                        style={{
                            flex: 1,
                            padding: '1rem',
                            textAlign: 'center',
                            fontSize: '0.875rem',
                            fontWeight: 700,
                            color: isActive ? PRIMARY : '#64748b',
                            background: isActive ? `rgba(70,165,253,0.05)` : 'none',
                            border: 'none',
                            borderBottom: isActive ? `2px solid ${PRIMARY}` : '2px solid transparent',
                            cursor: 'pointer',
                            transition: 'color 0.2s, background 0.2s',
                        }}
                    >
                        {label}
                    </button>
                );
            })}
        </div>
    </div>
);

export default TeamDetailTabs;
