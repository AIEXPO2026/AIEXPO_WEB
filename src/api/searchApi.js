import apiClient, { unwrapApiResponse } from './axios';

// 슈퍼 검색
export const superSearch = async (content) => {
  const response = await apiClient.post('/search/super', {
    content,
  });
  return unwrapApiResponse(response);
};

// 테마 검색
export const themeSearch = async (theme) => {
  const response = await apiClient.post('/search/theme', {
    theme,
  });
  return unwrapApiResponse(response);
};

// 일반 검색
export const search = async (content) => {
  const response = await apiClient.post('/search', {
    content,
  });
  return unwrapApiResponse(response);
};
