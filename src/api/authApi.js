import apiClient from './axios';

// 회원가입
export const signup = async (username, password, email) => {
  const response = await apiClient.post('/auth/signup', {
    username,
    password,
    email,
  });
  return response.data;
};

// 로그인
export const signin = async (username, password) => {
  const response = await apiClient.post('/auth/signin', {
    username,
    password,
  });
  return response.data;
};

// 인증 메일 전송
export const sendVerificationEmail = async (email) => {
  const response = await apiClient.post('/auth/email/send', {
    email,
  });
  return response.data;
};

// 인증 메일 확인
export const verifyEmail = async (email, authNum) => {
  const response = await apiClient.post('/auth/email/verify', {
    email,
    authNum,
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
