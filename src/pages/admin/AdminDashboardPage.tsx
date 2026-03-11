import React, { useState } from 'react';
import { Layout } from 'antd';
import AdminMenu from '../../components/admin/AdminMenu';
import type { AdminMenuKey } from '../../components/admin/AdminMenu';
import AdminCompetitionTable from '../../components/admin/AdminCompetitionTable';
import AdminClubTable from '../../components/admin/AdminClubTable';
const { Sider } = Layout;

const tableMap: Partial<Record<AdminMenuKey, React.ReactElement>> = {
    competitions: <AdminCompetitionTable />,
    clubs: <AdminClubTable />,
};

const tableContent = (key: AdminMenuKey) => {
    const table = tableMap[key];
    if (!table) return null;
    return <div key={key} className="admin-table-fade">{table}</div>;
};

const App: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedKey, setSelectedKey] = useState<AdminMenuKey>(
        () => (localStorage.getItem('adminMenuKey') as AdminMenuKey) ?? 'competitions'
    );

    const handleSelect = (key: AdminMenuKey) => {
        localStorage.setItem('adminMenuKey', key);
        setSelectedKey(key);
    };

    return (
        <Layout style={{ minHeight: '100vh', display: 'flex', width: '100vw' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div className="demo-logo-vertical" />
                <AdminMenu selectedKey={selectedKey} onSelect={handleSelect} />
            </Sider>
            <Layout style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                {tableContent(selectedKey)}
            </Layout>
        </Layout>
    );
};

export default App;
