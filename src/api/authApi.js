import apiClient, { unwrapApiResponse } from './axios';

// 회원가입
export const signup = async (name, username, password, email, authNum) => {
  const response = await apiClient.post('/auth/signup', {
    name,
    nickname: username,
    password_hash: password,
    email,
    authNum,
  });
  return unwrapApiResponse(response);
};

// 로그인
export const signin = async (username, password) => {
  const response = await apiClient.post('/auth/signin', {
    nickname: username,
    password_hash: password,
  });
  return unwrapApiResponse(response);
};

// 인증 메일 전송
export const sendVerificationEmail = async (email) => {
  const response = await apiClient.post('/auth/email/send', {
    email,
  });
  return unwrapApiResponse(response);
};

// 인증 메일 확인 (boolean 직접 반환)
export const verifyEmail = async (email, authNum) => {
  const response = await apiClient.post('/auth/email/verify', {
    email,
    authNum,
  });
  return response.data;
};

// 비밀번호 변경 (로그인 상태)
export const changePassword = async (oldPassword, newPassword) => {
  const response = await apiClient.put('/auth/password', {
    oldPassword,
    newPassword,
  });
  return unwrapApiResponse(response);
};

// 비밀번호 재설정 (이메일 인증 후, 비로그인 상태)
export const resetPassword = async (email, newPassword) => {
  const response = await apiClient.post('/auth/password/reset', {
    email,
    newPassword,
  });
  return unwrapApiResponse(response);
};

// 로그아웃
export const signout = async () => {
  const response = await apiClient.post('/auth/signout');
  return unwrapApiResponse(response);
};
