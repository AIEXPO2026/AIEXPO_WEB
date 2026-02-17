import { useState } from 'react';
import styles from './TravelModal.module.css';

const TravelEditModal = ({ travel, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: travel?.title || '',
    startDate: travel?.startDate || '',
    endDate: travel?.endDate || '',
    companions: travel?.companions || '',
    companionCount: travel?.companionCount || '',
    tags: travel?.tags || [],
    weather: travel?.weather || [], 
    review: travel?.review || '', 
    placeReviews: travel?.placeReviews || [], // 방문지별 후기
    isPublic: travel?.isPublic || false,
    thumbnailUrl: travel?.thumbnailUrl || null,
  });

  const [newTag, setNewTag] = useState('');
  const [thumbnailPreview, setThumbnailPreview] = useState(travel?.thumbnailUrl || null);

  // 날씨 옵션 : 임시로 정했는디 나쁘지 않은 듯?
  const weatherOptions = ['맑음', '흐림', '비', '눈', '선선함', '추움', '더움', '쾌적함'];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleWeatherToggle = (weather) => {
    setFormData(prev => ({
      ...prev,
      weather: prev.weather.includes(weather)
        ? prev.weather.filter(w => w !== weather)
        : [...prev.weather, weather]
    }));
  };

  const handleAddTag = () => {
    const trimmedTag = newTag.trim();
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, trimmedTag]
      }));
      setNewTag('');
    } else if (formData.tags.includes(trimmedTag)) {
      alert('이미 추가된 태그입니다.');
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 미리보기
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      // 백엔드 연결 시: FormData로 파일 업로드
      // const formData = new FormData();
      // formData.append('thumbnail', file);
      // uploadThumbnail(formData);
      
      setFormData(prev => ({
        ...prev,
        thumbnailFile: file,
        thumbnailUrl: reader.result
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>여행 기록 수정</h2>
          <button className={styles.closeButton} onClick={onClose} type="button">
            ✕
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* 썸네일 이미지 */}
          <div className={styles.formGroup}>
            <label className={styles.label}>여행 사진</label>
            <div className={styles.thumbnailUpload}>
              <div className={styles.thumbnailPreview}>
                {thumbnailPreview ? (
                  <img src={thumbnailPreview} alt="미리보기" />
                ) : (
                  <div className={styles.thumbnailPlaceholder}>
                    <span>📷</span>
                    <p>사진 추가</p>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className={styles.fileInput}
                id="thumbnail"
              />
              <label htmlFor="thumbnail" className={styles.fileLabel}>
                사진 선택
              </label>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>여행 제목</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="여행 제목을 입력하세요"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>여행 기간</label>
            <div className={styles.dateRange}>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className={styles.dateInput}
                required
              />
              <span className={styles.dateSeparator}>~</span>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className={styles.dateInput}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>동행인</label>
            <div className={styles.companionWrapper}>
              <input
                type="text"
                name="companions"
                value={formData.companions}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="예: 가족, 친구, 혼자 등"
              />
              <input
                type="number"
                name="companionCount"
                value={formData.companionCount}
                onChange={handleInputChange}
                className={styles.companionCount}
                placeholder="인원"
                min="1"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>날씨 (중복 선택 가능)</label>
            <div className={styles.weatherGrid}>
              {weatherOptions.map((weather) => (
                <button
                  key={weather}
                  type="button"
                  onClick={() => handleWeatherToggle(weather)}
                  className={`${styles.weatherButton} ${
                    formData.weather.includes(weather) ? styles.weatherActive : ''
                  }`}
                >
                  {weather}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>여행 테마</label>
            <div className={styles.tagInputWrapper}>
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className={styles.tagInput}
                placeholder="테마 입력 후 추가 버튼 클릭 (예: 힐링, 자연)"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className={styles.addTagButton}
              >
                추가
              </button>
            </div>
            <div className={styles.tagList}>
              {formData.tags.map((tag, index) => (
                <div key={index} className={styles.tag}>
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className={styles.removeTagButton}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>여행 후기</label>
            <textarea
              name="review"
              value={formData.review}
              onChange={handleInputChange}
              className={styles.textarea}
              placeholder="여행에 대한 전반적인 후기를 작성해주세요!"
              rows="4"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="isPublic"
                checked={formData.isPublic}
                onChange={handleInputChange}
                className={styles.checkbox}
              />
              <span>공개 여행으로 설정</span>
            </label>
            <p className={styles.hint}>
              공개 시 다른 사용자들이 내 여행 기록을 볼 수 있습니다. (기본: 비공개)
            </p>
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              취소
            </button>
            <button
              type="submit"
              className={styles.saveButton}
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TravelEditModal;