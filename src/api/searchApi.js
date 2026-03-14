import apiClient, { unwrapApiResponse } from './axios';

const AI_TIMEOUT = 60000; // 60초 — OpenAI 호출 포함 AI 서버 응답 대기

function extractResults(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  return [];
}

// 슈퍼 검색
export const superSearch = async (content, country, searchEngine) => {
  const response = await apiClient.post('/search/super', { content, country, searchEngine }, { timeout: AI_TIMEOUT });
  return extractResults(unwrapApiResponse(response));
};

// 테마 검색
export const themeSearch = async (theme, country, searchEngine) => {
  const response = await apiClient.post('/search/theme', { theme, country, searchEngine }, { timeout: AI_TIMEOUT });
  return extractResults(unwrapApiResponse(response));
};

// 일반 검색
export const search = async (content) => {
  const response = await apiClient.post('/search/super', { content }, { timeout: AI_TIMEOUT });
  return extractResults(unwrapApiResponse(response));
};
