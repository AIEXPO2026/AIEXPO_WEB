import { useState } from 'react';
import { changePassword } from '../../api/authApi';
import styles from './Profilemodal.module.css';

function IconClose() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IconEye({ open }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

function PasswordField({ label, value, onChange, placeholder, autoComplete }) {
  const [show, setShow] = useState(false);
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}>{label}</label>
      <div className={styles.passwordWrapper}>
        <input
          className={styles.input}
          type={show ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
        />
        <button type="button" className={styles.eyeButton} onClick={() => setShow(s => !s)}>
          <IconEye open={show} />
        </button>
      </div>
    </div>
  );
}

function ChangePasswordModal({ username, onClose, onSuccess }) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // 비밀번호 강도 체크
  const getStrength = (pw) => {
    if (!pw) return { level: 0, label: '', color: '' };
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 1) return { level: 1, label: '약함', color: '#E53935' };
    if (score === 2) return { level: 2, label: '보통', color: '#FB8C00' };
    return { level: 3, label: '강함', color: '#43A047' };
  };

  const strength = getStrength(newPassword);

  const validate = () => {
    if (!oldPassword) return '현재 비밀번호를 입력해주세요.';
    if (!newPassword) return '새 비밀번호를 입력해주세요.';
    if (newPassword.length < 8) return '비밀번호는 8자 이상이어야 합니다.';
    if (newPassword === oldPassword) return '새 비밀번호가 현재 비밀번호와 같습니다.';
    if (newPassword !== confirmPassword) return '새 비밀번호가 일치하지 않습니다.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }
    try {
      setIsLoading(true);
      setError('');
      await changePassword(username, oldPassword, newPassword);
      onSuccess();
    } catch (err) {
      const msg = err.response?.data?.message;
      setError(msg || '비밀번호 변경에 실패했습니다. 현재 비밀번호를 확인해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>비밀번호 변경</h2>
          <button className={styles.closeButton} onClick={onClose} type="button"><IconClose /></button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <PasswordField
            label="현재 비밀번호"
            value={oldPassword}
            onChange={(e) => { setOldPassword(e.target.value); setError(''); }}
            placeholder="현재 비밀번호를 입력하세요"
            autoComplete="current-password"
          />
          <PasswordField
            label="새 비밀번호"
            value={newPassword}
            onChange={(e) => { setNewPassword(e.target.value); setError(''); }}
            placeholder="8자 이상 입력하세요"
            autoComplete="new-password"
          />

          {/* 비밀번호 강도 표시 */}
          {newPassword.length > 0 && (
            <div className={styles.strengthBar}>
              <div className={styles.strengthSegments}>
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={styles.strengthSegment}
                    style={{ background: i <= strength.level ? strength.color : '#e8e8e8' }}
                  />
                ))}
              </div>
              <span className={styles.strengthLabel} style={{ color: strength.color }}>
                {strength.label}
              </span>
            </div>
          )}

          <PasswordField
            label="새 비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
            placeholder="새 비밀번호를 다시 입력하세요"
            autoComplete="new-password"
          />

          {/* 일치 여부 표시 */}
          {confirmPassword.length > 0 && (
            <p className={styles.matchText} style={{ color: newPassword === confirmPassword ? '#43A047' : '#E53935' }}>
              {newPassword === confirmPassword ? '✓ 비밀번호가 일치합니다' : '✗ 비밀번호가 일치하지 않습니다'}
            </p>
          )}

          {error && <p className={styles.errorText}>{error}</p>}

          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading ? '처리 중...' : '비밀번호 변경하기'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChangePasswordModal;