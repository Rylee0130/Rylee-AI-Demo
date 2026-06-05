import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '@/store/store';
import { fetchReport } from '@/store/reportSlice';
import WeeklySummary from '@/components/WeeklySummary';
import DecisionList from '@/components/DecisionList';
import BusinessHealth from '@/components/BusinessHealth';
import NextWeekAlert from '@/components/NextWeekAlert';
import { Spin } from 'antd';
import './UserPage.css';

function UserPage() {
  const { loading, error, currentReport, user } = useSelector((state: RootState) => state.report);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchReport());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="user-page">
        <div className="loading-container">
          <Spin size="large" />
          <p>正在生成周报...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-page">
        <div className="error-container">
          <p>加载失败: {error}</p>
          <button onClick={() => dispatch(fetchReport())}>重新加载</button>
        </div>
      </div>
    );
  }

  return (
    <div className="user-page">
      <header className="user-header">
        <div className="header-content">
          <h1>📊 智能周报</h1>
          <div className="user-info">
            <span className="greeting">您好，{user?.name}</span>
            <span className="role">{user?.role}</span>
          </div>
        </div>
        <div className="nav-links">
          <a href="#/" className="active">📋 周报</a>
          <a href="#/manage">⚙️ 管理后台</a>
        </div>
      </header>

      <main className="user-content">
        {currentReport && (
          <>
            <div className="summary-card">
              <WeeklySummary />
            </div>
            
            <div className="content-grid">
              <div className="left-panel">
                <div className="card">
                  <h2>🎯 目标进展</h2>
                  <BusinessHealth />
                </div>
                
                <div className="card">
                  <h2>🔭 下周预警</h2>
                  <NextWeekAlert />
                </div>
              </div>
              
              <div className="right-panel">
                <div className="card">
                  <h2>✅ 决策事项</h2>
                  <DecisionList />
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default UserPage;
