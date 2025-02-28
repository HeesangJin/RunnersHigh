import React, { useState, useEffect } from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Button,
  Divider,
} from '@mui/material';
import { runnerApi, raceApi, resultApi } from '../services/api';
import RunnerCard from '../components/RunnerCard';
import RaceCard from '../components/RaceCard';
import ResultTable from '../components/ResultTable';
import { Search as SearchIcon } from '@mui/icons-material';

// 탭 패널 컴포넌트
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`search-tabpanel-${index}`}
      aria-labelledby={`search-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const SearchPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('q') || '';
  
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [runners, setRunners] = useState([]);
  const [races, setRaces] = useState([]);
  const [results, setResults] = useState([]);
  
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // 러너 검색
        const runnersResponse = await runnerApi.getRunners({ search: searchQuery });
        setRunners(runnersResponse.data);
        
        // 대회 검색
        const racesResponse = await raceApi.getRaces({ search: searchQuery });
        setRaces(racesResponse.data);
        
        // 결과 검색 (러너 이름이나 대회 이름으로)
        const resultsResponse = await resultApi.getResults({ search: searchQuery });
        setResults(resultsResponse.data);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching search results:', err);
        setError('검색 결과를 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
        
        // 개발 중에는 더미 데이터로 대체
        if (searchQuery.toLowerCase().includes('김') || searchQuery.toLowerCase().includes('이')) {
          setRunners([
            { id: 1, name: '김철수', nationality: '대한민국', gender: 'M', profile_image: 'https://via.placeholder.com/300x200?text=Runner1', bio: '서울에서 활동하는 마라토너입니다.' },
            { id: 2, name: '이영희', nationality: '대한민국', gender: 'F', profile_image: 'https://via.placeholder.com/300x200?text=Runner2', bio: '부산에서 활동하는 마라토너입니다.' },
          ]);
        } else {
          setRunners([]);
        }
        
        if (searchQuery.toLowerCase().includes('서울') || searchQuery.toLowerCase().includes('마라톤')) {
          setRaces([
            { id: 1, name: '서울 마라톤 2025', date: '2025-04-15', location: '서울', distance: 42.195, type: '마라톤' },
            { id: 8, name: '울산 마라톤', date: '2025-10-05', location: '울산', distance: 42.195, type: '마라톤' },
          ]);
        } else {
          setRaces([]);
        }
        
        if (searchQuery.toLowerCase().includes('김') || searchQuery.toLowerCase().includes('서울')) {
          setResults([
            { 
              id: 1, 
              runner_id: 1, 
              runner: { id: 1, name: '김철수', gender: 'M' },
              race_id: 1, 
              race: { id: 1, name: '서울 마라톤 2024', date: '2024-03-15' },
              overall_rank: 5, 
              finish_time: '02:45:30', 
              pace: 3.92, 
              age_group_rank: 2, 
              gender_rank: 5 
            },
          ]);
        } else {
          setResults([]);
        }
      }
    };
    
    fetchSearchResults();
  }, [searchQuery]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const getTotalResultsCount = () => {
    return runners.length + races.length + results.length;
  };
  
  return (
    <Box>
      <Typography variant="h3" component="h1" gutterBottom>
        검색 결과: "{searchQuery}"
      </Typography>
      
      {/* 로딩 표시 */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* 검색 결과가 없는 경우 */}
          {getTotalResultsCount() === 0 ? (
            <Box sx={{ textAlign: 'center', my: 5 }}>
              <Typography variant="h5" color="text.secondary" gutterBottom>
                검색 결과가 없습니다.
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                다른 검색어로 다시 시도해보세요.
              </Typography>
              <Button
                component={RouterLink}
                to="/"
                variant="contained"
                color="primary"
                startIcon={<SearchIcon />}
              >
                홈으로 돌아가기
              </Button>
            </Box>
          ) : (
            <>
              {/* 탭 네비게이션 */}
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs 
                  value={tabValue} 
                  onChange={handleTabChange} 
                  aria-label="search tabs"
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  <Tab label={`전체 (${getTotalResultsCount()})`} />
                  <Tab label={`마라토너 (${runners.length})`} />
                  <Tab label={`대회 (${races.length})`} />
                  <Tab label={`결과 (${results.length})`} />
                </Tabs>
              </Box>
              
              {/* 전체 탭 */}
              <TabPanel value={tabValue} index={0}>
                {runners.length > 0 && (
                  <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h5" component="h2">
                        마라토너
                      </Typography>
                      {runners.length > 3 && (
                        <Button
                          onClick={() => setTabValue(1)}
                          color="primary"
                        >
                          더 보기
                        </Button>
                      )}
                    </Box>
                    <Grid container spacing={3}>
                      {runners.slice(0, 3).map((runner) => (
                        <Grid item key={runner.id} xs={12} sm={6} md={4}>
                          <RunnerCard runner={runner} />
                        </Grid>
                      ))}
                    </Grid>
                    <Divider sx={{ my: 4 }} />
                  </Box>
                )}
                
                {races.length > 0 && (
                  <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h5" component="h2">
                        대회
                      </Typography>
                      {races.length > 3 && (
                        <Button
                          onClick={() => setTabValue(2)}
                          color="primary"
                        >
                          더 보기
                        </Button>
                      )}
                    </Box>
                    <Grid container spacing={3}>
                      {races.slice(0, 3).map((race) => (
                        <Grid item key={race.id} xs={12} sm={6} md={4}>
                          <RaceCard race={race} />
                        </Grid>
                      ))}
                    </Grid>
                    <Divider sx={{ my: 4 }} />
                  </Box>
                )}
                
                {results.length > 0 && (
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h5" component="h2">
                        결과
                      </Typography>
                      {results.length > 5 && (
                        <Button
                          onClick={() => setTabValue(3)}
                          color="primary"
                        >
                          더 보기
                        </Button>
                      )}
                    </Box>
                    <ResultTable results={results.slice(0, 5)} />
                  </Box>
                )}
              </TabPanel>
              
              {/* 마라토너 탭 */}
              <TabPanel value={tabValue} index={1}>
                {runners.length === 0 ? (
                  <Typography variant="body1" color="text.secondary" align="center">
                    검색어와 일치하는 마라토너가 없습니다.
                  </Typography>
                ) : (
                  <Grid container spacing={3}>
                    {runners.map((runner) => (
                      <Grid item key={runner.id} xs={12} sm={6} md={4}>
                        <RunnerCard runner={runner} />
                      </Grid>
                    ))}
                  </Grid>
                )}
              </TabPanel>
              
              {/* 대회 탭 */}
              <TabPanel value={tabValue} index={2}>
                {races.length === 0 ? (
                  <Typography variant="body1" color="text.secondary" align="center">
                    검색어와 일치하는 대회가 없습니다.
                  </Typography>
                ) : (
                  <Grid container spacing={3}>
                    {races.map((race) => (
                      <Grid item key={race.id} xs={12} sm={6} md={4}>
                        <RaceCard race={race} />
                      </Grid>
                    ))}
                  </Grid>
                )}
              </TabPanel>
              
              {/* 결과 탭 */}
              <TabPanel value={tabValue} index={3}>
                {results.length === 0 ? (
                  <Typography variant="body1" color="text.secondary" align="center">
                    검색어와 일치하는 결과가 없습니다.
                  </Typography>
                ) : (
                  <ResultTable results={results} />
                )}
              </TabPanel>
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default SearchPage;
