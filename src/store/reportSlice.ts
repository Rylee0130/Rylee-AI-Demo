import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { WeeklyReport, User, UserLevel, AppConfig, PushSchedule, CalendarConfig } from '@/types';
import { generateMockReport, mockUsers } from '@/mock/data';

interface ReportState {
  currentReport: WeeklyReport | null;
  loading: boolean;
  error: string | null;
  user: User | null;
  userLevel: UserLevel;
  showPreview: boolean;
  showConfig: boolean;
  config: AppConfig;
}

const defaultConfig: AppConfig = {
  dataSources: [
    { key: 'pm', name: 'PM系统', enabled: true, description: '项目管理系统数据接入' },
    { key: 'okr', name: 'OKR平台', enabled: true, description: 'OKR目标管理数据接入' },
    { key: 'hr', name: 'HR系统', enabled: false, description: '人事数据、招聘数据接入' },
    { key: 'finance', name: '财务工具', enabled: false, description: '预算、资源申请数据接入' },
    { key: 'approval', name: '审批流系统', enabled: true, description: '审批状态数据接入' },
    { key: 'im', name: '企业即时通讯', enabled: false, description: '微信/飞书群消息接入' },
    { key: 'email', name: '邮件系统', enabled: false, description: '邮件数据接入' },
    { key: 'calendar', name: '企业日历', enabled: true, description: '会议日程数据接入' },
  ],
  pushChannels: [
    { key: 'wecom', name: '企业微信', enabled: true, config: { webhookUrl: '' } },
    { key: 'feishu', name: '飞书', enabled: false, config: { webhookUrl: '' } },
    { key: 'email', name: '邮件', enabled: false, config: { smtpServer: '', sender: '' } },
  ],
  calendar: {
    enabled: true,
    syncFrequency: 'daily',
    calendarUrl: '',
  },
  schedule: {
    enabled: true,
    time: '08:30',
    dayOfWeek: 1,
  },
};

const initialState: ReportState = {
  currentReport: null,
  loading: false,
  error: null,
  user: mockUsers.DIRECTOR,
  userLevel: 'DIRECTOR',
  showPreview: false,
  showConfig: false,
  config: defaultConfig,
};

export const fetchReport = createAsyncThunk<WeeklyReport, void>(
  'report/fetchReport',
  async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return generateMockReport(mockUsers.DIRECTOR.level);
  }
);

export const regenerateReport = createAsyncThunk<WeeklyReport, UserLevel>(
  'report/regenerateReport',
  async (userLevel) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return generateMockReport(userLevel);
  }
);

export const switchUserLevel = createAsyncThunk<{ report: WeeklyReport; user: User }, UserLevel>(
  'report/switchUserLevel',
  async (userLevel) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const user = mockUsers[userLevel];
    const report = generateMockReport(userLevel);
    return { report, user };
  }
);

const reportSlice = createSlice({
  name: 'report',
  initialState,
  reducers: {
    setUserLevel: (state, action: PayloadAction<UserLevel>) => {
      state.userLevel = action.payload;
      state.user = mockUsers[action.payload];
    },
    updateDecisionStatus: (state, action: PayloadAction<{ itemId: string; status: string }>) => {
      if (state.currentReport) {
        const item = state.currentReport.decisionItems.find(
          item => item.id === action.payload.itemId
        );
        if (item) {
          item.status = action.payload.status as 'pending' | 'processing' | 'completed';
        }
      }
    },
    updateSummary: (state, action: PayloadAction<string>) => {
      if (state.currentReport) {
        state.currentReport.summary = action.payload;
      }
    },
    togglePreview: (state) => {
      state.showPreview = !state.showPreview;
    },
    toggleConfig: (state) => {
      state.showConfig = !state.showConfig;
    },
    updateDataSource: (state, action: PayloadAction<{ key: string; enabled: boolean }>) => {
      const ds = state.config.dataSources.find(d => d.key === action.payload.key);
      if (ds) {
        ds.enabled = action.payload.enabled;
      }
    },
    updatePushChannel: (state, action: PayloadAction<{ key: string; enabled: boolean }>) => {
      const channel = state.config.pushChannels.find(c => c.key === action.payload.key);
      if (channel) {
        channel.enabled = action.payload.enabled;
      }
    },
    updateSchedule: (state, action: PayloadAction<PushSchedule>) => {
      state.config.schedule = action.payload;
    },
    updateCalendar: (state, action: PayloadAction<CalendarConfig>) => {
      state.config.calendar = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReport.fulfilled, (state, action) => {
        state.loading = false;
        state.currentReport = action.payload;
      })
      .addCase(fetchReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch report';
      })
      .addCase(regenerateReport.pending, (state) => {
        state.loading = true;
      })
      .addCase(regenerateReport.fulfilled, (state, action) => {
        state.loading = false;
        state.currentReport = action.payload;
      })
      .addCase(switchUserLevel.pending, (state) => {
        state.loading = true;
      })
      .addCase(switchUserLevel.fulfilled, (state, action) => {
        state.loading = false;
        state.currentReport = action.payload.report;
        state.user = action.payload.user;
        state.userLevel = action.payload.user.level;
      });
  },
});

export const { 
  setUserLevel, 
  updateDecisionStatus, 
  updateSummary,
  togglePreview,
  toggleConfig,
  updateDataSource,
  updatePushChannel,
  updateSchedule,
  updateCalendar,
} = reportSlice.actions;
export default reportSlice.reducer;
