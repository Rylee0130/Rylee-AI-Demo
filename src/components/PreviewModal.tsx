import { Modal, Button, Space, Typography, Divider, Input, message } from 'antd';
const { TextArea } = Input;
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { togglePreview, updateSummary } from '@/store/reportSlice';
import { downloadSharePage, openSharePage } from '@/utils/shareGenerator';

const { Title } = Typography;

export default function PreviewModal() {
  const { showPreview, currentReport, user } = useSelector((state: RootState) => state.report);
  const dispatch = useDispatch();
  const [summary, setSummary] = useState('');
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [exporting, setExporting] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showPreview && currentReport) {
      setSummary(currentReport.summary);
      setSent(false);
    }
  }, [showPreview, currentReport]);

  const handleClose = () => {
    dispatch(togglePreview());
  };

  const handleSaveSummary = () => {
    dispatch(updateSummary(summary));
    message.success('修改已保存');
  };

  const handleCopy = () => {
    const fullContent = generateFullReportText();
    navigator.clipboard.writeText(fullContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    message.success('完整周报已复制到剪贴板');
  };

  const generateFullReportText = () => {
    if (!currentReport) return '';
    
    let content = `📊 ${currentReport.weekStart} - ${currentReport.weekEnd} 周报\n\n`;
    content += `═══════════════════════════════════\n`;
    content += `📝 本周总览\n`;
    content += `═══════════════════════════════════\n`;
    content += `${currentReport.summary}\n\n`;
    
    content += `═══════════════════════════════════\n`;
    content += `✅ 我的决策清单 (${currentReport.decisionItems.length}项)\n`;
    content += `═══════════════════════════════════\n`;
    currentReport.decisionItems.forEach((item, index) => {
      const category = item.category === 'action' ? '需要动作' : item.category === 'decision' ? '需要决策' : '知会即可';
      content += `${index + 1}. [${category}] ${item.title}\n`;
      content += `   ${item.description}\n`;
      if (item.aiSummary) {
        content += `   💡 AI建议: ${item.aiSummary}\n`;
      }
      content += `\n`;
    });
    
    content += `═══════════════════════════════════\n`;
    content += `📊 业务与目标健康度\n`;
    content += `═══════════════════════════════════\n`;
    const statusEmoji = currentReport.healthOverview.overallStatus === 'green' ? '🟢' : 
                        currentReport.healthOverview.overallStatus === 'yellow' ? '🟡' : '🔴';
    content += `项目整体状态: ${statusEmoji}\n\n`;
    
    content += `项目进展:\n`;
    currentReport.healthOverview.projectHealth.forEach(project => {
      const projectStatus = project.status === 'green' ? '🟢' : project.status === 'yellow' ? '🟡' : '🔴';
      content += `  ${projectStatus} ${project.name} - ${project.milestone} (${project.progress}%)\n`;
    });
    
    content += `\nOKR进展:\n`;
    if (currentReport.healthOverview.okrHealth.teamOKRs) {
      currentReport.healthOverview.okrHealth.teamOKRs.forEach(okr => {
        const okrStatus = okr.status === 'green' ? '🟢' : okr.status === 'yellow' ? '🟡' : '🔴';
        content += `  ${okrStatus} ${okr.name}: ${okr.progress}%\n`;
      });
    }
    
    content += `\n═══════════════════════════════════\n`;
    content += `👥 团队动态\n`;
    content += `═══════════════════════════════════\n`;
    
    if (currentReport.teamDynamics.overdue1on1.length > 0) {
      content += `需要1on1:\n`;
      currentReport.teamDynamics.overdue1on1.forEach(member => {
        content += `  ⭐ ${member.name} - ${member.role} (超过2周未进行)\n`;
      });
    }
    
    if (currentReport.teamDynamics.newHires.length > 0) {
      content += `\n本周入职:\n`;
      currentReport.teamDynamics.newHires.forEach(member => {
        content += `  ➕ ${member.name} - ${member.role}\n`;
      });
    }
    
    if (currentReport.teamDynamics.departures.length > 0) {
      content += `\n本周离职:\n`;
      currentReport.teamDynamics.departures.forEach(member => {
        content += `  ➖ ${member.name} - ${member.role}\n`;
      });
    }
    
    if (currentReport.teamDynamics.hiringProgress.length > 0) {
      content += `\n招聘进展:\n`;
      currentReport.teamDynamics.hiringProgress.forEach(item => {
        content += `  💼 ${item.position}: ${item.candidates}位候选人\n`;
      });
    }
    
    content += `\n═══════════════════════════════════\n`;
    content += `🔭 下周预警 (${currentReport.nextWeekAlerts.length}项)\n`;
    content += `═══════════════════════════════════\n`;
    currentReport.nextWeekAlerts.forEach(alert => {
      const severity = alert.severity === 'high' ? '🔴高' : alert.severity === 'medium' ? '🟡中' : '🟢低';
      content += `[${severity}] ${alert.title}\n`;
      content += `  ${alert.description}\n`;
      content += `  📅 ${alert.dueDate}\n\n`;
    });
    
    return content;
  };

  const handleExport = async (type: 'image' | 'pdf') => {
    if (!previewRef.current) return;
    
    setExporting(true);
    try {
      // 创建临时canvas
      const canvas = document.createElement('canvas');
      const scale = 2;
      
      const content = generateFullReportText();
      const lines = content.split('\n');
      
      // 计算canvas尺寸
      const padding = 40;
      const lineHeight = 20;
      const fontSize = 14;
      const width = 600;
      const height = padding * 2 + lines.length * lineHeight;
      
      canvas.width = width * scale;
      canvas.height = height * scale;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('无法创建canvas上下文');
      }
      
      ctx.scale(scale, scale);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // 绘制背景和文本
      ctx.fillStyle = '#000000';
      ctx.font = `${fontSize}px Arial, sans-serif`;
      
      let y = padding;
      lines.forEach(line => {
        // 根据内容类型调整样式
        if (line.includes('═══')) {
          ctx.font = `bold ${fontSize}px Arial, sans-serif`;
          ctx.fillStyle = '#1890ff';
        } else if (line.startsWith('📊') || line.startsWith('📝') || line.startsWith('✅') || 
                   line.startsWith('👥') || line.startsWith('🔭')) {
          ctx.font = `bold ${fontSize + 2}px Arial, sans-serif`;
          ctx.fillStyle = '#1890ff';
        } else {
          ctx.font = `${fontSize}px Arial, sans-serif`;
          ctx.fillStyle = '#000000';
        }
        ctx.fillText(line, padding, y);
        y += lineHeight;
      });
      
      // 导出
      if (type === 'image') {
        const link = document.createElement('a');
        link.download = `周报_${currentReport?.weekStart}_${currentReport?.weekEnd}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        message.success('完整周报图片导出成功');
      } else {
        // PDF导出
        const imgData = canvas.toDataURL('image/png');
        const pdfWindow = window.open('', '_blank');
        if (pdfWindow) {
          pdfWindow.document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>周报 - ${currentReport?.weekStart} 至 ${currentReport?.weekEnd}</title>
                <style>
                  body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
                  img { width: 100%; height: auto; }
                </style>
              </head>
              <body>
                <img src="${imgData}" alt="周报内容"/>
              </body>
            </html>
          `);
          pdfWindow.document.close();
          setTimeout(() => {
            pdfWindow.print();
          }, 250);
          message.success('PDF打印窗口已打开，请使用浏览器打印功能保存为PDF');
        }
      }
    } catch (error) {
      console.error('导出失败:', error);
      message.error('导出失败，请重试');
    } finally {
      setExporting(false);
    }
  };

  const handleSend = () => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      message.success('周报已成功发送');
    }, 1500);
  };

  const handleDownloadShare = () => {
    if (currentReport) {
      downloadSharePage(currentReport, user);
    }
  };

  const handleOpenShare = () => {
    if (currentReport) {
      openSharePage(currentReport, user);
    }
  };

  if (!currentReport) return null;

  return (
    <Modal
      title="📤 周报预览与发送"
      open={showPreview}
      onCancel={handleClose}
      width={900}
      footer={
        <Space wrap>
          <Button onClick={handleClose}>✖️ 取消</Button>
          <Button onClick={handleSaveSummary}>✏️ 保存修改</Button>
          <Button onClick={handleCopy} disabled={exporting}>
            {copied ? '✓ 已复制' : '📋 复制完整内容'}
          </Button>
          <Button 
            onClick={() => handleExport('image')} 
            loading={exporting}
            disabled={sending}
          >
            🖼️ 导出图片
          </Button>
          <Button 
            onClick={() => handleExport('pdf')} 
            loading={exporting}
            disabled={sending}
          >
            📄 导出PDF
          </Button>
          <Button 
            type="primary" 
            loading={sending} 
            onClick={handleSend}
            disabled={exporting}
          >
            {sent ? '✓ 发送成功' : '📤 确认发送'}
          </Button>
          <Button onClick={handleOpenShare}>
            🔗 分享链接
          </Button>
          <Button onClick={handleDownloadShare}>
            📥 下载网页版
          </Button>
        </Space>
      }
    >
      <div ref={previewRef} className="preview-content">
        <div className="preview-header">
          <Title level={3} className="preview-title">
            📊 {currentReport.weekStart} - {currentReport.weekEnd} 周报
          </Title>
        </div>

        <Divider />

        <div className="preview-section">
          <h4 className="section-title">📝 本周总览</h4>
          <TextArea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={4}
            className="summary-editor"
            placeholder="编辑周报总结..."
          />
        </div>

        <Divider />

        <div className="preview-section">
          <h4 className="section-title">✅ 决策事项 ({currentReport.decisionItems.length}项)</h4>
          <ul className="decision-preview">
            {currentReport.decisionItems.map((item) => (
              <li key={item.id} className="decision-item">
                <div className="decision-header">
                  <span className="item-title">{item.title}</span>
                  <span className="item-category">
                    {item.category === 'action' ? '🔴 需要动作' : 
                     item.category === 'decision' ? '🟡 需要决策' : '🔵 知会即可'}
                  </span>
                </div>
                <p className="item-description">{item.description}</p>
                {item.aiSummary && (
                  <p className="ai-summary">💡 {item.aiSummary}</p>
                )}
              </li>
            ))}
          </ul>
        </div>

        <Divider />

        <div className="preview-section">
          <h4 className="section-title">📊 业务与目标健康度</h4>
          <div className="health-preview">
            <div className="health-item">
              <span className="health-label">项目整体状态</span>
              <span className={`health-status ${currentReport.healthOverview.overallStatus}`}>
                {currentReport.healthOverview.overallStatus === 'green' ? '🟢 正常' : 
                 currentReport.healthOverview.overallStatus === 'yellow' ? '🟡 警告' : '🔴 异常'}
              </span>
            </div>
            <div className="health-item">
              <span className="health-label">OKR健康度</span>
              <span className={`health-status ${currentReport.healthOverview.okrHealth.overallStatus}`}>
                {currentReport.healthOverview.okrHealth.overallStatus === 'green' ? '🟢 正常' : 
                 currentReport.healthOverview.okrHealth.overallStatus === 'yellow' ? '🟡 警告' : '🔴 异常'}
              </span>
            </div>
          </div>
          
          <div className="project-list">
            {currentReport.healthOverview.projectHealth.map((project) => (
              <div key={project.id} className="project-item">
                <span className="project-name">
                  {project.status === 'green' ? '🟢' : project.status === 'yellow' ? '🟡' : '🔴'} 
                  {project.name}
                </span>
                <span className="project-progress">{project.progress}%</span>
              </div>
            ))}
          </div>
        </div>

        <Divider />

        <div className="preview-section">
          <h4 className="section-title">👥 团队动态</h4>
          
          {currentReport.teamDynamics.overdue1on1.length > 0 && (
            <div className="team-sub-section">
              <h5>⭐ 需要1on1</h5>
              {currentReport.teamDynamics.overdue1on1.map((member) => (
                <div key={member.id} className="member-item">
                  {member.name} - {member.role} <span className="warning-tag">超过2周</span>
                </div>
              ))}
            </div>
          )}
          
          {currentReport.teamDynamics.newHires.length > 0 && (
            <div className="team-sub-section">
              <h5>➕ 本周入职</h5>
              {currentReport.teamDynamics.newHires.map((member) => (
                <div key={member.id} className="member-item">
                  {member.name} - {member.role}
                </div>
              ))}
            </div>
          )}
          
          {currentReport.teamDynamics.departures.length > 0 && (
            <div className="team-sub-section">
              <h5>➖ 本周离职</h5>
              {currentReport.teamDynamics.departures.map((member) => (
                <div key={member.id} className="member-item">
                  {member.name} - {member.role}
                </div>
              ))}
            </div>
          )}
          
          {currentReport.teamDynamics.hiringProgress.length > 0 && (
            <div className="team-sub-section">
              <h5>💼 招聘进展</h5>
              {currentReport.teamDynamics.hiringProgress.map((item, index) => (
                <div key={index} className="hiring-item">
                  {item.position}: {item.candidates}位候选人
                </div>
              ))}
            </div>
          )}
        </div>

        <Divider />

        <div className="preview-section">
          <h4 className="section-title">🔭 下周预警 ({currentReport.nextWeekAlerts.length}项)</h4>
          <ul className="alert-preview">
            {currentReport.nextWeekAlerts.map((alert) => (
              <li key={alert.id} className="alert-item">
                <div className="alert-header">
                  <span className={`severity-badge ${alert.severity}`}>
                    {alert.severity === 'high' ? '🔴高' : alert.severity === 'medium' ? '🟡中' : '🟢低'}
                  </span>
                  <span className="alert-title">{alert.title}</span>
                </div>
                <p className="alert-description">{alert.description}</p>
                <span className="alert-date">📅 {alert.dueDate}</span>
              </li>
            ))}
          </ul>
        </div>

        {sent && (
          <div className="success-message">
            <span className="success-icon">🎉</span>
            <span>周报已成功发送！</span>
          </div>
        )}
      </div>
    </Modal>
  );
}
