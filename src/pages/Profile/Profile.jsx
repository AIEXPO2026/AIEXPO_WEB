import { useNavigate } from 'react-router-dom';
import styles from './Profile.module.css';
import BottomNav from '../../components/BottomNav/BottomNav';
import machuPicchu from '../../assets/machu-picchu.png';

function ChevronRight() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9 18L15 12L9 6"
        stroke="#C8C8C8"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DropdownArrow() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="#888888"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StarIcon({ active = true }) {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16 4.77L19.09 11.04L19.18 11.22L19.38 11.25L26.3 12.26L21.14 17.29L21 17.43L21.03 17.63L22.22 24.52L16.17 21.34L16 21.25L15.83 21.34L9.78 24.52L10.97 17.63L11 17.43L10.86 17.29L5.7 12.26L12.62 11.25L12.82 11.22L12.91 11.04L16 4.77Z"
        fill={active ? "#FFC300" : "#D9D9D9"}
      />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16 24.75L8 21.8625L1.8 24.3375C1.35556 24.5208 0.944444 24.4695 0.566667 24.1835C0.188889 23.8975 0 23.5134 0 23.0312V3.78125C0 3.48333 0.0835555 3.21979 0.250667 2.99063C0.417778 2.76146 0.645333 2.58958 0.933333 2.475L8 0L16 2.8875L22.2 0.4125C22.6444 0.229167 23.0556 0.280958 23.4333 0.567875C23.8111 0.854792 24 1.23842 24 1.71875V20.9688C24 21.2667 23.9169 21.5302 23.7507 21.7594C23.5844 21.9885 23.3564 22.1604 23.0667 22.275L16 24.75ZM14.6667 21.3812V5.29375L9.33333 3.36875V19.4562L14.6667 21.3812Z"
        fill="#C2C2C2"
      />
    </svg>
  );
}

const travelData = [
  {
    id: 1,
    title: '첫 유럽 여행',
    location: '이탈리아',
    startDate: '2025. 10. 12.',
    endDate: '2025. 10. 19.',
  },
  {
    id: 2,
    title: '2025 제주도 여행',
    location: '대한민국',
    startDate: '2025. 7. 4.',
    endDate: '2025. 7. 9.',
  },
  {
    id: 3,
    title: '첫 유럽 여행',
    location: '이탈리아',
    startDate: '2025. 10. 12.',
    endDate: '2025. 10. 19.',
  },
  {
    id: 4,
    title: '첫 유럽 여행',
    location: '이탈리아',
    startDate: '2025. 10. 12.',
    endDate: '2025. 10. 19.',
  },
];

const bookmarkData = [
  {
    id: 1,
    title: '마추픽추',
    location: '페루 쿠스코',
    category: '역사',
    image: machuPicchu,
    favorite: true,
  },
  {
    id: 2,
    title: '에펠탑',
    location: '프랑스 파리',
    category: '역사',
    image: machuPicchu,
    favorite: true,
  },
  {
    id: 3,
    title: '해운대 해수욕장',
    location: '대한민국 부산',
    category: '역사',
    image: machuPicchu,
    favorite: true,
  },
];

function Profile() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      {/* User Info Section */}
      <div className={styles.userSection}>
        <h1 className={styles.userName}>
          오승윤 <span className={styles.userId}>(osy09)</span>
        </h1>
        <p className={styles.userEmail}>osy@dgsw.hs.kr</p>
      </div>

      {/* Credit Section */}
      <div className={styles.creditBox}>
        <div className={styles.creditInfo}>
          <span className={styles.creditLabel}>보유 크레딧</span>
          <span className={styles.creditAmount}>1,450</span>
        </div>
        <button className={styles.chargeButton}>충전하기</button>
      </div>

      {/* Menu Section */}
      <div className={styles.menuSection}>
        <button className={styles.menuItem} onClick={() => navigate('/profile/edit-id')}>
          <span className={styles.menuText}>아이디 수정</span>
          <ChevronRight />
        </button>
        <button className={styles.menuItem} onClick={() => navigate('/profile/change-password')}>
          <span className={styles.menuText}>비밀번호 변경</span>
          <ChevronRight />
        </button>
        <button className={styles.menuItem} onClick={() => navigate('/profile/delete-account')}>
          <span className={styles.menuText}>탈퇴하기</span>
          <ChevronRight />
        </button>
        <button className={styles.menuItem} onClick={() => navigate('/login')}>
          <span className={`${styles.menuText} ${styles.logout}`}>로그아웃</span>
          <ChevronRight />
        </button>
      </div>

      {/* Divider */}
      <div className={styles.divider} />

      {/* Travel Records Section */}
      <div className={styles.travelSection}>
        <div className={styles.travelHeader}>
          <h2 className={styles.travelTitle}>내 여행기록</h2>
          <div className={styles.filters}>
            <button className={styles.filterButton}>
              <span>최근 순</span>
              <DropdownArrow />
            </button>
            <button className={styles.filterButton}>
              <span>공개</span>
              <DropdownArrow />
            </button>
          </div>
        </div>

        {/* Travel List */}
        <div className={styles.travelList}>
          {travelData.map((travel) => (
            <div key={travel.id} className={styles.travelCard}>
              <h3 className={styles.travelCardTitle}>{travel.title}</h3>
              <p className={styles.travelCardMeta}>
                {travel.location} · {travel.startDate} ~{travel.endDate}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className={styles.divider} />

      {/* Bookmark Section */}
      <div className={styles.bookmarkSection}>
        <h2 className={styles.bookmarkTitle}>내 북마크</h2>

        <div className={styles.bookmarkList}>
          {bookmarkData.map((item) => (
            <div key={item.id} className={styles.bookmarkItem}>
              <img src={item.image} alt={item.title} className={styles.bookmarkImage} />
              <div className={styles.bookmarkInfo}>
                <h3 className={styles.bookmarkItemTitle}>{item.title}</h3>
                <p className={styles.bookmarkItemMeta}>
                  {item.location} · {item.category}
                </p>
              </div>
              <div className={styles.bookmarkActions}>
                <button className={styles.iconBtn} type="button" aria-label="favorite">
                  <StarIcon active={item.favorite} />
                </button>
                <button className={styles.iconBtn} type="button" aria-label="bookmark">
                  <BookmarkIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav activePage="profile" />
    </div>
  );
}

export default Profile;
