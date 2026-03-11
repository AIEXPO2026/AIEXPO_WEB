import apiClient from './axios';

// OpenAI 호출이 포함된 AI 서버 요청은 응답 시간이 길어 별도 타임아웃 적용
const AI_TIMEOUT = 60000; // 60초

// 위치 기반 AI 여행 코스 생성 (저장 없음)
// POST /course/location → { course: [{ order: int, place: string }] }
export const getCourseByLocation = async (location) => {
  const response = await apiClient.post('/course/location', { location }, { timeout: AI_TIMEOUT });
  return response.data;
};

// 위치 기반 AI 여행 코스 생성 + DB 저장
// POST /course/location/save → { travel_id: int, location: string, course: [...] }
export const saveCourse = async (nickname, location) => {
  const response = await apiClient.post('/course/location/save', {
    nickname,
    location,
  }, { timeout: AI_TIMEOUT });
  return response.data;
};

// 저장된 이력 기반 맞춤 코스 생성
// POST /course/customize/member/{memberId} → { course: [...] }
export const customizeCourse = async (memberId, style) => {
  const response = await apiClient.post(`/course/customize/member/${memberId}`, { style }, { timeout: AI_TIMEOUT });
  return response.data;
};
