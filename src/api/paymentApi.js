import apiClient, { unwrapApiResponse } from './axios';

// 토스페이먼츠 결제 승인 - POST /payment/confirm
// Body: { paymentKey, orderId, amount }
// Response: { credit: number }
export const confirmPayment = async ({ paymentKey, orderId, amount }) => {
  const response = await apiClient.post('/payment/confirm', { paymentKey, orderId, amount });
  return unwrapApiResponse(response);
};
