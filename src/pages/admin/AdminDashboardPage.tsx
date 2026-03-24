import React, { useState } from 'react';
import AdminMenu from '../../components/admin/AdminMenu';
import type { AdminMenuKey } from '../../components/admin/AdminMenu';
import AdminCompetitionTable from '../../components/admin/AdminCompetitionTable';
import AdminClubsSection from '../../components/admin/AdminClubsSection';
import AdminTeamsSection from '../../components/admin/AdminTeamsSection';
import AdminDashboardSection from '../../components/admin/AdminDashboardSection';
import AdminPlayersSection from '../../components/admin/AdminPlayersSection';

const tableMap: Partial<Record<AdminMenuKey, React.ReactElement>> = {
    dashboard: <AdminDashboardSection />,
    competitions: <AdminCompetitionTable />,
    clubs: <AdminClubsSection />,
    teams: <AdminTeamsSection />,
    players: <AdminPlayersSection />,
};

const AdminDashboardPage: React.FC = () => {
    const [selectedKey, setSelectedKey] = useState<AdminMenuKey>(
        () => (localStorage.getItem('adminMenuKey') as AdminMenuKey) ?? 'dashboard'
    );

    const handleSelect = (key: AdminMenuKey) => {
        localStorage.setItem('adminMenuKey', key);
        setSelectedKey(key);
    };

    const content = tableMap[selectedKey];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', fontFamily: "'Inter', sans-serif" }}>

            {/* Sidebar */}
            <aside style={{
                position: 'fixed', left: 0, top: 0, height: '100vh', width: '16rem',
                background: '#020617', display: 'flex', flexDirection: 'column',
                boxShadow: '4px 0 24px rgba(0,0,0,0.3)', zIndex: 50, overflowY: 'auto',
            }}>
                <AdminMenu selectedKey={selectedKey} onSelect={handleSelect} />
            </aside>

            {/* Main */}
            <main style={{ marginLeft: '16rem', flex: 1, minHeight: '100vh', overflowY: 'auto', background: '#f8f9ff' }}>
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
