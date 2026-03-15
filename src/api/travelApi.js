import apiClient from './axios';

// ─── 내 여행 목록 조회 ────────────────────────────────────────────────────────
export const getTravels = async () => {
  const response = await apiClient.get('/travel/my');
  return response.data;
};

// ─── 여행 시작 ────────────────────────────────────────────────────────────────
export const startTravel = async (travelInfo) => {
  const payload = {
    budget_min:   travelInfo.budget_min   ?? travelInfo.budgetMin   ?? 0,
    budget_max:   travelInfo.budget_max   ?? travelInfo.budgetMax   ?? 2147483647,
    start_date:   travelInfo.start_date   ?? travelInfo.startDate   ?? new Date().toISOString().split('T')[0],
    end_date:     travelInfo.end_date     ?? travelInfo.endDate     ?? new Date().toISOString().split('T')[0],
    people_count: travelInfo.people_count ?? travelInfo.peopleCount ?? 1,
  };
  const response = await apiClient.post('/travel/start', payload);
  return response.data;
};

// ─── 여행 종료 ────────────────────────────────────────────────────────────────
export const finishTravel = async () => {
  const response = await apiClient.put('/travel/finish');
  return response.data;
};

// ─── 여행 기록 수정 ───────────────────────────────────────────────────────────
export const editTravel = async (id, travelData) => {
  if (!id) throw new Error('editTravel: id가 없습니다.');

  const avgWeather =
    (travelData.avg_weather ?? travelData.avgWeather ?? '').trim() || '맑음';

  const payload = {
    people_count:  Number(travelData.people_count ?? travelData.peopleCount ?? 1),
    mood:          Math.min(Math.max(Number(travelData.mood ?? 0), 0), 4),
    avg_weather:   avgWeather,
    public_travel: Boolean(travelData.public_travel ?? travelData.publicTravel ?? false),
  };

  const response = await apiClient.put(`/travel/edit/${id}`, payload);
  return response.data;
};

// ─── 방문지 목록 조회 ─────────────────────────────────────────────────────────
export const getAttractions = async (travelId) => {
  const response = await apiClient.get(`/travel/${travelId}/attractions`);
  return response.data;
};

// ─── 방문지 추가 ──────────────────────────────────────────────────────────────

export const addAttraction = async (travelId, { duration, detail, file }) => {
  if (!travelId) throw new Error('addAttraction: travelId가 없습니다.');

  const formData = new FormData();

  formData.append(
    'request',
    new Blob(
      [
        JSON.stringify({
          duration: {
            hour:   duration?.hour   ?? 0,
            minute: duration?.minute ?? 0,
            second: duration?.second ?? 0,
            nano:   duration?.nano   ?? 0,
          },
          detail: detail ?? '',
        }),
      ],
      { type: 'application/json' },
    ),
  );

  if (file instanceof File) {
    formData.append('file', file);
  }

  const response = await apiClient.post(
    `/travel/${travelId}/attractions`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return response.data;
};