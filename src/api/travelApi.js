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

// ─── 내 여행 목록 조회 ────────────────────────────────────────────────────────
// GET /travel/my
// Response: { status, data: [{ id, startDate, endDate, budgetMin, budgetMax,
//             peopleCount, mood, avgWeather, publicTravel, travelStatus }] }
export const getTravels = async () => {
  const response = await apiClient.get('/travel/my');
  return response.data;
};

// ─── 여행 시작 ────────────────────────────────────────────────────────────────
// POST /travel/start
export const startTravel = async (travelInfo) => {
  const response = await apiClient.post('/travel/start', toStartTravelPayload(travelInfo));
  return unwrapApiResponse(response);
};

// ─── 여행 종료 ────────────────────────────────────────────────────────────────
// PUT /travel/finish  (body 없음)
export const finishTravel = async () => {
  const response = await apiClient.put('/travel/finish');
  return response.data;
};

// ─── 여행 기록 수정 ───────────────────────────────────────────────────────────
// PUT /travel/edit/{id}
// Body: { people_count, mood, avg_weather, public_travel }
export const editTravel = async (id, travelData) => {
  const response = await apiClient.put(`/travel/edit/${id}`, travelData);
  return response.data;
};

// ─── 방문지(경유지) 목록 조회 ─────────────────────────────────────────────────
// GET /travel/{travelId}/attractions
// Response: { status, data: [{ photoURL, detail, duration: { hour, minute, second, nano }, createdAt }] }
export const getAttractions = async (travelId) => {
  const response = await apiClient.get(`/travel/${travelId}/attractions`);
  return response.data;
};

// ─── 방문지(경유지) 추가 ──────────────────────────────────────────────────────
// POST /travel/{travelId}/attractions
// Body: { request: { duration: { hour, minute, second, nano }, detail }, file }
export const addAttraction = async (travelId, { duration, detail, file }) => {
  const response = await apiClient.post(`/travel/${travelId}/attractions`, {
    request: {
      duration: {
        hour:   duration?.hour   ?? 0,
        minute: duration?.minute ?? 0,
        second: duration?.second ?? 0,
        nano:   duration?.nano   ?? 0,
      },
      detail: detail ?? '',
    },
    file: file ?? '',
  });
  return response.data;
};