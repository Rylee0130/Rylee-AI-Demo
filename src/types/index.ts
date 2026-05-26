export type UserLevel = 'DIRECTOR' | 'VP';
export type HealthStatus = 'green' | 'yellow' | 'red';
export type PriorityLevel = 1 | 2 | 3 | 4 | 5;
export type DecisionCategory = 'action' | 'decision' | 'inform';
export type AlertSeverity = 'high' | 'medium' | 'low';
export type TrendDirection = 'up' | 'down' | 'stable';

export interface User {
  id: string;
  name: string;
  email: string;
  level: UserLevel;
  department: string;
  role: string;
}

export interface DecisionItem {
  id: string;
  title: string;
  description: string;
  category: DecisionCategory;
  priority: PriorityLevel;
  status: 'pending' | 'processing' | 'completed';
  sourceUrl?: string;
  dueDate?: string;
  aiSummary?: string;
}

export interface ProjectHealth {
  id: string;
  name: string;
  milestone: string;
  status: HealthStatus;
  progress: number;
  delayReason?: string;
  dependencies?: string[];
}

export interface OKRItem {
  id: string;
  name: string;
  progress: number;
  status: HealthStatus;
  trend: TrendDirection;
  period: string;
}

export interface OKRHealthSummary {
  overallStatus: HealthStatus;
  teamOKRs?: OKRItem[];
  buOKRs?: OKRItem[];
}

export interface HealthOverview {
  projectHealth: ProjectHealth[];
  okrHealth: OKRHealthSummary;
  overallStatus: HealthStatus;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  last1on1Date?: string;
  needs1on1: boolean;
}

export interface HiringStatus {
  position: string;
  stage: 'recruiting' | 'interviewing' | 'offering' | 'closed';
  candidates: number;
}

export interface TeamDynamics {
  overdue1on1: TeamMember[];
  newHires: TeamMember[];
  departures: TeamMember[];
  jobTransfers: TeamMember[];
  hiringProgress: HiringStatus[];
  importantDates: { date: string; name: string; type: 'birthday' | 'anniversary' }[];
}

export interface Alert {
  id: string;
  type: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  dueDate: string;
  relatedItems: string[];
}

export interface WeeklyReport {
  id: string;
  userId: string;
  weekStart: string;
  weekEnd: string;
  summary: string;
  decisionItems: DecisionItem[];
  healthOverview: HealthOverview;
  teamDynamics: TeamDynamics;
  nextWeekAlerts: Alert[];
  status: 'generated' | 'draft' | 'published';
  createdAt: string;
}

export interface DataSourceConfig {
  name: string;
  key: string;
  enabled: boolean;
  url?: string;
  description: string;
}

export interface PushChannel {
  name: string;
  key: string;
  enabled: boolean;
  config: Record<string, string>;
}

export interface CalendarConfig {
  enabled: boolean;
  syncFrequency: string;
  calendarUrl?: string;
}

export interface PushSchedule {
  enabled: boolean;
  time: string;
  dayOfWeek: number;
}

export interface AppConfig {
  dataSources: DataSourceConfig[];
  pushChannels: PushChannel[];
  calendar: CalendarConfig;
  schedule: PushSchedule;
}

export interface ReportState {
  currentReport: WeeklyReport | null;
  loading: boolean;
  error: string | null;
  user: User | null;
  userLevel: UserLevel;
  showPreview: boolean;
  showConfig: boolean;
  config: AppConfig;
}

export type CategoryLabel = {
  label: string;
  color: string;
  bgColor: string;
};

export type PriorityConfig = {
  label: string;
  color: string;
};
