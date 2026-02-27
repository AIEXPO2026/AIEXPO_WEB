import { useState } from 'react';
import styles from './Profilemodal.module.css';

function IconClose() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

const REASONS = [
  '서비스가 마음에 들지 않아요',
  '자주 사용하지 않아요',
  '개인정보가 걱정돼요',
  '다른 서비스로 이동할 예정이에요',
  '기타',
];

function DeleteAccountModal({ username, onClose, onConfirm }) {
  const [step, setStep] = useState(1); // 1: 이유 선택, 2: 비밀번호 확인
  const [selectedReason, setSelectedReason] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleNextStep = () => {
    if (!selectedReason) { setError('탈퇴 이유를 선택해주세요.'); return; }
    setError('');
    setStep(2);
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    if (!password) { setError('비밀번호를 입력해주세요.'); return; }
    try {
      setIsLoading(true);
      setError('');
      // API 미구현 — 추후 연결 예정
      // await deleteAccount({ password, reason: selectedReason });
      await new Promise((res) => setTimeout(res, 800)); // 임시 딜레이
      onConfirm();
    } catch (err) {
      setError('탈퇴 처리에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>탈퇴하기</h2>
          <button className={styles.closeButton} onClick={onClose} type="button"><IconClose /></button>
        </div>

        {step === 1 ? (
          <>
            <div className={styles.warningBox}>
              <p className={styles.warningTitle}>⚠️ 탈퇴 전 확인해주세요</p>
              <ul className={styles.warningList}>
                <li>모든 여행 기록과 북마크가 삭제됩니다.</li>
                <li>보유 크레딧은 환불되지 않습니다.</li>
                <li>삭제된 계정은 복구할 수 없습니다.</li>
              </ul>
            </div>

            <div className={styles.form}>
              <p className={styles.label}>탈퇴 이유를 알려주세요</p>
              <div className={styles.reasonList}>
                {REASONS.map((reason) => (
                  <button
                    key={reason}
                    type="button"
                    className={`${styles.reasonItem} ${selectedReason === reason ? styles.reasonSelected : ''}`}
                    onClick={() => { setSelectedReason(reason); setError(''); }}
                  >
                    <span className={styles.reasonRadio}>{selectedReason === reason ? '●' : '○'}</span>
                    {reason}
                  </button>
                ))}
              </div>

              {error && <p className={styles.errorText}>{error}</p>}

              <button type="button" className={styles.dangerButton} onClick={handleNextStep}>
                다음 단계
              </button>
              <button type="button" className={styles.cancelButton} onClick={onClose}>
                취소
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleConfirm} className={styles.form}>
            <div className={styles.currentInfo}>
              <span className={styles.currentLabel}>탈퇴 계정</span>
              <span className={styles.currentValue}>{username}</span>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>비밀번호 확인</label>
              <input
                className={styles.input}
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                autoComplete="current-password"
              />
              <p className={styles.fieldHint}>탈퇴 확인을 위해 비밀번호를 입력해주세요.</p>
            </div>

            {error && <p className={styles.errorText}>{error}</p>}

            <div className={styles.apiBadge}>🔧 탈퇴 API 연결 예정</div>

            <button type="submit" className={styles.dangerButton} disabled={isLoading}>
              {isLoading ? '처리 중...' : '탈퇴하기'}
            </button>
            <button type="button" className={styles.cancelButton} onClick={() => setStep(1)}>
              이전으로
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default DeleteAccountModal;