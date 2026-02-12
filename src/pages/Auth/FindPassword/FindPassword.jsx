import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './FindPassword.module.css';

function FindPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const handleNext = () => {
    if (step === 1) {
      // 이메일로 인증번호 전송 후 다음 단계
      setStep(2);
    } else if (step === 2) {
      // 인증번호 확인 후 다음 단계
      setStep(3);
    } else {
      // 비밀번호 일치 확인
      if (newPassword !== confirmPassword) {
        setPasswordError(true);
        return;
      }
      // 비밀번호 변경 완료 후 로그인 페이지로 이동
      navigate('/login');
    }
  };

  const handleBack = () => {
    if (step === 1) {
      navigate('/login');
    } else {
      setStep(step - 1);
    }
  };

  const handleResend = () => {
    // 인증번호 재전송 로직
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

        <button className={styles.button} onClick={handleNext}>
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
