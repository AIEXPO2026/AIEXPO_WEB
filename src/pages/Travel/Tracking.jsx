import { useState, useEffect, useRef } from 'react';
import styles from './Tracking.module.css';

const IconClose = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

const IconCamera = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
);

const IconTrash = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
);

const TravelTracking = ({ onFinish, onClose }) => {
  const [isTracking, setIsTracking] = useState(true);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [path, setPath] = useState([]);
  const [visitedPlaces, setVisitedPlaces] = useState([]);
  const [showPlaceModal, setShowPlaceModal] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showFinishConfirm, setShowFinishConfirm] = useState(false);
  const [travelStartTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  
  const mapRef = useRef(null);
  const watchIdRef = useRef(null);
  const googleMapRef = useRef(null);
  const polylineRef = useRef(null);
  const markersRef = useRef([]);

  // 경과 시간 계산
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(Date.now() - travelStartTime);
    }, 1000);
    return () => clearInterval(timer);
  }, [travelStartTime]);

  // 위치 추적
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
        },
        { 
          enableHighAccuracy: true, 
          maximumAge: 0, 
          timeout: 10000 
        }
      );
    }
    
    return () => { 
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [isTracking]);

  // 지도 초기화 및 업데이트
  useEffect(() => {
    if (!currentLocation || !mapRef.current || !window.google) return;
    
    if (!googleMapRef.current) {
      googleMapRef.current = new window.google.maps.Map(mapRef.current, { 
        center: currentLocation, 
        zoom: 16,
        disableDefaultUI: true,
        zoomControl: true
      });
    } else {
      googleMapRef.current.setCenter(currentLocation);
    }
    
    // 경로 그리기
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
    }
    
    polylineRef.current = new window.google.maps.Polyline({ 
      path, 
      strokeColor: '#FF1493', 
      strokeWeight: 4,
      strokeOpacity: 0.8,
      map: googleMapRef.current 
    });
    
    // 마커 제거
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
    
    // 현재 위치 마커
    const currentMarker = new window.google.maps.Marker({ 
      position: currentLocation, 
      map: googleMapRef.current,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: '#4A90E2',
        fillOpacity: 1,
        strokeColor: '#FFFFFF',
        strokeWeight: 2
      }
    });
    
    markersRef.current.push(currentMarker);
    
    // 방문지 마커
    visitedPlaces.forEach((place, index) => {
      const marker = new window.google.maps.Marker({
        position: place.location,
        map: googleMapRef.current,
        label: {
          text: `${index + 1}`,
          color: '#FFFFFF',
          fontSize: '12px',
          fontWeight: 'bold'
        }
      });
      markersRef.current.push(marker);
    });
    
  }, [currentLocation, path, visitedPlaces]);

  const formatElapsedTime = (ms) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    
    if (hours > 0) {
      return `${hours}시간 ${minutes}분`;
    } else if (minutes > 0) {
      return `${minutes}분 ${seconds}초`;
    } else {
      return `${seconds}초`;
    }
  };

  const calculateDistance = () => {
    if (path.length < 2) return 0;
    
    let totalDistance = 0;
    for (let i = 1; i < path.length; i++) {
      const lat1 = path[i - 1].lat;
      const lon1 = path[i - 1].lng;
      const lat2 = path[i].lat;
      const lon2 = path[i].lng;
      
      const R = 6371;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      totalDistance += R * c;
    }
    
    return totalDistance.toFixed(2);
  };

  const handleAddPlace = () => {
    if (!currentLocation) {
      alert('GPS 신호를 기다리는 중입니다.');
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
      id: Date.now(),
      ...placeData, 
      location: selectedPlace.location, 
      arrivalTime: selectedPlace.arrivalTime, 
      departureTime: Date.now() 
    };
    setVisitedPlaces(prev => [...prev, newPlace]);
    setShowPlaceModal(false);
    setSelectedPlace(null);
  };

  const handleRemovePlace = (placeId) => {
    if (window.confirm('이 방문지를 삭제하시겠습니까?')) {
      setVisitedPlaces(prev => prev.filter(p => p.id !== placeId));
    }
  };

  const handleConfirmFinish = () => {
    setIsTracking(false);
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }
    
    const duration = Math.floor((Date.now() - travelStartTime) / 1000 / 60);
    const distance = calculateDistance();
    
    onFinish({ 
      path, 
      visitedPlaces,
      startTime: travelStartTime, 
      endTime: Date.now(),
      duration: `${Math.floor(duration / 60)}시간 ${duration % 60}분`,
      distance: `${distance}km`,
      title: `${new Date().toLocaleDateString()} 여행`,
      period: `${Math.ceil(duration / 1440)}일`
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.mapContainer} ref={mapRef}>
        {!currentLocation && (
          <div className={styles.loadingOverlay}>
            <p>위치 정보를 불러오는 중...</p>
          </div>
        )}
      </div>
      
      <div className={styles.topBar}>
        <button className={styles.closeButton} onClick={onClose}>
          <IconClose />
        </button>
        <div className={styles.trackingInfo}>
          <div className={styles.statusBadge}>
            <span className={isTracking ? styles.dotRed : styles.dotGray}></span>
            {isTracking ? '기록 중' : '정지'}
          </div>
          <span className={styles.placeCount}>
            방문지 <strong>{visitedPlaces.length}</strong>
          </span>
        </div>
      </div>

      <div className={styles.statsBar}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>경과 시간</span>
          <span className={styles.statValue}>{formatElapsedTime(elapsedTime)}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>이동 거리</span>
          <span className={styles.statValue}>{calculateDistance()}km</span>
        </div>
      </div>

      {visitedPlaces.length > 0 && (
        <div className={styles.placesList}>
          <h4>방문한 장소</h4>
          {visitedPlaces.map((place) => (
            <div key={place.id} className={styles.placeItem}>
              <div className={styles.placeInfo}>
                <strong>{place.name}</strong>
                {place.photoFiles && (
                  <span className={styles.photoCount}>📷 {place.photoFiles.length}</span>
                )}
              </div>
              <button 
                className={styles.removeButton}
                onClick={() => handleRemovePlace(place.id)}
                type="button"
              >
                <IconTrash />
              </button>
            </div>
          ))}
        </div>
      )}
      
      <div className={styles.bottomControls}>
        <button className={styles.addPlaceButton} onClick={handleAddPlace}>
          방문지 추가
        </button>
        <button className={styles.finishButton} onClick={() => setShowFinishConfirm(true)}>
          여행 종료
        </button>
      </div>
      
      {showPlaceModal && (
        <PlaceModal 
          onClose={() => {
            setShowPlaceModal(false);
            setSelectedPlace(null);
          }} 
          onSave={handleSavePlace} 
        />
      )}
      
      {showFinishConfirm && (
        <div className={styles.confirmOverlay} onClick={() => setShowFinishConfirm(false)}>
          <div className={styles.confirmModal} onClick={e => e.stopPropagation()}>
            <h3>여행을 마칠까요?</h3>
            <p>지금까지의 기록이 저장됩니다.</p>
            <div className={styles.confirmStats}>
              <div>경과 시간: {formatElapsedTime(elapsedTime)}</div>
              <div>이동 거리: {calculateDistance()}km</div>
              <div>방문 장소: {visitedPlaces.length}곳</div>
            </div>
            <div className={styles.confirmButtons}>
              <button onClick={() => setShowFinishConfirm(false)}>취소</button>
              <button 
                className={styles.confirmFinishButton} 
                onClick={handleConfirmFinish}
              >
                종료하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const PlaceModal = ({ onClose, onSave }) => {
  const [name, setName] = useState('');
  const [review, setReview] = useState('');
  const [photos, setPhotos] = useState([]);
  const [previews, setPreviews] = useState([]);

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    
    const oversized = files.filter(f => f.size > 10 * 1024 * 1024);
    if (oversized.length > 0) {
      alert('10MB 이하의 이미지만 업로드 가능합니다.');
      return;
    }
    
    setPhotos(prev => [...prev, ...files]);

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const handleRemovePhoto = (index) => {
    URL.revokeObjectURL(previews[index]);
    setPhotos(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('장소명을 입력하세요.');
      return;
    }
    
    onSave({ 
      name: name.trim(), 
      review: review.trim(), 
      photoFiles: photos 
    });
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.placeModal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>방문지 기록</h3>
          <button onClick={onClose} type="button">
            <IconClose />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.placeForm}>
          <div className={styles.formGroup}>
            <label>장소 이름 *</label>
            <input 
              type="text" 
              placeholder="예: 경복궁" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required 
              maxLength={50}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>사진 ({photos.length}/10)</label>
            <input 
              type="file" 
              accept="image/*" 
              multiple 
              onChange={handlePhotoChange} 
              id="fileInput" 
              hidden 
              disabled={photos.length >= 10}
            />
            <label 
              htmlFor="fileInput" 
              className={`${styles.fileLabel} ${photos.length >= 10 ? styles.disabled : ''}`}
            >
              <IconCamera /> 
              <span>사진 추가</span>
            </label>
            
            {previews.length > 0 && (
              <div className={styles.photoPreviewGrid}>
                {previews.map((src, i) => (
                  <div key={i} className={styles.photoPreview}>
                    <img src={src} alt={`preview-${i}`} />
                    <button
                      type="button"
                      className={styles.removePhotoButton}
                      onClick={() => handleRemovePhoto(i)}
                    >
                      <IconClose />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>메모</label>
            <textarea 
              placeholder="이곳에서의 경험을 기록해보세요" 
              value={review} 
              onChange={e => setReview(e.target.value)} 
              rows="4"
              maxLength={500}
            />
            <span className={styles.charCount}>{review.length}/500</span>
          </div>
          
          <button type="submit" className={styles.saveButton}>
            기록 저장
          </button>
        </form>
      </div>
    </div>
  );
};

export default TravelTracking;