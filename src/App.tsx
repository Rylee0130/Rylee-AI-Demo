import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '@/store/store';
import { fetchReport } from '@/store/reportSlice';
import Header from '@/components/Header';
import WeeklySummary from '@/components/WeeklySummary';
import DecisionList from '@/components/DecisionList';
import BusinessHealth from '@/components/BusinessHealth';
import TeamDynamics from '@/components/TeamDynamics';
import NextWeekAlert from '@/components/NextWeekAlert';
import ConfigPanel from '@/components/ConfigPanel';
import PreviewModal from '@/components/PreviewModal';
import { Spin } from 'antd';

function App() {
  const { loading, error, currentReport } = useSelector((state: RootState) => state.report);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchReport());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="loading-container" style={{ textAlign: 'center', padding: '100px' }}>
        <Spin size="large" />
        <p>正在生成周报...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container" style={{ textAlign: 'center', padding: '100px' }}>
        <p>加载失败: {error}</p>
        <button onClick={() => dispatch(fetchReport())} style={{ padding: '10px 20px' }}>
          重新加载
        </button>
      </div>
    );
  }

  return (
    <div className="app" style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
      <Header />
      {currentReport ? (
        <main className="main-content">
          <div className="summary-section" style={{ marginBottom: '24px' }}>
            <WeeklySummary />
          </div>
          <div className="content-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div className="left-column">
              <NextWeekAlert />
              <BusinessHealth />
            </div>
            <div className="right-column">
              <DecisionList />
              <TeamDynamics />
            </div>
          </div>
        </main>
      ) : (
        <div style={{ textAlign: 'center', padding: '100px' }}>
          <p>无数据</p>
        </div>
      )}
      <ConfigPanel />
      <PreviewModal />
    </div>
  );
}

export default App;
