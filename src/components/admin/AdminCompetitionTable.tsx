import { Button, Input, Select, Table } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import AdminCompetitionModalWindow from './AdminCompetitionModalWindow';
import type { CompetitionType } from '../../types/competition';
import { CompetitionTypeEnum } from '../../types/competition';
import { colors } from '../../styles/colors';
import { listCompetitions } from '../../services/competitionService';
import type { CompetitionFilters } from '../../services/competitionService';

interface CompetitionRecord {
  key: string;
  name: string;
  season: string;
  type: CompetitionType;
}

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Season',
    dataIndex: 'season',
    key: 'season',
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
  },
];

const PAGE_SIZE = 10;

const TYPE_OPTIONS = Object.values(CompetitionTypeEnum).map((v) => ({ label: v, value: v }));

const AdminCompetitionTable = () => {
  const [selectedRecord, setSelectedRecord] = useState<CompetitionRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataSource, setDataSource] = useState<CompetitionRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [filters, setFilters] = useState<CompetitionFilters>({});

  useEffect(() => {
    listCompetitions(page, PAGE_SIZE, filters).then(({ data, count }) => {
      setDataSource(data.map((item) => ({ key: item.id, name: item.name, season: item.season, type: item.type })));
      setTotal(count);
    });
  }, [page, refreshKey, filters]);

  const handleFilterChange = (key: keyof CompetitionFilters, value: unknown) => {
    setPage(1);
    setFilters((prev) => ({ ...prev, [key]: value || undefined }));
  };

  const handleRowClick = (record: CompetitionRecord) => {
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
        <div style={{ width: '50%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <Input
              placeholder="Name"
              allowClear
              style={{ width: 160 }}
              onChange={(e) => handleFilterChange('name', e.target.value)}
            />
            <Input
              placeholder="Season"
              allowClear
              style={{ width: 120 }}
              onChange={(e) => handleFilterChange('season', e.target.value)}
            />
            <Select
              placeholder="Type"
              allowClear
              mode="multiple"
              style={{ width: 200 }}
              options={TYPE_OPTIONS}
              onChange={(value) => handleFilterChange('type', value.length ? value : undefined)}
            />
          </div>
          <Button
            type="primary"
            style={{ margin: '5px', backgroundColor: colors.success }}
            onClick={() => setIsModalOpen(true)}
          >
            <PlusCircleOutlined /> Add Competition
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
      <AdminCompetitionModalWindow
        isOpen={isModalOpen}
        onClose={handleClose}
        onSuccess={() => setRefreshKey(k => k + 1)}
        id={selectedRecord?.key}
        initialValues={selectedRecord ?? undefined}
      />
    </>
  );
};

export default AdminCompetitionTable;
