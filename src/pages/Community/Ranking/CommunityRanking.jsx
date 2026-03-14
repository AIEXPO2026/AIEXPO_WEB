import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './CommunityRanking.module.css'
import BottomNav from '../../../components/BottomNav/BottomNav'
import { getRanking } from '../../../api/recommendApi'

function BackIcon() {
  return (
    <svg width="13" height="23" viewBox="0 0 13 23" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.21838 11.3133L12.6464 20.7413L10.761 22.6267L0.390382 12.256C0.140421 12.006 0 11.6669 0 11.3133C0 10.9598 0.140421 10.6207 0.390382 10.3707L10.761 0L12.6464 1.88533L3.21838 11.3133Z"
        fill="#252525"
      />
    </svg>
  )
}

function DropdownArrow() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 4L6 8L10 4" stroke="#A6A6A6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

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

function RankingDetail() {
  const navigate = useNavigate()
  const [rankingData, setRankingData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const data = await getRanking()
        setRankingData(data?.content ?? [])
      } catch (err) {
        console.error('랭킹 데이터 로드 실패:', err)
        setError('랭킹 데이터를 불러오지 못했습니다.')
      } finally {
        setLoading(false)
      }
    }
    fetchRanking()
  }, [])

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          <BackIcon />
        </button>
        <h1 className={styles.title}>여행지 랭킹</h1>
      </header>

      <div className={styles.divider} />

      <div className={styles.contentArea}>
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

        {loading ? (
          <p className={styles.loadingState}>불러오는 중...</p>
        ) : error ? (
          <p className={styles.errorState}>{error}</p>
        ) : rankingData.length === 0 ? (
          <p className={styles.emptyState}>랭킹 데이터가 없습니다.</p>
        ) : (
          <div className={styles.rankingList}>
            {rankingData.map((item, idx) => (
              <div key={item.id ?? idx} className={styles.rankingItem}>
                <div className={styles.rankingInfo}>
                  <span className={styles.rankNumber}>{item.rank ?? idx + 1}</span>
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt={item.name ?? item.title} className={styles.rankingImage} />
                  )}
                  <div className={styles.rankingText}>
                    <span className={styles.rankingTitle}>{item.name ?? item.title}</span>
                    <div className={styles.rankingMeta}>
                      <span>{item.city ?? item.location}</span>
                      {item.category && <><span className={styles.dot}>·</span><span>{item.category}</span></>}
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
        )}
      </div>

      <BottomNav activePage="community" />
    </div>
  )
}

export default RankingDetail
