import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Travel.module.css';
import BottomNav from '../../components/BottomNav/BottomNav';
import TravelModal from './TravelModal';
import TravelTracking from './Tracking';
/* [에러 수정] getTravels를 import에서 제거했습니다. 
  나중에 API가 준비되면 다시 추가하세요.
*/
import { startTravel, finishTravel, editTravel } from '../../api/travelApi'; 

import MapIcon from '../../assets/map-icon.svg';
import PlaceIcon from '../../assets/place-icon.svg';
import ImgIcon from '../../assets/img-icon.svg';
import EditIcon from '../../assets/edit-icon.svg';
import TimeIcon from '../../assets/time-icon.svg';
import PeopleIcon from '../../assets/people-icon.svg';
import SplaceIcon from '../../assets/smollPlace-icon.svg';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const StatCardComponent = ({ icon, number, label }) => (
  <div className={styles.statCard}>
    <div className={styles.statIcon}>
      <img src={icon} alt={label} />
    </div>
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

  return (
    <div className={styles.travelCard}>
      <div className={styles.travelImage}>
        {travel.thumbnailUrl && <img src={travel.thumbnailUrl} alt={travel.title} />}
      </div>
      <div className={styles.travelInfo}>
        <div className={styles.travelHeader}>
          <h3 className={styles.travelTitle}>{travel.title}</h3>
          <button className={styles.editButton} type="button" onClick={() => onEdit(travel)}>
            <img src={EditIcon} alt="edit" />
          </button>
        </div>
        <div className={styles.travelMeta}>
          <div className={styles.metaItem}>
            <img src={TimeIcon} alt="time" className={styles.metaIcon} />
            <span>{travel.duration}</span>
          </div>
          <div className={styles.metaItem}>
            <img src={SplaceIcon} alt="place" className={styles.metaIcon} />
            <span>{travel.places}곳</span>
          </div>
          <div className={styles.metaItem}>
            <img src={PeopleIcon} alt="people" className={styles.metaIcon} />
            <span>{travel.people}명</span>
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
        <div className={styles.dateRange}>{travel.dateRange}</div>
      </div>
    </div>
  );
};

function TravelRecordManagement() {
  const [travelData, setTravelData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingTravel, setEditingTravel] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTrackingActive, setIsTrackingActive] = useState(false);

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google) return;
      const script = document.createElement('script');
      /* [에러 수정] 변수명을 GOOGLE_MAPS_API_KEY로 통일했습니다. */
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    };

    loadGoogleMaps();
    fetchTravelData();
  }, []);
  
  const fetchTravelData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      /* [나중에 API 연결] const data = await getTravels(); setTravelData(data); */
      const mockData = [
        {
          id: 1,
          title: "제주도 푸른 밤 여행",
          duration: "3일",
          places: "12",
          people: "2",
          tags: ["힐링", "자연"],
          dateRange: "2026.02.20 - 2026.02.22",
          thumbnailUrl: "https://images.unsplash.com/photo-1500835595353-b0ad2e58b431?w=400"
        }
      ];
      
      setTravelData(mockData); 
    } catch (error) {
      console.error('Failed to fetch:', error);
      setError("데이터를 불러오지 못했습니다.");
      setTravelData([]); 
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (travel) => {
    setEditingTravel(travel);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTravel(null);
  };

  const handleSave = async (updatedData) => {
    try {
      await editTravel({
        travel_id: editingTravel.id,
        people: updatedData.companionCount,
        mood: updatedData.mood || 1,
        weather_avg: updatedData.weather?.join(',') || '',
        publicTravel: updatedData.isPublic,
      });
      alert('여행 기록이 수정되었습니다.');
      handleCloseModal();
    } catch (error) {
      alert('수정에 실패했습니다.');
    }
  };

  const handleStartTracking = async () => {
    try {
      /* [에러 수정] 서버가 꺼져 있을 경우(ERR_CONNECTION_REFUSED) 
        화면 이동만 가능하도록 try-catch로 감싸져 있습니다. 
      */
      await startTravel({
        budget_min: 0, budget_max: 0,
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date().toISOString().split('T')[0],
        people_count: 1,
      });
      setIsTrackingActive(true);
    } catch (error) {
      console.error('서버 연결 실패, 오프라인 모드로 추적을 시작합니다.');
      setIsTrackingActive(true); // 서버가 없어도 일단 추적 화면은 띄웁니다.
    }
  };

  const handleFinishTracking = async (data) => {
    try {
      await finishTravel(data.title || '새로운 여행', data.period || '1일');
      setIsTrackingActive(false);
      setEditingTravel({ id: Date.now(), ...data });
      setIsModalOpen(true);
    } catch (error) {
      console.error('종료 데이터 전송 실패');
      setIsTrackingActive(false);
      setEditingTravel({ id: Date.now(), ...data });
      setIsModalOpen(true);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>여행기록 관리</h1>
      </div>

      <div className={styles.banner} onClick={handleStartTracking}>
        <div className={styles.playIconWrapper}>▶</div>
        <div className={styles.bannerContent}>
          <h2 className={styles.bannerTitle}>새로운 여행 시작!</h2>
          <p className={styles.bannerSubtitle}>위치 추적을 시작하고 새로운 여행을 기록하세요</p>
        </div>
        <div className={styles.arrowIcon}>›</div>
      </div>

      <div className={styles.statsContainer}>
        <StatCardComponent icon={MapIcon} number={travelData.length} label="총 여행" />
        <StatCardComponent icon={PlaceIcon} number="16" label="방문 장소" />
        <StatCardComponent icon={ImgIcon} number="28" label="남긴 사진" />
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>내 여행 기록</h2>

        {loading ? (
          <div className={styles.statusContainer}><p>로딩 중...</p></div>
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

      <BottomNav activePage="travel" />
    </div>
  );
}

export default TravelRecordManagement;