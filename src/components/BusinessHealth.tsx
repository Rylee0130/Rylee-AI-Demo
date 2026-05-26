import { Card, Tag, Progress } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { HealthStatus, TrendDirection } from '@/types';

const statusConfig: Record<HealthStatus, { label: string; color: string; bgColor: string }> = {
  green: { label: '正常', color: '#52c41a', bgColor: '#f6ffed' },
  yellow: { label: '警告', color: '#faad14', bgColor: '#fffbe6' },
  red: { label: '异常', color: '#f5222d', bgColor: '#fff2f0' },
};

const trendConfig: Record<TrendDirection, { icon: string; color: string }> = {
  up: { icon: '↑', color: '#52c41a' },
  down: { icon: '↓', color: '#f5222d' },
  stable: { icon: '→', color: '#d9d9d9' },
};

export default function BusinessHealth() {
  const { currentReport, userLevel } = useSelector((state: RootState) => state.report);

  if (!currentReport) return null;

  const { projectHealth, okrHealth } = currentReport.healthOverview;
  const isVP = userLevel === 'VP';
  const okrs = isVP ? okrHealth.buOKRs : okrHealth.teamOKRs;

  const sortedProjects = [...projectHealth].sort((a, b) => {
    const order: Record<HealthStatus, number> = { red: 0, yellow: 1, green: 2 };
    return order[a.status] - order[b.status];
  });

  return (
    <Card className="health-card" title={
      <div className="card-title">
        <span className="icon">📊</span>
        <span>业务与目标健康度</span>
        <Tag color={statusConfig[okrHealth.overallStatus].color} className="status-badge">
          {statusConfig[okrHealth.overallStatus].label}
        </Tag>
      </div>
    }>
      <div className="health-section">
        <h4 className="section-title">项目节点</h4>
        <div className="project-list">
          {sortedProjects.map((project) => {
            const status = statusConfig[project.status];
            return (
              <div key={project.id} className="project-item">
                <div className="project-header">
                  <div className="project-info">
                    <span className="project-name">{project.name}</span>
                    <span className="milestone">{project.milestone}</span>
                  </div>
                  <Tag color={status.color}>{status.label}</Tag>
                </div>
                <Progress 
                  percent={project.progress} 
                  strokeColor={status.color}
                  showInfo={false}
                  size="small"
                />
                {project.delayReason && (
                  <div className="delay-reason">
                    <span className="icon">⚠️</span>
                    <span>{project.delayReason}</span>
                  </div>
                )}
                {project.dependencies && project.dependencies.length > 0 && (
                  <div className="dependencies">
                    <span>依赖: {project.dependencies.join(', ')}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="health-section">
        <h4 className="section-title">
          {isVP ? 'BU级' : '团队级'} OKR进展
        </h4>
        <div className="okr-list">
          {okrs?.map((okr) => {
            const status = statusConfig[okr.status];
            const trend = trendConfig[okr.trend];

            return (
              <div key={okr.id} className="okr-item">
                <div className="okr-info">
                  <span className="okr-name">{okr.name}</span>
                  <span className="period">{okr.period}</span>
                </div>
                <div className="okr-metrics">
                  <div className="progress-container">
                    <Progress 
                      percent={okr.progress} 
                      strokeColor={status.color}
                      size="small"
                      showInfo={false}
                    />
                    <span className="progress-text">{okr.progress}%</span>
                  </div>
                  <div className="trend" style={{ color: trend.color }}>
                    {trend.icon}
                  </div>
                </div>
                <div className="okr-status">
                  <Tag color={status.color}>{status.label}</Tag>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
