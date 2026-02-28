import apiClient from './axios';

// ─── 내 여행 목록 조회 ────────────────────────────────────────────────────────
// GET /travel/my
export const getTravels = async () => {
  const response = await apiClient.get('/travel/my');
  return response.data;
};

// ─── 여행 시작 ────────────────────────────────────────────────────────────────
// POST /travel/start
// Swagger 기본값 참고: budget_max = 2147483647
export const startTravel = async (travelInfo) => {
  const payload = {
    budget_min: travelInfo.budget_min ?? travelInfo.budgetMin ?? 0,
    budget_max: travelInfo.budget_max ?? travelInfo.budgetMax ?? 2147483647,
    start_date: travelInfo.start_date ?? travelInfo.startDate ?? new Date().toISOString().split('T')[0],
    end_date:   travelInfo.end_date   ?? travelInfo.endDate   ?? new Date().toISOString().split('T')[0],
    people_count: travelInfo.people_count ?? travelInfo.peopleCount ?? 1,
  };
  const response = await apiClient.post('/travel/start', payload);
  return response.data;
};

// ─── 여행 종료 ────────────────────────────────────────────────────────────────
// PUT /travel/finish (body 없음)
export const finishTravel = async () => {
  const response = await apiClient.put('/travel/finish');
  return response.data;
};

// ─── 여행 기록 수정 ───────────────────────────────────────────────────────────
// PUT /travel/edit/{id}
export const editTravel = async (id, travelData) => {
  const payload = {
    people_count: travelData.people_count ?? travelData.peopleCount,
    mood:         travelData.mood ?? 0,
    avg_weather:  travelData.avg_weather ?? travelData.avgWeather ?? '',
    public_travel: travelData.public_travel ?? travelData.publicTravel ?? false,
  };
  const response = await apiClient.put(`/travel/edit/${id}`, payload);
  return response.data;
};

// ─── 방문지 목록 조회 ─────────────────────────────────────────────────────────
// GET /travel/{travelId}/attractions
export const getAttractions = async (travelId) => {
  const response = await apiClient.get(`/travel/${travelId}/attractions`);
  return response.data;
};

// ─── 방문지 추가 ──────────────────────────────────────────────────────────────
// POST /travel/{travelId}/attractions
// Swagger: multipart/form-data — request(JSON) + file(binary)
export const addAttraction = async (travelId, { duration, detail, file }) => {
  const formData = new FormData();

  // request 파트: JSON blob으로 전송
  formData.append('request', new Blob([JSON.stringify({
    duration: {
      hour:   duration?.hour   ?? 0,
      minute: duration?.minute ?? 0,
      second: duration?.second ?? 0,
      nano:   duration?.nano   ?? 0,
    },
    detail: detail ?? '',
  })], { type: 'application/json' }));

  // file 파트: File 객체가 있을 때만 첨부
  if (file instanceof File) {
    formData.append('file', file);
  }

  const response = await apiClient.post(
    `/travel/${travelId}/attractions`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return response.data;
};