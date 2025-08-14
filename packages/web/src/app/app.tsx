// import styles from './app.module.css';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Sidebar from '../components/Sliderbar';
import UserPage from '../pages/UserPage';
import OkxPage from '../pages/OkxPage';
import LoginPage from '../pages/LoginPage';
import ProtectedRoute from '../components/ProtectedRoute';
import { AuthProvider } from '../AuthContext/AuthContext';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forbidden" element={<div>Forbidden</div>} />
          {/* Protected routes (Sidebar visible only when logged in) */}
          <Route element={<Sidebar><ProtectedRoute /></Sidebar>}>
            <Route path="/user" element={<UserPage />} />
            <Route path="/okx" element={<OkxPage />} />
          </Route>
          {/* Fallback */}
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
