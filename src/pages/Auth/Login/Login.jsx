import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signin } from '../../../api/authApi';
import styles from './Login.module.css';

function Login() {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!id || !password) {
      setError(true);
      return;
    }

    setLoading(true);
    setError(false);

    try {
      const response = await signin(id, password);

      // 토큰 저장
      if (response?.accessToken) {
        localStorage.setItem('accessToken', response.accessToken);
        navigate('/home');
      }
    } catch (err) {
      setError(true);
      console.error('로그인 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>로그인</h1>

      <div className={styles.form}>
        <div className={styles.inputGroup}>
          <label className={`${styles.label} ${error ? styles.labelError : ''}`}>
            아이디
          </label>
          <input
            type="text"
            className={`${styles.input} ${error ? styles.inputError : ''}`}
            placeholder="아이디를 입력해주세요."
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={`${styles.label} ${error ? styles.labelError : ''}`}>
            비밀번호
          </label>
          <input
            type="password"
            className={`${styles.input} ${error ? styles.inputError : ''}`}
            placeholder="비밀번호를 입력해주세요."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <p className={styles.errorMessage}>
              아이디 또는 비밀번호가 일치하지 않습니다.
            </p>
          )}
        </div>

        <button
          className={styles.button}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? '로그인 중...' : '로그인'}
        </button>

        <div className={styles.links}>
          <span className={styles.link} onClick={() => navigate('/signup')}>
            회원가입하기
          </span>
          <span className={styles.divider}>|</span>
          <span className={styles.link} onClick={() => navigate('/find-password')}>
            비밀번호 찾기
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;
