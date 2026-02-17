import { useState, useEffect, useRef } from 'react';
import styles from './Tracking.module.css';

const TravelTracking = ({ onFinish, onClose }) => {
  const [isTracking, setIsTracking] = useState(true);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [path, setPath] = useState([]);
  const [visitedPlaces, setVisitedPlaces] = useState([]);
  const [showPlaceModal, setShowPlaceModal] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showFinishConfirm, setShowFinishConfirm] = useState(false);
  
  const mapRef = useRef(null);
  const watchIdRef = useRef(null);

  // 실시간 위치 추적
  useEffect(() => {
    if (!isTracking) return;

    if (navigator.geolocation) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            timestamp: Date.now()
          };
          
          setCurrentLocation(newLocation);
          setPath(prev => [...prev, newLocation]);
        },
        (error) => {
          console.error('위치 추적 오류:', error);
          alert('위치 추적을 시작할 수 없습니다. 위치 권한을 확인해주세요.');
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 5000
        }
      );
    }

    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [isTracking]);

  // 지도 초기화 (Google Maps API 사용 예시)
  useEffect(() => {
    if (!currentLocation || !mapRef.current) return;

    // Google Maps 초기화
    // const map = new google.maps.Map(mapRef.current, {
    //   center: currentLocation,
    //   zoom: 15
    // });

    // 경로 그리기
    // const pathLine = new google.maps.Polyline({
    //   path: path,
    //   strokeColor: '#FF0000',
    //   strokeWeight: 3
    // });
    // pathLine.setMap(map);
  }, [currentLocation, path]);

  const handleAddPlace = () => {
    if (!currentLocation) {
      alert('현재 위치를 확인할 수 없습니다.');
      return;
    }

    setSelectedPlace({
      location: currentLocation,
      arrivalTime: Date.now()
    });
    setShowPlaceModal(true);
  };

  const handleSavePlace = (placeData) => {
    const newPlace = {
      ...placeData,
      id: Date.now(),
      location: selectedPlace.location,
      arrivalTime: selectedPlace.arrivalTime,
      departureTime: Date.now()
    };

    setVisitedPlaces(prev => [...prev, newPlace]);
    setShowPlaceModal(false);
    setSelectedPlace(null);
  };

  const handleFinish = () => {
    setShowFinishConfirm(true);
  };

  const handleConfirmFinish = () => {
    setIsTracking(false);
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }
    
    // 여행 데이터 전달
    onFinish({
      path,
      visitedPlaces,
      startTime: path[0]?.timestamp,
      endTime: Date.now()
    });
  };

  return (
    <div className={styles.container}>
      {/* 지도 영역 */}
      <div className={styles.mapContainer} ref={mapRef}>
        <div className={styles.mapPlaceholder}>
          {/* 실제 구현 시 Google Maps / Kakao Maps / Naver Maps API 연동 */}
          <p>🗺️ 지도가 여기에 표시됩니다</p>
          <p className={styles.locationInfo}>
            {currentLocation 
              ? `위도: ${currentLocation.lat.toFixed(6)}, 경도: ${currentLocation.lng.toFixed(6)}`
              : '위치 정보를 불러오는 중...'}
          </p>
        </div>
      </div>

      {/* 상단 정보 */}
      <div className={styles.topBar}>
        <button className={styles.closeButton} onClick={onClose}>
          ✕
        </button>
        <div className={styles.trackingInfo}>
          <span className={styles.trackingStatus}>
            {isTracking ? '🔴 추적 중' : '⏸️ 일시정지'}
          </span>
          <span className={styles.placeCount}>
            방문지: {visitedPlaces.length}개
          </span>
        </div>
      </div>

      {/* 하단 컨트롤 */}
      <div className={styles.bottomControls}>
        <button 
          className={styles.addPlaceButton}
          onClick={handleAddPlace}
        >
          + 방문지 추가
        </button>
        <button 
          className={styles.finishButton}
          onClick={handleFinish}
        >
          여행 마치기
        </button>
      </div>

      {/* 방문지 추가 모달 */}
      {showPlaceModal && (
        <PlaceModal
          onClose={() => {
            setShowPlaceModal(false);
            setSelectedPlace(null);
          }}
          onSave={handleSavePlace}
        />
      )}

      {/* 여행 종료 확인 모달 */}
      {showFinishConfirm && (
        <div className={styles.confirmOverlay} onClick={() => setShowFinishConfirm(false)}>
          <div className={styles.confirmModal} onClick={e => e.stopPropagation()}>
            <h3>정말 여행을 마치시겠습니까?</h3>
            <p>여행을 종료하면 위치 추적이 중단됩니다.</p>
            <div className={styles.confirmButtons}>
              <button 
                className={styles.cancelButton}
                onClick={() => setShowFinishConfirm(false)}
              >
                취소
              </button>
              <button 
                className={styles.confirmFinishButton}
                onClick={handleConfirmFinish}
              >
                여행 마치기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 방문지 추가 모달 컴포넌트
const PlaceModal = ({ onClose, onSave }) => {
  const [placeData, setPlaceData] = useState({
    name: '',
    duration: { hours: 0, minutes: 30 },
    photos: [],
    review: ''
  });

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const photoUrls = files.map(file => URL.createObjectURL(file));
    
    setPlaceData(prev => ({
      ...prev,
      photos: [...prev.photos, ...photoUrls]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!placeData.name.trim()) {
      alert('장소 이름을 입력해주세요.');
      return;
    }
    onSave(placeData);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.placeModal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>방문지 기록</h3>
          <button onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.placeForm}>
          <div className={styles.formGroup}>
            <label>장소 이름</label>
            <input
              type="text"
              value={placeData.name}
              onChange={(e) => setPlaceData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="예: 구지 초등학교"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>머문 시간</label>
            <div className={styles.durationInputs}>
              <input
                type="number"
                min="0"
                value={placeData.duration.hours}
                onChange={(e) => setPlaceData(prev => ({
                  ...prev,
                  duration: { ...prev.duration, hours: parseInt(e.target.value) || 0 }
                }))}
                placeholder="시간"
              />
              <span>시간</span>
              <input
                type="number"
                min="0"
                max="59"
                value={placeData.duration.minutes}
                onChange={(e) => setPlaceData(prev => ({
                  ...prev,
                  duration: { ...prev.duration, minutes: parseInt(e.target.value) || 0 }
                }))}
                placeholder="분"
              />
              <span>분</span>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>첨부 사진</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoUpload}
              id="placePhotos"
              className={styles.fileInput}
            />
            <label htmlFor="placePhotos" className={styles.fileLabel}>
              📷 사진 추가
            </label>
            {placeData.photos.length > 0 && (
              <div className={styles.photoPreview}>
                {placeData.photos.map((photo, index) => (
                  <img key={index} src={photo} alt={`사진 ${index + 1}`} />
                ))}
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>자세한 기록</label>
            <textarea
              value={placeData.review}
              onChange={(e) => setPlaceData(prev => ({ ...prev, review: e.target.value }))}
              placeholder="여행 경험을 자세히 서술해보세요!"
              rows="4"
            />
          </div>

          <button type="submit" className={styles.saveButton}>
            저장
          </button>
        </form>
      </div>
    </div>
  );
};

export default TravelTracking;