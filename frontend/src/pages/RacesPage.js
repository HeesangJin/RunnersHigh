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
import { raceApi } from '../services/api';
import RaceCard from '../components/RaceCard';

const RacesPage = () => {
  const [races, setRaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 필터링 및 정렬 상태
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [raceType, setRaceType] = useState('');
  const [sortBy, setSortBy] = useState('date');
  
  // 페이지네이션 상태
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 9;
  
  // 지역 목록 (예시)
  const locations = ['서울', '부산', '대구', '인천', '광주', '대전', '울산', '제주'];
  
  // 대회 유형 목록
  const raceTypes = ['마라톤', '하프 마라톤', '10K', '5K'];
  
  useEffect(() => {
    const fetchRaces = async () => {
      try {
        setLoading(true);
        
        // API 요청 파라미터 구성
        const params = {
          skip: (page - 1) * itemsPerPage,
          limit: itemsPerPage,
          sort: sortBy,
        };
        
        if (searchQuery) params.search = searchQuery;
        if (location) params.location = location;
        if (raceType) params.type = raceType;
        
        const response = await raceApi.getRaces(params);
        
        // 응답 처리
        setRaces(response.data);
        setTotalPages(Math.ceil(response.headers['x-total-count'] / itemsPerPage) || 1);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching races:', err);
        setError('대회 데이터를 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
        
        // 개발 중에는 더미 데이터로 대체
        setRaces([
          { id: 1, name: '서울 마라톤 2025', date: '2025-04-15', location: '서울', distance: 42.195, type: '마라톤', description: '서울의 주요 명소를 달리는 국제 마라톤 대회' },
          { id: 2, name: '부산 하프 마라톤', date: '2025-05-20', location: '부산', distance: 21.0975, type: '하프 마라톤', description: '부산의 해안가를 따라 달리는 하프 마라톤' },
          { id: 3, name: '제주 10K', date: '2025-06-10', location: '제주', distance: 10, type: '10K', description: '제주의 아름다운 자연 속에서 달리는 10K 대회' },
          { id: 4, name: '대구 마라톤', date: '2025-03-05', location: '대구', distance: 42.195, type: '마라톤', description: '대구의 도심을 가로지르는 마라톤 대회' },
          { id: 5, name: '인천 하프 마라톤', date: '2025-07-12', location: '인천', distance: 21.0975, type: '하프 마라톤', description: '인천의 주요 관광지를 달리는 하프 마라톤' },
          { id: 6, name: '광주 5K', date: '2025-08-25', location: '광주', distance: 5, type: '5K', description: '광주의 도심을 달리는 5K 대회' },
          { id: 7, name: '대전 10K', date: '2025-09-18', location: '대전', distance: 10, type: '10K', description: '대전의 과학관 주변을 달리는 10K 대회' },
          { id: 8, name: '울산 마라톤', date: '2025-10-05', location: '울산', distance: 42.195, type: '마라톤', description: '울산의 산업단지와 도심을 달리는 마라톤 대회' },
          { id: 9, name: '제주 하프 마라톤', date: '2025-11-15', location: '제주', distance: 21.0975, type: '하프 마라톤', description: '제주의 오름과 해안을 달리는 하프 마라톤' },
        ]);
        setTotalPages(3);
      }
    };
    
    fetchRaces();
  }, [page, searchQuery, location, raceType, sortBy]);
  
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1); // 검색 시 첫 페이지로 이동
  };
  
  const handleLocationChange = (event) => {
    setLocation(event.target.value);
    setPage(1);
  };
  
  const handleRaceTypeChange = (event) => {
    setRaceType(event.target.value);
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
    setLocation('');
    setRaceType('');
    setSortBy('date');
    setPage(1);
  };
  
  return (
    <Box>
      <Typography variant="h3" component="h1" gutterBottom>
        마라톤 대회
      </Typography>
      
      {/* 필터 및 검색 섹션 */}
      <Box sx={{ mb: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="대회 검색"
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
              <InputLabel>지역</InputLabel>
              <Select
                value={location}
                onChange={handleLocationChange}
                label="지역"
              >
                <MenuItem value="">전체</MenuItem>
                {locations.map((loc) => (
                  <MenuItem key={loc} value={loc}>{loc}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>대회 유형</InputLabel>
              <Select
                value={raceType}
                onChange={handleRaceTypeChange}
                label="대회 유형"
              >
                <MenuItem value="">전체</MenuItem>
                {raceTypes.map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
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
                <MenuItem value="date">날짜순</MenuItem>
                <MenuItem value="name">이름순</MenuItem>
                <MenuItem value="location">지역순</MenuItem>
                <MenuItem value="distance">거리순</MenuItem>
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
          {/* 대회 목록 */}
          {races.length === 0 ? (
            <Box sx={{ textAlign: 'center', my: 5 }}>
              <Typography variant="h6" color="text.secondary">
                검색 결과가 없습니다.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {races.map((race) => (
                <Grid item key={race.id} xs={12} sm={6} md={4}>
                  <RaceCard race={race} />
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

export default RacesPage;
