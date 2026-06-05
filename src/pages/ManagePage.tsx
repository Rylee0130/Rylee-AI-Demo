import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '@/store/store';
import { switchUserLevel, regenerateReport, updateDataSource, updatePushChannel, updateSchedule, updateCalendar } from '@/store/reportSlice';
import { UserLevel, AppConfig } from '@/types';
import { Button, Card, Switch, Select, Slider, Space, Typography, Table, Input, Tag, message } from 'antd';
import TeamDynamics from '@/components/TeamDynamics';
import './ManagePage.css';

const { Title } = Typography;
const { Option } = Select;

const levelOptions = [
  { value: 'DIRECTOR', label: '总监视图' },
  { value: 'VP', label: 'VP视图' },
];

const mockHistoryReports = [
  { id: '1', week: '第21周', date: '2026-05-19 ~ 2026-05-25', status: '已发送', user: '张明', type: 'weekly' },
  { id: '2', week: '第20周', date: '2026-05-12 ~ 2026-05-18', status: '已发送', user: '张明', type: 'weekly' },
  { id: '3', week: '第19周', date: '2026-05-05 ~ 2026-05-11', status: '已发送', user: '张明', type: 'weekly' },
  { id: '4', week: '第18周', date: '2026-04-28 ~ 2026-05-04', status: '已发送', user: '张明', type: 'weekly' },
  { id: '5', week: '第17周', date: '2026-04-21 ~ 2026-04-27', status: '已发送', user: '张明', type: 'weekly' },
];

const mockDataRecords = [
  { id: '1', type: 'okr', source: 'OKR平台', count: 24, lastSync: '2026-05-25 08:30', status: 'success' },
  { id: '2', type: 'pm', source: 'PM系统', count: 156, lastSync: '2026-05-25 08:30', status: 'success' },
  { id: '3', type: 'hr', source: 'HR系统', count: 45, lastSync: '2026-05-25 08:25', status: 'success' },
  { id: '4', type: 'approval', source: '审批流系统', count: 23, lastSync: '2026-05-25 08:30', status: 'success' },
  { id: '5', type: 'calendar', source: '企业日历', count: 128, lastSync: '2026-05-25 08:30', status: 'success' },
];

