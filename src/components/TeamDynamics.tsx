import { Card, Tag, Avatar } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const stageConfig: Record<string, { label: string; color: string }> = {
  recruiting: { label: '招聘中', color: '#1890ff' },
  interviewing: { label: '面试中', color: '#faad14' },
  offering: { label: '发offer', color: '#52c41a' },
  closed: { label: '已关闭', color: '#d9d9d9' },
};

export default function TeamDynamics() {
  const { currentReport } = useSelector((state: RootState) => state.report);

  if (!currentReport) return null;

  const { overdue1on1, newHires, departures, jobTransfers, hiringProgress, importantDates } = currentReport.teamDynamics;

  return (
    <Card className="team-card" title={
      <div className="card-title">
        <span className="icon">👥</span>
        <span>团队动态</span>
      </div>
    }>
      {overdue1on1.length > 0 && (
        <div className="team-section">
          <h5 className="section-title">
            <span className="icon">⭐</span>
            需要1on1
          </h5>
          <div className="member-list">
            {overdue1on1.map((member) => (
              <div key={member.id} className="member-item">
                <Avatar icon={<span>👤</span>} />
                <div className="member-info">
                  <span className="member-name">{member.name}</span>
                  <span className="member-role">{member.role}</span>
                </div>
                <Tag color="warning">超过2周</Tag>
              </div>
            ))}
          </div>
        </div>
      )}

      {(newHires.length > 0 || departures.length > 0 || jobTransfers.length > 0) && (
        <div className="team-section">
          <h5 className="section-title">人事动态</h5>
          
          {newHires.length > 0 && (
            <div className="dynamic-group">
              <div className="group-header">
                <span className="icon add">➕</span>
                <span>本周入职 ({newHires.length})</span>
              </div>
              <div className="member-list">
                {newHires.map((member) => (
                  <div key={member.id} className="member-item">
                    <Avatar icon={<span>👤</span>} />
                    <div className="member-info">
                      <span className="member-name">{member.name}</span>
                      <span className="member-role">{member.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {departures.length > 0 && (
            <div className="dynamic-group">
              <div className="group-header">
                <span className="icon remove">➖</span>
                <span>本周离职 ({departures.length})</span>
              </div>
              <div className="member-list">
                {departures.map((member) => (
                  <div key={member.id} className="member-item">
                    <Avatar icon={<span>👤</span>} />
                    <div className="member-info">
                      <span className="member-name">{member.name}</span>
                      <span className="member-role">{member.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {jobTransfers.length > 0 && (
            <div className="dynamic-group">
              <div className="group-header">
                <span className="icon transfer">↔️</span>
                <span>本周转岗 ({jobTransfers.length})</span>
              </div>
              <div className="member-list">
                {jobTransfers.map((member) => (
                  <div key={member.id} className="member-item">
                    <Avatar icon={<span>👤</span>} />
                    <div className="member-info">
                      <span className="member-name">{member.name}</span>
                      <span className="member-role">{member.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {hiringProgress.length > 0 && (
        <div className="team-section">
          <h5 className="section-title">
            <span className="icon">💼</span>
            招聘进展
          </h5>
          <div className="hiring-list">
            {hiringProgress.map((item, index) => {
              const stage = stageConfig[item.stage];
              return (
                <div key={index} className="hiring-item">
                  <span className="position">{item.position}</span>
                  <Tag color={stage.color}>{stage.label}</Tag>
                  <span className="candidates">{item.candidates}位候选人</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {importantDates.length > 0 && (
        <div className="team-section">
          <h5 className="section-title">
            <span className="icon">🎂</span>
            重要日期
          </h5>
          <div className="dates-list">
            {importantDates.map((item, index) => (
              <div key={index} className="date-item">
                <span className="date">{item.date}</span>
                <span className="name">{item.name}</span>
                <Tag color="purple">
                  {item.type === 'birthday' ? '生日' : '工作周年'}
                </Tag>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
