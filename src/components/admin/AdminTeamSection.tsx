import { Table } from 'antd';
import { useEffect, useState } from 'react';
import { listClubs } from '../../services/clubService';
import AdminTeamTable from './AdminTeamTable';

interface ClubRecord {
    key: string;
    name: string;
    logo: string;
}

const columns = [
    {
        title: 'Logo',
        dataIndex: 'logo',
        key: 'logo',
        width: 60,
        render: (logo: string) => logo ? <img src={logo} alt="logo" style={{ width: 32, height: 32, objectFit: 'contain' }} /> : null,
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
];

const PAGE_SIZE = 10;

const AdminTeamSection = () => {
    const [dataSource, setDataSource] = useState<ClubRecord[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);

    useEffect(() => {
        listClubs(page, PAGE_SIZE).then(({ data, count }) => {
            setDataSource(data.map((c) => ({ key: c.id, name: c.name, logo: c.logo })));
            setTotal(count);
        });
    }, [page]);

    return (
        <div style={{ width: '100%', justifyContent: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Table
                dataSource={dataSource}
                columns={columns}
                pagination={{ placement: ['bottomCenter'], pageSize: PAGE_SIZE, total, current: page, onChange: setPage }}
                style={{ width: '50%', borderRadius: '24px', border: '1px solid black', overflow: 'hidden' }}
                expandable={{
                    expandedRowRender: (record) => <div className="team-expand-fade"><AdminTeamTable clubId={record.key} width="100%" /></div>,
                    expandRowByClick: true,
                }}
            />
        </div>
    );
};

export default AdminTeamSection;
