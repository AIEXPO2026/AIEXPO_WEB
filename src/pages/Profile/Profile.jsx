import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Profile.module.css';
import BottomNav from '../../components/BottomNav/BottomNav';
import CreditChargeModal from './Creditchargemodal';
import EditIdModal from './EditIdmodal';
import ChangePasswordModal from './Changepasswordmodal';
import DeleteAccountModal from './Deleteaccountmodal';
import LogoutModal from './Logoutmodal';
import { getBookmarks, deleteBookmark, getCredit, getTravels } from '../../api/profileApi';
import { signout } from '../../api/authApi';
import machuPicchu from '../../assets/machu-picchu.png';

/* ─── SVG 아이콘 ──────────────────────────────────────────────────────────── */
function ChevronRight() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M9 18L15 12L9 6" stroke="#C8C8C8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function DropdownArrow() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M5 7.5L10 12.5L15 7.5" stroke="#888888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function StarIcon({ active = true }) {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path d="M16 4.77L19.09 11.04L19.18 11.22L19.38 11.25L26.3 12.26L21.14 17.29L21 17.43L21.03 17.63L22.22 24.52L16.17 21.34L16 21.25L15.83 21.34L9.78 24.52L10.97 17.63L11 17.43L10.86 17.29L5.7 12.26L12.62 11.25L12.82 11.22L12.91 11.04L16 4.77Z" fill={active ? '#FFC300' : '#D9D9D9'} />
    </svg>
  );
}
function BookmarkIcon() {
  return (
    <svg width="24" height="25" viewBox="0 0 24 25" fill="none">
      <path d="M16 24.75L8 21.8625L1.8 24.3375C1.35556 24.5208 0.944444 24.4695 0.566667 24.1835C0.188889 23.8975 0 23.5134 0 23.0312V3.78125C0 3.48333 0.0835555 3.21979 0.250667 2.99063C0.417778 2.76146 0.645333 2.58958 0.933333 2.475L8 0L16 2.8875L22.2 0.4125C22.6444 0.229167 23.0556 0.280958 23.4333 0.567875C23.8111 0.854792 24 1.23842 24 1.71875V20.9688C24 21.2667 23.9169 21.5302 23.7507 21.7594C23.5844 21.9885 23.3564 22.1604 23.0667 22.275L16 24.75ZM14.6667 21.3812V5.29375L9.33333 3.36875V19.4562L14.6667 21.3812Z" fill="#C2C2C2" />
    </svg>
  );
}
function TrashIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}
function CoinIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#FFD700" />
      <text x="12" y="16" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1a1a1a">C</text>
    </svg>
  );
}
function PinIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
  );
}
function CalendarIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
function LockOpenIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 9.9-1" />
    </svg>
  );
}
function LockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
/* ─────────────────────────────────────────────────────────────────────────── */

// 열릴 수 있는 모달 종류
const MODAL = {
  NONE: null,
  CHARGE: 'charge',
  EDIT_ID: 'editId',
  CHANGE_PW: 'changePw',
  DELETE: 'delete',
  LOGOUT: 'logout',
};

