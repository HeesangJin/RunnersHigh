import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Box, 
  Chip,
  Avatar,
  CardActionArea
} from '@mui/material';
import { formatName } from '../utils/formatters';

const RunnerCard = ({ runner }) => {
  const defaultImage = 'https://via.placeholder.com/300x200?text=No+Image';
  
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
      <CardActionArea component={RouterLink} to={`/runners/${runner.id}`}>
        <CardMedia
          component="img"
          height="200"
          image={runner.profile_image || defaultImage}
          alt={runner.name}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h5" component="div">
            {formatName(runner.name)}
          </Typography>
          
          <Box sx={{ display: 'flex', mb: 1 }}>
            {runner.nationality && (
              <Chip 
                size="small" 
                label={runner.nationality} 
                sx={{ mr: 1 }} 
              />
            )}
            {runner.gender && (
              <Chip 
                size="small" 
                label={runner.gender === 'M' ? '남성' : '여성'} 
                color={runner.gender === 'M' ? 'primary' : 'secondary'}
              />
            )}
          </Box>
          
          {runner.bio && (
            <Typography variant="body2" color="text.secondary" sx={{ 
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
            }}>
              {runner.bio}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default RunnerCard;
