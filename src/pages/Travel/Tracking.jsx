import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
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

const IconPin = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);

const GpsErrorBanner = ({ message }) => (
  <div className={styles.gpsErrorBanner}>
    <IconPin /> {message}
  </div>
);

const TravelTracking = ({ onFinish, onClose }) => {
  const [isTracking, setIsTracking] = useState(true);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [gpsError, setGpsError] = useState(null);
  const [mapReady, setMapReady] = useState(false);
  const [path, setPath] = useState([]);
  const [visitedPlaces, setVisitedPlaces] = useState([]);
  const [showPlaceModal, setShowPlaceModal] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showFinishConfirm, setShowFinishConfirm] = useState(false);
  const [isListOpen, setIsListOpen] = useState(true); // 방문지 목록 접기/펼치기
  const [travelStartTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);

  const mapRef = useRef(null);
  const watchIdRef = useRef(null);
  const googleMapRef = useRef(null);
  const polylineRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(Date.now() - travelStartTime);
    }, 1000);
    return () => clearInterval(timer);
  }, [travelStartTime]);

  useEffect(() => {
    if (window.google?.maps) {
      setMapReady(true);
      return;
    }
    const script = document.getElementById('gmap-script');
    if (!script) { setMapReady(false); return; }
    const onLoad = () => setMapReady(true);
    script.addEventListener('load', onLoad);
    return () => script.removeEventListener('load', onLoad);
  }, []);

  useEffect(() => {
    if (!isTracking) return;

    if (!navigator.geolocation) {
      setGpsError('이 브라우저는 위치 추적을 지원하지 않습니다.');
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        setGpsError(null);
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          timestamp: Date.now(),
        };
        setCurrentLocation(newLocation);
        setPath(prev => [...prev, newLocation]);
      },
      (error) => {
        console.warn('위치 추적 오류:', error);
        switch (error.code) {
          case 1: setGpsError('위치 권한이 거부되었습니다. 브라우저 설정에서 허용해주세요.'); break;
          case 2: setGpsError('GPS 신호를 찾을 수 없습니다. 잠시 후 다시 시도합니다.'); break;
          case 3: setGpsError('위치 정보 요청이 시간 초과됐습니다. 재시도 중...'); break;
          default: setGpsError('위치 정보를 가져올 수 없습니다.');
        }
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
    );

    return () => {
      if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, [isTracking]);

  useEffect(() => {
    if (!currentLocation || !mapRef.current || !mapReady || !window.google?.maps) return;

    if (!googleMapRef.current) {
      googleMapRef.current = new window.google.maps.Map(mapRef.current, {
        center: currentLocation,
        zoom: 16,
        disableDefaultUI: true,
        zoomControl: true,
        mapId: 'DEMO_MAP_ID',
      });
    } else {
      googleMapRef.current.setCenter(currentLocation);
    }

    if (polylineRef.current) polylineRef.current.setMap(null);
    polylineRef.current = new window.google.maps.Polyline({
      path,
      strokeColor: '#FFD700',
      strokeWeight: 4,
      strokeOpacity: 0.8,
      map: googleMapRef.current,
    });

    // 기존 마커 제거
    markersRef.current.forEach(m => { m.map = null; });
    markersRef.current = [];

    const { AdvancedMarkerElement } = window.google.maps.marker;

    // 현재 위치 마커 (파란 원)
    const currentDot = document.createElement('div');
    currentDot.style.cssText = 'width:16px;height:16px;border-radius:50%;background:#4A90E2;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3);';
    markersRef.current.push(new AdvancedMarkerElement({
      position: currentLocation,
      map: googleMapRef.current,
      content: currentDot,
    }));

    // 열려있는 InfoWindow 추적
    let openInfoWindow = null;

    visitedPlaces.forEach((place, index) => {
      if (!place.location) return;

      // 번호 뱃지 마커
      const pin = document.createElement('div');
      pin.style.cssText = 'width:28px;height:28px;border-radius:50%;background:#FFD700;color:#1a1a1a;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,0.25);border:2px solid #fff;cursor:pointer;';
      pin.textContent = `${index + 1}`;

      const marker = new AdvancedMarkerElement({
        position: place.location,
        map: googleMapRef.current,
        content: pin,
      });

      // InfoWindow 콘텐츠
      const arrivalStr = new Date(place.arrivalTime).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
      const photoLine = place.photoFiles?.length > 0
        ? `<div style="display:flex;align-items:center;gap:4px;color:#B8860B;font-size:12px;margin-top:4px"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#B8860B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg> 사진 ${place.photoFiles.length}장</div>`
        : '';
      const reviewLine = place.review
        ? `<div style="color:#555;font-size:12px;margin-top:4px;line-height:1.5">${place.review}</div>`
        : '';

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="font-family:'Pretendard',sans-serif;min-width:160px;max-width:220px;padding:4px 2px;">
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
              <span style="background:#FFD700;color:#1a1a1a;font-size:11px;font-weight:700;padding:2px 7px;border-radius:20px;">${index + 1}</span>
              <strong style="font-size:15px;color:#1a1a1a">${place.name}</strong>
            </div>
            <div style="display:flex;align-items:center;gap:4px;color:#999;font-size:11px"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> ${arrivalStr} 도착</div>
            ${reviewLine}
            ${photoLine}
          </div>
        `,
      });

      // 클릭 시 토글
      marker.addListener('click', () => {
        if (openInfoWindow === infoWindow) {
          infoWindow.close();
          openInfoWindow = null;
          return;
        }
        if (openInfoWindow) openInfoWindow.close();
        infoWindow.open({ map: googleMapRef.current, anchor: marker });
        openInfoWindow = infoWindow;
      });

      // hover 시 열기
      marker.element.addEventListener('mouseenter', () => {
        if (openInfoWindow && openInfoWindow !== infoWindow) openInfoWindow.close();
        infoWindow.open({ map: googleMapRef.current, anchor: marker });
        openInfoWindow = infoWindow;
      });

      markersRef.current.push(marker);
    });
  }, [currentLocation, path, visitedPlaces, mapReady]);

  const formatElapsedTime = (ms) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    if (hours > 0) return `${hours}시간 ${minutes}분`;
    if (minutes > 0) return `${minutes}분 ${seconds}초`;
    return `${seconds}초`;
  };

  const calculateDistance = () => {
    if (path.length < 2) return 0;
    let totalDistance = 0;
    for (let i = 1; i < path.length; i++) {
      const lat1 = path[i - 1].lat, lon1 = path[i - 1].lng;
      const lat2 = path[i].lat, lon2 = path[i].lng;
      const R = 6371;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
      totalDistance += R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }
    return totalDistance.toFixed(2);
  };

  const handleAddPlace = () => {
    setSelectedPlace({ location: currentLocation ?? null, arrivalTime: Date.now() });
    setShowPlaceModal(true);
  };

  const handleSavePlace = (placeData) => {
    setVisitedPlaces(prev => [...prev, {
      id: Date.now(), ...placeData,
      location: selectedPlace.location,
      arrivalTime: selectedPlace.arrivalTime,
      departureTime: Date.now(),
    }]);
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
    if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
    const duration = Math.floor((Date.now() - travelStartTime) / 1000 / 60);
    onFinish({
      path,
      visitedPlaces,
      startTime: travelStartTime,
      endTime: Date.now(),
      duration: `${Math.floor(duration / 60)}시간 ${duration % 60}분`,
      distance: `${calculateDistance()}km`,
      title: `${new Date().toLocaleDateString()} 여행`,
      period: `${Math.ceil(duration / 1440)}일`,
    });
  };

  const content = (
    <div className={styles.container}>
      <div className={styles.mapContainer} ref={mapRef}>
        {gpsError && <GpsErrorBanner message={gpsError} />}
        {!currentLocation && !gpsError && (
          <div className={styles.loadingOverlay}>
            <p>위치 정보를 불러오는 중...</p>
          </div>
        )}
        {currentLocation && !mapReady && (
          <div className={styles.loadingOverlay}>
            <p>지도를 불러오는 중...</p>
          </div>
        )}
      </div>

      <div className={styles.topBar}>
        <button className={styles.closeButton} onClick={onClose} type="button">
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
          <button
            type="button"
            className={styles.placesHeader}
            onClick={() => setIsListOpen(prev => !prev)}
          >
            <div className={styles.placesHeaderLeft}>
              <span className={styles.placesTitle}>방문한 장소</span>
              <span className={styles.placesCount}>{visitedPlaces.length}</span>
            </div>
            <svg
              width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ transform: isListOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          {isListOpen && (
            <div className={styles.placesTimeline}>
            {visitedPlaces.map((place, index) => (
              <div key={place.id} className={styles.placeRow}>
                <div className={styles.timelineCol}>
                  <div className={styles.timelineDot}>{index + 1}</div>
                  {index < visitedPlaces.length - 1 && <div className={styles.timelineLine} />}
                </div>
                <div className={styles.placeCard} style={{ animationDelay: `${index * 0.07}s` }}>
                  <div className={styles.placeCardInner}>
                    <div className={styles.placeCardLeft}>
                      <span className={styles.placeName}>{place.name}</span>
                      {place.review && <span className={styles.placeReview}>{place.review}</span>}
                      <span className={styles.placeTime}>
                        {new Date(place.arrivalTime).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className={styles.placeCardRight}>
                      {place.photoFiles?.length > 0 && (
                        <div className={styles.photoBadge}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#B8860B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" />
                          </svg>
                          <span className={styles.photoBadgeCount}>{place.photoFiles.length}</span>
                        </div>
                      )}
                      <button className={styles.removeButton} onClick={() => handleRemovePlace(place.id)} type="button">
                        <IconTrash />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      )}

      <div className={styles.bottomControls}>
        <button className={styles.addPlaceButton} onClick={handleAddPlace} type="button">
          방문지 추가
        </button>
        <button className={styles.finishButton} onClick={() => setShowFinishConfirm(true)} type="button">
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
            <p>지금까지의 기록이 저장됩니다.</p>
            <div className={styles.confirmStats}>
              <div>경과 시간: {formatElapsedTime(elapsedTime)}</div>
              <div>이동 거리: {calculateDistance()}km</div>
              <div>방문 장소: {visitedPlaces.length}곳</div>
            </div>
            <div className={styles.confirmButtons}>
              <button type="button" onClick={() => setShowFinishConfirm(false)}>취소</button>
              <button type="button" className={styles.confirmFinishButton} onClick={handleConfirmFinish}>
                종료하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return document.body ? createPortal(content, document.body) : content;
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
    if (oversized.length > 0) { alert('10MB 이하의 이미지만 업로드 가능합니다.'); return; }
    setPhotos(prev => [...prev, ...files]);
    setPreviews(prev => [...prev, ...files.map(file => URL.createObjectURL(file))]);
  };

  const handleRemovePhoto = (index) => {
    URL.revokeObjectURL(previews[index]);
    setPhotos(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) { alert('장소명을 입력하세요.'); return; }
    onSave({ name: name.trim(), review: review.trim(), photoFiles: photos });
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.placeModal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>방문지 기록</h3>
          <button onClick={onClose} type="button"><IconClose /></button>
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
            <label htmlFor="fileInput" className={`${styles.fileLabel} ${photos.length >= 10 ? styles.disabled : ''}`}>
              <IconCamera /><span>사진 추가</span>
            </label>
            {previews.length > 0 && (
              <div className={styles.photoPreviewGrid}>
                {previews.map((src, i) => (
                  <div key={i} className={styles.photoPreview}>
                    <img src={src} alt={`preview-${i}`} />
                    <button type="button" className={styles.removePhotoButton} onClick={() => handleRemovePhoto(i)}>
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
          <button type="submit" className={styles.saveButton}>기록 저장</button>
        </form>
      </div>
    </div>
  );
};

export default TravelTracking;