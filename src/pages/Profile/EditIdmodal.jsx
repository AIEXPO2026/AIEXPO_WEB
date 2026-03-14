import { useState } from 'react';
import { updateUsername } from '../../api/profileApi';
import PasswordInput from '../../components/common/PasswordInput';
import styles from './Profilemodal.module.css';

function IconClose() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function EditIdModal({ currentUserId, onClose, onSuccess }) {
  const [newId, setNewId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const validate = () => {
    if (!newId.trim()) return '새 아이디를 입력해주세요.';
    if (newId.length < 4) return '아이디는 4자 이상이어야 합니다.';
    if (!/^[a-zA-Z0-9_]+$/.test(newId)) return '영문, 숫자, 밑줄(_)만 사용 가능합니다.';
    if (!password) return '현재 비밀번호를 입력해주세요.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }
    try {
      setIsLoading(true);
      setError('');
      await updateUsername(newId.trim(), password);
      onSuccess(newId.trim());
    } catch (err) {
      const msg = err.response?.data?.message;
      setError(msg || '아이디 변경에 실패했습니다. 비밀번호를 확인해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>아이디 수정</h2>
          <button className={styles.closeButton} onClick={onClose} type="button"><IconClose /></button>
        </div>

        <div className={styles.currentInfo}>
          <span className={styles.currentLabel}>현재 아이디</span>
          <span className={styles.currentValue}>{currentUserId}</span>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>새 아이디</label>
            <input
              className={styles.input}
              type="text"
              placeholder="새 아이디 입력 (영문, 숫자, _)"
              value={newId}
              onChange={(e) => { setNewId(e.target.value); setError(''); }}
              maxLength={20}
              autoComplete="off"
            />
            <span className={styles.charCount}>{newId.length}/20</span>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>현재 비밀번호 확인</label>
            <PasswordInput
              className={styles.input}
              placeholder="현재 비밀번호를 입력하세요"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              autoComplete="current-password"
            />
          </div>

          {error && <p className={styles.errorText}>{error}</p>}

          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading ? '처리 중...' : '아이디 변경하기'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditIdModal;
