import apiClient from './axios';

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
  const response = await apiClient.post('/travel/start', travelInfo);
  return response.data;
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