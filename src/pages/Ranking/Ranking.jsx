import { useNavigate } from 'react-router-dom'
import styles from './Ranking.module.css'
import machuPicchu from '../../assets/machu-picchu.png'

const rankingData = [
  { id: 1, rank: 1, title: '마추픽추', location: '페루 쿠스코', category: '역사', image: machuPicchu },
  { id: 2, rank: 2, title: '마추픽추', location: '페루 쿠스코', category: '역사', image: machuPicchu },
  { id: 3, rank: 3, title: '마추픽추', location: '페루 쿠스코', category: '역사', image: machuPicchu },
  { id: 4, rank: 4, title: '마추픽추', location: '페루 쿠스코', category: '역사', image: machuPicchu },
  { id: 5, rank: 1, title: '마추픽추', location: '페루 쿠스코', category: '역사', image: machuPicchu },
  { id: 6, rank: 2, title: '마추픽추', location: '페루 쿠스코', category: '역사', image: machuPicchu },
  { id: 7, rank: 3, title: '마추픽추', location: '페루 쿠스코', category: '역사', image: machuPicchu },
]

function BackIcon() {
  return (
    <svg width="16" height="32" viewBox="0 0 16 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 4L2 16L14 28" stroke="#252525" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function StarIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 4.77L19.09 11.04L19.18 11.22L19.38 11.25L26.3 12.26L21.14 17.29L21 17.43L21.03 17.63L22.22 24.52L16.17 21.34L16 21.25L15.83 21.34L9.78 24.52L10.97 17.63L11 17.43L10.86 17.29L5.7 12.26L12.62 11.25L12.82 11.22L12.91 11.04L16 4.77Z" fill="#FFC300"/>
    </svg>
  )
}

function BookmarkIcon() {
  return (
    <svg width="32" height="33" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 6.13V28.88L16 24.13L24 28.88V6.13C24 5.6 23.79 5.09 23.41 4.72C23.04 4.34 22.53 4.13 22 4.13H10C9.47 4.13 8.96 4.34 8.59 4.72C8.21 5.09 8 5.6 8 6.13Z" stroke="#C2C2C2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function DropdownArrow() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 4L6 8L10 4" stroke="#A6A6A6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function HomeIcon({ active }) {
  return (
    <svg width="26" height="29" viewBox="0 0 27 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.33 13.33V26.67C3.33 27.55 4.05 28.27 4.93 28.27H10V20H16.67V28.27H21.73C22.62 28.27 23.33 27.55 23.33 26.67V13.33" stroke={active ? '#181818' : '#B8B8B8'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M1 15L13.33 2.67L25.67 15" stroke={active ? '#181818' : '#B8B8B8'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function PostIcon({ active }) {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill={active ? '#181818' : '#B8B8B8'} xmlns="http://www.w3.org/2000/svg">
      <path d="M4 4H26V22H4V4ZM6 6V20H24V6H6ZM4 24H26V26H4V24Z"/>
    </svg>
  )
}

function PenIcon({ active }) {
  return (
    <svg width="33" height="33" viewBox="0 0 34 34" fill={active ? '#181818' : '#B8B8B8'} xmlns="http://www.w3.org/2000/svg">
      <path d="M24.5 4.5L29.5 9.5L10 29H5V24L24.5 4.5Z"/>
    </svg>
  )
}

function ProfileIcon({ active }) {
  return (
    <svg width="33" height="33" viewBox="0 0 34 34" fill={active ? '#181818' : '#B8B8B8'} xmlns="http://www.w3.org/2000/svg">
      <path d="M17 17C20.31 17 23 14.31 23 11C23 7.69 20.31 5 17 5C13.69 5 11 7.69 11 11C11 14.31 13.69 17 17 17ZM17 20C12.33 20 3 22.34 3 27V29H31V27C31 22.34 21.67 20 17 20Z"/>
    </svg>
  )
}

function Ranking() {
  const navigate = useNavigate()

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate('/community')}>
          <BackIcon />
        </button>
        <h1 className={styles.title}>여행지 랭킹</h1>
      </header>

      <div className={styles.divider} />

      <div className={styles.filters}>
        <button className={styles.filterButton}>
          <span>주요 국가별</span>
          <DropdownArrow />
        </button>
        <button className={styles.filterButton}>
          <span>계절별</span>
          <DropdownArrow />
        </button>
      </div>

      <div className={styles.rankingList}>
        {rankingData.map((item) => (
          <div key={item.id} className={styles.rankingItem}>
            <div className={styles.rankingInfo}>
              <span className={styles.rankNumber}>{item.rank}</span>
              <img src={item.image} alt={item.title} className={styles.rankingImage} />
              <div className={styles.rankingText}>
                <span className={styles.rankingTitle}>{item.title}</span>
                <div className={styles.rankingMeta}>
                  <span>{item.location}</span>
                  <span className={styles.dot}>·</span>
                  <span>{item.category}</span>
                </div>
              </div>
            </div>
            <div className={styles.rankingActions}>
              <StarIcon />
              <BookmarkIcon />
            </div>
          </div>
        ))}
      </div>

      <nav className={styles.bottomNav}>
        <button className={styles.navItem}>
          <HomeIcon active={false} />
        </button>
        <button className={styles.navItem}>
          <PostIcon active={true} />
        </button>
        <button className={styles.navItem}>
          <PenIcon active={false} />
        </button>
        <button className={styles.navItem}>
          <ProfileIcon active={false} />
        </button>
      </nav>
    </div>
  )
}

export default Ranking
