import apiClient, { unwrapApiResponse } from './axios';

// 회원가입
export const signup = async (name, username, password, email) => {
  const response = await apiClient.post('/auth/signup', {
    name,
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
  await apiClient.post('/auth/email/send', { email });
};

// 회원가입 인증 메일 확인
export const verifySignupEmail = async (email, authNum) => {
  await apiClient.post('/auth/signup/email/verify', { email, authNum });
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
export const resetPassword = async (email, authNum, newPassword) => {
  await apiClient.post('/auth/password/reset', {
    email,
    authNum,
    password_hash: newPassword,
  });
};

// 로그아웃
export const signout = async () => {
  const response = await apiClient.post('/auth/signout');
  return unwrapApiResponse(response);
};
