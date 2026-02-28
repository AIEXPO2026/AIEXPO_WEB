import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup, sendVerificationEmail, verifySignupEmail } from '../../../api/authApi';
import styles from './Signup.module.css';

function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [authCodeError, setAuthCodeError] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const validatePassword = (value) => {
    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    return regex.test(value);
  };

  const handleNext = async () => {
    if (step === 2) {
      // 이메일 입력 후 인증번호 전송
      if (!email) return;
      setLoading(true);
      setApiError('');
      try {
        await sendVerificationEmail(email);
        setStep(3);
      } catch (err) {
        setApiError('인증 메일 발송에 실패했습니다. 다시 시도해주세요.');
        console.error('메일 발송 실패:', err);
      } finally {
        setLoading(false);
      }
    } else if (step === 3) {
      // 인증번호 API 검증
      if (!authCode) {
        setAuthCodeError('인증번호를 입력해주세요.');
        return;
      }
      setLoading(true);
      setAuthCodeError('');
      try {
        await verifySignupEmail(email, authCode);
        setStep(4);
      } catch (err) {
        setAuthCodeError('인증번호가 올바르지 않습니다.');
        console.error('이메일 인증 실패:', err);
      } finally {
        setLoading(false);
      }
    } else if (step === 5) {
      // 비밀번호 입력 후 회원가입 요청 (name, authNum 포함)
      if (!validatePassword(password)) {
        setPasswordError(true);
        return;
      }
      if (password !== confirmPassword) {
        setConfirmPasswordError(true);
        return;
      }

      setLoading(true);
      setApiError('');

      try {
        await signup(name, id, password, email, authCode);
        navigate('/welcome');
      } catch (err) {
        setApiError('회원가입에 실패했습니다. 다시 시도해주세요.');
        console.error('회원가입 실패:', err);
      } finally {
        setLoading(false);
      }
    } else if (step === 1) {
      if (!name.trim()) {
        setApiError('이름을 입력해주세요.');
        return;
      }
      setApiError('');
      setStep(2);
    } else {
      setStep(step + 1);
    }
  };

  const handleResendEmail = async () => {
    setLoading(true);
    setAuthCodeError('');
    try {
      await sendVerificationEmail(email);
    } catch (err) {
      setAuthCodeError('재전송에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (e.target.value && !validatePassword(e.target.value)) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (e.target.value && password !== e.target.value) {
      setConfirmPasswordError(true);
    } else {
      setConfirmPasswordError(false);
    }
  };

  const getButtonText = () => {
    if (loading) return '처리 중...';
    if (step === 2) return '인증번호 전송';
    if (step === 3) return '인증 확인';
    if (step === 5) return '회원가입';
    return '다음';
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className={styles.inputGroup}>
            <label className={styles.label}>이름</label>
            <input
              type="text"
              className={styles.input}
              placeholder="이름를 입력해주세요."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        );
      case 2:
        return (
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
        );
      case 3:
        return (
          <div className={styles.inputGroup}>
            <label className={`${styles.label} ${authCodeError ? styles.labelError : ''}`}>
              인증번호
            </label>
            <p className={styles.emailHint}>{email}으로 발송된 인증번호를 입력해주세요.</p>
            <input
              type="text"
              className={`${styles.input} ${authCodeError ? styles.inputError : ''}`}
              placeholder="인증번호 6자리를 입력해주세요."
              value={authCode}
              onChange={(e) => setAuthCode(e.target.value)}
            />
            {authCodeError && (
              <p className={styles.errorMessage}>{authCodeError}</p>
            )}
          </div>
        );
      case 4:
        return (
          <div className={styles.inputGroup}>
            <label className={styles.label}>아이디</label>
            <input
              type="text"
              className={styles.input}
              placeholder="아이디를 입력해주세요."
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
          </div>
        );
      case 5:
        return (
          <>
            <div className={styles.inputGroup}>
              <label className={`${styles.label} ${passwordError ? styles.labelError : ''}`}>
                비밀번호
              </label>
              <input
                type="password"
                className={`${styles.input} ${passwordError ? styles.inputError : ''}`}
                placeholder="비밀번호를 입력해주세요."
                value={password}
                onChange={handlePasswordChange}
              />
              {passwordError && (
                <p className={styles.errorMessage}>
                  영문 대소문자, 숫자, 특수문자 포함 8자 이상이어야 합니다.
                </p>
              )}
            </div>
            <div className={styles.inputGroup}>
              <label className={`${styles.label} ${confirmPasswordError ? styles.labelError : ''}`}>
                비밀번호 재확인
              </label>
              <input
                type="password"
                className={`${styles.input} ${confirmPasswordError ? styles.inputError : ''}`}
                placeholder="비밀번호를 다시 입력해주세요."
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
              {confirmPasswordError && (
                <p className={styles.errorMessage}>
                  비밀번호가 일치하지 않습니다.
                </p>
              )}
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>회원가입</h1>

      <div className={styles.form}>
        {renderStep()}

        {apiError && <p className={styles.errorMessage}>{apiError}</p>}

        <button
          className={styles.button}
          onClick={handleNext}
          disabled={loading}
        >
          {getButtonText()}
        </button>

        <div className={styles.links}>
          {step > 1 && (
            <>
              <span className={styles.link} onClick={handleBack}>
                이전으로
              </span>
              <span className={styles.divider}>|</span>
            </>
          )}
          {step === 3 && (
            <>
              <span className={styles.link} onClick={handleResendEmail}>
                재전송하기
              </span>
              <span className={styles.divider}>|</span>
            </>
          )}
          <span className={styles.link} onClick={() => navigate('/login')}>
            로그인하기
          </span>
        </div>
      </div>
    </div>
  );
}

export default Signup;
