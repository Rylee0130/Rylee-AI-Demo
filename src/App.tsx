import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserPage from '@/pages/UserPage';
import ManagePage from '@/pages/ManagePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserPage />} />
        <Route path="/manage" element={<ManagePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
