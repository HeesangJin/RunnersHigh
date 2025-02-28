import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
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
  Terrain as TerrainIcon,
} from '@mui/icons-material';
import { raceApi, resultApi } from '../services/api';
import ResultTable from '../components/ResultTable';
import { formatDate, formatDistance, formatTime } from '../utils/formatters';

// 탭 패널 컴포넌트
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`race-tabpanel-${index}`}
      aria-labelledby={`race-tab-${index}`}
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

const RaceDetailPage = () => {
  const { id } = useParams();
  const [race, setRace] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [stats, setStats] = useState({
    totalParticipants: 0,
    averageFinishTime: null,
    fastestTime: null,
    maleParticipants: 0,
    femaleParticipants: 0,
  });

  useEffect(() => {
    const fetchRaceData = async () => {
      try {
        setLoading(true);
        
        // 대회 정보 가져오기
        const raceResponse = await raceApi.getRace(id);
        setRace(raceResponse.data);
        
        // 대회 결과 가져오기
        const resultsResponse = await resultApi.getResults({ race_id: id });
        setResults(resultsResponse.data);
        
        // 통계 계산
        if (resultsResponse.data.length > 0) {
          const totalParticipants = resultsResponse.data.length;
          
          // 평균 완주 시간 계산
          const finishTimes = resultsResponse.data
            .filter(r => r.finish_time)
            .map(r => {
              const [hours, minutes, seconds] = r.finish_time.split(':').map(Number);
              return hours * 3600 + minutes * 60 + seconds;
            });
          
          const averageSeconds = finishTimes.reduce((sum, time) => sum + time, 0) / finishTimes.length;
          const averageHours = Math.floor(averageSeconds / 3600);
          const averageMinutes = Math.floor((averageSeconds % 3600) / 60);
          const averageRemainingSeconds = Math.floor(averageSeconds % 60);
          
          const averageFinishTime = `${String(averageHours).padStart(2, '0')}:${String(averageMinutes).padStart(2, '0')}:${String(averageRemainingSeconds).padStart(2, '0')}`;
          
          // 최고 기록 찾기
          const fastestResult = resultsResponse.data.reduce((fastest, current) => 
            !fastest || (current.finish_time && current.finish_time < fastest.finish_time) 
              ? current 
              : fastest
          , null);
          
          // 성별 참가자 수 계산
          const maleParticipants = resultsResponse.data.filter(r => 
            r.runner && r.runner.gender === 'M'
          ).length;
          
          const femaleParticipants = resultsResponse.data.filter(r => 
            r.runner && r.runner.gender === 'F'
          ).length;
          
          setStats({
            totalParticipants,
            averageFinishTime,
            fastestTime: fastestResult,
            maleParticipants,
            femaleParticipants,
          });
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching race data:', err);
        setError('대회 데이터를 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
        
        // 개발 중에는 더미 데이터로 대체
        setRace({
          id: parseInt(id),
          name: '서울 마라톤 2025',
          date: '2025-04-15',
          location: '서울',
          distance: 42.195,
          type: '마라톤',
          description: '서울의 주요 명소를 달리는 국제 마라톤 대회입니다. 경복궁, 남산, 한강 등 서울의 아름다운 경관을 즐기며 달릴 수 있습니다.',
          elevation_gain: 350,
          course_map_url: 'https://via.placeholder.com/800x400?text=Course+Map',
          website: 'https://example.com/seoul-marathon',
          image_url: 'https://via.placeholder.com/800x400?text=Seoul+Marathon',
        });
        
        setResults([
          { 
            id: 1, 
            runner_id: 1, 
            runner: { id: 1, name: '김철수', gender: 'M' },
            race_id: parseInt(id), 
            overall_rank: 1, 
            finish_time: '02:30:45', 
            pace: 3.56, 
            age_group_rank: 1, 
            gender_rank: 1 
          },
          { 
            id: 2, 
            runner_id: 2, 
            runner: { id: 2, name: '이영희', gender: 'F' },
            race_id: parseInt(id), 
            overall_rank: 2, 
            finish_time: '02:35:12', 
            pace: 3.67, 
            age_group_rank: 1, 
            gender_rank: 1 
          },
          { 
            id: 3, 
            runner_id: 3, 
            runner: { id: 3, name: '박지성', gender: 'M' },
            race_id: parseInt(id), 
            overall_rank: 3, 
            finish_time: '02:40:30', 
            pace: 3.8, 
            age_group_rank: 2, 
            gender_rank: 2 
          },
        ]);
        
        setStats({
          totalParticipants: 3,
          averageFinishTime: '02:35:29',
          fastestTime: { 
            runner: { name: '김철수' }, 
            finish_time: '02:30:45' 
          },
          maleParticipants: 2,
          femaleParticipants: 1,
        });
      }
    };

    fetchRaceData();
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

  if (!race) {
    return (
      <Alert severity="info" sx={{ my: 3 }}>
        대회를 찾을 수 없습니다.
      </Alert>
    );
  }

  return (
    <Box>
      {/* 대회 헤더 */}
      <Paper 
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 2,
          backgroundImage: race.image_url ? `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${race.image_url})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: race.image_url ? 'white' : 'inherit',
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
              <Typography variant="h3" component="h1" sx={{ mr: 2 }}>
                {race.name}
              </Typography>
              <Chip 
                label={race.type} 
                color="primary"
                sx={{ 
                  bgcolor: race.type === '마라톤' ? 'primary.main' : 
                          race.type === '하프 마라톤' ? 'secondary.main' :
                          race.type === '10K' ? 'success.main' : 'info.main'
                }}
              />
            </Box>
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={4}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CalendarIcon sx={{ mr: 1, color: race.image_url ? 'white' : 'text.secondary' }} />
                  <Typography variant="h6">
                    {formatDate(race.date)}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationIcon sx={{ mr: 1, color: race.image_url ? 'white' : 'text.secondary' }} />
                  <Typography variant="h6">
                    {race.location}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <DistanceIcon sx={{ mr: 1, color: race.image_url ? 'white' : 'text.secondary' }} />
                  <Typography variant="h6">
                    {formatDistance(race.distance)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            
            {race.description && (
              <Typography variant="body1" paragraph>
                {race.description}
              </Typography>
            )}
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 3 }}>
              {race.elevation_gain && (
                <Chip 
                  icon={<TerrainIcon />} 
                  label={`고도 상승: ${race.elevation_gain}m`} 
                  color="primary" 
                  variant="outlined"
                  sx={{ bgcolor: race.image_url ? 'rgba(255, 255, 255, 0.1)' : 'inherit' }}
                />
              )}
              {race.website && (
                <Chip 
                  label="공식 웹사이트" 
                  color="primary" 
                  variant="outlined"
                  component="a"
                  href={race.website}
                  target="_blank"
                  clickable
                  sx={{ bgcolor: race.image_url ? 'rgba(255, 255, 255, 0.1)' : 'inherit' }}
                />
              )}
              <Chip 
                icon={<RunIcon />} 
                label={`${stats.totalParticipants}명 참가`} 
                color="primary" 
                variant="outlined"
                sx={{ bgcolor: race.image_url ? 'rgba(255, 255, 255, 0.1)' : 'inherit' }}
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {/* 코스 지도 (있는 경우) */}
      {race.course_map_url && (
        <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom>
            코스 지도
          </Typography>
          <Box 
            component="img" 
            src={race.course_map_url} 
            alt="코스 지도"
            sx={{ 
              width: '100%', 
              height: 'auto', 
              maxHeight: '400px',
              objectFit: 'contain',
              borderRadius: 1,
            }}
          />
        </Paper>
      )}
      
      {/* 탭 네비게이션 */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="race tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="결과" icon={<TrophyIcon />} iconPosition="start" />
          <Tab label="통계" icon={<SpeedIcon />} iconPosition="start" />
        </Tabs>
      </Box>
      
      {/* 결과 탭 */}
      <TabPanel value={tabValue} index={0}>
        {results.length === 0 ? (
          <Typography variant="body1" color="text.secondary" align="center">
            대회 결과가 없습니다.
          </Typography>
        ) : (
          <ResultTable results={results} showRace={false} />
        )}
      </TabPanel>
      
      {/* 통계 탭 */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  참가자 통계
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      총 참가자
                    </Typography>
                    <Typography variant="h5">
                      {stats.totalParticipants}명
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      남성 참가자
                    </Typography>
                    <Typography variant="h5">
                      {stats.maleParticipants}명
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      여성 참가자
                    </Typography>
                    <Typography variant="h5">
                      {stats.femaleParticipants}명
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      완주율
                    </Typography>
                    <Typography variant="h5">
                      {stats.totalParticipants > 0 ? '100%' : '0%'}
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
                  기록 통계
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      평균 완주 시간
                    </Typography>
                    <Typography variant="h5">
                      {formatTime(stats.averageFinishTime)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      최고 기록
                    </Typography>
                    <Typography variant="h5">
                      {stats.fastestTime ? formatTime(stats.fastestTime.finish_time) : '-'}
                    </Typography>
                  </Grid>
                  {stats.fastestTime && (
                    <>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">
                          최고 기록 보유자
                        </Typography>
                        <Typography variant="h6" color="primary">
                          {stats.fastestTime.runner.name}
                        </Typography>
                      </Grid>
                    </>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
      
      {/* 뒤로 가기 버튼 */}
      <Box sx={{ mt: 4 }}>
        <Button
          component={RouterLink}
          to="/races"
          variant="outlined"
          startIcon={<TrophyIcon />}
        >
          대회 목록으로 돌아가기
        </Button>
      </Box>
    </Box>
  );
};

export default RaceDetailPage;
