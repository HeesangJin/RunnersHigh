import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip,
  CardActionArea,
  Grid
} from '@mui/material';
import { 
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Straighten as DistanceIcon
} from '@mui/icons-material';
import { formatDate, formatDistance } from '../utils/formatters';

const RaceCard = ({ race }) => {
  // 레이스 타입에 따른 색상 설정
  const getTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'marathon':
      case '마라톤':
        return 'primary';
      case 'half marathon':
      case '하프 마라톤':
        return 'secondary';
      case '10k':
        return 'success';
      case '5k':
        return 'info';
      default:
        return 'default';
    }
  };
  
  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
        }
      }}
      className="card-hover"
    >
      <CardActionArea component={RouterLink} to={`/races/${race.id}`}>
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography gutterBottom variant="h5" component="div" sx={{ mb: 0 }}>
              {race.name}
            </Typography>
            <Chip 
              label={race.type} 
              color={getTypeColor(race.type)} 
              size="small"
            />
          </Box>
          
          <Grid container spacing={1} sx={{ mb: 2 }}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {formatDate(race.date)}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {race.location}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <DistanceIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {formatDistance(race.distance)}
                </Typography>
              </Box>
            </Grid>
          </Grid>
          
          {race.description && (
            <Typography variant="body2" color="text.secondary" sx={{ 
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}>
              {race.description}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default RaceCard;
