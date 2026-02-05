import { useNavigate } from 'react-router-dom'
import styles from './RankingDetail.module.css'
import machuPicchu from '../../assets/machu-picchu.png'

// Figma 아이콘 에셋 URL
const iconMap = "http://localhost:3845/assets/dc7663a251d2a960e1670c81af59b4d822fd0f25.svg"
const iconStar = "http://localhost:3845/assets/473fa65f6bf25730dcbc77ac31955bd3768f4450.svg"
const iconBack = "http://localhost:3845/assets/c1e8df364647065e420bc2e5a294f92d9321e018.svg"
const iconArrow = "http://localhost:3845/assets/bd539d5d4fca8bbbafae20fa19b2a671f19b4071.svg"
const iconHomeInactive = "http://localhost:3845/assets/9872fc521d567fff1381b2295e01f331f459464d.svg"
const iconPostActive = "http://localhost:3845/assets/a06ff4fafbd2b64f1431b943be5c58136a4bb953.svg"
const iconPen = "http://localhost:3845/assets/b684b03cfe3098d5db1f56026c0e91677c6247a8.svg"
const iconProfile = "http://localhost:3845/assets/b48c86993d5210d5c60110b1d62770aa07ed3ec0.svg"

const rankingData = [
  { id: 1, rank: 1, title: '마추픽추', location: '페루 쿠스코', category: '역사', image: machuPicchu },
  { id: 2, rank: 2, title: '마추픽추', location: '페루 쿠스코', category: '역사', image: machuPicchu },
  { id: 3, rank: 3, title: '마추픽추', location: '페루 쿠스코', category: '역사', image: machuPicchu },
  { id: 4, rank: 4, title: '마추픽추', location: '페루 쿠스코', category: '역사', image: machuPicchu },
  { id: 5, rank: 1, title: '마추픽추', location: '페루 쿠스코', category: '역사', image: machuPicchu },
  { id: 6, rank: 2, title: '마추픽추', location: '페루 쿠스코', category: '역사', image: machuPicchu },
  { id: 7, rank: 3, title: '마추픽추', location: '페루 쿠스코', category: '역사', image: machuPicchu },
]

function RankingDetail() {
  const navigate = useNavigate()

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          <img src={iconBack} alt="back" className={styles.backIcon} />
        </button>
        <h1 className={styles.title}>여행지 랭킹</h1>
      </header>

      {/* Divider */}
      <div className={styles.divider} />

      {/* Content Area */}
      <div className={styles.contentArea}>
        {/* Filters */}
        <div className={styles.filters}>
          <button className={styles.filterButton}>
            <span>주요 국가별</span>
            <img src={iconArrow} alt="" className={styles.filterArrow} />
          </button>
          <button className={styles.filterButton}>
            <span>계절별</span>
            <img src={iconArrow} alt="" className={styles.filterArrow} />
          </button>
        </div>

        {/* Ranking List */}
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
                <div className={styles.iconWrapper}>
                  <img src={iconStar} alt="star" className={styles.actionIcon} />
                </div>
                <div className={styles.iconWrapper}>
                  <img src={iconMap} alt="map" className={styles.actionIcon} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className={styles.bottomNav}>
        <button className={styles.navItem} onClick={() => navigate('/ranking')}>
          <div className={styles.navIconWrapper}>
            <img src={iconHomeInactive} alt="home" className={styles.navIcon} />
          </div>
        </button>
        <button className={styles.navItem}>
          <div className={styles.navIconWrapper}>
            <img src={iconPostActive} alt="post" className={styles.navIcon} />
          </div>
        </button>
        <button className={styles.navItem}>
          <div className={styles.navIconWrapper}>
            <img src={iconPen} alt="pen" className={styles.navIcon} />
          </div>
        </button>
        <button className={styles.navItem}>
          <div className={styles.navIconWrapper}>
            <img src={iconProfile} alt="profile" className={styles.navIcon} />
          </div>
        </button>
      </nav>

      {/* Home Indicator */}
      <div className={styles.homeIndicator}>
        <div className={styles.homeIndicatorBar} />
      </div>
    </div>
  )
}

export default RankingDetail
