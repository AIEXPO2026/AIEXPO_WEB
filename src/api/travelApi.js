import apiClient, { unwrapApiResponse } from './axios';

const toStartTravelPayload = (travelInfo) => ({
  budget_min: travelInfo.budget_min ?? travelInfo.budgetMin,
  budget_max: travelInfo.budget_max ?? travelInfo.budgetMax,
  start_date: travelInfo.start_date ?? travelInfo.startDate,
  end_date: travelInfo.end_date ?? travelInfo.endDate,
  people_count: travelInfo.people_count ?? travelInfo.peopleCount,
});

const toEditTravelPayload = (travelData) => ({
  people_count: travelData.people_count ?? travelData.peopleCount,
  mood: travelData.mood,
  avg_weather: travelData.avg_weather ?? travelData.avgWeather,
  public_travel: travelData.public_travel ?? travelData.publicTravel,
});

// 여행 기록 수정
export const editTravel = async (id, travelData) => {
  const response = await apiClient.put(`/travel/edit/${id}`, toEditTravelPayload(travelData));
  return unwrapApiResponse(response);
};

// 여행 시작
export const startTravel = async (travelInfo) => {
  const response = await apiClient.post('/travel/start', toStartTravelPayload(travelInfo));
  return unwrapApiResponse(response);
};

// 여행 종료
export const finishTravel = async () => {
  const response = await apiClient.put('/travel/finish');
  return unwrapApiResponse(response);
};
