import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';

// 날짜 형식 변환 (YYYY-MM-DD -> YYYY년 MM월 DD일)
export const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, 'yyyy년 MM월 dd일', { locale: ko });
  } catch (error) {
    console.error('Date formatting error:', error);
    return dateString;
  }
};

// 시간 형식 변환 (HH:MM:SS -> HH시간 MM분 SS초)
export const formatTime = (timeString) => {
  if (!timeString) return '';
  
  try {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    
    let result = '';
    if (hours > 0) result += `${hours}시간 `;
    if (minutes > 0 || hours > 0) result += `${minutes}분 `;
    result += `${seconds}초`;
    
    return result;
  } catch (error) {
    console.error('Time formatting error:', error);
    return timeString;
  }
};

// 페이스 형식 변환 (min/km)
export const formatPace = (pace) => {
  if (!pace && pace !== 0) return '';
  
  const minutes = Math.floor(pace);
  const seconds = Math.round((pace - minutes) * 60);
  
  return `${minutes}'${seconds.toString().padStart(2, '0')}"`;
};

// 거리 형식 변환 (km)
export const formatDistance = (distance) => {
  if (!distance && distance !== 0) return '';
  return `${distance} km`;
};

// 고도 형식 변환 (m)
export const formatElevation = (elevation) => {
  if (!elevation && elevation !== 0) return '';
  return `${elevation} m`;
};

// 순위 형식 변환
export const formatRank = (rank) => {
  if (!rank && rank !== 0) return '-';
  
  // 1st, 2nd, 3rd, 4th 등의 서수 형식으로 변환
  const lastDigit = rank % 10;
  const lastTwoDigits = rank % 100;
  
  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
    return `${rank}th`;
  }
  
  switch (lastDigit) {
    case 1:
      return `${rank}st`;
    case 2:
      return `${rank}nd`;
    case 3:
      return `${rank}rd`;
    default:
      return `${rank}th`;
  }
};

// 이름 형식 변환 (성, 이름 -> 성 이름)
export const formatName = (name) => {
  if (!name) return '';
  return name;
};
