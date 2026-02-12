import { useNavigate } from 'react-router-dom'
import styles from './Community.module.css'
import machuPicchu from '../../assets/machu-picchu.png'
import BottomNav from '../../components/BottomNav/BottomNav'

function StarIcon({ active = true }) {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16 4.77L19.09 11.04L19.18 11.22L19.38 11.25L26.3 12.26L21.14 17.29L21 17.43L21.03 17.63L22.22 24.52L16.17 21.34L16 21.25L15.83 21.34L9.78 24.52L10.97 17.63L11 17.43L10.86 17.29L5.7 12.26L12.62 11.25L12.82 11.22L12.91 11.04L16 4.77Z"
        fill={active ? "#FFC300" : "#D9D9D9"}
      />
    </svg>
  )
}

function BookmarkIcon() {
  return (
    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16 24.75L8 21.8625L1.8 24.3375C1.35556 24.5208 0.944444 24.4695 0.566667 24.1835C0.188889 23.8975 0 23.5134 0 23.0312V3.78125C0 3.48333 0.0835555 3.21979 0.250667 2.99063C0.417778 2.76146 0.645333 2.58958 0.933333 2.475L8 0L16 2.8875L22.2 0.4125C22.6444 0.229167 23.0556 0.280958 23.4333 0.567875C23.8111 0.854792 24 1.23842 24 1.71875V20.9688C24 21.2667 23.9169 21.5302 23.7507 21.7594C23.5844 21.9885 23.3564 22.1604 23.0667 22.275L16 24.75ZM14.6667 21.3812V5.29375L9.33333 3.36875V19.4562L14.6667 21.3812Z"
        fill="#C2C2C2"
      />
    </svg>
  )
}

function ArrowRightIcon() {
  return (
    <svg width="8" height="16" viewBox="0 0 8 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1 1L7 8L1 15"
        stroke="#878787"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const rankingData = [
  { id: 1, rank: 1, title: '마추픽추', location: '페루 쿠스코', category: '역사', image: machuPicchu },
  { id: 2, rank: 2, title: '마추픽추', location: '페루 쿠스코', category: '역사', image: machuPicchu },
  { id: 3, rank: 3, title: '마추픽추', location: '페루 쿠스코', category: '역사', image: machuPicchu },
  { id: 4, rank: 4, title: '마추픽추', location: '페루 쿠스코', category: '역사', image: machuPicchu },
]

const blogData = [
  { id: 1, title: '푸바오 보러 중국으로', author: '오승훈', location: '중국', date: '2일 전' },
  { id: 2, title: '25년 일본 여행기', author: '김경훈', location: '일본', date: '7일 전' },
  { id: 3, title: '겨울 국내 여행', author: '조상철', location: '대한민국', date: '2일 전' },
  { id: 4, title: '싱가포르 국외현장체험', author: '오승훈', location: '이탈리아', date: '2일 전' },
  { id: 5, title: '푸바오 보러 중국으로', author: '오승훈', location: '중국', date: '2일 전' },
  { id: 6, title: '25년 일본 여행기', author: '김경훈', location: '일본', date: '7일 전' },
  { id: 7, title: '겨울 국내 여행', author: '조상철', location: '대한민국', date: '2일 전' },
  { id: 8, title: '싱가포르 국외현장체험', author: '오승훈', location: '이탈리아', date: '2일 전' },
]

function Ranking() {
  const navigate = useNavigate()

  return (
    <div className={styles.container}>
      {/* Content Area */}
      <div className={styles.contentArea}>
        {/* 여행지 랭킹 섹션 */}
        <div className={styles.sectionHeader}>
          <h1 className={styles.sectionTitle}>여행지 랭킹</h1>
          <button className={styles.moreButton} onClick={() => navigate('/community/ranking')}>
            <span>더보기</span>
            <div className={styles.arrowIcon}>
              <ArrowRightIcon />
            </div>
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
                <button className={styles.iconBtn} type="button" aria-label="favorite">
                  <StarIcon active={true} />
                </button>
                <button className={styles.iconBtn} type="button" aria-label="bookmark">
                  <BookmarkIcon />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 구분선 */}
        <div className={styles.divider} />

        {/* 블로그 섹션 */}
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>블로그</h2>
          <button className={styles.moreButton} onClick={() => navigate('/community/blog')}>
            <span>더보기</span>
            <div className={styles.arrowIcon}>
              <ArrowRightIcon />
            </div>
          </button>
        </div>

        <div className={styles.blogList}>
          {blogData.map((item) => (
            <div key={item.id} className={styles.blogItem}>
              <div className={styles.blogText}>
                <span className={styles.blogTitle}>{item.title}</span>
                <div className={styles.blogMeta}>
                  <span>{item.author}</span>
                  <span className={styles.dot}>·</span>
                  <span>{item.location}</span>
                  <span className={styles.dot}>·</span>
                  <span>{item.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 하단 네비게이션 */}
      <BottomNav activePage="ranking" />
    </div>
  )
}

export default Ranking
