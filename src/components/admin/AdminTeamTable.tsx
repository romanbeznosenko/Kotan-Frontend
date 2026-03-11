import { Button, Table } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import AdminTeamModalWindow from './AdminTeamModalWindow';
import { colors } from '../../styles/colors';
import { listTeams } from '../../services/teamService';
import type { AgeGroupEnum, GenderEnum } from '../../services/teamService';

interface TeamRecord {
    key: string;
    name: string;
    ageGroup: AgeGroupEnum;
    gender: GenderEnum;
}

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Age Group',
        dataIndex: 'ageGroup',
        key: 'ageGroup',
        render: (v: AgeGroupEnum) => v.replace('_', '/'),
    },
    {
        title: 'Gender',
        dataIndex: 'gender',
        key: 'gender',
        render: (v: GenderEnum) => v.charAt(0) + v.slice(1).toLowerCase(),
    },
];

interface AdminTeamTableProps {
    clubId: string;
    width?: string;
}

const AdminTeamTable = ({ clubId, width = '50%' }: AdminTeamTableProps) => {
    const [selectedRecord, setSelectedRecord] = useState<TeamRecord | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dataSource, setDataSource] = useState<TeamRecord[]>([]);
    const [total, setTotal] = useState(0);
    const [refreshKey, setRefreshKey] = useState(0);
    useEffect(() => {
        listTeams(clubId).then(({ data, count }) => {
            setDataSource(data.map((item) => ({ key: item.id, name: item.name, ageGroup: item.ageGroup, gender: item.gender })));
            setTotal(count);
        });
    }, [clubId, refreshKey]);

    const handleRowClick = (record: TeamRecord) => {
        setSelectedRecord(record);
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setSelectedRecord(null);
    };

    return (
        <>
            <div style={{ width: '100%', justifyContent: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        type="primary"
                        style={{ margin: '5px', backgroundColor: colors.success }}
                        onClick={() => setIsModalOpen(true)}
                    >
                        <PlusCircleOutlined /> Add Team
                    </Button>
                </div>
                <Table
                    dataSource={dataSource}
                    columns={columns}
                    pagination={{ placement: ['bottomCenter'], total }}
                    style={{ width, borderRadius: '24px', border: '1px solid black', overflow: 'hidden' }}
                    onRow={(record) => ({ onClick: () => handleRowClick(record) })}
                />
            </div>
            <AdminTeamModalWindow
                isOpen={isModalOpen}
                onClose={handleClose}
                onSuccess={() => setRefreshKey(k => k + 1)}
                clubId={clubId}
                teamId={selectedRecord?.key}
            />
        </>
    );
};

export default AdminTeamTable;
