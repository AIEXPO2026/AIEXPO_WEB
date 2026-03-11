import apiClient from './axios';

// 위치 기반 AI 여행 코스 생성 (저장 없음)
// POST /course/location → { course: [{ order: int, place: string }] }
export const getCourseByLocation = async (location) => {
  const response = await apiClient.post('/course/location', { location });
  return response.data;
};

// 위치 기반 AI 여행 코스 생성 + DB 저장
// POST /course/location/save → { travel_id: int, location: string, course: [...] }
// NOTE: member_id는 Spring Boot /auth/me 엔드포인트가 생기면 연결 가능
export const saveCourse = async (memberId, location) => {
  const response = await apiClient.post('/course/location/save', {
    member_id: memberId,
    location,
  });
  return response.data;
};

// 저장된 이력 기반 맞춤 코스 생성
// POST /course/customize/member/{memberId} → { course: [...] }
export const customizeCourse = async (memberId, style) => {
  const response = await apiClient.post(`/course/customize/member/${memberId}`, { style });
  return response.data;
};
