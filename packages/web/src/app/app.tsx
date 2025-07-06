// Uncomment this line to use CSS modules
// import styles from './app.module.css';
import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import { Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import Sidebar from '../components/Sliderbar';
import UserPage from '../pages/UserPage';
import OkxPage from '../pages/OkxPage';

export function App() {
  return (
    <BrowserRouter >
      <Sidebar>
        <Routes>
          <Route path="/user" element={<UserPage />} />
          <Route path='/okx' element={<OkxPage />} />
          {/*  */}
        </Routes>

      </Sidebar>
    </BrowserRouter>
  );
}

export default App;
