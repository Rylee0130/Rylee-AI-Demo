import { Card, Button, Typography, Space, message } from 'antd';
import { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const { Paragraph } = Typography;

export default function WeeklySummary() {
  const { currentReport } = useSelector((state: RootState) => state.report);
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);

  const handleCopy = () => {
    if (currentReport?.summary) {
      navigator.clipboard.writeText(currentReport.summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      message.success('已复制到剪贴板');
    }
  };

  const handleExport = async (type: 'image' | 'pdf') => {
    if (!summaryRef.current) return;
    
    setExporting(true);
    try {
      // 创建临时canvas
      const canvas = document.createElement('canvas');
      const scale = 2; // 提高清晰度
      canvas.width = summaryRef.current.offsetWidth * scale;
      canvas.height = summaryRef.current.offsetHeight * scale;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('无法创建canvas上下文');
      }
      
      ctx.scale(scale, scale);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // 使用HTML5 Canvas绘制文本
      ctx.fillStyle = '#000000';
      ctx.font = '16px Arial';
      const lines = currentReport?.summary?.split('\n') || [];
      let y = 30;
      lines.forEach(line => {
        ctx.fillText(line, 20, y);
        y += 24;
      });
      
      // 添加标题
      ctx.font = 'bold 20px Arial';
      ctx.fillText('📝 本周总览', 20, 25);
      
      // 导出
      if (type === 'image') {
        const link = document.createElement('a');
        link.download = `周报总览_${new Date().toLocaleDateString()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        message.success('图片导出成功');
      } else {
        // PDF导出
        const imgData = canvas.toDataURL('image/png');
        
        // 创建简单的PDF（使用canvas数据）
        const pdfWindow = window.open('', '_blank');
        if (pdfWindow) {
          pdfWindow.document.write(`
            <html>
              <head><title>周报总览</title></head>
              <body style="margin:0;padding:0;">
                <img src="${imgData}" style="width:100%;height:auto;"/>
              </body>
            </html>
          `);
          pdfWindow.document.close();
          pdfWindow.print();
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

  if (!currentReport) return null;

  return (
    <Card className="summary-card" title={
      <div className="card-title">
        <span className="icon">📝</span>
        <span>本周总览</span>
      </div>
    } extra={
      <Space size="small">
        <Button 
          onClick={handleCopy}
          size="small"
          disabled={exporting}
        >
          {copied ? '✓ 已复制' : '📋 一键复制'}
        </Button>
        <Button 
          onClick={() => handleExport('image')}
          size="small"
          loading={exporting}
        >
          🖼️ 导出图片
        </Button>
        <Button 
          onClick={() => handleExport('pdf')}
          size="small"
          loading={exporting}
        >
          📄 导出PDF
        </Button>
      </Space>
    }>
      <div ref={summaryRef}>
        <Paragraph className="summary-text">
          {currentReport.summary}
        </Paragraph>
        <div className="summary-tip">
          可直接作为向上级汇报的周报草稿
        </div>
      </div>
    </Card>
  );
}
