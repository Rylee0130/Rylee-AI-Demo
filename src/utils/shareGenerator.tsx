import { message } from 'antd';

export const generateShareHTML = (report: any, user: any) => {
  const htmlContent = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>周报 - ${report.weekStart} 至 ${report.weekEnd}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: #f0f2f5;
      padding: 40px;
      line-height: 1.6;
    }
    .container { 
      max-width: 900px; 
      margin: 0 auto; 
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 16px;
      padding: 40px;
      margin-bottom: 24px;
      color: white;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .header h1 { font-size: 28px; margin-bottom: 16px; font-weight: 600; }
    .date { font-size: 14px; opacity: 0.9; }
    .summary-box {
      background: rgba(255,255,255,0.15);
      border-radius: 8px;
      padding: 16px;
      margin-top: 16px;
    }
    .user-info { font-size: 14px; opacity: 0.9; margin-bottom: 8px; }
    .card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 24px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }
    .card-title {
      color: #1890ff;
      font-size: 20px;
      margin-bottom: 20px;
      padding-bottom: 12px;
      border-bottom: 2px solid #e6f7ff;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .item {
      padding: 16px;
      background: #fafafa;
      border-radius: 8px;
      margin-bottom: 16px;
      border-left: 4px solid #1890ff;
    }
    .item:last-child { margin-bottom: 0; }
    .tag {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
      margin-right: 12px;
    }
    .tag-action { background: #fff1f0; color: #f5222d; }
    .tag-decision { background: #fffbe6; color: #faad14; }
    .tag-inform { background: #e6f7ff; color: #1890ff; }
    .tag-high { background: #fff2f0; color: #f5222d; }
    .tag-medium { background: #fffbe6; color: #faad14; }
    .tag-low { background: #f6ffed; color: #52c41a; }
    .item-title { font-size: 16px; font-weight: 500; color: #262626; }
    .item-desc { color: #8c8c8c; font-size: 14px; margin: 8px 0; }
    .ai-tip { background: #fef9e6; padding: 12px; border-radius: 6px; font-size: 13px; color: #ad6800; margin-top: 8px; }
    .status-grid { display: flex; gap: 16px; margin-bottom: 20px; }
    .status-box {
      flex: 1;
      padding: 16px;
      border-radius: 8px;
      text-align: center;
    }
    .status-emoji { font-size: 24px; margin-bottom: 8px; }
    .status-label { font-size: 14px; color: #595959; }
    .project-item {
      display: flex;
      align-items: center;
      padding: 12px;
      background: #fafafa;
      border-radius: 6px;
      margin-bottom: 12px;
    }
    .project-item:last-child { margin-bottom: 0; }
    .project-name { flex: 1; font-size: 14px; font-weight: 500; color: #262626; margin-left: 12px; }
    .project-progress { font-size: 14px; font-weight: 500; }
    .team-section { margin-bottom: 20px; }
    .team-section:last-child { margin-bottom: 0; }
    .team-section h4 { font-size: 16px; color: #595959; margin-bottom: 12px; }
    .member-item { padding: 12px; background: #fafafa; border-radius: 6px; margin-bottom: 8px; font-size: 14px; color: #595959; }
    .member-item:last-child { margin-bottom: 0; }
    .warning-tag { 
      background: #fffbe6; 
      color: #fa8c16; 
      font-size: 12px;
      font-weight: 500;
      padding: 2px 8px;
      border-radius: 4px;
      margin-left: 8px;
    }
    .alert-item { padding: 16px; border-radius: 8px; margin-bottom: 16px; border-left: 4px solid; }
    .alert-item:last-child { margin-bottom: 0; }
    .alert-title { font-size: 16px; font-weight: 500; color: #262626; margin-left: 12px; }
    .alert-desc { color: #595959; font-size: 14px; margin: 8px 0; }
    .alert-date { font-size: 12px; color: #8c8c8c; }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding: 20px;
      color: #8c8c8c;
      font-size: 12px;
    }
    @media print {
      body { background: white; padding: 20px; }
      .container { max-width: 100%; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📊 智能周报</h1>
      <div class="date">📅 ${report.weekStart} - ${report.weekEnd}</div>
      <div class="summary-box">
        <div class="user-info">👤 ${user?.name || '未知'} · ${user?.role || '未知角色'}</div>
        <p>${report.summary}</p>
      </div>
    </div>

    <div class="card">
      <div class="card-title">✅ 我的决策清单 (${report.decisionItems.length}项)</div>
      ${report.decisionItems.map((item: any) => {
        const tagClass = item.category === 'action' ? 'tag-action' : item.category === 'decision' ? 'tag-decision' : 'tag-inform';
        const tagText = item.category === 'action' ? '🔴 需要动作' : item.category === 'decision' ? '🟡 需要决策' : '🔵 知会即可';
        return `
          <div class="item" style="border-left-color: ${item.category === 'action' ? '#f5222d' : item.category === 'decision' ? '#faad14' : '#1890ff'}">
            <span class="tag ${tagClass}">${tagText}</span>
            <span class="item-title">${item.title}</span>
            <p class="item-desc">${item.description}</p>
            ${item.aiSummary ? `<div class="ai-tip">💡 ${item.aiSummary}</div>` : ''}
          </div>
        `;
      }).join('')}
    </div>

    <div class="card">
      <div class="card-title">📊 业务与目标健康度</div>
      <div class="status-grid">
        <div class="status-box" style="background: ${report.healthOverview.overallStatus === 'green' ? '#f6ffed' : report.healthOverview.overallStatus === 'yellow' ? '#fffbe6' : '#fff2f0'}">
          <div class="status-emoji">${report.healthOverview.overallStatus === 'green' ? '🟢' : report.healthOverview.overallStatus === 'yellow' ? '🟡' : '🔴'}</div>
          <div class="status-label">项目整体状态</div>
        </div>
        <div class="status-box" style="background: ${report.healthOverview.okrHealth.overallStatus === 'green' ? '#f6ffed' : report.healthOverview.okrHealth.overallStatus === 'yellow' ? '#fffbe6' : '#fff2f0'}">
          <div class="status-emoji">${report.healthOverview.okrHealth.overallStatus === 'green' ? '🟢' : report.healthOverview.okrHealth.overallStatus === 'yellow' ? '🟡' : '🔴'}</div>
          <div class="status-label">OKR健康度</div>
        </div>
      </div>
      
      <h4 style="font-size: 16px; color: #595959; margin: 20px 0 12px 0;">📋 项目进展</h4>
      ${report.healthOverview.projectHealth.map((project: any) => `
        <div class="project-item">
          <span>${project.status === 'green' ? '🟢' : project.status === 'yellow' ? '🟡' : '🔴'}</span>
          <span class="project-name">${project.name}</span>
          <span class="project-progress" style="color: ${project.status === 'green' ? '#52c41a' : project.status === 'yellow' ? '#faad14' : '#f5222d'}">${project.progress}%</span>
        </div>
      `).join('')}
    </div>

    <div class="card">
      <div class="card-title">👥 团队动态</div>
      ${report.teamDynamics.overdue1on1.length > 0 ? `
        <div class="team-section">
          <h4>⭐ 需要1on1</h4>
          ${report.teamDynamics.overdue1on1.map((member: any) => `
            <div class="member-item" style="background: #fffbe6;">
              ${member.name} - ${member.role}<span class="warning-tag">超过2周</span>
            </div>
          `).join('')}
        </div>
      ` : ''}
      
      ${report.teamDynamics.newHires.length > 0 || report.teamDynamics.departures.length > 0 ? `
        <div class="team-section">
          <h4>人事动态</h4>
          ${report.teamDynamics.newHires.map((member: any) => `
            <div class="member-item" style="background: #f6ffed; color: #52c41a;">➕ 入职: ${member.name} - ${member.role}</div>
          `).join('')}
          ${report.teamDynamics.departures.map((member: any) => `
            <div class="member-item" style="background: #fff2f0; color: #ff4d4f;">➖ 离职: ${member.name} - ${member.role}</div>
          `).join('')}
        </div>
      ` : ''}
      
      ${report.teamDynamics.hiringProgress.length > 0 ? `
        <div class="team-section">
          <h4>💼 招聘进展</h4>
          ${report.teamDynamics.hiringProgress.map((item: any) => `
            <div class="member-item">${item.position}: ${item.candidates}位候选人</div>
          `).join('')}
        </div>
      ` : ''}
    </div>

    <div class="card">
      <div class="card-title">🔭 下周预警 (${report.nextWeekAlerts.length}项)</div>
      ${report.nextWeekAlerts.map((alert: any) => {
        const severityColor = alert.severity === 'high' ? '#f5222d' : alert.severity === 'medium' ? '#faad14' : '#52c41a';
        const severityBg = alert.severity === 'high' ? '#fff2f0' : alert.severity === 'medium' ? '#fffbe6' : '#f6ffed';
        const tagClass = alert.severity === 'high' ? 'tag-high' : alert.severity === 'medium' ? 'tag-medium' : 'tag-low';
        return `
          <div class="alert-item" style="border-left-color: ${severityColor}; background: ${severityBg};">
            <span class="tag ${tagClass}">${alert.severity === 'high' ? '🔴高' : alert.severity === 'medium' ? '🟡中' : '🟢低'}</span>
            <span class="alert-title">${alert.title}</span>
            <p class="alert-desc">${alert.description}</p>
            <div class="alert-date">📅 ${alert.dueDate}</div>
          </div>
        `;
      }).join('')}
    </div>

    <div class="footer">
      <p>本周报由智能周报提醒工具自动生成</p>
      <p>生成时间: ${new Date().toLocaleString('zh-CN')}</p>
    </div>
  </div>
</body>
</html>
  `;
  
  return htmlContent;
};

export const downloadSharePage = (report: any, user: any) => {
  const htmlContent = generateShareHTML(report, user);
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `周报_${report.weekStart}_${report.weekEnd}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  message.success('分享页面已下载');
};

export const openSharePage = (report: any, user: any) => {
  const htmlContent = generateShareHTML(report, user);
  const newWindow = window.open('', '_blank');
  if (newWindow) {
    newWindow.document.write(htmlContent);
    newWindow.document.close();
    message.success('分享页面已在新窗口打开');
  } else {
    message.error('无法打开新窗口，请检查浏览器设置');
  }
};
