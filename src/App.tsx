import { HashRouter, Routes, Route } from 'react-router-dom';
import UserPage from '@/pages/UserPage';
import ManagePage from '@/pages/ManagePage';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<UserPage />} />
        <Route path="/manage" element={<ManagePage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
