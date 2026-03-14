import { useState, useEffect } from 'react';
import styles from './Travel.module.css';
import BottomNav from '../../components/BottomNav/BottomNav';
import TravelModal from './TravelModal';
import TravelTracking from './Tracking';
import { getTravels, startTravel, finishTravel, editTravel, getAttractions, addAttraction } from '../../api/travelApi';
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
  script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=marker&loading=async`;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
}

// ─── TravelEmptyState ─────────────────────────────────────────────────────────
const TravelEmptyState = () => (
  <div className={styles.emptyContainer}>
    <svg width="100%" viewBox="0 0 680 420" xmlns="http://www.w3.org/2000/svg">
      {/* 지도 배경 */}
      <rect x="180" y="60" width="320" height="210" rx="16" fill="#FAC775" fillOpacity="0.18" stroke="#EF9F27" strokeWidth="0.5" strokeOpacity="0.18"/>

      {/* 지도 격자선 */}
      {[90,120,150,180,210].map(y => (
        <line key={`h${y}`} x1="200" y1={y} x2="480" y2={y} stroke="currentColor" strokeWidth="0.5" opacity="0.12"/>
      ))}
      {[240,290,340,390,440].map(x => (
        <line key={`v${x}`} x1={x} y1="70" x2={x} y2="260" stroke="currentColor" strokeWidth="0.5" opacity="0.12"/>
      ))}

      {/* 점선 여행 경로 */}
      <path d="M250 220 Q280 170 310 190 Q340 210 370 150 Q395 110 430 130"
        fill="none" stroke="#EF9F27" strokeWidth="2" strokeDasharray="6 5" opacity="0.55"/>

      {/* 경로 포인트 */}
      <circle cx="250" cy="220" r="5" fill="#EF9F27" opacity="0.5"/>
      <circle cx="310" cy="190" r="5" fill="#EF9F27" opacity="0.5"/>
      <circle cx="370" cy="150" r="5" fill="#EF9F27" opacity="0.5"/>

      {/* 목적지 핀 */}
      <ellipse cx="430" cy="148" rx="10" ry="4" fill="rgba(0,0,0,0.1)" opacity="0.4"/>
      <path d="M430 90 C418 90 410 99 410 110 C410 128 430 145 430 145 C430 145 450 128 450 110 C450 99 442 90 430 90Z"
        fill="#EF9F27" stroke="#BA7517" strokeWidth="0.8"/>
      <circle cx="430" cy="111" r="6" fill="white" opacity="0.85"/>

      {/* 돋보기 */}
      <circle cx="476" cy="238" r="14" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.35"/>
      <line x1="486" y1="248" x2="496" y2="258" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.35"/>

      {/* 나무 */}
      <g opacity="0.25">
        <polygon points="215,195 225,170 235,195" fill="currentColor"/>
        <rect x="223" y="195" width="4" height="8" fill="currentColor"/>
        <polygon points="205,210 213,190 221,210" fill="currentColor"/>
        <rect x="211" y="210" width="3" height="6" fill="currentColor"/>
      </g>

      {/* 구름 왼쪽 */}
      <g opacity="0.12">
        <ellipse cx="155" cy="155" rx="22" ry="12" fill="currentColor"/>
        <ellipse cx="140" cy="158" rx="14" ry="10" fill="currentColor"/>
        <ellipse cx="170" cy="158" rx="14" ry="10" fill="currentColor"/>
      </g>

      {/* 구름 오른쪽 */}
      <g opacity="0.1">
        <ellipse cx="530" cy="200" rx="18" ry="10" fill="currentColor"/>
        <ellipse cx="517" cy="202" rx="11" ry="8" fill="currentColor"/>
        <ellipse cx="543" cy="202" rx="11" ry="8" fill="currentColor"/>
      </g>

      {/* 별 장식 왼쪽 */}
      <g opacity="0.2">
        <line x1="155" y1="80" x2="175" y2="100" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="148" y1="95" x2="162" y2="95" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
        <line x1="170" y1="75" x2="170" y2="88" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
      </g>

      {/* 별 장식 오른쪽 */}
      <g opacity="0.15">
        <line x1="500" y1="72" x2="516" y2="88" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="495" y1="84" x2="506" y2="84" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
        <line x1="514" y1="68" x2="514" y2="78" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
      </g>

      {/* 텍스트 */}
      <text x="340" y="310" textAnchor="middle" fontSize="17" fontWeight="500" fill="currentColor" opacity="0.9">
        아직 여행 기록이 없어요
      </text>
      <text x="340" y="336" textAnchor="middle" fontSize="13" fill="currentColor" opacity="0.5">
        새로운 여행을 시작하고 소중한 순간을 기록해보세요
      </text>
    </svg>
  </div>
);

// ─── 유틸: 경과 시간(ms) → "N시간 M분" 문자열 ────────────────────────────────
const formatDuration = (ms) => {
  const totalMinutes = Math.floor(ms / 1000 / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}시간 ${minutes}분`;
};

// ─── StatCard ─────────────────────────────────────────────────────────────────
const StatCardComponent = ({ icon, number, label }) => (
  <div className={styles.statCard}>
    <div className={styles.statIcon}><img src={icon} alt={label} /></div>
    <div className={styles.statNumber}>{number}</div>
    <div className={styles.statLabel}>{label}</div>
  </div>
);

// ─── TravelCard ───────────────────────────────────────────────────────────────
const TravelCardComponent = ({ travel, onEdit }) => {
  const getTagColors = (tag) => {
    const colorMap = {
      '힐링': { bg: '#E3F2FD', text: '#1976D2' },
      '자연': { bg: '#E8F5E9', text: '#388E3C' },
      '맛집': { bg: '#FFF3E0', text: '#F57C00' },
    };
    return colorMap[tag] || { bg: '#F3E5F5', text: '#7B1FA2' };
  };

  const dateRange =
    travel.startDate && travel.endDate
      ? `${travel.startDate} - ${travel.endDate}`
      : travel.dateRange || '';

  return (
    <div className={styles.travelCard}>
      <div className={styles.travelImage}>
        {travel.thumbnailUrl && (
          <img src={travel.thumbnailUrl} alt={travel.title} />
        )}
      </div>
      <div className={styles.travelInfo}>
        <div className={styles.travelHeader}>
          <h3 className={styles.travelTitle}>{travel.title || '여행'}</h3>
          <button
            className={styles.editButton}
            type="button"
            onClick={() => onEdit(travel)}
          >
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
              <span
                key={index}
                className={styles.tag}
                style={{ backgroundColor: colors.bg, color: colors.text }}
              >
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

// ─── VisitedPlacesSummary ─────────────────────────────────────────────────────
const VisitedPlacesSummary = ({
  visitedPlaces,
  travelInfo,
  onClose,
  onSaveTravel,
  isSaving,
}) => (
  <div className={styles.summaryOverlay} onClick={onClose}>
    <div
      className={styles.summaryModal}
      onClick={(e) => e.stopPropagation()}
    >
      <div className={styles.summaryHeader}>
        <h2 className={styles.summaryTitle}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ marginRight: '6px', verticalAlign: 'middle' }}
          >
            <polygon points="3 11 22 2 13 21 11 13 3 11" />
          </svg>
          여행 경유지 기록
        </h2>
        <button
          className={styles.closeButton}
          onClick={onClose}
          type="button"
          disabled={isSaving}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className={styles.summaryStats}>
        <div className={styles.summaryStat}>
          <span className={styles.summaryStatValue}>
            {travelInfo?.duration || '-'}
          </span>
          <span className={styles.summaryStatLabel}>여행 시간</span>
        </div>
        <div className={styles.summaryStat}>
          <span className={styles.summaryStatValue}>
            {travelInfo?.distance || '-'}
          </span>
          <span className={styles.summaryStatLabel}>이동 거리</span>
        </div>
        <div className={styles.summaryStat}>
          <span className={styles.summaryStatValue}>
            {visitedPlaces.length}곳
          </span>
          <span className={styles.summaryStatLabel}>방문 장소</span>
        </div>
      </div>

      {visitedPlaces.length === 0 ? (
        <div className={styles.summaryEmpty}>
          <p>기록된 경유지가 없습니다.</p>
        </div>
      ) : (
        <div className={styles.summaryPlaceList}>
          {visitedPlaces.map((place, index) => (
            <div key={place.id} className={styles.summaryPlaceItem}>
              <div className={styles.summaryPlaceIndex}>{index + 1}</div>
              <div className={styles.summaryPlaceContent}>
                <div className={styles.summaryPlaceName}>{place.name}</div>
                {place.review && (
                  <div className={styles.summaryPlaceReview}>
                    {place.review}
                  </div>
                )}
                {place.photoFiles?.length > 0 && (
                  <div className={styles.summaryPlacePhotos}>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ marginRight: '4px', verticalAlign: 'middle' }}
                    >
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                    사진 {place.photoFiles.length}장
                  </div>
                )}
                <div className={styles.summaryPlaceTime}>
                  {new Date(place.arrivalTime).toLocaleTimeString('ko-KR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}{' '}
                  도착
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className={styles.summaryActions}>
        <button
          type="button"
          className={styles.summaryEditButton}
          onClick={onSaveTravel}
          disabled={isSaving}
        >
          {isSaving ? '저장 중...' : '여행 기록 저장하기'}
        </button>
      </div>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
function TravelRecordManagement() {
  const [travelData, setTravelData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingTravel, setEditingTravel] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTrackingActive, setIsTrackingActive] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [finishedTravelData, setFinishedTravelData] = useState(null);
  const [isSavingAttractions, setIsSavingAttractions] = useState(false);
  // startTravel 응답에서 받은 여행 id를 저장
  // → finishTravel 응답에 id가 없으므로 여기서 미리 확보해둠
  const [currentTravelId, setCurrentTravelId] = useState(null);

  const [totalPlaces, setTotalPlaces] = useState(0);
  const [totalPhotos, setTotalPhotos] = useState(0);

  useEffect(() => {
    fetchTravelData();
  }, []);

  // ── 여행 목록 + 통계 조회 ────────────────────────────────────────────────
  const fetchTravelData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getTravels();
      const travels = res.data ?? [];
      setTravelData(travels);

      let placesCount = 0;
      let photosCount = 0;
      for (const travel of travels) {
        if (travel.id) {
          try {
            const attractions = await getAttractions(travel.id);
            const list = attractions.data ?? [];
            placesCount += list.length;
            list.forEach((a) => {
              if (a.photoURL) photosCount += 1;
            });
          } catch (err) {
            console.warn(
              `여행 ${travel.id}의 방문지 조회 실패:`,
              err.message,
            );
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

  // ── 여행 수정 모달 ───────────────────────────────────────────────────────
  const handleEdit = (travel) => {
    setEditingTravel(travel);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTravel(null);
  };

  const handleSave = async (updatedData) => {
    // avg_weather: 배열이면 join, 문자열이면 그대로, 비어있으면 '맑음'
    const weatherStr =
      Array.isArray(updatedData.weather) && updatedData.weather.length > 0
        ? updatedData.weather.join(',')
        : typeof updatedData.avg_weather === 'string' && updatedData.avg_weather.trim()
        ? updatedData.avg_weather.trim()
        : typeof updatedData.avgWeather === 'string' && updatedData.avgWeather.trim()
        ? updatedData.avgWeather.trim()
        : '맑음';

    try {
      await editTravel(editingTravel.id, {
        people_count: Number(
          updatedData.companionCount ?? updatedData.peopleCount ?? 1,
        ),
        // mood: 0~4 범위 강제 (MOOD_OPTIONS와 1:1 매핑)
        mood: Math.min(Math.max(Number(updatedData.mood ?? 0), 0), 4),
        avg_weather: weatherStr,
        public_travel: Boolean(
          updatedData.isPublic ?? updatedData.publicTravel ?? false,
        ),
      });
      alert('여행 기록이 수정되었습니다.');
      await fetchTravelData();
      handleCloseModal();
    } catch (err) {
      console.error(
        '여행 수정 실패:',
        err.message,
        err?.response?.data,
      );
      alert(`수정에 실패했습니다. (${err?.response?.status ?? err.message})`);
    }
  };

  // ── 여행 추적 시작 ───────────────────────────────────────────────────────
  const handleStartTracking = async () => {
    if (isTrackingActive) return;

    // 혹시 진행 중인 여행이 있으면 먼저 종료
    try {
      await finishTravel();
    } catch (_) {
      // 진행 중인 여행 없으면 무시
    }

    setIsTrackingActive(true);
    setCurrentTravelId(null); // 이전 여행 id 초기화

    // ★ 핵심: startTravel 응답에서 여행 id를 미리 저장
    // /travel/finish 응답에 id가 없기 때문에,
    // 여행 시작 시점에 id를 확보해두지 않으면 종료 후 엉뚱한 여행이 수정될 수 있음
    startTravel({
      budget_min: 1000,
      budget_max: 2147483647,
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date().toISOString().split('T')[0],
      people_count: 1,
    }).then((res) => {
      const id = res?.data?.id ?? res?.id ?? null;
      if (id) {
        setCurrentTravelId(id);
      } else {
        console.warn('[startTravel] 응답에 id 없음 — 종료 후 목록 재조회 fallback 사용');
      }
    }).catch((e) => {
      console.warn(
        'startTravel 실패:',
        e?.response?.data?.error?.code ?? e.message,
      );
    });
  };

  // ── 여행 추적 종료 ───────────────────────────────────────────────────────
  const handleFinishTracking = async (data) => {
    try {
      await finishTravel();
    } catch (err) {
      console.warn('finishTravel 실패:', err.message, err?.response?.data);
    } finally {
      setIsTrackingActive(false);
      // currentTravelId: startTravel 응답에서 확보한 id (가장 신뢰할 수 있는 값)
      // 없으면 handleSummaryProceed에서 목록 재조회 fallback 사용
      setFinishedTravelData({ ...data, travelId: currentTravelId });
      setShowSummary(true);
    }
  };

  // ── 방문지 서버 저장 후 수정 모달 오픈 ──────────────────────────────────
  const handleSummaryProceed = async () => {
    setIsSavingAttractions(true);

    try {
      // 1. 완료된 여행 ID 확보 (finishTravel 응답에 id 없는 경우 목록에서 재조회)
      let travelId = finishedTravelData?.travelId ?? null;

      if (!travelId) {
        const res = await getTravels();
        const travels = res.data ?? [];

        // travelStatus 필드명은 백엔드마다 다를 수 있으므로 여러 케이스 대응
        // 가능한 값: 'TRAVEL_FINISHED', 'FINISHED', 'COMPLETED', 'END'
        const FINISHED_STATUSES = new Set([
          'TRAVEL_FINISHED',
          'FINISHED',
          'COMPLETED',
          'END',
        ]);

        const latestFinished = [...travels]
          .reverse()
          .find(
            (t) =>
              FINISHED_STATUSES.has(t.travelStatus) ||
              FINISHED_STATUSES.has(t.status),
          );

        // fallback: 완료 상태 판별 불가 시 가장 최근 여행
        const target = latestFinished ?? travels[travels.length - 1];

        if (!target?.id) {
          alert(
            '여행 정보를 불러오지 못했습니다. 목록에서 직접 수정해주세요.',
          );
          await fetchTravelData();
          setShowSummary(false);
          setFinishedTravelData(null);
          return;
        }

        travelId = target.id;
        setTravelData(travels);
      }

      // 2. 방문지(attractions) 서버 저장
      const visitedPlaces = finishedTravelData?.visitedPlaces ?? [];
      const attractionErrors = [];

      for (const place of visitedPlaces) {
        try {
          const durationMs =
            (place.departureTime ?? Date.now()) - (place.arrivalTime ?? Date.now());
          const totalSeconds = Math.max(Math.floor(durationMs / 1000), 0);
          const hour = Math.floor(totalSeconds / 3600);
          const minute = Math.floor((totalSeconds % 3600) / 60);
          const second = totalSeconds % 60;

          // 사진은 첫 번째 파일만 전송 (API가 file 하나만 받음)
          const file =
            place.photoFiles?.length > 0 ? place.photoFiles[0] : null;

          await addAttraction(travelId, {
            duration: { hour, minute, second, nano: 0 },
            detail: place.review ?? place.name ?? '',
            file,
          });
        } catch (err) {
          console.warn(
            `방문지 "${place.name}" 저장 실패:`,
            err.message,
            err?.response?.data,
          );
          attractionErrors.push(place.name);
        }
      }

      if (attractionErrors.length > 0) {
        console.warn('일부 방문지 저장 실패:', attractionErrors);
        // 치명적 오류는 아니므로 계속 진행
      }

      // 3. 수정 모달 오픈
      const latestRes = await getTravels();
      const latestTravels = latestRes.data ?? [];
      const targetTravel =
        latestTravels.find((t) => t.id === travelId) ??
        latestTravels[latestTravels.length - 1];

      if (targetTravel) {
        setTravelData(latestTravels);
        setEditingTravel({ ...targetTravel, ...finishedTravelData, id: targetTravel.id });
        setShowSummary(false);
        setFinishedTravelData(null);
        setIsModalOpen(true);
      } else {
        alert('여행 정보를 불러오지 못했습니다. 목록에서 직접 수정해주세요.');
        await fetchTravelData();
        setShowSummary(false);
        setFinishedTravelData(null);
      }
    } catch (err) {
      console.warn('handleSummaryProceed 실패:', err.message);
      alert('여행 정보를 불러오지 못했습니다. 목록에서 직접 수정해주세요.');
      await fetchTravelData();
      setShowSummary(false);
      setFinishedTravelData(null);
    } finally {
      setIsSavingAttractions(false);
    }
  };

  const handleSummaryClose = () => {
    if (isSavingAttractions) return; // 저장 중에는 닫기 방지
    setShowSummary(false);
    setFinishedTravelData(null);
  };

  // ── Render ───────────────────────────────────────────────────────────────
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
          <p className={styles.bannerSubtitle}>
            위치 추적을 시작하고 새로운 여행을 기록하세요
          </p>
        </div>
        <div className={styles.arrowIcon}>›</div>
      </button>

      <div className={styles.statsContainer}>
        <StatCardComponent
          icon={MapIcon}
          number={travelData.length}
          label="총 여행"
        />
        <StatCardComponent
          icon={PlaceIcon}
          number={totalPlaces}
          label="방문 장소"
        />
        <StatCardComponent
          icon={ImgIcon}
          number={totalPhotos}
          label="남긴 사진"
        />
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>내 여행 기록</h2>
        {loading ? (
          <div className={styles.statusContainer}>
            <p>로딩 중...</p>
          </div>
        ) : error ? (
          <div className={styles.statusContainer}>
            <p className={styles.errorText}>{error}</p>
          </div>
        ) : travelData.length === 0 ? (
          <TravelEmptyState />
        ) : (
          <div className={styles.travelList}>
            {travelData.map((travel) => (
              <TravelCardComponent
                key={travel.id}
                travel={travel}
                onEdit={handleEdit}
              />
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <TravelModal
          travel={editingTravel}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}

      {isTrackingActive && (
        <TravelTracking
          onFinish={handleFinishTracking}
          onClose={() => setIsTrackingActive(false)}
        />
      )}

      {showSummary && finishedTravelData && (
        <VisitedPlacesSummary
          visitedPlaces={finishedTravelData.visitedPlaces || []}
          travelInfo={finishedTravelData}
          onClose={handleSummaryClose}
          onSaveTravel={handleSummaryProceed}
          isSaving={isSavingAttractions}
        />
      )}

      <BottomNav activePage="travel" />
    </div>
  );
}

export default TravelRecordManagement;