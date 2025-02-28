import React from 'react';
import { Box, Container, Typography, Link, Grid } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { DirectionsRun as RunIcon } from '@mui/icons-material';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[100],
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <RunIcon sx={{ mr: 1 }} />
              <Typography variant="h6" color="text.primary">
                RunnersHigh
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              마라토너를 위한 랭킹 및 전적 시스템
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              바로가기
            </Typography>
            <Link component={RouterLink} to="/" color="inherit" display="block" sx={{ mb: 1 }}>
              홈
            </Link>
            <Link component={RouterLink} to="/runners" color="inherit" display="block" sx={{ mb: 1 }}>
              마라토너
            </Link>
            <Link component={RouterLink} to="/races" color="inherit" display="block" sx={{ mb: 1 }}>
              대회
            </Link>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              문의하기
            </Typography>
            <Typography variant="body2" color="text.secondary">
              이메일: contact@runnershigh.com
            </Typography>
          </Grid>
        </Grid>
        <Box mt={3} pt={3} borderTop={1} borderColor="divider">
          <Typography variant="body2" color="text.secondary" align="center">
            {'© '}
            {currentYear}
            {' RunnersHigh. All rights reserved.'}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
