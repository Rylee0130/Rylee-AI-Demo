import { Card, Tag, List } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { AlertSeverity } from '@/types';

const severityConfig: Record<AlertSeverity, { label: string; color: string; bgColor: string }> = {
  high: { label: '高', color: '#f5222d', bgColor: '#fff2f0' },
  medium: { label: '中', color: '#faad14', bgColor: '#fffbe6' },
  low: { label: '低', color: '#52c41a', bgColor: '#f6ffed' },
};

const typeConfig: Record<string, { icon: string; label: string }> = {
  milestone: { icon: '🎯', label: '里程碑' },
  meeting: { icon: '📅', label: '会议' },
  okr: { icon: '🎯', label: 'OKR' },
  resource: { icon: '⚠️', label: '资源' },
};

export default function NextWeekAlert() {
  const { currentReport } = useSelector((state: RootState) => state.report);

  if (!currentReport) return null;

  const sortedAlerts = [...currentReport.nextWeekAlerts].sort((a, b) => {
    const order: Record<AlertSeverity, number> = { high: 0, medium: 1, low: 2 };
    return order[a.severity] - order[b.severity];
  });

  return (
    <Card className="alert-card" title={
      <div className="card-title">
        <span className="icon">🔭</span>
        <span>下周预警</span>
        <span className="count">{sortedAlerts.length}项</span>
      </div>
    }>
      <List
        dataSource={sortedAlerts}
        renderItem={(alert) => {
          const severity = severityConfig[alert.severity];
          const type = typeConfig[alert.type] || { icon: '📌', label: '其他' };

          return (
            <List.Item key={alert.id} className="alert-item">
              <div className="alert-icon" style={{ backgroundColor: severity.bgColor }}>
                <span style={{ color: severity.color }}>{type.icon}</span>
              </div>
              <div className="alert-content">
                <div className="alert-header">
                  <span className="alert-title">{alert.title}</span>
                  <div className="alert-tags">
                    <Tag color={severity.color}>{severity.label}</Tag>
                    <Tag color="default">{type.label}</Tag>
                  </div>
                </div>
                <p className="alert-description">{alert.description}</p>
                <div className="alert-footer">
                  <span className="icon">📅</span>
                  <span>{alert.dueDate}</span>
                </div>
              </div>
            </List.Item>
          );
        }}
      />
    </Card>
  );
}
