import { useState, useEffect, useRef } from 'react';
import styles from './Tracking.module.css';

const IconClose = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

const IconCamera = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
);

const IconMap = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>
);

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
  const googleMapRef = useRef(null);

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
          console.error(error);
          alert('위치 정보를 가져올 수 없습니다.');
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
      );
    }

    return () => {
      if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, [isTracking]);

  useEffect(() => {
    if (!currentLocation || !mapRef.current || !window.google) return;

    if (!googleMapRef.current) {
      googleMapRef.current = new window.google.maps.Map(mapRef.current, {
        center: currentLocation,
        zoom: 16,
        disableDefaultUI: true,
      });
    } else {
      googleMapRef.current.setCenter(currentLocation);
    }

    new window.google.maps.Polyline({
      path: path,
      strokeColor: '#4A90E2',
      strokeOpacity: 0.8,
      strokeWeight: 5,
      map: googleMapRef.current
    });

    new window.google.maps.Marker({
      position: currentLocation,
      map: googleMapRef.current,
    });
  }, [currentLocation, path]);

  const handleAddPlace = () => {
    if (!currentLocation) return alert('GPS 신호를 기다리는 중입니다.');
    setSelectedPlace({ location: currentLocation, arrivalTime: Date.now() });
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

  const handleConfirmFinish = () => {
    setIsTracking(false);
    if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
    
    onFinish({ 
      path, 
      visitedPlaces, 
      startTime: path[0]?.timestamp || Date.now(), 
      endTime: Date.now(),
      title: `${new Date().toLocaleDateString()} 여행` 
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.mapContainer} ref={mapRef}>
        {!currentLocation && (
          <div className={styles.mapPlaceholder}>
            <IconMap />
            <p>지도를 불러오는 중입니다</p>
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
            {isTracking ? '기록 중' : '일시정지'}
          </div>
          <span className={styles.placeCount}>
            방문지 <strong>{visitedPlaces.length}</strong>
          </span>
        </div>
      </div>

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
          onClose={() => { setShowPlaceModal(false); setSelectedPlace(null); }}
          onSave={handleSavePlace}
        />
      )}

      {showFinishConfirm && (
        <div className={styles.confirmOverlay} onClick={() => setShowFinishConfirm(false)}>
          <div className={styles.confirmModal} onClick={e => e.stopPropagation()}>
            <h3>여행을 마칠까요?</h3>
            <p>종료 후에는 경로 기록이 중단됩니다.</p>
            <div className={styles.confirmButtons}>
              <button className={styles.cancelButton} onClick={() => setShowFinishConfirm(false)}>취소</button>
              <button className={styles.confirmFinishButton} onClick={handleConfirmFinish}>종료하기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const PlaceModal = ({ onClose, onSave }) => {
  const [placeData, setPlaceData] = useState({ name: '', photos: [], review: '' });

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const photoUrls = files.map(file => URL.createObjectURL(file));
    setPlaceData(prev => ({ ...prev, photos: [...prev.photos, ...photoUrls] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!placeData.name.trim()) return alert('장소명을 입력하세요.');
    onSave(placeData);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.placeModal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>방문지 기록</h3>
          <button onClick={onClose}><IconClose /></button>
        </div>

        <form onSubmit={handleSubmit} className={styles.placeForm}>
          <div className={styles.formGroup}>
            <label>장소 명칭</label>
            <input 
              type="text" 
              value={placeData.name} 
              onChange={(e) => setPlaceData(prev => ({ ...prev, name: e.target.value }))} 
              required 
            />
          </div>

          <div className={styles.formGroup}>
            <label>사진 첨부</label>
            <input 
              type="file" 
              accept="image/*" 
              multiple 
              onChange={handlePhotoUpload} 
              id="placePhotos" 
              className={styles.fileInput} 
            />
            <label htmlFor="placePhotos" className={styles.fileLabel}>
              <IconCamera /> <span>사진 선택</span>
            </label>
            <div className={styles.photoPreview}>
              {placeData.photos.map((photo, index) => <img key={index} src={photo} alt="preview" />)}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>상세 기록</label>
            <textarea 
              value={placeData.review} 
              onChange={(e) => setPlaceData(prev => ({ ...prev, review: e.target.value }))} 
              rows="4" 
            />
          </div>

          <button type="submit" className={styles.saveButton}>기록 저장</button>
        </form>
      </div>
    </div>
  );
};

export default TravelTracking;