function ManagePage() {
  const { userLevel, currentReport, config } = useSelector((state: RootState) => state.report);
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState('overview');
  const [localConfig, setLocalConfig] = useState<AppConfig>(config);
  const [apiConfig, setApiConfig] = useState({
    apiUrl: 'https://api.example.com/v1',
    apiKey: 'sk-xxxxxxxxxxxxxxxx',
    timeout: 30000,
    retryCount: 3,
  });

  useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  const handleLevelChange = (level: UserLevel) => {
    dispatch(switchUserLevel(level));
  };

  const handleRegenerate = () => {
    dispatch(regenerateReport(userLevel));
    message.success('周报已重新生成');
  };

  const handleDataSourceToggle = (key: string, enabled: boolean) => {
    dispatch(updateDataSource({ key, enabled }));
    setLocalConfig(prev => ({
      ...prev,
      dataSources: prev.dataSources.map(ds => 
        ds.key === key ? { ...ds, enabled } : ds
      )
    }));
  };

  const handlePushChannelToggle = (key: string, enabled: boolean) => {
    dispatch(updatePushChannel({ key, enabled }));
    setLocalConfig(prev => ({
      ...prev,
      pushChannels: prev.pushChannels.map(ch => 
        ch.key === key ? { ...ch, enabled } : ch
      )
    }));
  };

  const handleScheduleChange = (field: string, value: any) => {
    dispatch(updateSchedule({ ...localConfig.schedule, [field]: value }));
    setLocalConfig(prev => ({
      ...prev,
      schedule: { ...prev.schedule, [field]: value }
    }));
  };

  const handleCalendarChange = (field: string, value: any) => {
    dispatch(updateCalendar({ ...localConfig.calendar, [field]: value }));
    setLocalConfig(prev => ({
      ...prev,
      calendar: { ...prev.calendar, [field]: value }
    }));
  };

  const handleSaveConfig = () => {
    message.success('配置已保存');
  };

  const handleApiSave = () => {
    message.success('API配置已保存');
  };

  const handleTestApi = () => {
    message.info('正在测试API连接...');
    setTimeout(() => {
      message.success('API连接测试成功！');
    }, 1500);
  };

  const historyColumns = [
    { title: '周报编号', dataIndex: 'week', key: 'week' },
    { title: '日期范围', dataIndex: 'date', key: 'date' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (status: string) => (
      <Tag color={status === '已发送' ? 'green' : 'orange'}>{status}</Tag>
    )},
    { title: '生成人', dataIndex: 'user', key: 'user' },
    { title: '操作', key: 'action', render: () => (
      <Space>
        <Button size="small">查看</Button>
        <Button size="small">下载</Button>
      </Space>
    )},
  ];

  const dataColumns = [
    { title: '数据类型', dataIndex: 'source', key: 'source' },
    { title: '记录数', dataIndex: 'count', key: 'count' },
    { title: '最后同步', dataIndex: 'lastSync', key: 'lastSync' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (status: string) => (
      <Tag color={status === 'success' ? 'green' : 'red'}>
        {status === 'success' ? '✓ 正常' : '✗ 异常'}
      </Tag>
    )},
    { title: '操作', key: 'action', render: () => (
      <Button size="small">同步</Button>
    )},
  ];

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
          <div className={`sidebar-item ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
            📜 历史周报
          </div>
          <div className={`sidebar-item ${activeTab === 'team' ? 'active' : ''}`} onClick={() => setActiveTab('team')}>
            👥 团队管理
          </div>
          <div className={`sidebar-item ${activeTab === 'data' ? 'active' : ''}`} onClick={() => setActiveTab('data')}>
            📡 数据源配置
          </div>
          <div className={`sidebar-item ${activeTab === 'api' ? 'active' : ''}`} onClick={() => setActiveTab('api')}>
            🔌 API配置
          </div>
          <div className={`sidebar-item ${activeTab === 'push' ? 'active' : ''}`} onClick={() => setActiveTab('push')}>
            📤 推送设置
          </div>
          <div className={`sidebar-item ${activeTab === 'schedule' ? 'active' : ''}`} onClick={() => setActiveTab('schedule')}>
            ⏰ 定时任务
          </div>
          <div className={`sidebar-item ${activeTab === 'datamgmt' ? 'active' : ''}`} onClick={() => setActiveTab('datamgmt')}>
            🗄️ 数据管理
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

          {activeTab === 'history' && (
            <div className="history-section">
              <Card title="📜 历史周报">
                <Table 
                  columns={historyColumns} 
                  dataSource={mockHistoryReports} 
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                />
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
                  {localConfig.dataSources.map(source => (
                    <div key={source.key} className="source-item">
                      <div className="source-info">
                        <span className="source-name">{source.name}</span>
                        <span className="source-desc">{source.description}</span>
                      </div>
                      <Switch 
                        checked={source.enabled} 
                        onChange={(checked) => handleDataSourceToggle(source.key, checked)}
                      />
                    </div>
                  ))}
                </div>
                <Button type="primary" onClick={handleSaveConfig} className="save-btn">
                  💾 保存配置
                </Button>
              </Card>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="config-section">
              <Card title="🔌 API配置">
                <div className="api-config">
                  <div className="config-item">
                    <span>API 基础地址</span>
                    <Input 
                      value={apiConfig.apiUrl} 
                      onChange={(e) => setApiConfig(prev => ({ ...prev, apiUrl: e.target.value }))}
                      style={{ width: 400 }}
                      placeholder="请输入API地址"
                    />
                  </div>
                  <div className="config-item">
                    <span>API Key</span>
                    <Input.Password 
                      value={apiConfig.apiKey} 
                      onChange={(e) => setApiConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                      style={{ width: 400 }}
                      placeholder="请输入API Key"
                    />
                  </div>
                  <div className="config-item">
                    <span>请求超时(ms)</span>
                    <Input.Number 
                      value={apiConfig.timeout} 
                      onChange={(value) => setApiConfig(prev => ({ ...prev, timeout: value || 0 }))}
                      style={{ width: 150 }}
                      min={1000}
                      max={60000}
                    />
                  </div>
                  <div className="config-item">
                    <span>重试次数</span>
                    <Select
                      value={apiConfig.retryCount}
                      onChange={(value) => setApiConfig(prev => ({ ...prev, retryCount: value }))}
                      style={{ width: 100 }}
                    >
                      <Option value={1}>1次</Option>
                      <Option value={2}>2次</Option>
                      <Option value={3}>3次</Option>
                      <Option value={5}>5次</Option>
                    </Select>
                  </div>
                </div>
                <div className="api-actions">
                  <Button type="primary" onClick={handleTestApi}>🔍 测试连接</Button>
                  <Button onClick={handleApiSave}>💾 保存配置</Button>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'push' && (
            <div className="config-section">
              <Card title="📤 推送渠道配置">
                <div className="push-channel-list">
                  {localConfig.pushChannels.map(channel => (
                    <div key={channel.key} className="channel-item">
                      <div className="channel-info">
                        <span className="channel-name">{channel.name}</span>
                      </div>
                      <div className="channel-config">
                        <Switch 
                          checked={channel.enabled} 
                          onChange={(checked) => handlePushChannelToggle(channel.key, checked)}
                        />
                        {channel.enabled && (
                          <div className="webhook-input">
                            <input 
                              type="text" 
                              placeholder="Webhook URL" 
                              className="webhook-field"
                              defaultValue={channel.config.webhookUrl}
                            />
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
                    <Switch 
                      checked={localConfig.schedule.enabled} 
                      onChange={(checked) => handleScheduleChange('enabled', checked)}
                    />
                  </div>
                  <div className="config-item">
                    <span>发送时间</span>
                    <Select
                      value={localConfig.schedule.time}
                      onChange={(value) => handleScheduleChange('time', value)}
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
                      value={localConfig.schedule.dayOfWeek}
                      onChange={(value) => handleScheduleChange('dayOfWeek', value)}
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
                      value={localConfig.calendar.syncFrequency === 'daily' ? 1 : localConfig.calendar.syncFrequency === 'hourly' ? 2 : 3}
                      onChange={(value) => {
                        const freq = value === 1 ? 'daily' : value === 2 ? 'hourly' : 'realtime';
                        handleCalendarChange('syncFrequency', freq);
                      }}
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

          {activeTab === 'datamgmt' && (
            <div className="config-section">
              <Card title="🗄️ 数据管理">
                <Table 
                  columns={dataColumns} 
                  dataSource={mockDataRecords} 
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                />
                <div className="data-actions">
                  <Button type="primary">🔄 同步所有数据</Button>
                  <Button>🗑️ 清理缓存</Button>
                  <Button>📊 数据统计</Button>
                </div>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default ManagePage;
