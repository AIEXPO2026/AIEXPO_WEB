import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { confirmPayment } from '../../api/paymentApi';
import styles from './PaymentResultPage.module.css';

function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // loading | success | error
  const [errorMessage, setErrorMessage] = useState('');
  const [chargedCredit, setChargedCredit] = useState(0);
  const confirmedRef = useRef(false);

  useEffect(() => {
    if (confirmedRef.current) return;
    confirmedRef.current = true;

    const paymentKey = searchParams.get('paymentKey');
    const orderId = searchParams.get('orderId');
    const amount = parseInt(searchParams.get('amount'), 10);

    const storedAmount = parseInt(sessionStorage.getItem('toss_order_amount'), 10);
    const storedOrderId = sessionStorage.getItem('toss_order_id');

    if (!paymentKey || !orderId || !amount) {
      navigate('/payment/fail?code=MISSING_PARAMS&message=결제 정보가 올바르지 않습니다.', { replace: true });
      return;
    }

    if (amount !== storedAmount || orderId !== storedOrderId) {
      navigate('/payment/fail?code=AMOUNT_MISMATCH&message=결제 정보가 위변조되었습니다.', { replace: true });
      return;
    }

    confirmPayment({ paymentKey, orderId, amount })
      .then((data) => {
        sessionStorage.removeItem('toss_order_id');
        sessionStorage.removeItem('toss_order_amount');
        setChargedCredit(amount);
        setStatus('success');
      })
      .catch((err) => {
        const msg = err.response?.data?.error?.message || '결제 승인에 실패했습니다.';
        setErrorMessage(msg);
        setStatus('error');
      });
  }, [searchParams, navigate]);

  if (status === 'loading') {
    return (
      <div className={styles.container}>
        <div className={styles.loadingWrapper}>
          <div className={styles.spinner} />
          <p>결제를 처리하고 있습니다...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className={styles.container}>
        <div className={styles.resultCard}>
          <div className={styles.iconFail}>✕</div>
          <h2 className={styles.resultTitle}>결제 실패</h2>
          <p className={styles.resultMessage}>{errorMessage}</p>
          <button className={styles.actionButton} onClick={() => navigate('/profile')}>
            마이페이지로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.resultCard}>
        <div className={styles.iconSuccess}>✓</div>
        <h2 className={styles.resultTitle}>결제 완료</h2>
        <p className={styles.resultMessage}>
          <span className={styles.highlight}>{chargedCredit.toLocaleString()} 크레딧</span>이 충전되었습니다.
        </p>
        <button className={styles.actionButton} onClick={() => navigate('/profile')}>
          마이페이지로 이동
        </button>
      </div>
    </div>
  );
}

export default PaymentSuccessPage;