function Profile() {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(() => {
    const nickname = localStorage.getItem('nickname') || '';
    return {
      name: nickname,
      userId: nickname,
      email: '',
    };
  });
  const [credit, setCredit] = useState(0);
  const [travelData, setTravelData] = useState([]);
  const [bookmarkData, setBookmarkData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('recent');
  const [filterBy, setFilterBy] = useState('all');
  const [activeModal, setActiveModal] = useState(MODAL.NONE);
  const [openDropdown, setOpenDropdown] = useState(null); // 'sort' | 'filter' | null
  const [showAllTravels, setShowAllTravels] = useState(false);
  const TRAVEL_LIMIT = 5;
  const dropdownRef = useRef(null);

  useEffect(() => {
    loadProfileData();
  }, []);

  useEffect(() => {
    if (!openDropdown) return;
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const [creditRes, travelsRes, bookmarksRes] = await Promise.all([
        getCredit().catch(() => null),
        getTravels().catch(() => null),
        getBookmarks().catch(() => null),
      ]);
      setCredit(creditRes?.credit ?? 0);
      setTravelData(Array.isArray(travelsRes) ? travelsRes : []);
      setBookmarkData(Array.isArray(bookmarksRes) ? bookmarksRes : []);
    } catch (error) {
      console.error('Failed to load profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => setActiveModal(MODAL.NONE);

  // ── 아이디 수정 성공 ────────────────────────────────────────────────────
  const handleEditIdSuccess = (newId) => {
    setUserInfo((prev) => ({ ...prev, name: newId, userId: newId }));
    localStorage.setItem('nickname', newId); // ✅ localStorage도 동기화
    closeModal();
    alert(`아이디가 "${newId}"로 변경되었습니다.`);
  };

  // ── 비밀번호 변경 성공 ──────────────────────────────────────────────────
  const handleChangePwSuccess = () => {
    closeModal();
    alert('비밀번호가 변경되었습니다. 다시 로그인해주세요.');
    navigate('/login');
  };

  // ── 탈퇴 확인 ───────────────────────────────────────────────────────────
  const handleDeleteConfirm = () => {
    closeModal();
    alert('탈퇴가 완료되었습니다.');
    navigate('/login');
  };

  // ── 로그아웃 확인 ────────────────────────────────────────────────────────
  const handleLogoutConfirm = async () => {
    try {
      await signout(); // ✅ 서버 세션 종료
    } catch (err) {
      console.warn('signout API 실패 (무시):', err.message);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('nickname');
      sessionStorage.clear();
      closeModal();
      navigate('/login');
    }
  };

  const handleDeleteBookmark = async (destinationId) => {
    if (!window.confirm('북마크를 삭제하시겠습니까?')) return;
    try {
      await deleteBookmark(destinationId);
      setBookmarkData((prev) => prev.filter((b) => b.destinationId !== destinationId));
    } catch (error) {
      alert('북마크 삭제에 실패했습니다.');
    }
  };

  const filteredTravels = travelData
    .filter((t) => {
      if (filterBy === 'public') return t.publicTravel === true;
      if (filterBy === 'private') return t.publicTravel === false;
      return true;
    })
    .sort((a, b) => {
      const da = new Date(a.startDate), db = new Date(b.startDate);
      return sortBy === 'recent' ? db - da : da - db;
    });

  const filterLabel = { all: '전체', public: '공개', private: '비공개' };
  const displayedTravels = showAllTravels ? filteredTravels : filteredTravels.slice(0, TRAVEL_LIMIT);

  return (
    <div className={styles.container}>
      {/* 유저 정보 */}
      <div className={styles.userSection}>
        <h1 className={styles.userName}>
          {userInfo.name} <span className={styles.userId}>({userInfo.userId})</span>
        </h1>
        <p className={styles.userEmail}>{userInfo.email}</p>
      </div>

      {/* 크레딧 */}
      <div className={styles.creditBox}>
        <div className={styles.creditInfo}>
          <span className={styles.creditLabel}>보유 크레딧</span>
          <div className={styles.creditAmountRow}>
            <CoinIcon />
            <span className={styles.creditAmount}>
              {loading ? '...' : credit.toLocaleString()}
            </span>
          </div>
        </div>
        <button className={styles.chargeButton} type="button" onClick={() => setActiveModal(MODAL.CHARGE)}>
          충전하기
        </button>
      </div>

      {/* 메뉴 */}
      <div className={styles.menuSection}>
        {/* ✅ 아이디 수정 — 모달 */}
        <button className={styles.menuItem} type="button" onClick={() => setActiveModal(MODAL.EDIT_ID)}>
          <span className={styles.menuText}>아이디 수정</span>
          <ChevronRight />
        </button>

        {/* ✅ 비밀번호 변경 — 모달 */}
        <button className={styles.menuItem} type="button" onClick={() => setActiveModal(MODAL.CHANGE_PW)}>
          <span className={styles.menuText}>비밀번호 변경</span>
          <ChevronRight />
        </button>

        {/* 여행기록 관리 — 페이지 이동 유지 */}
        <button className={styles.menuItem} type="button" onClick={() => navigate('/travel')}>
          <span className={styles.menuText}>여행기록 관리</span>
          <ChevronRight />
        </button>

        {/* ✅ 탈퇴하기 — 모달 */}
        <button className={styles.menuItem} type="button" onClick={() => setActiveModal(MODAL.DELETE)}>
          <span className={styles.menuText}>탈퇴하기</span>
          <ChevronRight />
        </button>

        {/* ✅ 로그아웃 — 모달 */}
        <button className={styles.menuItem} type="button" onClick={() => setActiveModal(MODAL.LOGOUT)}>
          <span className={`${styles.menuText} ${styles.logout}`}>로그아웃</span>
          <ChevronRight />
        </button>
      </div>

      <div className={styles.divider} />

      {/* 내 여행기록 */}
      <div className={styles.travelSection}>
        <div className={styles.travelHeader}>
          <h2 className={styles.travelTitle}>내 여행기록</h2>
          <div className={styles.filters} ref={dropdownRef}>
            {/* 정렬 드롭다운 */}
            <div className={styles.filterWrapper}>
              <button
                className={styles.filterButton}
                onClick={() => setOpenDropdown(o => o === 'sort' ? null : 'sort')}
              >
                <span>{sortBy === 'recent' ? '최근 순' : '오래된 순'}</span>
                <DropdownArrow />
              </button>
              {openDropdown === 'sort' && (
                <div className={styles.filterDropdown}>
                  {[['recent', '최근 순'], ['oldest', '오래된 순']].map(([val, label]) => (
                    <button
                      key={val}
                      className={`${styles.filterDropdownItem} ${sortBy === val ? styles.filterDropdownItemActive : ''}`}
                      onClick={() => { setSortBy(val); setOpenDropdown(null); }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* 공개여부 드롭다운 */}
            <div className={styles.filterWrapper}>
              <button
                className={styles.filterButton}
                onClick={() => setOpenDropdown(o => o === 'filter' ? null : 'filter')}
              >
                <span>{filterLabel[filterBy]}</span>
                <DropdownArrow />
              </button>
              {openDropdown === 'filter' && (
                <div className={styles.filterDropdown}>
                  {[['all', '전체'], ['public', '공개'], ['private', '비공개']].map(([val, label]) => (
                    <button
                      key={val}
                      className={`${styles.filterDropdownItem} ${filterBy === val ? styles.filterDropdownItemActive : ''}`}
                      onClick={() => { setFilterBy(val); setOpenDropdown(null); setShowAllTravels(false); }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className={styles.loadingState}><p>로딩 중...</p></div>
        ) : filteredTravels.length === 0 ? (
          <div className={styles.emptyState}>
            <p>여행 기록이 없습니다.</p>
            <button onClick={() => navigate('/travel')}>여행 시작하기</button>
          </div>
        ) : (
          <>
            <div className={styles.travelList}>
              {displayedTravels.map((travel) => (
                <div key={travel.id} className={styles.travelCard} onClick={() => navigate(`/travel/${travel.id}`)}>
                  <div className={styles.travelCardTop}>
                    <h3 className={styles.travelCardTitle}>{travel.title || `${travel.startDate} 여행`}</h3>
                    <span className={`${styles.publicBadge} ${travel.publicTravel ? styles.publicBadgeOn : styles.publicBadgeOff}`}>
                      {travel.publicTravel ? <><LockOpenIcon /> 공개</> : <><LockIcon /> 비공개</>}
                    </span>
                  </div>
                  <div className={styles.travelCardMeta}>
                    <span className={styles.metaChip}><CalendarIcon />{travel.startDate} ~ {travel.endDate}</span>
                    {travel.avgWeather && <span className={styles.metaChip}>{travel.avgWeather}</span>}
                  </div>
                </div>
              ))}
            </div>
            {filteredTravels.length > TRAVEL_LIMIT && !showAllTravels && (
              <button className={styles.showMoreBtn} onClick={() => setShowAllTravels(true)}>
                더보기 ({filteredTravels.length - TRAVEL_LIMIT}개 더)
              </button>
            )}
          </>
        )}
      </div>

      <div className={styles.divider} />

      {/* 내 북마크 */}
      <div className={styles.bookmarkSection}>
        <h2 className={styles.bookmarkTitle}>내 북마크</h2>
        {loading ? (
          <div className={styles.loadingState}><p>로딩 중...</p></div>
        ) : bookmarkData.length === 0 ? (
          <div className={styles.emptyState}><p>북마크한 장소가 없습니다.</p></div>
        ) : (
          <div className={styles.bookmarkList}>
            {bookmarkData.map((item) => (
              <div key={item.bookmarkId} className={styles.bookmarkItem}>
                <img src={item.image || machuPicchu} alt={item.name} className={styles.bookmarkImage} />
                <div className={styles.bookmarkInfo}>
                  <h3 className={styles.bookmarkItemTitle}>{item.name}</h3>
                  <p className={styles.bookmarkItemMeta}><PinIcon /> {item.city}</p>
                  {item.baseScor !== undefined && (
                    <div className={styles.scoreRow}>
                      <StarIcon active />
                      <span className={styles.scoreText}>{item.baseScor}</span>
                    </div>
                  )}
                </div>
                <div className={styles.bookmarkActions}>
                  <button className={styles.iconBtn} type="button" aria-label="북마크 삭제" onClick={() => handleDeleteBookmark(item.destinationId)}>
                    <BookmarkIcon />
                  </button>
                  <button className={`${styles.iconBtn} ${styles.deleteBtn}`} type="button" aria-label="삭제" onClick={() => handleDeleteBookmark(item.destinationId)}>
                    <TrashIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav activePage="profile" />

      {/* ── 모달들 ────────────────────────────────────────────────────────── */}
      {activeModal === MODAL.CHARGE && (
        <CreditChargeModal
          currentCredit={credit}
          onClose={closeModal}
        />
      )}
      {activeModal === MODAL.EDIT_ID && (
        <EditIdModal
          currentUserId={userInfo.userId}
          onClose={closeModal}
          onSuccess={handleEditIdSuccess}
        />
      )}
      {activeModal === MODAL.CHANGE_PW && (
        <ChangePasswordModal
          onClose={closeModal}
          onSuccess={handleChangePwSuccess}
        />
      )}
      {activeModal === MODAL.DELETE && (
        <DeleteAccountModal
          username={userInfo.userId}
          onClose={closeModal}
          onConfirm={handleDeleteConfirm}
        />
      )}
      {activeModal === MODAL.LOGOUT && (
        <LogoutModal
          onClose={closeModal}
          onConfirm={handleLogoutConfirm}
        />
      )}
    </div>
  );
}

export default Profile;