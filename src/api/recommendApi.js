import apiClient, { unwrapApiResponse } from './axios';

// 여행지 추천
export const getRecommendations = async () => {
  const response = await apiClient.get('/recommend');
  return unwrapApiResponse(response);
};

// 여행지 랭킹
export const getRanking = async () => {
  const response = await apiClient.get('/recommend/ranking');
  return unwrapApiResponse(response);
};

// 여행지 블로그 목록
export const getBlogList = async (page = 0) => {
  const response = await apiClient.get('/blogs', { params: { page } });
  return unwrapApiResponse(response);
};

// 블로그 상세 조회
export const getBlogDetail = async (id) => {
  const response = await apiClient.get(`/blogs/${id}`);
  return unwrapApiResponse(response);
};
