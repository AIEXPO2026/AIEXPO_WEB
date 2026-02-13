import apiClient from './axios';

// 슈퍼 검색
export const superSearch = async (content) => {
  const response = await apiClient.post('/search/super', {
    content,
  });
  return response.data;
};

// 테마 검색
export const themeSearch = async (theme) => {
  const response = await apiClient.post('/search/theme', {
    theme,
  });
  return response.data;
};

// 일반 검색
export const search = async (content) => {
  const response = await apiClient.post('/search', {
    content,
  });
  return response.data;
};
