import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '@/store/store';
import { switchUserLevel, regenerateReport, updateConfig } from '@/store/reportSlice';
import { UserLevel } from '@/types';
import { Button, Card, Switch, Select, Slider, Space, Typography } from 'antd';
import TeamDynamics from '@/components/TeamDynamics';
import './ManagePage.css';

const { Title } = Typography;

const levelOptions = [
  { value: 'DIRECTOR', label: '总监视图' },
  { value: 'VP', label: 'VP视图' },
];

function ManagePage() {
  const { userLevel, currentReport, config } = useSelector((state: RootState) => state.report);
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLevelChange = (level: UserLevel) => {
    dispatch(switchUserLevel(level));
  };

  const handleRegenerate = () => {
    dispatch(regenerateReport(userLevel));
  };

  const handleSaveConfig = () => {
    dispatch(updateConfig(config));
  };

  return (
    <div className="manage-page">
      <header className="manage-header">
        <div className="header-left">
          <Title level={2}>⚙️ 管理后台</Title>
          <p>智能周报提醒工具 - 系统配置管理</p>
        </div>
        <div className="header-right">
          <Space>
            <Select
              value={userLevel}
              onChange={(value) => handleLevelChange(value as UserLevel)}
              style={{ width: 160 }}
              options={levelOptions}
            />
            <Button onClick={handleRegenerate}>🔄 重新生成</Button>
            <a href="/" className="back-link">📋 返回用户端</a>
          </Space>
        </div>
      </header>

      <div className="manage-content">
        <aside className="sidebar">
          <div className={`sidebar-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            📊 概览
          </div>
          <div className={`sidebar-item ${activeTab === 'team' ? 'active' : ''}`} onClick={() => setActiveTab('team')}>
            👥 团队管理
          </div>
          <div className={`sidebar-item ${activeTab === 'data' ? 'active' : ''}`} onClick={() => setActiveTab('data')}>
            📡 数据源配置
          </div>
          <div className={`sidebar-item ${activeTab === 'push' ? 'active' : ''}`} onClick={() => setActiveTab('push')}>
            📤 推送设置
          </div>
          <div className={`sidebar-item ${activeTab === 'schedule' ? 'active' : ''}`} onClick={() => setActiveTab('schedule')}>
            ⏰ 定时任务
          </div>
        </aside>

        <main className="main-panel">
          {activeTab === 'overview' && (
            <div className="overview-section">
              <Card title="📊 系统概览" className="overview-card">
                <div className="stats-grid">
                  <div className="stat-item">
                    <div className="stat-value">21</div>
                    <div className="stat-label">本周周报</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">3</div>
                    <div className="stat-label">决策事项</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">3</div>
                    <div className="stat-label">预警事项</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">🟢</div>
                    <div className="stat-label">系统状态</div>
                  </div>
                </div>
              </Card>

              <Card title="📝 最近周报摘要" className="summary-card">
                {currentReport?.summary ? (
                  <p className="summary-text">{currentReport.summary}</p>
                ) : (
                  <p>暂无周报数据</p>
                )}
              </Card>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="team-section">
              <Card title="👥 团队动态管理">
                <TeamDynamics />
              </Card>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="config-section">
              <Card title="📡 数据源配置">
                <div className="data-source-list">
                  {config.dataSources.map(source => (
                    <div key={source.key} className="source-item">
                      <div className="source-info">
                        <span className="source-name">{source.name}</span>
                        <span className="source-desc">{source.description}</span>
                      </div>
                      <Switch checked={source.enabled} />
                    </div>
                  ))}
                </div>
                <Button type="primary" onClick={handleSaveConfig} className="save-btn">
                  💾 保存配置
                </Button>
              </Card>
            </div>
          )}

          {activeTab === 'push' && (
            <div className="config-section">
              <Card title="📤 推送渠道配置">
                <div className="push-channel-list">
                  {config.pushChannels.map(channel => (
                    <div key={channel.key} className="channel-item">
                      <div className="channel-info">
                        <span className="channel-name">{channel.name}</span>
                      </div>
                      <div className="channel-config">
                        <Switch checked={channel.enabled} />
                        {channel.enabled && (
                          <div className="webhook-input">
                            <input type="text" placeholder="Webhook URL" className="webhook-field" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <Button type="primary" onClick={handleSaveConfig} className="save-btn">
                  💾 保存配置
                </Button>
              </Card>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="config-section">
              <Card title="⏰ 定时任务配置">
                <div className="schedule-config">
                  <div className="config-item">
                    <span>启用定时发送</span>
                    <Switch checked={config.schedule.enabled} />
                  </div>
                  <div className="config-item">
                    <span>发送时间</span>
                    <Select
                      value={config.schedule.time}
                      style={{ width: 120 }}
                      options={[
                        { value: '08:00', label: '08:00' },
                        { value: '08:30', label: '08:30' },
                        { value: '09:00', label: '09:00' },
                        { value: '10:00', label: '10:00' },
                        { value: '14:00', label: '14:00' },
                      ]}
                    />
                  </div>
                  <div className="config-item">
                    <span>发送日期</span>
                    <Select
                      value={config.schedule.dayOfWeek}
                      style={{ width: 120 }}
                      options={[
                        { value: 1, label: '周一' },
                        { value: 3, label: '周三' },
                        { value: 5, label: '周五' },
                      ]}
                    />
                  </div>
                  <div className="config-item">
                    <span>日历同步频率</span>
                    <Slider
                      defaultValue={config.calendar.syncFrequency === 'daily' ? 1 : config.calendar.syncFrequency === 'hourly' ? 2 : 3}
                      marks={{ 1: '每日', 2: '每小时', 3: '实时' }}
                    />
                  </div>
                </div>
                <Button type="primary" onClick={handleSaveConfig} className="save-btn">
                  💾 保存配置
                </Button>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default ManagePage;
