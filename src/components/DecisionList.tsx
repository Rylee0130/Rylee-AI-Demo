import { Card, Tag, Button, Collapse } from 'antd';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { updateDecisionStatus } from '@/store/reportSlice';
import { DecisionCategory, PriorityLevel } from '@/types';

const categoryConfig: Record<DecisionCategory, { label: string; color: string; bgColor: string }> = {
  action: { label: '需要动作', color: '#f5222d', bgColor: '#fff1f0' },
  decision: { label: '需要决策', color: '#fa8c16', bgColor: '#fffbe6' },
  inform: { label: '知会即可', color: '#1890ff', bgColor: '#e6f7ff' },
};

const priorityConfig: Record<PriorityLevel, { label: string; color: string }> = {
  1: { label: '紧急', color: '#f5222d' },
  2: { label: '高', color: '#fa8c16' },
  3: { label: '中', color: '#faad14' },
  4: { label: '低', color: '#52c41a' },
  5: { label: '可缓', color: '#d9d9d9' },
};

export default function DecisionList() {
  const { currentReport } = useSelector((state: RootState) => state.report);
  const dispatch = useDispatch();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  if (!currentReport) return null;

  const sortedItems = [...currentReport.decisionItems].sort((a, b) => a.priority - b.priority);

  const handleStatusChange = (itemId: string, status: string) => {
    dispatch(updateDecisionStatus({ itemId, status }));
  };

  const toggleExpand = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  return (
    <Card className="decision-card" title={
      <div className="card-title">
        <span className="icon">✅</span>
        <span>我的决策清单</span>
        <span className="count">{sortedItems.length}项</span>
      </div>
    }>
      <div className="decision-list">
        {sortedItems.map((item) => {
          const category = categoryConfig[item.category];
          const priority = priorityConfig[item.priority];
          const isExpanded = expandedItems.includes(item.id);

          return (
            <div key={item.id} className={`decision-item ${item.status}`}>
              <div className="item-header" onClick={() => toggleExpand(item.id)}>
                <div className="item-left">
                  <Tag color={category.color} className="category-tag">
                    {category.label}
                  </Tag>
                  <Tag color={priority.color} className="priority-tag">
                    {priority.label}
                  </Tag>
                  <span className="item-title">{item.title}</span>
                </div>
                <div className="item-right">
                  {item.dueDate && (
                    <span className="due-date">
                      <span className="icon">📅</span>
                      {item.dueDate}
                    </span>
                  )}
                  {item.sourceUrl && (
                    <Button size="small" className="link-btn">
                      →
                    </Button>
                  )}
                  <span className="expand-icon">{isExpanded ? '▲' : '▼'}</span>
                </div>
              </div>

              <Collapse defaultActiveKey={[]} activeKey={isExpanded ? [item.id] : []}>
                <Collapse.Panel key={item.id} header="" className="collapse-panel">
                  <p className="item-description">{item.description}</p>
                  {item.aiSummary && (
                    <div className="ai-summary">
                      <span className="icon">💡</span>
                      <span>AI建议：{item.aiSummary}</span>
                    </div>
                  )}
                  <div className="item-actions">
                    <Button 
                      size="small" 
                      onClick={(e) => { e.stopPropagation(); handleStatusChange(item.id, 'pending'); }}
                      className={item.status === 'pending' ? 'active' : ''}
                    >
                      待处理
                    </Button>
                    <Button 
                      size="small" 
                      onClick={(e) => { e.stopPropagation(); handleStatusChange(item.id, 'processing'); }}
                      className={item.status === 'processing' ? 'active' : ''}
                    >
                      处理中
                    </Button>
                    <Button 
                      size="small" 
                      onClick={(e) => { e.stopPropagation(); handleStatusChange(item.id, 'completed'); }}
                      className={item.status === 'completed' ? 'active' : ''}
                    >
                      已完成
                    </Button>
                  </div>
                </Collapse.Panel>
              </Collapse>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
