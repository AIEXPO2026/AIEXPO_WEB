import apiClient, { unwrapApiResponse } from './axios';

// 회원가입
export const signup = async (username, password, email) => {
  const response = await apiClient.post('/auth/signup', {
    nickname: username,
    password_hash: password,
    email,
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

// 인증 메일 확인
export const verifyEmail = async (email, authNum) => {
  const response = await apiClient.post('/auth/email/verify', {
    email,
    authNum,
  });
  return unwrapApiResponse(response);
};

// 비밀번호 변경
export const changePassword = async (oldPassword, newPassword) => {
  const response = await apiClient.put('/auth/password', {
    oldPassword,
    newPassword,
  });
  return unwrapApiResponse(response);
};

// 로그아웃
export const signout = async () => {
  const response = await apiClient.post('/auth/signout');
  return unwrapApiResponse(response);
};
