import apiClient from './axios';

// 여행 기록 수정
export const editTravel = async (travelData) => {
  const response = await apiClient.put('/travel/edit', travelData);
  return response.data;
};

// 여행 시작
export const startTravel = async (travelInfo) => {
  const response = await apiClient.post('/travel/start', travelInfo);
  return response.data;
};

// 여행 종료
export const finishTravel = async (travelTitle, period) => {
  const response = await apiClient.post('/travel/finish', {
    travel_title: travelTitle,
    period,
  });
  return response.data;
};
