import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Link,
  Chip,
  Box,
  Typography
} from '@mui/material';
import { formatTime, formatPace, formatRank } from '../utils/formatters';

const ResultTable = ({ results, showRunner = true, showRace = true }) => {
  if (!results || results.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          결과가 없습니다.
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ mt: 2, mb: 4 }}>
      <Table sx={{ minWidth: 650 }} aria-label="결과 테이블">
        <TableHead>
          <TableRow>
            <TableCell>순위</TableCell>
            {showRunner && <TableCell>마라토너</TableCell>}
            {showRace && <TableCell>대회</TableCell>}
            <TableCell>완주 시간</TableCell>
            <TableCell>페이스</TableCell>
            <TableCell>연령대 순위</TableCell>
            <TableCell>성별 순위</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {results.map((result) => (
            <TableRow
              key={result.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell>
                <Chip 
                  label={formatRank(result.overall_rank)} 
                  color={
                    result.overall_rank === 1 ? 'primary' :
                    result.overall_rank === 2 ? 'secondary' :
                    result.overall_rank === 3 ? 'warning' : 'default'
                  }
                  size="small"
                />
              </TableCell>
              
              {showRunner && (
                <TableCell>
                  <Link component={RouterLink} to={`/runners/${result.runner_id}`}>
                    {result.runner ? result.runner.name : `러너 #${result.runner_id}`}
                  </Link>
                </TableCell>
              )}
              
              {showRace && (
                <TableCell>
                  <Link component={RouterLink} to={`/races/${result.race_id}`}>
                    {result.race ? result.race.name : `대회 #${result.race_id}`}
                  </Link>
                </TableCell>
              )}
              
              <TableCell>{formatTime(result.finish_time)}</TableCell>
              <TableCell>{formatPace(result.pace)}</TableCell>
              <TableCell>{formatRank(result.age_group_rank) || '-'}</TableCell>
              <TableCell>{formatRank(result.gender_rank) || '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ResultTable;
