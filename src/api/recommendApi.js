import apiClient, { unwrapApiResponse } from './axios';

const AI_TIMEOUT = 60000; // 60초 — OpenAI 호출 포함 AI 서버 응답 대기

// 여행지 추천
export const getRecommendations = async () => {
  const response = await apiClient.get('/recommend', { timeout: AI_TIMEOUT });
  return unwrapApiResponse(response);
};

// 여행지 랭킹
export const getRanking = async () => {
  const response = await apiClient.get('/recommend/ranking', { timeout: AI_TIMEOUT });
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

// 블로그 작성 - POST /blogs
// Body: { title, content, date, country }
export const writeBlog = async ({ title, content, date, country }) => {
  const response = await apiClient.post('/blogs', { title, content, date, country });
  return unwrapApiResponse(response);
};
