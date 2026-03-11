import React from 'react';
import { TrophyOutlined } from '@ant-design/icons';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import AssistWalkerIcon from '@mui/icons-material/AssistWalker';
import SportsIcon from '@mui/icons-material/Sports';
import ArticleIcon from '@mui/icons-material/Article';
import BarChartIcon from '@mui/icons-material/BarChart';
import type { MenuProps } from 'antd';
import { Button, Divider, Menu, Typography } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

type MenuItem = Required<MenuProps>['items'][number];

export type AdminMenuKey = 'competitions' | 'clubs' | 'teams' | 'players' | 'articles' | 'matches' | 'matchStaistics';

const items: MenuItem[] = [
  {
    key: 'competitions',
    label: 'Competitions',
    icon: <TrophyOutlined />
  },
  {
    key: 'clubs',
    label: 'Clubs',
    icon: <SportsSoccerIcon />
  },
  {
    key: 'players',
    label: 'Players',
    icon: <AssistWalkerIcon />
  },
  {
    key: 'articles',
    label: 'Articles',
    icon: <ArticleIcon />
  },
  {
    key: 'matches',
    label: 'Matches',
    icon: <SportsIcon />
  },
  {
    key: 'matchStaistics',
    label: 'Player Match Statistics',
    icon: <BarChartIcon />
  }
];

interface AdminMenuProps {
  selectedKey: AdminMenuKey;
  onSelect: (key: AdminMenuKey) => void;
}

const App: React.FC<AdminMenuProps> = ({ selectedKey, onSelect }) => {
  const navigate = useNavigate();

  const onClick: MenuProps['onClick'] = (e) => {
    onSelect?.(e.key as AdminMenuKey);
  };

  const handleLogout = async () => {
    navigate('/admin/login');
  };

  return (
    <>
      <Typography.Title level={3} style={{ color: 'white', margin: '16px 16px 8px', justifyContent: 'center', display: 'flex' }}>
        Admin Panel
      </Typography.Title>
      <Divider style={{ borderColor: 'rgba(255,255,255,0.2)', margin: '0 0 8px' }} />
      <Menu
        onClick={onClick}
        theme="dark"
        mode="inline"
        items={items}
        selectedKeys={[selectedKey]}
      />
      <Divider style={{ borderColor: 'rgba(255,255,255,0.2)', margin: '0 0 8px' }} />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button type="primary" style={{ width: '90%' }} onClick={handleLogout}>
          <LogoutOutlined />Logout
        </Button>
      </div>
    </>
  );
};

export default App;