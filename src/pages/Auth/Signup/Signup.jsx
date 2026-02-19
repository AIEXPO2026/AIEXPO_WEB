import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../../../api/authApi';
import styles from './Signup.module.css';

function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const validatePassword = (value) => {
    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    return regex.test(value);
  };

  const handleNext = async () => {
    if (step === 4) {
      if (!validatePassword(password)) {
        setPasswordError(true);
        return;
      }
      if (password !== confirmPassword) {
        setConfirmPasswordError(true);
        return;
      }

      // 회원가입 API 호출
      setLoading(true);
      setApiError('');

      try {
        await signup(id, password, email);
        navigate('/welcome');
      } catch (err) {
        setApiError('회원가입에 실패했습니다. 다시 시도해주세요.');
        console.error('회원가입 실패:', err);
      } finally {
        setLoading(false);
      }
    } else {
      setStep(step + 1);
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
      case 4:
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
          {loading ? '처리 중...' : step === 4 ? '회원가입' : '다음'}
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
          <span className={styles.link} onClick={() => navigate('/login')}>
            로그인하기
          </span>
        </div>
      </div>
    </div>
  );
}

export default Signup;
