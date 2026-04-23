import React, { useState } from 'react';
import AdminMenu, { type AdminMenuKey } from '../../components/admin/AdminMenu';
import AdminCompetitionTable from '../../components/admin/AdminCompetitionTable';
import AdminClubsSection from '../../components/admin/AdminClubsSection';
import AdminTeamsSection from '../../components/admin/AdminTeamsSection';
import AdminDashboardSection from '../../components/admin/AdminDashboardSection';
import AdminPlayersSection from '../../components/admin/AdminPlayersSection';
import AdminNewsSection from '../../components/admin/AdminNewsSection';

const SIDEBAR_W   = '16rem';
const COLLAPSED_W = '4.5rem';

const tableMap: Partial<Record<AdminMenuKey, React.ReactElement>> = {
    dashboard:    <AdminDashboardSection />,
    competitions: <AdminCompetitionTable />,
    clubs:        <AdminClubsSection />,
    teams:        <AdminTeamsSection />,
    players:      <AdminPlayersSection />,
    articles:     <AdminNewsSection />,
};

const AdminDashboardPage: React.FC = () => {
    const [selectedKey, setSelectedKey] = useState<AdminMenuKey>(
        () => (localStorage.getItem('adminMenuKey') as AdminMenuKey) ?? 'dashboard'
    );
    const [collapsed, setCollapsed] = useState(
        () => localStorage.getItem('adminSidebarCollapsed') === 'true'
    );

    const handleSelect = (key: AdminMenuKey) => {
        localStorage.setItem('adminMenuKey', key);
        setSelectedKey(key);
    };

    const handleToggle = () => {
        setCollapsed(v => {
            localStorage.setItem('adminSidebarCollapsed', String(!v));
            return !v;
        });
    };

    const w = collapsed ? COLLAPSED_W : SIDEBAR_W;
    const content = tableMap[selectedKey];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', fontFamily: "'Inter', sans-serif" }}>
            <aside style={{
                position: 'fixed', left: 0, top: 0, height: '100vh', width: w,
                background: '#020617', display: 'flex', flexDirection: 'column',
                boxShadow: '4px 0 24px rgba(0,0,0,0.3)', zIndex: 50,
                overflowY: 'auto', overflowX: 'hidden',
                transition: 'width 0.22s ease',
            }}>
                <AdminMenu
                    selectedKey={selectedKey}
                    onSelect={handleSelect}
                    collapsed={collapsed}
                    onToggle={handleToggle}
                />
            </aside>

            <main style={{
                marginLeft: w, flex: 1, minHeight: '100vh', overflowY: 'auto', background: '#f8f9ff',
                transition: 'margin-left 0.22s ease',
            }}>
                {content ?? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8', fontSize: '0.875rem' }}>
                        Wybierz sekcję z menu
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminDashboardPage;
