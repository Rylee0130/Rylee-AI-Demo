import { Button, Dropdown, Space, Typography, Avatar } from 'antd';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/store/store';
import { RootState } from '@/store/store';
import { switchUserLevel, toggleConfig, togglePreview } from '@/store/reportSlice';
import { openSharePage, downloadSharePage } from '@/utils/shareGenerator';
import { UserLevel } from '@/types';

const { Title } = Typography;

const levelOptions = [
  { value: 'DIRECTOR', label: '总监视图' },
  { value: 'VP', label: 'VP视图' },
];

export default function Header() {
  const { user, userLevel, currentReport } = useSelector((state: RootState) => state.report);
  const dispatch = useAppDispatch();

  const handleLevelChange = (level: UserLevel) => {
    dispatch(switchUserLevel(level));
  };

  

  return (
    <header className="header">
      <div className="header-left">
        <Title level={2} className="title">📊 智能周报</Title>
        <div className="week-info">
          <span className="icon">📅</span>
          <span>2026年第21周 (05/19 - 05/25)</span>
        </div>
      </div>
      
      <div className="header-right">
        <Space>
          <Dropdown
            menu={{
              items: levelOptions.map(opt => ({
                key: opt.value,
                label: opt.label,
                onClick: () => handleLevelChange(opt.value as UserLevel),
              })),
            }}
            trigger={['click']}
          >
            <Button className="level-switch">
              🔄 {levelOptions.find(l => l.value === userLevel)?.label}
            </Button>
          </Dropdown>
          
          <Button>🔄 刷新周报</Button>
          
          <Button 
            type="primary"
            disabled={!currentReport}
            onClick={() => dispatch(togglePreview())}
          >
            👁️ 预览发送
          </Button>
          
          <Dropdown
            menu={{
              items: [
                { key: 'open', label: '🔗 打开分享页面', onClick: () => { if (currentReport) openSharePage(currentReport, user); } },
                { key: 'download', label: '📥 下载网页版', onClick: () => { if (currentReport) downloadSharePage(currentReport, user); } },
              ],
            }}
            trigger={['click']}
          >
            <Button disabled={!currentReport}>
              📤 分享
            </Button>
          </Dropdown>
          
          <Button onClick={() => dispatch(toggleConfig())}>
            ⚙️ 配置
          </Button>
          
          <div className="user-info">
            <Avatar icon={<span>👤</span>} />
            <span>{user?.name}</span>
            <span className="role">{user?.role}</span>
          </div>
        </Space>
      </div>
    </header>
  );
}
