import apiClient from './axios';

// 여행지 추천
export const getRecommendations = async () => {
  const response = await apiClient.get('/recommend');
  return response.data;
};

// 여행지 랭킹
export const getRanking = async () => {
  const response = await apiClient.get('/recommend/ranking');
  return response.data;
};

// 여행지 블로그 목록
export const getBlogList = async () => {
  const response = await apiClient.get('/recommend/blog');
  return response.data;
};

// 블로그 상세 조회
export const getBlogDetail = async (id) => {
  const response = await apiClient.get(`/recommend/blog/${id}`);
  return response.data;
};
