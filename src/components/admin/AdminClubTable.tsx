import { Button, Input, Select, Table } from 'antd';
import { PlusCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';
import AdminClubModalWindow from './AdminClubModalWindow';
import { colors } from '../../styles/colors';
import { importClubs, listClubs, type ClubFilters } from '../../services/clubService';

interface ClubRecord {
    key: string;
    name: string;
    logo: string;
}

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Logo',
        dataIndex: 'logo',
        key: 'logo',
        render: (logo: string) => logo ? <img src={logo} alt="logo" style={{ width: 32, height: 32, objectFit: 'contain' }} /> : null,
    },
];

const PAGE_SIZE = 10;

const AdminClubTable = () => {
    const [selectedRecord, setSelectedRecord] = useState<ClubRecord | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dataSource, setDataSource] = useState<ClubRecord[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [refreshKey, setRefreshKey] = useState(0);
    const [filters, setFilters] = useState<ClubFilters>({});
    const importInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        listClubs(page, PAGE_SIZE, filters).then(({ data, count }) => {
            setDataSource(data.map((item) => ({ key: item.id, name: item.name, logo: item.logo })));
            setTotal(count);
        });
    }, [page, refreshKey, filters]);

    const handleFilterChange = (patch: Partial<ClubFilters>) => {
        setPage(1);
        setFilters(prev => ({ ...prev, ...patch }));
    };

    const handleRowClick = (record: ClubRecord) => {
        setSelectedRecord(record);
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setSelectedRecord(null);
    };

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        await importClubs(file);
        setRefreshKey(k => k + 1);
        e.target.value = '';
    };

    return (
        <>
            <div style={{ width: '100%', justifyContent: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '50%', display: 'flex', gap: 8, marginBottom: 8 }}>
                    <Input
                        placeholder="Name"
                        allowClear
                        onChange={e => handleFilterChange({ name: e.target.value || undefined })}
                        style={{ flex: 1 }}
                    />
                    <Select
                        placeholder="Our club"
                        allowClear
                        onChange={(val: boolean | undefined) => handleFilterChange({ isOurClub: val })}
                        style={{ width: 140 }}
                        options={[
                            { label: 'Our club', value: true },
                            { label: 'Other', value: false },
                        ]}
                    />
                </div>
                <div style={{ width: '50%', display: 'flex', justifyContent: 'flex-end' }}>
                    <input ref={importInputRef} type="file" accept=".csv,.xlsx,.xls" style={{ display: 'none' }} onChange={handleImport} />
                    <Button style={{ margin: '5px' }} onClick={() => importInputRef.current?.click()}>
                        <UploadOutlined /> Import
                    </Button>
                    <Button
                        type="primary"
                        style={{ margin: '5px', backgroundColor: colors.success }}
                        onClick={() => setIsModalOpen(true)}
                    >
                        <PlusCircleOutlined /> Add Club
                    </Button>
                </div>
                <Table
                    dataSource={dataSource}
                    columns={columns}
                    pagination={{ placement: ['bottomCenter'], pageSize: PAGE_SIZE, total, current: page, onChange: setPage }}
                    style={{ width: '50%', borderRadius: '24px', border: '1px solid black', overflow: 'hidden' }}
                    onRow={(record) => ({ onClick: () => handleRowClick(record) })}
                />
            </div>
            <AdminClubModalWindow
                isOpen={isModalOpen}
                onClose={handleClose}
                onSuccess={() => setRefreshKey(k => k + 1)}
                id={selectedRecord?.key}
            />
        </>
    );
};

export default AdminClubTable;
