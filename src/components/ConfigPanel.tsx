import { Drawer, Switch, Input, Select, Button, Divider, Card } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { toggleConfig, updateDataSource, updatePushChannel, updateSchedule, updateCalendar } from '@/store/reportSlice';
import { CalendarConfig, PushSchedule } from '@/types';

const { Option } = Select;

const weekDays = [
  { value: 0, label: '周日' },
  { value: 1, label: '周一' },
  { value: 2, label: '周二' },
  { value: 3, label: '周三' },
  { value: 4, label: '周四' },
  { value: 5, label: '周五' },
  { value: 6, label: '周六' },
];

export default function ConfigPanel() {
  const { showConfig, config } = useSelector((state: RootState) => state.report);
  const dispatch = useDispatch();

  const handleDataSourceChange = (key: string, enabled: boolean) => {
    dispatch(updateDataSource({ key, enabled }));
  };

  const handlePushChannelChange = (key: string, enabled: boolean) => {
    dispatch(updatePushChannel({ key, enabled }));
  };

  const handleScheduleChange = (field: keyof PushSchedule, value: boolean | string | number) => {
    dispatch(updateSchedule({ ...config.schedule, [field]: value }));
  };

  const handleCalendarChange = (field: keyof CalendarConfig, value: boolean | string) => {
    dispatch(updateCalendar({ ...config.calendar, [field]: value }));
  };

  const handleSave = () => {
    dispatch(toggleConfig());
  };

  return (
    <Drawer
      title="⚙️ 系统配置"
      placement="right"
      width={400}
      onClose={() => dispatch(toggleConfig())}
      open={showConfig}
      extra={
        <Button type="primary" onClick={handleSave}>
          💾 保存配置
        </Button>
      }
    >
      <div className="config-panel">
        <Card className="config-section" title={
          <div className="section-header">
            <span className="icon">🗄️</span>
            <span>数据源配置</span>
          </div>
        }>
          <div className="config-list">
            {config.dataSources.map((ds) => (
              <div key={ds.key} className="config-item">
                <div className="config-info">
                  <span className="config-name">{ds.name}</span>
                  <span className="config-desc">{ds.description}</span>
                </div>
                <Switch
                  checked={ds.enabled}
                  onChange={(enabled) => handleDataSourceChange(ds.key, enabled)}
                />
              </div>
            ))}
          </div>
        </Card>

        <Divider />

        <Card className="config-section" title={
          <div className="section-header">
            <span className="icon">🔔</span>
            <span>推送渠道</span>
          </div>
        }>
          <div className="config-list">
            {config.pushChannels.map((channel) => (
              <div key={channel.key} className="config-item">
                <div className="config-info">
                  <span className="config-name">{channel.name}</span>
                </div>
                <Switch
                  checked={channel.enabled}
                  onChange={(enabled) => handlePushChannelChange(channel.key, enabled)}
                />
              </div>
            ))}
          </div>
        </Card>

        <Divider />

        <Card className="config-section" title={
          <div className="section-header">
            <span className="icon">📅</span>
            <span>日历同步</span>
          </div>
        }>
          <div className="calendar-config">
            <div className="config-row">
              <span>启用日历同步</span>
              <Switch
                checked={config.calendar.enabled}
                onChange={(enabled) => handleCalendarChange('enabled', enabled)}
              />
            </div>
            {config.calendar.enabled && (
              <>
                <div className="config-row">
                  <span>同步频率</span>
                  <Select
                    value={config.calendar.syncFrequency}
                    onChange={(value) => handleCalendarChange('syncFrequency', value)}
                    style={{ width: 150 }}
                  >
                    <Option value="hourly">每小时</Option>
                    <Option value="daily">每天</Option>
                    <Option value="weekly">每周</Option>
                  </Select>
                </div>
                <div className="config-row">
                  <span>日历URL</span>
                  <Input
                    value={config.calendar.calendarUrl}
                    onChange={(e) => handleCalendarChange('calendarUrl', e.target.value)}
                    placeholder="输入日历订阅URL"
                  />
                </div>
              </>
            )}
          </div>
        </Card>

        <Divider />

        <Card className="config-section" title={
          <div className="section-header">
            <span className="icon">⏰</span>
            <span>定时推送</span>
          </div>
        }>
          <div className="schedule-config">
            <div className="config-row">
              <span>启用定时推送</span>
              <Switch
                checked={config.schedule.enabled}
                onChange={(enabled) => handleScheduleChange('enabled', enabled)}
              />
            </div>
            {config.schedule.enabled && (
              <>
                <div className="config-row">
                  <span>推送时间</span>
                  <Input
                    value={config.schedule.time}
                    onChange={(e) => handleScheduleChange('time', e.target.value)}
                    placeholder="HH:MM"
                    style={{ width: 100 }}
                  />
                </div>
                <div className="config-row">
                  <span>推送日期</span>
                  <Select
                    value={config.schedule.dayOfWeek}
                    onChange={(value) => handleScheduleChange('dayOfWeek', value)}
                    style={{ width: 150 }}
                  >
                    {weekDays.map((day) => (
                      <Option key={day.value} value={day.value}>{day.label}</Option>
                    ))}
                  </Select>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>
    </Drawer>
  );
}
