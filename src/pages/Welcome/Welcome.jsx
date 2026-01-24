import { useNavigate } from 'react-router-dom';
import styles from './Welcome.module.css';

function Welcome() {
  const navigate = useNavigate();

  const handleComplete = () => {
    navigate('/login');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>환영합니다</h1>
      <p className={styles.subtitle}>지금 바로 최적의 여행지를 추천받아 보세요!</p>

      <div className={styles.iconWrapper}>
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* 파라솔 */}
          <ellipse cx="60" cy="65" rx="40" ry="35" fill="#4A90D9" />
          <ellipse cx="60" cy="65" rx="40" ry="35" fill="url(#umbrella-gradient)" />
          <path
            d="M20 65 C20 65 35 50 60 50 C85 50 100 65 100 65"
            fill="#3B7DD8"
          />
          <path
            d="M30 65 C30 58 42 48 60 48 C78 48 90 58 90 65"
            fill="#F5C842"
          />
          <path
            d="M40 65 C40 55 48 47 60 47 C72 47 80 55 80 65"
            fill="#4A90D9"
          />
          <path
            d="M50 65 C50 55 54 48 60 48 C66 48 70 55 70 65"
            fill="#F5C842"
          />
          {/* 파라솔 봉 */}
          <rect x="58" y="60" width="4" height="40" rx="2" fill="#666666" />
          {/* 바다 물결 */}
          <path
            d="M15 80 Q30 75 45 80 Q60 85 75 80 Q90 75 105 80"
            stroke="#4A90D9"
            strokeWidth="3"
            fill="none"
            opacity="0.6"
          />
          <path
            d="M10 88 Q25 83 40 88 Q55 93 70 88 Q85 83 100 88 Q108 85 115 88"
            stroke="#4A90D9"
            strokeWidth="2.5"
            fill="none"
            opacity="0.4"
          />
          <defs>
            <linearGradient id="umbrella-gradient" x1="20" y1="40" x2="100" y2="70">
              <stop offset="0%" stopColor="#4A90D9" />
              <stop offset="50%" stopColor="#F5C842" />
              <stop offset="100%" stopColor="#4A90D9" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <button className={styles.button} onClick={handleComplete}>
        완료
      </button>
    </div>
  );
}

export default Welcome;
