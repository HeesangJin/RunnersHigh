import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Container,
  Divider,
} from '@mui/material';
import {
  DirectionsRun as RunIcon,
  EmojiEvents as TrophyIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { runnerApi, raceApi, resultApi } from '../services/api';
import RunnerCard from '../components/RunnerCard';
import RaceCard from '../components/RaceCard';
import ResultTable from '../components/ResultTable';

const HomePage = () => {
  const [topRunners, setTopRunners] = useState([]);
  const [upcomingRaces, setUpcomingRaces] = useState([]);
  const [recentResults, setRecentResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        
        // 상위 러너 가져오기
        const runnersResponse = await runnerApi.getRunners({ limit: 3 });
        setTopRunners(runnersResponse.data);
        
        // 다가오는 대회 가져오기
        const racesResponse = await raceApi.getRaces({ limit: 3 });
        setUpcomingRaces(racesResponse.data);
        
        // 최근 결과 가져오기
        const resultsResponse = await resultApi.getResults({ limit: 5 });
        setRecentResults(resultsResponse.data);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching home data:', err);
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
        
        // 개발 중에는 더미 데이터로 대체
        setTopRunners([
          { id: 1, name: '김철수', nationality: '대한민국', gender: 'M', profile_image: 'https://via.placeholder.com/300x200?text=Runner1' },
          { id: 2, name: '이영희', nationality: '대한민국', gender: 'F', profile_image: 'https://via.placeholder.com/300x200?text=Runner2' },
          { id: 3, name: '박지성', nationality: '대한민국', gender: 'M', profile_image: 'https://via.placeholder.com/300x200?text=Runner3' },
        ]);
        
        setUpcomingRaces([
          { id: 1, name: '서울 마라톤 2025', date: '2025-04-15', location: '서울', distance: 42.195, type: '마라톤' },
          { id: 2, name: '부산 하프 마라톤', date: '2025-05-20', location: '부산', distance: 21.0975, type: '하프 마라톤' },
          { id: 3, name: '제주 10K', date: '2025-06-10', location: '제주', distance: 10, type: '10K' },
        ]);
        
        setRecentResults([
          { id: 1, runner_id: 1, race_id: 1, overall_rank: 1, finish_time: '02:30:45', pace: 3.56, age_group_rank: 1, gender_rank: 1 },
          { id: 2, runner_id: 2, race_id: 1, overall_rank: 2, finish_time: '02:35:12', pace: 3.67, age_group_rank: 1, gender_rank: 1 },
          { id: 3, runner_id: 3, race_id: 1, overall_rank: 3, finish_time: '02:40:30', pace: 3.8, age_group_rank: 2, gender_rank: 2 },
        ]);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <Box>
      {/* 히어로 섹션 */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          borderRadius: 2,
          mb: 6,
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(https://source.unsplash.com/random/1200x400/?marathon)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
            RunnersHigh
          </Typography>
          <Typography variant="h5" align="center" paragraph>
            마라토너를 위한 최고의 랭킹 및 전적 시스템
          </Typography>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              component={RouterLink}
              to="/runners"
              variant="contained"
              color="secondary"
              size="large"
              startIcon={<RunIcon />}
            >
              마라토너 보기
            </Button>
            <Button
              component={RouterLink}
              to="/races"
              variant="outlined"
              color="inherit"
              size="large"
              startIcon={<TrophyIcon />}
            >
              대회 보기
            </Button>
          </Box>
        </Container>
      </Box>

      {/* 주요 기능 소개 */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center">
          RunnersHigh의 주요 기능
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardMedia
                component="img"
                height="140"
                image="https://source.unsplash.com/random/400x200/?runner"
                alt="마라토너 프로필"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  마라토너 프로필
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  각 마라토너의 상세 프로필과 참가한 대회 기록, 통계 정보를 확인할 수 있습니다.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardMedia
                component="img"
                height="140"
                image="https://source.unsplash.com/random/400x200/?marathon"
                alt="대회 정보"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  대회 정보
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  다양한 마라톤 대회 정보와 참가자 기록, 순위를 확인할 수 있습니다.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardMedia
                component="img"
                height="140"
                image="https://source.unsplash.com/random/400x200/?ranking"
                alt="랭킹 시스템"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  랭킹 시스템
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  대회 결과를 기반으로 한 마라토너들의 종합 랭킹과 통계를 확인할 수 있습니다.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ my: 6 }} />

      {/* 인기 마라토너 */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h2">
            인기 마라토너
          </Typography>
          <Button
            component={RouterLink}
            to="/runners"
            variant="outlined"
            endIcon={<SearchIcon />}
          >
            더 보기
          </Button>
        </Box>
        <Grid container spacing={3}>
          {topRunners.map((runner) => (
            <Grid item key={runner.id} xs={12} sm={6} md={4}>
              <RunnerCard runner={runner} />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* 다가오는 대회 */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h2">
            다가오는 대회
          </Typography>
          <Button
            component={RouterLink}
            to="/races"
            variant="outlined"
            endIcon={<SearchIcon />}
          >
            더 보기
          </Button>
        </Box>
        <Grid container spacing={3}>
          {upcomingRaces.map((race) => (
            <Grid item key={race.id} xs={12} sm={6} md={4}>
              <RaceCard race={race} />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* 최근 결과 */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          최근 결과
        </Typography>
        <ResultTable results={recentResults} />
      </Box>
    </Box>
  );
};

export default HomePage;
