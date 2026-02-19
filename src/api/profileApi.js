import apiClient, { unwrapApiResponse } from './axios';

// 북마크 조회
export const getBookmarks = async () => {
  const response = await apiClient.get('/profile/bookmark');
  return unwrapApiResponse(response);
};

// 아이디(username) 수정
export const updateUsername = async (newUsername, password) => {
  const response = await apiClient.put('/profile/username', {
    newUsername,
    password,
  });
  return unwrapApiResponse(response);
};

// 보유 크레딧 확인
export const getCredit = async () => {
  const response = await apiClient.get('/profile/credit');
  return unwrapApiResponse(response);
};

// 크레딧 충전
export const chargeCredit = async (credit) => {
  const response = await apiClient.post('/credit', {
    credit,
  });
  return unwrapApiResponse(response);
};
