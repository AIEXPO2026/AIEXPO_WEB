import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendVerificationEmail, verifySignupEmail, resetPassword } from '../../../api/authApi';
import styles from './FindPassword.module.css';

function FindPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleNext = async () => {
    if (step === 1) {
      // 이메일로 인증번호 전송
      setLoading(true);
      setApiError('');
      try {
        await sendVerificationEmail(email);
        setStep(2);
      } catch (err) {
        setApiError('인증번호 전송에 실패했습니다. 이메일을 확인해주세요.');
        console.error('인증번호 전송 실패:', err);
      } finally {
        setLoading(false);
      }
    } else if (step === 2) {
      // 인증번호 확인
      setLoading(true);
      setApiError('');
      try {
        await verifySignupEmail(email, verificationCode);
        setStep(3);
      } catch (err) {
        setApiError('인증번호가 올바르지 않습니다.');
        console.error('인증번호 확인 실패:', err);
      } finally {
        setLoading(false);
      }
    } else {
      // 비밀번호 일치 확인
      if (newPassword !== confirmPassword) {
        setPasswordError(true);
        return;
      }
      setLoading(true);
      setApiError('');
      try {
        await resetPassword(email, verificationCode, newPassword);
        navigate('/login');
      } catch (err) {
        setApiError('비밀번호 변경에 실패했습니다. 다시 시도해주세요.');
        console.error('비밀번호 재설정 실패:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (step === 1) {
      navigate('/login');
    } else {
      setApiError('');
      setStep(step - 1);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setApiError('');
    try {
      await sendVerificationEmail(email);
    } catch (err) {
      setApiError('재전송에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (e.target.value && newPassword !== e.target.value) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
  };

  const getButtonText = () => {
    if (loading) return '처리 중...';
    if (step === 1) return '인증번호 보내기';
    if (step === 2) return '다음';
    return '완료';
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>비밀번호 찾기</h1>

      <div className={styles.form}>
        {step === 1 && (
          <div className={styles.inputGroup}>
            <label className={styles.label}>이메일</label>
            <input
              type="email"
              className={styles.input}
              placeholder="이메일을 입력해주세요."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        )}

        {step === 2 && (
          <div className={styles.inputGroup}>
            <label className={styles.label}>인증번호</label>
            <input
              type="text"
              className={styles.input}
              placeholder="인증번호를 입력해주세요."
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
          </div>
        )}

        {step === 3 && (
          <>
            <div className={styles.inputGroup}>
              <label className={styles.label}>새 비밀번호</label>
              <input
                type="password"
                className={styles.input}
                placeholder="새 비밀번호를 입력해주세요."
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={`${styles.label} ${passwordError ? styles.labelError : ''}`}>
                비밀번호 재확인
              </label>
              <input
                type="password"
                className={`${styles.input} ${passwordError ? styles.inputError : ''}`}
                placeholder="비밀번호를 다시 입력해주세요."
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
              {passwordError && (
                <p className={styles.errorMessage}>
                  비밀번호가 일치하지 않습니다.
                </p>
              )}
            </div>
          </>
        )}

        {apiError && <p className={styles.errorMessage}>{apiError}</p>}

        <button className={styles.button} onClick={handleNext} disabled={loading}>
          {getButtonText()}
        </button>

        <div className={styles.links}>
          <span className={styles.link} onClick={handleBack}>
            이전으로
          </span>
          {step === 2 && (
            <>
              <span className={styles.divider}>|</span>
              <span className={styles.link} onClick={handleResend}>
                재전송하기
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default FindPassword;
