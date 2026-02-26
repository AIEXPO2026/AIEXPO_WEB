import apiClient from './axios';

// 북마크 조회
export const getBookmarks = async () => {
  const response = await apiClient.get('/profile/bookmark');
  return response.data;
};

// ID 수정
export const updateUsername = async (newUsername, password) => {
  const response = await apiClient.put('/profile/username', {
    newUsername,
    password,
  });
  return response.data;
};

// 비밀번호 변경
export const changePassword = async (username, oldPassword, newPassword) => {
  const response = await apiClient.put('/auth/password', {
    username,
    oldPassword,
    newPassword,
  });
  return response.data;
};

// 보유 크레딧 확인
export const getCredit = async () => {
  const response = await apiClient.get('/profile/credit');
  return response.data;
};

// 크레딧 충전
export const chargeCredit = async (creditAmount) => {
  const response = await apiClient.post('/credit', {
    credit: creditAmount,
  });
  return response.data;
};

// 여행 목록 조회
export const getTravels = async () => {
  const response = await apiClient.get('/travel/my');
  return response.data;
};