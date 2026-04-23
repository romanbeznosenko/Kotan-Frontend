import { useNavigate } from 'react-router-dom';

export type AdminMenuKey = 'dashboard' | 'competitions' | 'clubs' | 'teams' | 'players' | 'articles' | 'matches' | 'matchStaistics';

const NAV_ITEMS: { key: AdminMenuKey; icon: string; label: string }[] = [
    { key: 'dashboard',      icon: 'dashboard',     label: 'Dashboard' },
    { key: 'clubs',          icon: 'storefront',    label: 'Kluby' },
    { key: 'teams',          icon: 'groups',        label: 'Zespoły' },
    { key: 'players',        icon: 'person',        label: 'Zawodnicy' },
    { key: 'competitions',   icon: 'emoji_events',  label: 'Ligi' },
    { key: 'matches',        icon: 'sports_soccer', label: 'Mecze' },
    { key: 'articles',       icon: 'newspaper',     label: 'Aktualności' },
    { key: 'matchStaistics', icon: 'bar_chart',     label: 'Statystyki' },
];

interface AdminMenuProps {
    selectedKey: AdminMenuKey;
    onSelect:    (key: AdminMenuKey) => void;
    collapsed:   boolean;
    onToggle:    () => void;
}

const AdminMenu = ({ selectedKey, onSelect, collapsed, onToggle }: AdminMenuProps) => {
    const navigate = useNavigate();

    const itemBase: React.CSSProperties = {
        display: 'flex', alignItems: 'center',
        gap: collapsed ? 0 : '0.75rem',
        padding: collapsed ? '0.625rem 0' : '0.625rem 0.75rem',
        justifyContent: collapsed ? 'center' : 'flex-start',
        borderRadius: collapsed ? '0.5rem' : '0.5rem 0 0 0.5rem',
        fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer',
        transition: 'all 0.15s', color: '#94a3b8',
        background: 'none', border: 'none',
        width: '100%', textAlign: 'left', fontFamily: "'Inter', sans-serif",
        position: 'relative',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
    };

    const itemActive: React.CSSProperties = {
        ...itemBase,
        color: '#46a5fd',
        background: 'rgba(15,23,42,0.5)',
        borderRight: collapsed ? 'none' : '4px solid #46a5fd',
        fontWeight: 700,
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: "'Inter', sans-serif" }}>

            {/* Brand + toggle */}
            <div style={{
                padding: collapsed ? '1.25rem 0' : '1.25rem 1rem 1.25rem 1.5rem',
                display: 'flex', alignItems: 'center',
                justifyContent: collapsed ? 'center' : 'space-between',
                borderBottom: '1px solid #0f172a',
                transition: 'padding 0.22s ease',
                gap: '0.5rem',
            }}>
                {!collapsed && (
                    <div style={{ overflow: 'hidden' }}>
                        <h1 style={{ fontSize: '1.125rem', fontWeight: 700, letterSpacing: '-0.03em', color: '#fff', fontFamily: "'Manrope', sans-serif", margin: 0, lineHeight: 1.2, whiteSpace: 'nowrap' }}>
                            Kotan Ozorków
                        </h1>
                        <p style={{ fontSize: '9px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.2em', marginTop: '0.2rem', fontWeight: 700, margin: 0 }}>
                            Admin Panel
                        </p>
                    </div>
                )}
                <button
                    onClick={onToggle}
                    title={collapsed ? 'Rozwiń menu' : 'Zwiń menu'}
                    style={{
                        background: '#1e293b', border: 'none', borderRadius: '0.5rem',
                        width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', color: '#94a3b8', flexShrink: 0, transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#334155'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#1e293b'}
                >
                    <span className="material-symbols-outlined" style={{ fontSize: '1.125rem', transition: 'transform 0.22s ease', transform: collapsed ? 'rotate(180deg)' : 'none' }}>
                        chevron_left
                    </span>
                </button>
            </div>

            {/* Nav */}
            <nav style={{ flex: 1, padding: collapsed ? '0.75rem 0.5rem' : '0.75rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.125rem', transition: 'padding 0.22s ease' }}>
                {NAV_ITEMS.map(item => {
                    const isActive = selectedKey === item.key;
                    return (
                        <button
                            key={item.key}
                            style={isActive ? itemActive : itemBase}
                            onClick={() => onSelect(item.key)}
                            title={collapsed ? item.label : undefined}
                            onMouseEnter={e => { if (!isActive) { (e.currentTarget as HTMLButtonElement).style.color = '#fff'; (e.currentTarget as HTMLButtonElement).style.background = '#1e293b'; } }}
                            onMouseLeave={e => { if (!isActive) { (e.currentTarget as HTMLButtonElement).style.color = '#94a3b8'; (e.currentTarget as HTMLButtonElement).style.background = 'none'; } }}
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '1.375rem', color: isActive ? '#46a5fd' : 'inherit', flexShrink: 0 }}>
                                {item.icon}
                            </span>
                            {!collapsed && item.label}
                        </button>
                    );
                })}
            </nav>

            {/* Footer */}
            <div style={{ padding: collapsed ? '1rem 0.5rem' : '1rem', borderTop: '1px solid #0f172a', display: 'flex', flexDirection: 'column', gap: '0.125rem', transition: 'padding 0.22s ease' }}>
                <button
                    style={{ ...itemBase, borderRadius: '0.5rem' }}
                    onClick={() => navigate('/admin/login')}
                    title={collapsed ? 'Logout' : undefined}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#fff'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#94a3b8'; }}
                >
                    <span className="material-symbols-outlined" style={{ fontSize: '1.375rem', flexShrink: 0 }}>logout</span>
                    {!collapsed && 'Logout'}
                </button>
            </div>
        </div>
    );
};

export default AdminMenu;
