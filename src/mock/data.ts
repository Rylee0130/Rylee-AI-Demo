import { WeeklyReport, User, DecisionItem, ProjectHealth, OKRItem, TeamDynamics, Alert, UserLevel } from '@/types';

export const mockUser: User = {
  id: 'user-001',
  name: '张明',
  email: 'zhangming@company.com',
  level: 'DIRECTOR',
  department: '研发部',
  role: '技术总监',
};

export const mockUsers: Record<UserLevel, User> = {
  DIRECTOR: {
    id: 'user-001',
    name: '张明',
    email: 'zhangming@company.com',
    level: 'DIRECTOR',
    department: '研发部',
    role: '技术总监',
  },
  VP: {
    id: 'user-002',
    name: '李华',
    email: 'lihua@company.com',
    level: 'VP',
    department: '技术委员会',
    role: '技术副总裁',
  },
};

export const mockDecisionItems: DecisionItem[] = [
  {
    id: 'dec-001',
    title: 'Q3技术架构升级方案审批',
    description: '架构组提交了Q3技术架构升级方案，涉及微服务重构和数据库迁移，需要您审批确认。',
    category: 'decision',
    priority: 1,
    status: 'pending',
    sourceUrl: 'https://internal.approvals.com/request/12345',
    dueDate: '2026-05-28',
    aiSummary: '架构升级方案预计耗时8周，涉及3个核心系统，需要额外2名资深工程师资源。',
  },
  {
    id: 'dec-002',
    title: '跨部门协作阻塞问题',
    description: '支付团队与风控团队在接口联调上存在分歧，需要您介入协调。',
    category: 'action',
    priority: 2,
    status: 'pending',
    sourceUrl: 'https://feishu.company.com/group/abc123',
  },
  {
    id: 'dec-003',
    title: '预算申请待审批',
    description: '研发部Q3工具采购预算申请已提交，金额50万元。',
    category: 'decision',
    priority: 2,
    status: 'pending',
    sourceUrl: 'https://internal.finance.com/budget/67890',
    dueDate: '2026-05-30',
  },
  {
    id: 'dec-004',
    title: '核心项目延期风险',
    description: 'SaaS平台重构项目进度落后2周，PM已发起Escalation。',
    category: 'action',
    priority: 1,
    status: 'pending',
    aiSummary: '主要原因是关键依赖未按时交付，建议召开紧急会议评估影响。',
  },
  {
    id: 'dec-005',
    title: '新员工入职安排',
    description: '本周有3名新工程师入职，已完成培训计划安排。',
    category: 'inform',
    priority: 4,
    status: 'completed',
  },
];

export const mockProjectHealth: ProjectHealth[] = [
  {
    id: 'proj-001',
    name: 'SaaS平台重构',
    milestone: '核心模块上线',
    status: 'red',
    progress: 65,
    delayReason: '关键依赖未按时交付',
    dependencies: ['支付系统', '认证服务'],
  },
  {
    id: 'proj-002',
    name: '移动端App开发',
    milestone: 'Beta版本发布',
    status: 'yellow',
    progress: 80,
  },
  {
    id: 'proj-003',
    name: '数据中台建设',
    milestone: '数据仓库上线',
    status: 'green',
    progress: 95,
  },
  {
    id: 'proj-004',
    name: '安全合规整改',
    milestone: '等保三级认证',
    status: 'green',
    progress: 70,
  },
  {
    id: 'proj-005',
    name: 'AI能力平台',
    milestone: 'MVP发布',
    status: 'yellow',
    progress: 55,
    delayReason: '算法模型训练耗时超出预期',
  },
];

export const mockTeamOKRs: OKRItem[] = [
  { id: 'okr-001', name: '核心系统稳定性', progress: 85, status: 'green', trend: 'up', period: 'Q2' },
  { id: 'okr-002', name: '研发效率提升', progress: 60, status: 'yellow', trend: 'stable', period: 'Q2' },
  { id: 'okr-003', name: '技术债清理', progress: 45, status: 'yellow', trend: 'down', period: 'Q2' },
  { id: 'okr-004', name: '团队能力建设', progress: 75, status: 'green', trend: 'up', period: 'Q2' },
];

