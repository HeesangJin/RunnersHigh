import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';

// 레이아웃 컴포넌트
import Layout from './components/Layout';

// 페이지 컴포넌트
import HomePage from './pages/HomePage';
import RunnersPage from './pages/RunnersPage';
import RunnerDetailPage from './pages/RunnerDetailPage';
import RacesPage from './pages/RacesPage';
import RaceDetailPage from './pages/RaceDetailPage';
import SearchPage from './pages/SearchPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="runners" element={<RunnersPage />} />
          <Route path="runners/:id" element={<RunnerDetailPage />} />
          <Route path="races" element={<RacesPage />} />
          <Route path="races/:id" element={<RaceDetailPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Box>
  );
}

export default App;
