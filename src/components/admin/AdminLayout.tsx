import type { ReactNode } from 'react';
import AdminMenu, { type AdminMenuKey } from './AdminMenu';
import { useNavigate } from 'react-router-dom';

interface Props {
    activeKey: AdminMenuKey;
    children: ReactNode;
}

const AdminLayout = ({ activeKey, children }: Props) => {
    const navigate = useNavigate();

    const handleSelect = (key: AdminMenuKey) => {
        localStorage.setItem('adminMenuKey', key);
        navigate('/admin');
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', fontFamily: "'Inter', sans-serif" }}>
            <aside style={{
                position: 'fixed', left: 0, top: 0, height: '100vh', width: '16rem',
                background: '#020617', display: 'flex', flexDirection: 'column',
                boxShadow: '4px 0 24px rgba(0,0,0,0.3)', zIndex: 50, overflowY: 'auto',
            }}>
                <AdminMenu selectedKey={activeKey} onSelect={handleSelect} />
            </aside>

            <main style={{ marginLeft: '16rem', flex: 1, minHeight: '100vh', overflowY: 'auto', background: '#f8f9ff' }}>
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
