import apiClient, { unwrapApiResponse } from './axios';

function extractResults(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  return [];
}

// 슈퍼 검색
export const superSearch = async (content) => {
  const response = await apiClient.post('/search/super', { content });
  return extractResults(unwrapApiResponse(response));
};

// 테마 검색
export const themeSearch = async (theme) => {
  const response = await apiClient.post('/search/theme', { theme });
  return extractResults(unwrapApiResponse(response));
};

// 일반 검색 (AI 서버의 super search 사용)
export const search = async (content) => {
  const response = await apiClient.post('/search/super', { content });
  return extractResults(unwrapApiResponse(response));
};
