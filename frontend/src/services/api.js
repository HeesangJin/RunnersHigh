import axios from 'axios';

// API 기본 설정
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 러너(마라토너) 관련 API
export const runnerApi = {
  // 모든 러너 목록 조회
  getRunners: (params = {}) => api.get('/runners/', { params }),
  
  // 특정 러너 상세 정보 조회
  getRunner: (id) => api.get(`/runners/${id}`),
  
  // 새 러너 생성
  createRunner: (data) => api.post('/runners/', data),
  
  // 러너 정보 업데이트
  updateRunner: (id, data) => api.put(`/runners/${id}`, data),
  
  // 러너 삭제
  deleteRunner: (id) => api.delete(`/runners/${id}`),
};

// 대회(레이스) 관련 API
export const raceApi = {
  // 모든 대회 목록 조회
  getRaces: (params = {}) => api.get('/races/', { params }),
  
  // 특정 대회 상세 정보 조회
  getRace: (id) => api.get(`/races/${id}`),
  
  // 새 대회 생성
  createRace: (data) => api.post('/races/', data),
  
  // 대회 정보 업데이트
  updateRace: (id, data) => api.put(`/races/${id}`, data),
  
  // 대회 삭제
  deleteRace: (id) => api.delete(`/races/${id}`),
};

// 결과(레이스 결과) 관련 API
export const resultApi = {
  // 모든 결과 목록 조회
  getResults: (params = {}) => api.get('/results/', { params }),
  
  // 특정 결과 상세 정보 조회
  getResult: (id) => api.get(`/results/${id}`),
  
  // 새 결과 생성
  createResult: (data) => api.post('/results/', data),
  
  // 결과 정보 업데이트
  updateResult: (id, data) => api.put(`/results/${id}`, data),
  
  // 결과 삭제
  deleteResult: (id) => api.delete(`/results/${id}`),
};

export default api;
