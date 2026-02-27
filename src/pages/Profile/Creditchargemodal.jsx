import { useState } from 'react';
import { chargeCredit } from '../../api/profileApi';
import styles from './CreditChargeModal.module.css';

const PRESET_AMOUNTS = [1000, 3000, 5000, 10000, 30000, 50000];

function IconClose() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function CoinIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#FFD700" />
      <text x="12" y="16" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1a1a1a">C</text>
    </svg>
  );
}

function CreditChargeModal({ currentCredit, onClose, onSuccess }) {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // 최종 충전할 금액
  const chargeAmount = selectedAmount ?? (parseInt(customAmount.replace(/,/g, ''), 10) || 0);

  const handlePresetClick = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount('');
    setError('');
  };

  const handleCustomInput = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setCustomAmount(raw ? Number(raw).toLocaleString() : '');
    setSelectedAmount(null);
    setError('');
  };

  const handleCharge = async () => {
    if (chargeAmount <= 0) {
      setError('충전할 금액을 선택하거나 입력해주세요.');
      return;
    }
    if (chargeAmount < 1000) {
      setError('최소 충전 금액은 1,000 크레딧입니다.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      await chargeCredit(chargeAmount);
      onSuccess(chargeAmount);
    } catch (err) {
      console.error('크레딧 충전 실패:', err);
      setError('충전에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

        {/* 헤더 */}
        <div className={styles.header}>
          <h2 className={styles.title}>크레딧 충전</h2>
          <button className={styles.closeButton} onClick={onClose} type="button">
            <IconClose />
          </button>
        </div>

        {/* 현재 보유 크레딧 */}
        <div className={styles.currentCredit}>
          <span className={styles.currentLabel}>현재 보유</span>
          <div className={styles.currentAmount}>
            <CoinIcon size={18} />
            <span>{currentCredit.toLocaleString()}</span>
          </div>
        </div>

        {/* 프리셋 금액 선택 */}
        <div className={styles.section}>
          <p className={styles.sectionLabel}>금액 선택</p>
          <div className={styles.presetGrid}>
            {PRESET_AMOUNTS.map((amount) => (
              <button
                key={amount}
                type="button"
                className={`${styles.presetButton} ${selectedAmount === amount ? styles.presetSelected : ''}`}
                onClick={() => handlePresetClick(amount)}
              >
                {amount.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* 직접 입력 */}
        <div className={styles.section}>
          <p className={styles.sectionLabel}>직접 입력</p>
          <div className={styles.inputWrapper}>
            <CoinIcon size={16} />
            <input
              className={styles.customInput}
              type="text"
              inputMode="numeric"
              placeholder="금액을 입력하세요"
              value={customAmount}
              onChange={handleCustomInput}
            />
          </div>
        </div>

        {/* 충전 후 예상 크레딧 */}
        {chargeAmount > 0 && (
          <div className={styles.preview}>
            <span className={styles.previewLabel}>충전 후 보유</span>
            <div className={styles.previewAmount}>
              <CoinIcon size={16} />
              <span>{(currentCredit + chargeAmount).toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* 에러 메시지 */}
        {error && <p className={styles.errorText}>{error}</p>}

        {/* 충전 버튼 */}
        <button
          type="button"
          className={styles.chargeButton}
          onClick={handleCharge}
          disabled={isLoading || chargeAmount <= 0}
        >
          {isLoading
            ? '처리 중...'
            : chargeAmount > 0
              ? `${chargeAmount.toLocaleString()} 크레딧 충전하기`
              : '충전하기'}
        </button>

        <p className={styles.notice}>충전된 크레딧은 환불되지 않습니다.</p>
      </div>
    </div>
  );
}

export default CreditChargeModal;