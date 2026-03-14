import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Community.module.css'
import BottomNav from '../../components/BottomNav/BottomNav'
import { getRanking, getBlogList } from '../../api/recommendApi'
import { addBookmark, deleteBookmark } from '../../api/profileApi'

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

function Community() {
  const navigate = useNavigate()
  const [rankingData, setRankingData] = useState([])
  const [blogData, setBlogData] = useState([])
  const [loading, setLoading] = useState(true)
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set())

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ranking, blogs] = await Promise.all([
          getRanking().catch(() => null),
          getBlogList().catch(() => null),
        ])
        setRankingData((ranking?.content ?? []).slice(0, 4))
        setBlogData((Array.isArray(blogs) ? blogs : blogs?.content ?? []).slice(0, 8))
      } catch (err) {
        console.error('커뮤니티 데이터 로드 실패:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleBookmark = async (e, item) => {
    e.stopPropagation()
    const id = item.id
    const next = !bookmarkedIds.has(id)
    setBookmarkedIds(prev => {
      const s = new Set(prev)
      next ? s.add(id) : s.delete(id)
      return s
    })
    try {
      next ? await addBookmark(id) : await deleteBookmark(id)
    } catch {
      setBookmarkedIds(prev => {
        const s = new Set(prev)
        next ? s.delete(id) : s.add(id)
        return s
      })
    }
  }

  const handleMapView = (e, item) => {
    e.stopPropagation()
    navigate('/search-result/detail', {
      state: {
        item: {
          id: item.id,
          title: item.name,
          location: item.resorts,
          category: item.countryTheme,
          image: item.imageUrl,
        }
      }
    })
  }

  return (
    <div className={styles.container}>
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

        {loading ? (
          <p className={styles.loadingState}>불러오는 중...</p>
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
                  <button className={styles.iconBtn} type="button" aria-label="favorite" onClick={(e) => handleBookmark(e, item)}>
                    <StarIcon active={bookmarkedIds.has(item.id)} />
                  </button>
                  <button className={styles.iconBtn} type="button" aria-label="지도보기" onClick={(e) => handleMapView(e, item)}>
                    <BookmarkIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

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

        {loading ? (
          <p className={styles.loadingState}>불러오는 중...</p>
        ) : blogData.length === 0 ? (
          <p className={styles.emptyState}>블로그 게시글이 없습니다.</p>
        ) : (
          <div className={styles.blogList}>
            {blogData.map((item, idx) => (
              <div key={item.id ?? idx} className={styles.blogItem}>
                <div className={styles.blogText}>
                  <span className={styles.blogTitle}>{item.title}</span>
                  <div className={styles.blogMeta}>
                    <span>{item.author ?? item.nickname}</span>
                    <span className={styles.dot}>·</span>
                    <span>{item.country}</span>
                    <span className={styles.dot}>·</span>
                    <span>{item.date}</span>
                  </div>
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

export default Community