export const mockBuOKRs: OKRItem[] = [
  { id: 'okr-bu-001', name: '营收增长', progress: 70, status: 'yellow', trend: 'up', period: 'Q2' },
  { id: 'okr-bu-002', name: '客户满意度', progress: 82, status: 'green', trend: 'stable', period: 'Q2' },
  { id: 'okr-bu-003', name: '市场份额扩展', progress: 55, status: 'yellow', trend: 'down', period: 'Q2' },
];

export const mockTeamDynamics: TeamDynamics = {
  overdue1on1: [
    { id: 'emp-001', name: '王磊', role: '高级工程师', last1on1Date: '2026-04-20', needs1on1: true },
    { id: 'emp-002', name: '陈芳', role: '技术主管', last1on1Date: '2026-04-15', needs1on1: true },
  ],
  newHires: [
    { id: 'emp-003', name: '赵强', role: '后端工程师', needs1on1: false },
    { id: 'emp-004', name: '刘娜', role: '前端工程师', needs1on1: false },
    { id: 'emp-005', name: '周伟', role: 'DevOps工程师', needs1on1: false },
  ],
  departures: [],
  jobTransfers: [
    { id: 'emp-006', name: '孙丽', role: '从开发转产品', needs1on1: false },
  ],
  hiringProgress: [
    { position: '资深后端工程师', stage: 'interviewing', candidates: 3 },
    { position: 'AI算法工程师', stage: 'recruiting', candidates: 5 },
    { position: '安全工程师', stage: 'offering', candidates: 1 },
  ],
  importantDates: [
    { date: '2026-05-23', name: '李明', type: 'birthday' },
    { date: '2026-05-25', name: '王芳', type: 'anniversary' },
  ],
};

export const mockAlerts: Alert[] = [
  {
    id: 'alert-001',
    type: 'milestone',
    title: 'SaaS平台重构关键里程碑',
    description: '核心模块上线截止日期为下周五，请关注进度。',
    severity: 'high',
    dueDate: '2026-05-30',
    relatedItems: ['proj-001'],
  },
  {
    id: 'alert-002',
    type: 'meeting',
    title: 'Q2季度述职',
    description: '下周三需要进行Q2季度述职汇报，请提前准备。',
    severity: 'high',
    dueDate: '2026-05-28',
    relatedItems: [],
  },
  {
    id: 'alert-003',
    type: 'okr',
    title: 'OKR关键节点',
    description: '技术债清理目标进度落后，需要关注。',
    severity: 'medium',
    dueDate: '2026-06-01',
    relatedItems: ['okr-003'],
  },
  {
    id: 'alert-004',
    type: 'resource',
    title: '跨团队资源冲突',
    description: '数据中台项目与AI平台项目存在资源竞争。',
    severity: 'medium',
    dueDate: '2026-05-27',
    relatedItems: ['proj-003', 'proj-005'],
  },
];

export const generateMockReport = (userLevel: UserLevel): WeeklyReport => {
  const isVP = userLevel === 'VP';
  const user = mockUsers[userLevel];
  
  return {
    id: `report-${Date.now()}`,
    userId: user.id,
    weekStart: '2026-05-19',
    weekEnd: '2026-05-25',
    summary: isVP 
      ? `本周整体业务状态平稳，但存在一些需要关注的风险点。最需要关注的是SaaS平台重构项目延期问题，已落后计划2周，建议尽快协调资源解决关键依赖。下周最大的风险是多个项目的关键里程碑集中在同一周，可能存在资源冲突风险。Q2整体OKR健康度为黄色，需要重点关注技术债清理目标的进展。`
      : `本周研发部整体状态基本正常。最需要关注的是SaaS平台重构项目，由于关键依赖未按时交付导致进度落后2周，PM已发起Escalation。下周最大风险是核心模块上线里程碑临近，但当前进度仅65%。团队OKR整体健康度为黄色，其中技术债清理目标趋势有所恶化。`,
    decisionItems: mockDecisionItems,
    healthOverview: {
      projectHealth: mockProjectHealth,
      okrHealth: {
        overallStatus: 'yellow',
        teamOKRs: isVP ? undefined : mockTeamOKRs,
        buOKRs: isVP ? mockBuOKRs : undefined,
      },
      overallStatus: 'yellow',
    },
    teamDynamics: mockTeamDynamics,
    nextWeekAlerts: mockAlerts,
    status: 'generated',
    createdAt: new Date().toISOString(),
  };
};
