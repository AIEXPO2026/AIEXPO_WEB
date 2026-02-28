import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './PaymentPage.module.css';

const CLIENT_KEY = import.meta.env.VITE_TOSS_CLIENT_KEY;

function PaymentPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const tossRef = useRef(null);

  const amount = state?.amount;
  const orderName = state?.orderName || '크레딧 충전';
  const customerName = localStorage.getItem('nickname') || '고객';

  useEffect(() => {
    if (!amount || amount <= 0) {
      navigate('/profile', { replace: true });
    }
  }, [amount, navigate]);

  useEffect(() => {
    if (!amount) return;
    if (!CLIENT_KEY) {
      navigate('/payment/fail?code=INIT_FAILED&message=결제 초기화에 실패했습니다.');
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.tosspayments.com/v1/payment';
    script.onload = () => {
      try {
        tossRef.current = window.TossPayments(CLIENT_KEY);
        setIsReady(true);
      } catch {
        navigate('/payment/fail?code=INIT_FAILED&message=결제 초기화에 실패했습니다.');
      }
    };
    script.onerror = () => {
      navigate('/payment/fail?code=INIT_FAILED&message=결제 초기화에 실패했습니다.');
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [amount, navigate]);

  const handlePayment = async () => {
    if (!tossRef.current || !isReady) return;
    setIsLoading(true);

    const orderId = crypto.randomUUID();
    sessionStorage.setItem('toss_order_id', orderId);
    sessionStorage.setItem('toss_order_amount', String(amount));

    try {
      await tossRef.current.requestPayment('카드', {
        amount,
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

      <p className={styles.paymentNote}>
        아래 버튼을 클릭하면 토스페이먼츠 결제창이 열립니다.
      </p>

      <button
        type="button"
        className={styles.payButton}
        onClick={handlePayment}
        disabled={!isReady || isLoading}
      >
        {!isReady ? '로딩 중...' : isLoading ? '처리 중...' : `${amount.toLocaleString()}원 결제하기`}
      </button>
    </div>
  );
}

export default PaymentPage;
