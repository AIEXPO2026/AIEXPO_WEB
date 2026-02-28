import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadPaymentWidget, ANONYMOUS } from '@tosspayments/payment-widget-sdk';
import styles from './PaymentPage.module.css';

const CLIENT_KEY = import.meta.env.VITE_TOSS_CLIENT_KEY;

function getCustomerKey() {
  const userId = localStorage.getItem('userId');
  if (userId) return `user_${userId}`;
  return ANONYMOUS;
}

function PaymentPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const widgetRef = useRef(null);

  const amount = state?.amount;
  const orderName = state?.orderName || '크레딧 충전';
  const customerName = localStorage.getItem('nickname') || '고객';

  useEffect(() => {
    if (!amount || amount <= 0) {
      navigate('/profile', { replace: true });
    }
  }, [amount, navigate]);

  useEffect(() => {
    if (!amount || !CLIENT_KEY) return;

    const orderId = crypto.randomUUID();
    sessionStorage.setItem('toss_order_id', orderId);
    sessionStorage.setItem('toss_order_amount', String(amount));

    async function initWidget() {
      const paymentWidget = await loadPaymentWidget(CLIENT_KEY, getCustomerKey());
      widgetRef.current = paymentWidget;

      await paymentWidget.renderPaymentMethods({
        selector: '#payment-method',
        amount,
      });
      await paymentWidget.renderAgreement({ selector: '#payment-agreement' });

      setIsReady(true);
    }

    initWidget().catch((err) => {
      console.error('위젯 초기화 실패:', err);
      navigate('/payment/fail?code=INIT_FAILED&message=결제 초기화에 실패했습니다.');
    });
  }, [amount, navigate]);

  const handlePayment = async () => {
    if (!widgetRef.current || !isReady) return;
    setIsLoading(true);
    try {
      const orderId = sessionStorage.getItem('toss_order_id');
      await widgetRef.current.requestPayment({
        orderId,
        orderName,
        customerName,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });
    } catch (err) {
      if (err.code !== 'USER_CANCEL') {
        console.error('결제 요청 오류:', err);
      }
      setIsLoading(false);
    }
  };

  if (!amount) return null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate(-1)} type="button">
          ← 돌아가기
        </button>
        <h1 className={styles.title}>결제</h1>
      </div>

      <div className={styles.orderInfo}>
        <span className={styles.orderName}>{orderName}</span>
        <span className={styles.orderAmount}>{amount.toLocaleString()}원</span>
      </div>

      <div id="payment-method" className={styles.widgetSection} />
      <div id="payment-agreement" className={styles.widgetSection} />

      <button
        type="button"
        className={styles.payButton}
        onClick={handlePayment}
        disabled={!isReady || isLoading}
      >
        {isLoading ? '처리 중...' : `${amount.toLocaleString()}원 결제하기`}
      </button>
    </div>
  );
}

export default PaymentPage;
