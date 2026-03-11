import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AICourse.module.css';
import { getCourseByLocation, saveCourse } from '../../../api/courseApi';

function AICourse() {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [course, setCourse] = useState(null);
  const [generatedLocation, setGeneratedLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null); // 'success' | 'error' | null

  const handleGenerate = async () => {
    const trimmed = location.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    setCourse(null);
    setSaveStatus(null);

    try {
      const data = await getCourseByLocation(trimmed);
      const items = data?.course ?? [];
      if (items.length === 0) {
        setError('주변 장소를 찾지 못했습니다. 다른 위치를 입력해 보세요.');
      } else {
        setCourse(items);
        setGeneratedLocation(trimmed);
      }
    } catch (err) {
      setError('코스 생성에 실패했습니다. 잠시 후 다시 시도해 주세요.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem('accessToken');
    let nickname = null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      nickname = payload.sub;
    } catch {
      setSaveStatus('error');
      return;
    }

    setSaving(true);
    setSaveStatus(null);
    try {
      await saveCourse(nickname, generatedLocation);
      setSaveStatus('success');
    } catch (err) {
      setSaveStatus('error');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleGenerate();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button type="button" className={styles.backButton} onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h1 className={styles.title}>AI 여행 코스</h1>
      </div>

      <div className={styles.description}>
        <p>현재 위치나 여행지를 입력하면</p>
        <p>AI가 최적의 여행 코스를 만들어 드려요</p>
      </div>

      <div className={styles.inputSection}>
        <div className={styles.inputWrapper}>
          <svg className={styles.inputIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <input
            className={styles.input}
            type="text"
            placeholder="예: 후쿠오카 타워, 명동, 경복궁"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {location && (
            <button type="button" className={styles.clearButton} onClick={() => setLocation('')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
        <button
          type="button"
          className={styles.generateButton}
          onClick={handleGenerate}
          disabled={loading || !location.trim()}
        >
          {loading ? (
            <span className={styles.spinner} />
          ) : (
            '코스 생성'
          )}
        </button>
      </div>

      {loading && (
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner} />
          <p className={styles.loadingText}>AI가 최적의 코스를 생성하고 있어요</p>
          <p className={styles.loadingSubText}>잠시만 기다려 주세요...</p>
        </div>
      )}

      {!loading && error && (
        <div className={styles.errorState}>
          <p>{error}</p>
        </div>
      )}

      {!loading && course && (
        <div className={styles.result}>
          <div className={styles.resultHeader}>
            <div className={styles.resultLocation}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{generatedLocation}</span>
            </div>
            <span className={styles.resultBadge}>AI 추천 코스</span>
          </div>

          <div className={styles.courseList}>
            {course.map((item) => (
              <div key={item.order} className={styles.courseItem}>
                <div className={styles.courseIndex}>{item.order}</div>
                <div className={styles.courseContent}>
                  <p className={styles.coursePlaceName}>{item.place}</p>
                </div>
                {item.order < course.length && (
                  <div className={styles.connector}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D0D0D0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>

          {saveStatus === 'success' ? (
            <div className={styles.saveSuccess}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              여행 기록에 저장되었습니다
            </div>
          ) : (
            <button
              type="button"
              className={styles.saveButton}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? '저장 중...' : '여행 기록에 저장하기'}
            </button>
          )}

          {saveStatus === 'no_member_id' && (
            <p className={styles.saveError}>저장 기능을 사용하려면 앱을 다시 로그인해 주세요.</p>
          )}
          {saveStatus === 'error' && (
            <p className={styles.saveError}>저장에 실패했습니다. 잠시 후 다시 시도해 주세요.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default AICourse;
