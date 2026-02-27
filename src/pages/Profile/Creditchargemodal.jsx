import { useState } from 'react';
import { chargeCredit } from '../../api/profileApi';
import styles from './CreditChargeModal.module.css';

function IconClose() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function CoinIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#FFD700" />
      <text x="12" y="16" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1a1a1a">C</text>
    </svg>
  );
}

const PRESET_AMOUNTS = [10000, 30000, 50000];

function CreditChargeModal({ currentCredit, onClose, onSuccess }) {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const amount = selectedAmount ?? (parseInt(customAmount.replace(/,/g, ''), 10) || 0);

  const handlePreset = (value) => {
    setSelectedAmount(value);
    setCustomAmount('');
    setError('');
  };

  const handleCustomChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setCustomAmount(raw);
    setSelectedAmount(null);
    setError('');
  };

  const handleCharge = async () => {
    if (!amount || amount <= 0) {
      setError('충전할 크레딧을 선택하거나 입력해주세요.');
      return;
    }
    try {
      setIsLoading(true);
      setError('');
      await chargeCredit(amount);
      onSuccess(amount);
    } catch (err) {
      const msg = err.response?.data?.message;
      setError(msg || '충전에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>크레딧 충전</h2>
          <button className={styles.closeButton} onClick={onClose} type="button"><IconClose /></button>
        </div>

        <div className={styles.currentCredit}>
          <span className={styles.currentLabel}>보유 크레딧</span>
          <div className={styles.currentAmount}>
            <CoinIcon />
            <span>{currentCredit.toLocaleString()}</span>
          </div>
        </div>

        <div className={styles.section}>
          <p className={styles.sectionLabel}>충전 금액 선택</p>
          <div className={styles.presetGrid}>
            {PRESET_AMOUNTS.map((v) => (
              <button
                key={v}
                type="button"
                className={`${styles.presetButton} ${selectedAmount === v ? styles.presetSelected : ''}`}
                onClick={() => handlePreset(v)}
              >
                {v.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <p className={styles.sectionLabel}>직접 입력</p>
          <div className={styles.inputWrapper}>
            <CoinIcon />
            <input
              className={styles.customInput}
              type="text"
              inputMode="numeric"
              placeholder="충전할 크레딧을 입력하세요"
              value={customAmount}
              onChange={handleCustomChange}
            />
          </div>
        </div>

        {amount > 0 && (
          <div className={styles.preview}>
            <span className={styles.previewLabel}>충전 후 크레딧</span>
            <div className={styles.previewAmount}>
              <CoinIcon />
              <span>{(currentCredit + amount).toLocaleString()}</span>
            </div>
          </div>
        )}

        {error && <p className={styles.errorText}>{error}</p>}

        <button
          type="button"
          className={styles.chargeButton}
          onClick={handleCharge}
          disabled={isLoading || !amount}
        >
          {isLoading ? '처리 중...' : `${amount > 0 ? amount.toLocaleString() + ' ' : ''}크레딧 충전하기`}
        </button>

        <p className={styles.notice}>충전된 크레딧은 환불되지 않습니다.</p>
      </div>
    </div>
  );
}

export default CreditChargeModal;
