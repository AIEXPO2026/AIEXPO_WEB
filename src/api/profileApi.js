import apiClient, { unwrapApiResponse } from './axios';

// 북마크 목록 조회 - GET /profile/bookmark
// Response: { status, data: [{ bookmarkId, destinationId, name, city, latitude, longitude, baseScor }] }
export const getBookmarks = async () => {
  const response = await apiClient.get('/profile/bookmark');
  return unwrapApiResponse(response);
};

// 북마크 삭제 - DELETE /profile/bookmark/{destinationId}
export const deleteBookmark = async (destinationId) => {
  const response = await apiClient.delete(`/profile/bookmark/${destinationId}`);
  return response.data;
};

// 보유 크레딧 확인 - GET /profile/credit
// Response: { status, data: { credit } }
export const getCredit = async () => {
  const response = await apiClient.get('/profile/credit');
  return unwrapApiResponse(response);
};

// 크레딧 충전 - POST /profile/credit
// Body: { credit: number }
export const chargeCredit = async (creditAmount) => {
  const response = await apiClient.post('/profile/credit', {
    credit: creditAmount,
  });
  return unwrapApiResponse(response);
};

// 아이디 수정 - PUT /profile/username
export const updateUsername = async (newUsername, password) => {
  const response = await apiClient.put('/profile/username', {
    newUsername,
    password,
  });
  return unwrapApiResponse(response);
};

// 비밀번호 변경 - PUT /auth/password
export const changePassword = async (username, oldPassword, newPassword) => {
  const response = await apiClient.put('/auth/password', {
    username,
    oldPassword,
    newPassword,
  });
  return unwrapApiResponse(response);
};

// 내 여행 목록 조회 - GET /travel/my
export const getTravels = async () => {
  const response = await apiClient.get('/travel/my');
  return response.data;
};