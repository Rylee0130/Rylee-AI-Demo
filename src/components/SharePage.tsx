import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export default function SharePage() {
  const { currentReport, user } = useSelector((state: RootState) => state.report);

  if (!currentReport) {
    return (
      <div style={{ 
        padding: '40px', 
        maxWidth: '900px', 
        margin: '0 auto', 
        fontFamily: 'Arial, sans-serif' 
      }}>
        <h1 style={{ color: '#666', textAlign: 'center' }}>
          暂无周报数据
        </h1>
      </div>
    );
  }

  return (
    <div style={{ 
    padding: '40px', 
    maxWidth: '900px', 
    margin: '0 auto', 
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    backgroundColor: '#f0f2f5',
    minHeight: '100vh'
  }}>
      {/* Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '16px',
        padding: '40px',
        marginBottom: '24px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h1 style={{ 
            color: 'white', 
            fontSize: '28px', 
            margin: 0,
            fontWeight: '600'
          }}>
            📊 智能周报
          </h1>
          <div style={{ color: 'white', fontSize: '14px', opacity: 0.9 }}>
            📅 {currentReport.weekStart} - {currentReport.weekEnd}
          </div>
        </div>
        <div style={{ 
          background: 'rgba(255,255,255,0.15)',
          borderRadius: '8px',
          padding: '16px',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ color: 'white', marginBottom: '8px', fontSize: '14px', opacity: 0.9 }}>
            👤 {user?.name} · {user?.role}
          </div>
          <p style={{ 
            color: 'white', 
            margin: 0, 
            lineHeight: '1.8',
            fontSize: '16px'
          }}>
            {currentReport.summary}
          </p>
        </div>
      </div>

      {/* 决策清单 */}
      <div style={{ 
        background: 'white', 
        borderRadius: '12px', 
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}>
        <h2 style={{ 
          color: '#1890ff', 
          fontSize: '20px', 
          marginBottom: '20px',
          paddingBottom: '12px',
          borderBottom: '2px solid #e6f7ff',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          ✅ 我的决策清单 ({currentReport.decisionItems.length}项)
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {currentReport.decisionItems.map((item) => {
            const categoryColor = item.category === 'action' ? '#f5222d' : 
                                  item.category === 'decision' ? '#faad14' : '#1890ff';
            const categoryBg = item.category === 'action' ? '#fff1f0' : 
                              item.category === 'decision' ? '#fffbe6' : '#e6f7ff';
            
            return (
              <div key={item.id} style={{ 
                padding: '16px', 
                background: '#fafafa',
                borderRadius: '8px',
                borderLeft: `4px solid ${categoryColor}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <span style={{ 
                    background: categoryBg, 
                    color: categoryColor,
                    padding: '4px 12px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {item.category === 'action' ? '🔴 需要动作' : 
                     item.category === 'decision' ? '🟡 需要决策' : '🔵 知会即可'}
                  </span>
                  <span style={{ 
                    fontSize: '16px', 
                    fontWeight: '500',
                    color: '#262626'
                  }}>
                    {item.title}
                  </span>
                </div>
                <p style={{ 
                  color: '#8c8c8c', 
                  margin: '0 0 8px 0',
                  fontSize: '14px',
                  lineHeight: '1.6'
                }}>
                  {item.description}
                </p>
                {item.aiSummary && (
                  <div style={{ 
                    background: '#fef9e6',
                    padding: '12px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    color: '#ad6800'
                  }}>
                    💡 {item.aiSummary}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 业务健康度 */}
      <div style={{ 
        background: 'white', 
        borderRadius: '12px', 
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}>
        <h2 style={{ 
          color: '#1890ff', 
          fontSize: '20px', 
          marginBottom: '20px',
          paddingBottom: '12px',
          borderBottom: '2px solid #e6f7ff',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          📊 业务与目标健康度
        </h2>
        
        <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
          <div style={{ 
            flex: 1,
            padding: '16px',
            background: currentReport.healthOverview.overallStatus === 'green' ? '#f6ffed' : 
                       currentReport.healthOverview.overallStatus === 'yellow' ? '#fffbe6' : '#fff2f0',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>
              {currentReport.healthOverview.overallStatus === 'green' ? '🟢' : 
               currentReport.healthOverview.overallStatus === 'yellow' ? '🟡' : '🔴'}
            </div>
            <div style={{ 
              fontSize: '14px',
              color: '#595959'
            }}>
              项目整体状态
            </div>
          </div>
          
          <div style={{ 
            flex: 1,
            padding: '16px',
            background: currentReport.healthOverview.okrHealth.overallStatus === 'green' ? '#f6ffed' : 
                       currentReport.healthOverview.okrHealth.overallStatus === 'yellow' ? '#fffbe6' : '#fff2f0',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>
              {currentReport.healthOverview.okrHealth.overallStatus === 'green' ? '🟢' : 
               currentReport.healthOverview.okrHealth.overallStatus === 'yellow' ? '🟡' : '🔴'}
            </div>
            <div style={{ 
              fontSize: '14px',
              color: '#595959'
            }}>
              OKR健康度
            </div>
          </div>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3 style={{ fontSize: '16px', color: '#595959', marginBottom: '12px' }}>
            📋 项目进展
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {currentReport.healthOverview.projectHealth.map((project) => (
              <div key={project.id} style={{ 
                display: 'flex',
                alignItems: 'center',
                padding: '12px',
                background: '#fafafa',
                borderRadius: '6px'
              }}>
                <span style={{ fontSize: '16px', marginRight: '12px' }}>
                  {project.status === 'green' ? '🟢' : project.status === 'yellow' ? '🟡' : '🔴'}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#262626' }}>
                    {project.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                    {project.milestone}
                  </div>
                </div>
                <div style={{ 
                  fontSize: '14px',
                  fontWeight: '500',
                  color: project.status === 'green' ? '#52c41a' : 
                         project.status === 'yellow' ? '#faad14' : '#f5222d'
                }}>
                  {project.progress}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 团队动态 */}
      <div style={{ 
        background: 'white', 
        borderRadius: '12px', 
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}>
        <h2 style={{ 
          color: '#1890ff', 
          fontSize: '20px', 
          marginBottom: '20px',
          paddingBottom: '12px',
          borderBottom: '2px solid #e6f7ff',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          👥 团队动态
        </h2>

        {currentReport.teamDynamics.overdue1on1.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ 
              fontSize: '16px', 
              color: '#faad14',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              ⭐ 需要1on1
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {currentReport.teamDynamics.overdue1on1.map((member) => (
                <div key={member.id} style={{ 
                  padding: '12px',
                  background: '#fffbe6',
                  borderRadius: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '14px', color: '#595959' }}>
                    {member.name} - {member.role}
                  </span>
                  <span style={{ 
                    fontSize: '12px',
                    color: '#fa8c16',
                    fontWeight: '500'
                  }}>
                    超过2周未进行
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {(currentReport.teamDynamics.newHires.length > 0 || 
          currentReport.teamDynamics.departures.length > 0) && (
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ 
              fontSize: '16px', 
              color: '#595959',
              marginBottom: '12px'
            }}>
              人事动态
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {currentReport.teamDynamics.newHires.map((member) => (
                <div key={member.id} style={{ 
                  padding: '12px',
                  background: '#f6ffed',
                  borderRadius: '6px',
                  fontSize: '14px',
                  color: '#52c41a'
                }}>
                  ➕ 入职: {member.name} - {member.role}
                </div>
              ))}
              {currentReport.teamDynamics.departures.map((member) => (
                <div key={member.id} style={{ 
                  padding: '12px',
                  background: '#fff2f0',
                  borderRadius: '6px',
                  fontSize: '14px',
                  color: '#ff4d4f'
                }}>
                  ➖ 离职: {member.name} - {member.role}
                </div>
              ))}
            </div>
          </div>
        )}

        {currentReport.teamDynamics.hiringProgress.length > 0 && (
          <div>
            <h3 style={{ 
              fontSize: '16px', 
              color: '#595959',
              marginBottom: '12px'
            }}>
              💼 招聘进展
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {currentReport.teamDynamics.hiringProgress.map((item, index) => (
                <div key={index} style={{ 
                  padding: '12px',
                  background: '#fafafa',
                  borderRadius: '6px',
                  fontSize: '14px',
                  color: '#595959'
                }}>
                  {item.position}: {item.candidates}位候选人
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 下周预警 */}
      <div style={{ 
        background: 'white', 
        borderRadius: '12px', 
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}>
        <h2 style={{ 
          color: '#1890ff', 
          fontSize: '20px', 
          marginBottom: '20px',
          paddingBottom: '12px',
          borderBottom: '2px solid #e6f7ff',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          🔭 下周预警 ({currentReport.nextWeekAlerts.length}项)
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {currentReport.nextWeekAlerts.map((alert) => {
            const severityColor = alert.severity === 'high' ? '#f5222d' : 
                                 alert.severity === 'medium' ? '#faad14' : '#52c41a';
            const severityBg = alert.severity === 'high' ? '#fff2f0' : 
                              alert.severity === 'medium' ? '#fffbe6' : '#f6ffed';
            
            return (
              <div key={alert.id} style={{ 
                padding: '16px',
                background: severityBg,
                borderRadius: '8px',
                borderLeft: `4px solid ${severityColor}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <span style={{ 
                    background: severityColor,
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {alert.severity === 'high' ? '🔴高' : alert.severity === 'medium' ? '🟡中' : '🟢低'}
                  </span>
                  <span style={{ 
                    fontSize: '16px',
                    fontWeight: '500',
                    color: '#262626'
                  }}>
                    {alert.title}
                  </span>
                </div>
                <p style={{ 
                  color: '#595959', 
                  margin: '0 0 8px 0',
                  fontSize: '14px',
                  lineHeight: '1.6'
                }}>
                  {alert.description}
                </p>
                <div style={{ 
                  fontSize: '12px',
                  color: '#8c8c8c',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  📅 {alert.dueDate}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div style={{ 
        textAlign: 'center',
        marginTop: '40px',
        padding: '20px',
        color: '#8c8c8c',
        fontSize: '12px'
      }}>
        <p style={{ margin: '0 0 8px 0' }}>
          本周报由智能周报提醒工具自动生成
        </p>
        <p style={{ margin: 0 }}>
          生成时间: {new Date().toLocaleString('zh-CN')}
        </p>
      </div>
    </div>
  );
}
