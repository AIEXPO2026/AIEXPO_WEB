import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Travel.module.css';
import BottomNav from '../../components/BottomNav/BottomNav';
import TravelModal from './TravelModal';
import TravelTracking from './Tracking';
import { getTravels, startTravel, finishTravel, editTravel, getAttractions } from '../../api/travelApi';
import MapIcon from '../../assets/map-icon.svg';
import PlaceIcon from '../../assets/place-icon.svg';
import ImgIcon from '../../assets/img-icon.svg';
import EditIcon from '../../assets/edit-icon.svg';
import TimeIcon from '../../assets/time-icon.svg';
import PeopleIcon from '../../assets/people-icon.svg';
import SplaceIcon from '../../assets/smollPlace-icon.svg';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// 페이지 진입 즉시 Google Maps 로드 시작
if (typeof window !== 'undefined' && !window.google && !document.getElementById('gmap-script')) {
  const script = document.createElement('script');
  script.id = 'gmap-script';
  script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,marker&loading=async`;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
}

const StatCardComponent = ({ icon, number, label }) => (
  <div className={styles.statCard}>
    <div className={styles.statIcon}><img src={icon} alt={label} /></div>
    <div className={styles.statNumber}>{number}</div>
    <div className={styles.statLabel}>{label}</div>
  </div>
);

const TravelCardComponent = ({ travel, onEdit }) => {
  const getTagColors = (tag) => {
    const colorMap = {
      '힐링': { bg: '#E3F2FD', text: '#1976D2' },
      '자연': { bg: '#E8F5E9', text: '#388E3C' },
      '맛집': { bg: '#FFF3E0', text: '#F57C00' },
    };
    return colorMap[tag] || { bg: '#F3E5F5', text: '#7B1FA2' };
  };

  const dateRange = travel.startDate && travel.endDate
    ? `${travel.startDate} - ${travel.endDate}`
    : travel.dateRange || '';

  return (
    <div className={styles.travelCard}>
      <div className={styles.travelImage}>
        {travel.thumbnailUrl && <img src={travel.thumbnailUrl} alt={travel.title} />}
      </div>
      <div className={styles.travelInfo}>
        <div className={styles.travelHeader}>
          <h3 className={styles.travelTitle}>{travel.title || '여행'}</h3>
          <button className={styles.editButton} type="button" onClick={() => onEdit(travel)}>
            <img src={EditIcon} alt="edit" />
          </button>
        </div>
        <div className={styles.travelMeta}>
          <div className={styles.metaItem}>
            <img src={TimeIcon} alt="time" className={styles.metaIcon} />
            <span>{travel.duration || '-'}</span>
          </div>
          <div className={styles.metaItem}>
            <img src={SplaceIcon} alt="place" className={styles.metaIcon} />
            <span>{travel.places || '-'}곳</span>
          </div>
          <div className={styles.metaItem}>
            <img src={PeopleIcon} alt="people" className={styles.metaIcon} />
            <span>{travel.peopleCount ?? travel.people ?? '-'}명</span>
          </div>
        </div>
        <div className={styles.tagContainer}>
          {travel.tags?.map((tag, index) => {
            const colors = getTagColors(tag);
            return (
              <span key={index} className={styles.tag} style={{ backgroundColor: colors.bg, color: colors.text }}>
                #{tag}
              </span>
            );
          })}
        </div>
        <div className={styles.dateRange}>{dateRange}</div>
      </div>
    </div>
  );
};

const VisitedPlacesSummary = ({ visitedPlaces, travelInfo, onClose, onSaveTravel }) => (
  <div className={styles.summaryOverlay} onClick={onClose}>
    <div className={styles.summaryModal} onClick={(e) => e.stopPropagation()}>
      <div className={styles.summaryHeader}>
        <h2 className={styles.summaryTitle}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'6px',verticalAlign:'middle'}}>
            <polygon points="3 11 22 2 13 21 11 13 3 11"/>
          </svg>
          여행 경유지 기록
        </h2>
        <button className={styles.closeButton} onClick={onClose} type="button">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
      <div className={styles.summaryStats}>
        <div className={styles.summaryStat}>
          <span className={styles.summaryStatValue}>{travelInfo?.duration || '-'}</span>
          <span className={styles.summaryStatLabel}>여행 시간</span>
        </div>
        <div className={styles.summaryStat}>
          <span className={styles.summaryStatValue}>{travelInfo?.distance || '-'}</span>
          <span className={styles.summaryStatLabel}>이동 거리</span>
        </div>
        <div className={styles.summaryStat}>
          <span className={styles.summaryStatValue}>{visitedPlaces.length}곳</span>
          <span className={styles.summaryStatLabel}>방문 장소</span>
        </div>
      </div>
      {visitedPlaces.length === 0 ? (
        <div className={styles.summaryEmpty}><p>기록된 경유지가 없습니다.</p></div>
      ) : (
        <div className={styles.summaryPlaceList}>
          {visitedPlaces.map((place, index) => (
            <div key={place.id} className={styles.summaryPlaceItem}>
              <div className={styles.summaryPlaceIndex}>{index + 1}</div>
              <div className={styles.summaryPlaceContent}>
                <div className={styles.summaryPlaceName}>{place.name}</div>
                {place.review && <div className={styles.summaryPlaceReview}>{place.review}</div>}
                {place.photoFiles?.length > 0 && (
                  <div className={styles.summaryPlacePhotos}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'4px',verticalAlign:'middle'}}>
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>
                    </svg>
                    사진 {place.photoFiles.length}장
                  </div>
                )}
                <div className={styles.summaryPlaceTime}>
                  {new Date(place.arrivalTime).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })} 도착
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className={styles.summaryActions}>
        <button type="button" className={styles.summaryEditButton} onClick={onSaveTravel}>
          여행 기록 저장하기
        </button>
      </div>
    </div>
  </div>
);

function TravelRecordManagement() {
  const navigate = useNavigate();
  const [travelData, setTravelData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingTravel, setEditingTravel] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTrackingActive, setIsTrackingActive] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [finishedTravelData, setFinishedTravelData] = useState(null);

  // 통계 데이터
  const [totalPlaces, setTotalPlaces] = useState(0);
  const [totalPhotos, setTotalPhotos] = useState(0);

  useEffect(() => {
    fetchTravelData();
  }, []);

  const fetchTravelData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getTravels();
      const travels = res.data ?? [];
      setTravelData(travels);

      // 총 방문 장소 / 사진 수 집계
      let placesCount = 0;
      let photosCount = 0;
      for (const travel of travels) {
        if (travel.id) {
          try {
            const attractions = await getAttractions(travel.id);
            const list = attractions.data ?? [];
            placesCount += list.length;
            list.forEach(a => { if (a.photoURL) photosCount += 1; });
          } catch (err) {
            console.warn(`여행 ${travel.id}의 방문지 조회 실패:`, err.message);
          }
        }
      }
      setTotalPlaces(placesCount);
      setTotalPhotos(photosCount);

    } catch (err) {
      console.warn('여행 목록 로드 실패 (서버 미연결):', err.message);
      setError('서버에 연결할 수 없습니다. 여행 시작은 가능합니다.');
      setTravelData([]);
      setTotalPlaces(0);
      setTotalPhotos(0);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (travel) => { setEditingTravel(travel); setIsModalOpen(true); };
  const handleCloseModal = () => { setIsModalOpen(false); setEditingTravel(null); };

  const handleSave = async (updatedData) => {
    console.log('[handleSave] updatedData:', updatedData); // 디버그용
    try {
      const weatherStr = Array.isArray(updatedData.weather) && updatedData.weather.length > 0
        ? updatedData.weather.join(',')
        : (updatedData.avg_weather ?? updatedData.avgWeather ?? '맑음'); // 빈 문자열 불가 → 기본값 '맑음'

      await editTravel(editingTravel.id, {
        people_count: Number(updatedData.companionCount ?? updatedData.peopleCount ?? 1),
        mood: Number(updatedData.mood ?? 1),
        avg_weather: weatherStr,
        public_travel: Boolean(updatedData.isPublic ?? updatedData.publicTravel ?? false),
      });
      alert('여행 기록이 수정되었습니다.');
      await fetchTravelData();
      handleCloseModal();
    } catch (err) {
      // 400 원인 파악용 — 응답 body 출력
      console.error('여행 수정 실패:', err.message, err?.response?.data);
      alert(`수정에 실패했습니다. (${err?.response?.status ?? err.message})`);
    }
  };

  const handleStartTracking = async () => {
    if (isTrackingActive) return;

    // TRAVEL_ALREADY_STARTED 대응: 기존 여행 먼저 종료 시도
    try {
      await finishTravel();
      console.log('기존 여행 종료 완료 후 새 여행 시작');
    } catch (_) {
      // 진행 중인 여행 없으면 무시
    }

    // 화면 먼저 전환
    setIsTrackingActive(true);

    // 백그라운드에서 새 여행 시작
    startTravel({
      budget_min: 1000,
      budget_max: 2147483647,
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date().toISOString().split('T')[0],
      people_count: 1,
    }).catch((e) => {
      console.warn('startTravel 백그라운드 실패:', e?.response?.data?.error?.code ?? e.message);
    });
  };

  const handleFinishTracking = async (data) => {
    try {
      await finishTravel();
    } catch (err) {
      console.warn('finishTravel 실패 (오프라인 무시):', err.message);
    } finally {
      setIsTrackingActive(false);
      setFinishedTravelData(data);
      setShowSummary(true);
    }
  };

  const handleSummaryProceed = () => {
    setShowSummary(false);
    setEditingTravel({ id: Date.now(), ...finishedTravelData });
    setIsModalOpen(true);
  };

  const handleSummaryClose = () => {
    setShowSummary(false);
    setFinishedTravelData(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>여행기록 관리</h1>
      </div>

      <button
        type="button"
        className={styles.banner}
        onClick={handleStartTracking}
        disabled={isTrackingActive}
      >
        <div className={styles.playIconWrapper}>▶</div>
        <div className={styles.bannerContent}>
          <h2 className={styles.bannerTitle}>새로운 여행 시작!</h2>
          <p className={styles.bannerSubtitle}>위치 추적을 시작하고 새로운 여행을 기록하세요</p>
        </div>
        <div className={styles.arrowIcon}>›</div>
      </button>

      <button
        type="button"
        className={styles.courseBanner}
        onClick={() => navigate('/travel/course')}
      >
        <div className={styles.courseIconWrapper}>✨</div>
        <div className={styles.bannerContent}>
          <h2 className={styles.bannerTitle}>AI 여행 코스 만들기</h2>
          <p className={styles.bannerSubtitle}>위치를 입력하면 AI가 최적의 코스를 추천해요</p>
        </div>
        <div className={styles.arrowIcon}>›</div>
      </button>

      <div className={styles.statsContainer}>
        <StatCardComponent icon={MapIcon} number={travelData.length} label="총 여행" />
        <StatCardComponent icon={PlaceIcon} number={totalPlaces} label="방문 장소" />
        <StatCardComponent icon={ImgIcon} number={totalPhotos} label="남긴 사진" />
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>내 여행 기록</h2>
        {loading ? (
          <div className={styles.statusContainer}><p>로딩 중...</p></div>
        ) : error ? (
          <div className={styles.statusContainer}>
            <p className={styles.errorText}>{error}</p>
          </div>
        ) : travelData.length === 0 ? (
          <div className={styles.emptyContainer}>
            <p>아직 여행 기록이 없습니다.</p>
            <p>새로운 여행을 시작해보세요!</p>
          </div>
        ) : (
          <div className={styles.travelList}>
            {travelData.map((travel) => (
              <TravelCardComponent key={travel.id} travel={travel} onEdit={handleEdit} />
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <TravelModal travel={editingTravel} onClose={handleCloseModal} onSave={handleSave} />
      )}
      {isTrackingActive && (
        <TravelTracking onFinish={handleFinishTracking} onClose={() => setIsTrackingActive(false)} />
      )}
      {showSummary && finishedTravelData && (
        <VisitedPlacesSummary
          visitedPlaces={finishedTravelData.visitedPlaces || []}
          travelInfo={finishedTravelData}
          onClose={handleSummaryClose}
          onSaveTravel={handleSummaryProceed}
        />
      )}

      <BottomNav activePage="travel" />
    </div>
  );
}

export default TravelRecordManagement;