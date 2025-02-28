import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  Avatar,
  Divider,
  Tab,
  Tabs,
  CircularProgress,
  Alert,
  Button,
  Card,
  CardContent,
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  DirectionsRun as RunIcon,
  EmojiEvents as TrophyIcon,
  Straighten as DistanceIcon,
  Timer as TimerIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material';
import { runnerApi, resultApi } from '../services/api';
import ResultTable from '../components/ResultTable';
import { formatDate, formatTime, formatPace } from '../utils/formatters';

// 탭 패널 컴포넌트
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`runner-tabpanel-${index}`}
      aria-labelledby={`runner-tab-${index}`}
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

const RunnerDetailPage = () => {
  const { id } = useParams();
  const [runner, setRunner] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [stats, setStats] = useState({
    totalRaces: 0,
    bestTime: null,
    averagePace: 0,
    totalDistance: 0,
    achievements: [],
  });

  useEffect(() => {
    const fetchRunnerData = async () => {
      try {
        setLoading(true);
        
        // 러너 정보 가져오기
        const runnerResponse = await runnerApi.getRunner(id);
        setRunner(runnerResponse.data);
        
        // 러너의 레이스 결과 가져오기
        const resultsResponse = await resultApi.getResults({ runner_id: id });
        setResults(resultsResponse.data);
        
        // 통계 계산
        if (resultsResponse.data.length > 0) {
          const totalRaces = resultsResponse.data.length;
          
          // 최고 기록 찾기 (마라톤 기준)
          const marathonResults = resultsResponse.data.filter(r => 
            r.race && r.race.distance >= 42
          );
          
          const bestTime = marathonResults.length > 0 
            ? marathonResults.reduce((best, current) => 
                !best || current.finish_time < best.finish_time ? current : best
              , null)
            : null;
          
          // 평균 페이스 계산
          const totalPace = resultsResponse.data.reduce((sum, result) => sum + (result.pace || 0), 0);
          const averagePace = totalPace / totalRaces;
          
          // 총 달린 거리 계산
          const totalDistance = resultsResponse.data.reduce((sum, result) => 
            sum + (result.race ? result.race.distance : 0), 0);
          
          // 업적 계산 (예: 1위 횟수, 완주한 마라톤 수 등)
          const firstPlaces = resultsResponse.data.filter(r => r.overall_rank === 1).length;
          const marathonsCompleted = resultsResponse.data.filter(r => 
            r.race && r.race.distance >= 42
          ).length;
          const halfMarathonsCompleted = resultsResponse.data.filter(r => 
            r.race && r.race.distance >= 21 && r.race.distance < 42
          ).length;
          
          const achievements = [
            { title: '1위 완주', count: firstPlaces },
            { title: '마라톤 완주', count: marathonsCompleted },
            { title: '하프 마라톤 완주', count: halfMarathonsCompleted },
          ].filter(a => a.count > 0);
          
          setStats({
            totalRaces,
            bestTime: bestTime,
            averagePace,
            totalDistance,
            achievements,
          });
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching runner data:', err);
        setError('러너 데이터를 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
        
        // 개발 중에는 더미 데이터로 대체
        setRunner({
          id: parseInt(id),
          name: '김철수',
          nationality: '대한민국',
          gender: 'M',
          birth_date: '1990-05-15',
          profile_image: 'https://via.placeholder.com/400x400?text=Runner',
          bio: '서울에서 활동하는 마라토너입니다. 2015년부터 마라톤을 시작했으며, 현재까지 10회 이상의 풀 마라톤과 20회 이상의 하프 마라톤을 완주했습니다. 개인 최고 기록은 2시간 45분입니다.',
        });
        
        setResults([
          { 
            id: 1, 
            runner_id: parseInt(id), 
            race_id: 1, 
            race: { id: 1, name: '서울 마라톤 2024', date: '2024-03-15', location: '서울', distance: 42.195, type: '마라톤' },
            overall_rank: 5, 
            finish_time: '02:45:30', 
            pace: 3.92, 
            age_group_rank: 2, 
            gender_rank: 5 
          },
          { 
            id: 2, 
            runner_id: parseInt(id), 
            race_id: 2, 
            race: { id: 2, name: '부산 하프 마라톤', date: '2024-02-10', location: '부산', distance: 21.0975, type: '하프 마라톤' },
            overall_rank: 3, 
            finish_time: '01:20:15', 
            pace: 3.8, 
            age_group_rank: 1, 
            gender_rank: 3 
          },
          { 
            id: 3, 
            runner_id: parseInt(id), 
            race_id: 3, 
            race: { id: 3, name: '제주 10K', date: '2024-01-05', location: '제주', distance: 10, type: '10K' },
            overall_rank: 1, 
            finish_time: '00:35:20', 
            pace: 3.53, 
            age_group_rank: 1, 
            gender_rank: 1 
          },
        ]);
        
        setStats({
          totalRaces: 3,
          bestTime: { 
            race: { name: '서울 마라톤 2024', date: '2024-03-15' }, 
            finish_time: '02:45:30' 
          },
          averagePace: 3.75,
          totalDistance: 73.2925,
          achievements: [
            { title: '1위 완주', count: 1 },
            { title: '마라톤 완주', count: 1 },
            { title: '하프 마라톤 완주', count: 1 },
          ],
        });
      }
    };

    fetchRunnerData();
  }, [id]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 3 }}>
        {error}
      </Alert>
    );
  }

  if (!runner) {
    return (
      <Alert severity="info" sx={{ my: 3 }}>
        마라토너를 찾을 수 없습니다.
      </Alert>
    );
  }

  return (
    <Box>
      {/* 프로필 헤더 */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Avatar
              src={runner.profile_image || 'https://via.placeholder.com/200x200?text=No+Image'}
              alt={runner.name}
              sx={{ width: '100%', height: 'auto', aspectRatio: '1/1', borderRadius: 2 }}
              variant="rounded"
            />
          </Grid>
          <Grid item xs={12} md={9}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h3" component="h1">
                {runner.name}
              </Typography>
              <Chip 
                label={runner.gender === 'M' ? '남성' : '여성'} 
                color={runner.gender === 'M' ? 'primary' : 'secondary'}
                sx={{ ml: 2 }}
              />
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" component="div" color="text.secondary">
                {runner.nationality}
              </Typography>
              {runner.birth_date && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <CalendarIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body1" color="text.secondary">
                    {formatDate(runner.birth_date)}
                  </Typography>
                </Box>
              )}
            </Box>
            
            {runner.bio && (
              <Typography variant="body1" paragraph>
                {runner.bio}
              </Typography>
            )}
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 3 }}>
              <Chip 
                icon={<RunIcon />} 
                label={`${stats.totalRaces}회 참가`} 
                color="primary" 
                variant="outlined"
              />
              {stats.bestTime && (
                <Chip 
                  icon={<TimerIcon />} 
                  label={`최고 기록: ${formatTime(stats.bestTime.finish_time)}`} 
                  color="primary" 
                  variant="outlined"
                />
              )}
              <Chip 
                icon={<SpeedIcon />} 
                label={`평균 페이스: ${formatPace(stats.averagePace)}`} 
                color="primary" 
                variant="outlined"
              />
              <Chip 
                icon={<DistanceIcon />} 
                label={`총 거리: ${stats.totalDistance.toFixed(1)} km`} 
                color="primary" 
                variant="outlined"
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {/* 탭 네비게이션 */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="runner tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="대회 결과" icon={<TrophyIcon />} iconPosition="start" />
          <Tab label="통계" icon={<SpeedIcon />} iconPosition="start" />
          <Tab label="업적" icon={<EmojiEvents />} iconPosition="start" />
        </Tabs>
      </Box>
      
      {/* 대회 결과 탭 */}
      <TabPanel value={tabValue} index={0}>
        {results.length === 0 ? (
          <Typography variant="body1" color="text.secondary" align="center">
            참가한 대회 결과가 없습니다.
          </Typography>
        ) : (
          <ResultTable results={results} showRunner={false} />
        )}
      </TabPanel>
      
      {/* 통계 탭 */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  마라톤 참가 통계
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      총 참가 대회
                    </Typography>
                    <Typography variant="h5">
                      {stats.totalRaces}회
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      총 달린 거리
                    </Typography>
                    <Typography variant="h5">
                      {stats.totalDistance.toFixed(1)} km
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      평균 페이스
                    </Typography>
                    <Typography variant="h5">
                      {formatPace(stats.averagePace)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      최고 순위
                    </Typography>
                    <Typography variant="h5">
                      {Math.min(...results.map(r => r.overall_rank || Infinity), Infinity) === Infinity 
                        ? '-' 
                        : Math.min(...results.map(r => r.overall_rank || Infinity)) + '위'}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  최고 기록
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {stats.bestTime ? (
                  <>
                    <Typography variant="body2" color="text.secondary">
                      대회명
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      {stats.bestTime.race.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      날짜
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      {formatDate(stats.bestTime.race.date)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      기록
                    </Typography>
                    <Typography variant="h5" color="primary">
                      {formatTime(stats.bestTime.finish_time)}
                    </Typography>
                  </>
                ) : (
                  <Typography variant="body1" color="text.secondary" align="center">
                    마라톤 완주 기록이 없습니다.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
      
      {/* 업적 탭 */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          {stats.achievements.length === 0 ? (
            <Grid item xs={12}>
              <Typography variant="body1" color="text.secondary" align="center">
                획득한 업적이 없습니다.
              </Typography>
            </Grid>
          ) : (
            stats.achievements.map((achievement, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                      <TrophyIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
                      <Typography variant="h5" gutterBottom>
                        {achievement.title}
                      </Typography>
                      <Typography variant="h3" color="primary">
                        {achievement.count}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {achievement.title === '1위 완주' ? '1위로 완주한 횟수' : 
                         achievement.title === '마라톤 완주' ? '풀 마라톤을 완주한 횟수' : 
                         '하프 마라톤을 완주한 횟수'}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </TabPanel>
      
      {/* 뒤로 가기 버튼 */}
      <Box sx={{ mt: 4 }}>
        <Button
          component={RouterLink}
          to="/runners"
          variant="outlined"
          startIcon={<RunIcon />}
        >
          마라토너 목록으로 돌아가기
        </Button>
      </Box>
    </Box>
  );
};

export default RunnerDetailPage;
