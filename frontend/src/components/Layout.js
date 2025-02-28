import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
  return (
    <>
      <Header />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 4,
          minHeight: 'calc(100vh - 128px)', // 헤더와 푸터 높이를 제외한 최소 높이
        }}
      >
        <Container maxWidth="lg">
          <Outlet />
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default Layout;
