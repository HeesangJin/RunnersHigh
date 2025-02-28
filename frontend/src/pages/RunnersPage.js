import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Pagination,
  CircularProgress,
  Button,
  Alert,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { runnerApi } from '../services/api';
import RunnerCard from '../components/RunnerCard';

const RunnersPage = () => {
  const [runners, setRunners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 필터링 및 정렬 상태
  const [searchQuery, setSearchQuery] = useState('');
  const [nationality, setNationality] = useState('');
  const [gender, setGender] = useState('');
  const [sortBy, setSortBy] = useState('name');
  
  // 페이지네이션 상태
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 9;
  
  // 국적 목록 (예시)
  const nationalities = ['대한민국', '미국', '케냐', '에티오피아', '영국', '일본', '중국'];
  
  useEffect(() => {
    const fetchRunners = async () => {
      try {
        setLoading(true);
        
        // API 요청 파라미터 구성
        const params = {
          skip: (page - 1) * itemsPerPage,
          limit: itemsPerPage,
          sort: sortBy,
        };
        
        if (searchQuery) params.search = searchQuery;
        if (nationality) params.nationality = nationality;
        if (gender) params.gender = gender;
        
        const response = await runnerApi.getRunners(params);
        
        // 응답 처리
        setRunners(response.data);
        setTotalPages(Math.ceil(response.headers['x-total-count'] / itemsPerPage) || 1);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching runners:', err);
        setError('마라토너 데이터를 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
        
        // 개발 중에는 더미 데이터로 대체
        setRunners([
          { id: 1, name: '김철수', nationality: '대한민국', gender: 'M', profile_image: 'https://via.placeholder.com/300x200?text=Runner1', bio: '서울에서 활동하는 마라토너입니다.' },
          { id: 2, name: '이영희', nationality: '대한민국', gender: 'F', profile_image: 'https://via.placeholder.com/300x200?text=Runner2', bio: '부산에서 활동하는 마라토너입니다.' },
          { id: 3, name: '박지성', nationality: '대한민국', gender: 'M', profile_image: 'https://via.placeholder.com/300x200?text=Runner3', bio: '대구에서 활동하는 마라토너입니다.' },
          { id: 4, name: 'John Smith', nationality: '미국', gender: 'M', profile_image: 'https://via.placeholder.com/300x200?text=Runner4', bio: 'American marathon runner' },
          { id: 5, name: 'Mary Johnson', nationality: '미국', gender: 'F', profile_image: 'https://via.placeholder.com/300x200?text=Runner5', bio: 'American marathon runner' },
          { id: 6, name: 'Eliud Kipchoge', nationality: '케냐', gender: 'M', profile_image: 'https://via.placeholder.com/300x200?text=Runner6', bio: 'Kenyan marathon runner' },
          { id: 7, name: 'Brigid Kosgei', nationality: '케냐', gender: 'F', profile_image: 'https://via.placeholder.com/300x200?text=Runner7', bio: 'Kenyan marathon runner' },
          { id: 8, name: '무라카미 하루키', nationality: '일본', gender: 'M', profile_image: 'https://via.placeholder.com/300x200?text=Runner8', bio: '일본의 마라토너입니다.' },
          { id: 9, name: '왕리', nationality: '중국', gender: 'F', profile_image: 'https://via.placeholder.com/300x200?text=Runner9', bio: '중국의 마라토너입니다.' },
        ]);
        setTotalPages(3);
      }
    };
    
    fetchRunners();
  }, [page, searchQuery, nationality, gender, sortBy]);
  
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1); // 검색 시 첫 페이지로 이동
  };
  
  const handleNationalityChange = (event) => {
    setNationality(event.target.value);
    setPage(1);
  };
  
  const handleGenderChange = (event) => {
    setGender(event.target.value);
    setPage(1);
  };
  
  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    setPage(1);
  };
  
  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleClearFilters = () => {
    setSearchQuery('');
    setNationality('');
    setGender('');
    setSortBy('name');
    setPage(1);
  };
  
  return (
    <Box>
      <Typography variant="h3" component="h1" gutterBottom>
        마라토너
      </Typography>
      
      {/* 필터 및 검색 섹션 */}
      <Box sx={{ mb: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="마라토너 검색"
              variant="outlined"
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>국적</InputLabel>
              <Select
                value={nationality}
                onChange={handleNationalityChange}
                label="국적"
              >
                <MenuItem value="">전체</MenuItem>
                {nationalities.map((nat) => (
                  <MenuItem key={nat} value={nat}>{nat}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>성별</InputLabel>
              <Select
                value={gender}
                onChange={handleGenderChange}
                label="성별"
              >
                <MenuItem value="">전체</MenuItem>
                <MenuItem value="M">남성</MenuItem>
                <MenuItem value="F">여성</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>정렬</InputLabel>
              <Select
                value={sortBy}
                onChange={handleSortChange}
                label="정렬"
              >
                <MenuItem value="name">이름순</MenuItem>
                <MenuItem value="nationality">국적순</MenuItem>
                <MenuItem value="races_count">대회 참가 수</MenuItem>
                <MenuItem value="best_time">최고 기록순</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <Button 
              fullWidth 
              variant="outlined" 
              onClick={handleClearFilters}
              sx={{ height: '56px' }}
            >
              필터 초기화
            </Button>
          </Grid>
        </Grid>
      </Box>
      
      {/* 에러 표시 */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* 로딩 표시 */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* 마라토너 목록 */}
          {runners.length === 0 ? (
            <Box sx={{ textAlign: 'center', my: 5 }}>
              <Typography variant="h6" color="text.secondary">
                검색 결과가 없습니다.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {runners.map((runner) => (
                <Grid item key={runner.id} xs={12} sm={6} md={4}>
                  <RunnerCard runner={runner} />
                </Grid>
              ))}
            </Grid>
          )}
          
          {/* 페이지네이션 */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination 
              count={totalPages} 
              page={page} 
              onChange={handlePageChange} 
              color="primary" 
              size="large"
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default RunnersPage;
