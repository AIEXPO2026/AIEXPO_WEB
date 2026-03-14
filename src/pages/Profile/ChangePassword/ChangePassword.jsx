import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { changePassword } from '../../../api/authApi';
import PasswordInput from '../../../components/common/PasswordInput';
import styles from './ChangePassword.module.css';

function BackIcon() {
  return (
    <svg width="13" height="23" viewBox="0 0 13 23" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.21838 11.3133L12.6464 20.7413L10.761 22.6267L0.390382 12.256C0.140421 12.006 0 11.6669 0 11.3133C0 10.9598 0.140421 10.6207 0.390382 10.3707L10.761 0L12.6464 1.88533L3.21838 11.3133Z"
        fill="#252525"
      />
    </svg>
  );
}

function ChangePassword() {
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmError, setConfirmError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(false);

  const validatePassword = (value) => {
    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    return regex.test(value);
  };

  const handleSubmit = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      setApiError('모든 항목을 입력해주세요.');
      return;
    }
    if (!validatePassword(newPassword)) {
      setApiError('새 비밀번호는 영문 대소문자, 숫자, 특수문자 포함 8자 이상이어야 합니다.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setConfirmError(true);
      return;
    }

    setLoading(true);
    setApiError('');
    setConfirmError(false);

    try {
      await changePassword(oldPassword, newPassword);
      setSuccess(true);
    } catch (err) {
      setApiError('비밀번호 변경에 실패했습니다. 현재 비밀번호를 확인해주세요.');
      console.error('비밀번호 변경 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (e.target.value && newPassword !== e.target.value) {
      setConfirmError(true);
    } else {
      setConfirmError(false);
    }
  };

  if (success) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <button className={styles.backButton} onClick={() => navigate('/profile')}>
            <BackIcon />
          </button>
          <h1 className={styles.title}>비밀번호 변경</h1>
        </header>
        <div className={styles.successBox}>
          <p className={styles.successText}>비밀번호가 변경되었습니다.</p>
          <button className={styles.button} onClick={() => navigate('/profile')}>
            확인
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate('/profile')}>
          <BackIcon />
        </button>
        <h1 className={styles.title}>비밀번호 변경</h1>
      </header>

      <div className={styles.form}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>현재 비밀번호</label>
          <PasswordInput
            className={styles.input}
            placeholder="현재 비밀번호를 입력해주세요."
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>새 비밀번호</label>
          <PasswordInput
            className={styles.input}
            placeholder="영문 대소문자, 숫자, 특수문자 포함 8자 이상"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={`${styles.label} ${confirmError ? styles.labelError : ''}`}>
            새 비밀번호 재확인
          </label>
          <PasswordInput
            className={`${styles.input} ${confirmError ? styles.inputError : ''}`}
            placeholder="새 비밀번호를 다시 입력해주세요."
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
          />
          {confirmError && (
            <p className={styles.errorMessage}>비밀번호가 일치하지 않습니다.</p>
          )}
        </div>

        {apiError && <p className={styles.errorMessage}>{apiError}</p>}

        <button className={styles.button} onClick={handleSubmit} disabled={loading}>
          {loading ? '처리 중...' : '변경하기'}
        </button>
      </div>
    </div>
  );
}

export default ChangePassword;
