import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './PaymentResultPage.module.css';

function PaymentFailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const code = searchParams.get('code') || '';
  const message = searchParams.get('message') || '결제가 취소되었거나 실패했습니다.';

  return (
    <div className={styles.container}>
      <div className={styles.resultCard}>
        <div className={styles.iconFail}>✕</div>
        <h2 className={styles.resultTitle}>결제 실패</h2>
        {code && <p className={styles.errorCode}>오류 코드: {code}</p>}
        <p className={styles.resultMessage}>{message}</p>
        <button className={styles.actionButton} onClick={() => navigate('/profile')}>
          마이페이지로 돌아가기
        </button>
      </div>
    </div>
  );
}

export default PaymentFailPage;
