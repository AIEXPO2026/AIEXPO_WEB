import { useState } from 'react';
import styles from './Travel.module.css';
import BottomNav from '../../components/BottomNav/BottomNav';
import TravelModal from './TravelModal';
import Tracking from './Tracking';
import Map from '../../assets/map-icon.svg';
import Place from '../../assets/place-icon.svg';
import Img from '../../assets/img-icon.svg';
import Edit from '../../assets/edit-icon.svg';
import Time from '../../assets/time-icon.svg';
import People from '../../assets/people-icon.svg';
import Splace from '../../assets/smollPlace-icon.svg';

// Component Functions
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
      '지연': { bg: '#FCE4EC', text: '#C2185B' },
    };
    return colorMap[tag] || { bg: '#F3E5F5', text: '#7B1FA2' };
  };

  return (
    <div className={styles.travelCard}>
      {travel.badge && <div className={styles.badgeWrapper}>{travel.badge}</div>}
      <div className={styles.travelImage}>
        {/* 대충 여기에 이미지 */}
        {travel.thumbnailUrl && <img src={travel.thumbnailUrl} alt={travel.title} />}
      </div>
      <div className={styles.travelInfo}>
        <div className={styles.travelHeader}>
          <h3 className={styles.travelTitle}>{travel.title}</h3>
          <button 
            className={styles.editButton} 
            type="button" 
            aria-label="edit"
            onClick={() => onEdit(travel)}
          >
            <img src={Edit} alt="edit" />
          </button>
        </div>
        
        <div className={styles.travelMeta}>
          <div className={styles.metaItem}>
            <span className={styles.metaIcon}>
              <img src={Time} alt="time" />
            </span>
            <span>{travel.duration}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaIcon}>
              <img src={Splace} alt="place" />
            </span>
            <span>{travel.places}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaIcon}>
              <img src={People} alt="people" />
            </span>
            <span>{travel.people}</span>
          </div>
        </div>
        
        <div className={styles.tagContainer}>
          {travel.tags.map((tag, index) => {
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
        
        <div className={styles.dateRange}>{travel.dateRange}</div>
      </div>
    </div>
  );
};

// Main Component
const TravelRecordManagement = () => {
  // 백엔드 연결 시: API 호출로 교체
  const [travelData, setTravelData] = useState([
    {
      id: 1,
      title: '제주도 힐링 여행',
      duration: '2박 3일',
      places: '12개 장소',
      people: '5인',
      tags: ['힐링', '자연', '힐링', '자연', '힐링', '자연'],
      dateRange: '2026.01.01 ~ 2026.01.03',
      startDate: '2026-01-01',
      endDate: '2026-01-03',
      companions: '가족',
      isPublic: true,
      thumbnailUrl: null, // API에서 받은 이미지 URL
    },
    {
      id: 2,
      title: '제주도 힐링 여행',
      duration: '2박 3일',
      places: '12개 장소',
      people: '5인',
      tags: ['힐링', '자연', '힐링', '자연', '힐링', '자연'],
      dateRange: '2026.01.01 ~ 2026.01.03',
      startDate: '2026-01-01',
      endDate: '2026-01-03',
      companions: '친구',
      isPublic: false,
      thumbnailUrl: null,
    },
    {
      id: 3,
      title: '제주도 힐링 여행',
      duration: '2박 3일',
      places: '12개 장소',
      people: '5인',
      tags: ['힐링', '자연', '힐링', '자연', '힐링', '자연'],
      dateRange: '2026.01.01 ~ 2026.01.03',
      startDate: '2026-01-01',
      endDate: '2026-01-03',
      companions: '혼자',
      isPublic: true,
      thumbnailUrl: null,
    },
    {
      id: 4,
      title: '제주도 힐링 여행',
      duration: '2박 3일',
      places: '12개 장소',
      people: '5인',
      tags: ['힐링', '자연', '힐링', '자연', '힐링', '자연'],
      dateRange: '2026.01.01 ~ 2026.01.03',
      startDate: '2026-01-01',
      endDate: '2026-01-03',
      companions: '가족',
      isPublic: false,
      thumbnailUrl: null,
    },
  ]);

  const [editingTravel, setEditingTravel] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTrackingActive, setIsTrackingActive] = useState(false);

  // 백엔드 연결 시: useEffect로 데이터 fetch
  // useEffect(() => {
  //   fetchTravelData();
  // }, []);
  
  // const fetchTravelData = async () => {
  //   try {
  //     const response = await fetch('/api/travels');
  //     const data = await response.json();
  //     setTravelData(data);
  //   } catch (error) {
  //     console.error('Failed to fetch travel data:', error);
  //   }
  // };

  const handleEdit = (travel) => {
    setEditingTravel(travel);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTravel(null);
  };

  const handleSave = async (updatedData) => {
    // 백엔드 연결 시: API 호출로 교체
    // try {
    //   await fetch(`/api/travels/${editingTravel.id}`, {
    //     method: 'PUT',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(updatedData)
    //   });
    //   fetchTravelData(); // 데이터 새로고침
    // } catch (error) {
    //   console.error('Failed to update travel:', error);
    // }
    
    // 현재: 로컬 상태만 업데이트
    setTravelData(prev => 
      prev.map(travel => 
        travel.id === editingTravel.id 
          ? { ...travel, ...updatedData }
          : travel
      )
    );
    handleCloseModal();
  };

  const handleStartTracking = () => {
    setIsTrackingActive(true);
  };

  const handleFinishTracking = (travelData) => {
    setIsTrackingActive(false);
    
    // 여행 종료 후 수정 모달 열기
    const newTravel = {
      id: Date.now(),
      title: '새로운 여행',
      ...travelData,
      // path, visitedPlaces 등 위치 데이터 포함
    };
    
    setEditingTravel(newTravel);
    setIsModalOpen(true);
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
        <StatCardComponent icon={Map} number="3" label="총 여행" />
        <StatCardComponent icon={Place} number="16" label="방문 장소" />
        <StatCardComponent icon={Img} number="28" label="남긴 사진" />
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>내 여행 기록</h2>
        <div className={styles.travelList}>
          {travelData.map((travel) => (
            <TravelCardComponent 
              key={travel.id} 
              travel={travel}
              onEdit={handleEdit}
            />
          ))}
        </div>
      </div>

      {isModalOpen && (
        <TravelModal
          travel={editingTravel}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}

      {isTrackingActive && (
        <Tracking
          onFinish={handleFinishTracking}
          onClose={() => setIsTrackingActive(false)}
        />
      )}

      <BottomNav activePage="travel" />
    </div>
  );
};

export default TravelRecordManagement;