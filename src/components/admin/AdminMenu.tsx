import { useNavigate } from 'react-router-dom';

export type AdminMenuKey = 'dashboard' | 'competitions' | 'clubs' | 'teams' | 'players' | 'articles' | 'matches' | 'matchStaistics';

const NAV_ITEMS: { key: AdminMenuKey; icon: string; label: string }[] = [
    { key: 'dashboard',       icon: 'dashboard',      label: 'Dashboard' },
    { key: 'clubs',           icon: 'storefront',     label: 'Kluby' },
    { key: 'teams',           icon: 'groups',         label: 'Zespoły' },
    { key: 'players',         icon: 'person',         label: 'Zawodnicy' },
    { key: 'competitions',    icon: 'emoji_events',   label: 'Ligi' },
    { key: 'matches',         icon: 'sports_soccer',  label: 'Mecze' },
    { key: 'articles',        icon: 'newspaper',      label: 'Aktualności' },
    { key: 'matchStaistics',  icon: 'bar_chart',      label: 'Statystyki' },
];

interface AdminMenuProps {
    selectedKey: AdminMenuKey;
    onSelect: (key: AdminMenuKey) => void;
}

const AdminMenu = ({ selectedKey, onSelect }: AdminMenuProps) => {
    const navigate = useNavigate();

    const linkBase: React.CSSProperties = {
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        padding: '0.625rem 0.75rem', borderRadius: '0.5rem',
        fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer',
        transition: 'all 0.15s', textDecoration: 'none',
        color: '#94a3b8', background: 'none', border: 'none',
        width: '100%', textAlign: 'left', fontFamily: "'Inter', sans-serif",
    };

    const linkActive: React.CSSProperties = {
        ...linkBase,
        color: '#46a5fd',
        background: 'rgba(15,23,42,0.5)',
        borderRight: '4px solid #46a5fd',
        borderRadius: '0.5rem 0 0 0.5rem',
        fontWeight: 700,
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: "'Inter', sans-serif" }}>

            {/* Brand */}
            <div style={{ padding: '1.5rem' }}>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.03em', color: '#fff', fontFamily: "'Manrope', sans-serif", margin: 0, lineHeight: 1.2 }}>
                    Kotan Ozorków
                </h1>
                <p style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.2em', marginTop: '0.25rem', fontWeight: 700 }}>
                    Admin Panel
                </p>
            </div>

            {/* Nav */}
            <nav style={{ flex: 1, padding: '0 1rem', display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
                {NAV_ITEMS.map(item => {
                    const isActive = selectedKey === item.key;
                    return (
                        <button
                            key={item.key}
                            style={isActive ? linkActive : linkBase}
                            onClick={() => onSelect(item.key)}
                            onMouseEnter={e => { if (!isActive) { (e.currentTarget as HTMLButtonElement).style.color = '#fff'; (e.currentTarget as HTMLButtonElement).style.background = '#1e293b'; } }}
                            onMouseLeave={e => { if (!isActive) { (e.currentTarget as HTMLButtonElement).style.color = '#94a3b8'; (e.currentTarget as HTMLButtonElement).style.background = 'none'; } }}
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '1.375rem', color: isActive ? '#46a5fd' : 'inherit', flexShrink: 0 }}>
                                {item.icon}
                            </span>
                            {item.label}
                        </button>
                    );
                })}
            </nav>

            {/* Footer */}
            <div style={{ padding: '1rem', borderTop: '1px solid #0f172a', display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
                {[
                    { icon: 'logout',   label: 'Logout', onClick: () => navigate('/admin/login') },
                ].map(item => (
                    <button
                        key={item.label}
                        style={{ ...linkBase, borderRadius: '0.5rem' }}
                        onClick={item.onClick}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#fff'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#94a3b8'; }}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '1.375rem' }}>{item.icon}</span>
                        {item.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default AdminMenu;
