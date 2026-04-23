import { useState } from 'react';
import type { ReactNode } from 'react';
import AdminMenu, { type AdminMenuKey } from './AdminMenu';
import { useNavigate } from 'react-router-dom';

interface Props {
    activeKey: AdminMenuKey;
    children: ReactNode;
}

const SIDEBAR_W  = '16rem';
const COLLAPSED_W = '4.5rem';

const AdminLayout = ({ activeKey, children }: Props) => {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(
        () => localStorage.getItem('adminSidebarCollapsed') === 'true'
    );

    const toggle = () => {
        setCollapsed(v => {
            localStorage.setItem('adminSidebarCollapsed', String(!v));
            return !v;
        });
    };

    const handleSelect = (key: AdminMenuKey) => {
        localStorage.setItem('adminMenuKey', key);
        navigate('/admin');
    };

    const w = collapsed ? COLLAPSED_W : SIDEBAR_W;

    return (
        <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', fontFamily: "'Inter', sans-serif" }}>
            <aside style={{
                position: 'fixed', left: 0, top: 0, height: '100vh', width: w,
                background: '#020617', display: 'flex', flexDirection: 'column',
                boxShadow: '4px 0 24px rgba(0,0,0,0.3)', zIndex: 50, overflowY: 'auto', overflowX: 'hidden',
                transition: 'width 0.22s ease',
            }}>
                <AdminMenu selectedKey={activeKey} onSelect={handleSelect} collapsed={collapsed} onToggle={toggle} />
            </aside>

            <main style={{
                marginLeft: w, flex: 1, minHeight: '100vh', overflowY: 'auto', background: '#f8f9ff',
                transition: 'margin-left 0.22s ease',
            }}>
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
