import { useNavigate } from 'react-router-dom'
import styles from './BlogDetail.module.css'

// Figma 아이콘 에셋 URL
const iconBack = "http://localhost:3845/assets/c1e8df364647065e420bc2e5a294f92d9321e018.svg"
const iconArrow = "http://localhost:3845/assets/bd539d5d4fca8bbbafae20fa19b2a671f19b4071.svg"
const iconHomeInactive = "http://localhost:3845/assets/9872fc521d567fff1381b2295e01f331f459464d.svg"
const iconPostActive = "http://localhost:3845/assets/a06ff4fafbd2b64f1431b943be5c58136a4bb953.svg"
const iconPen = "http://localhost:3845/assets/b684b03cfe3098d5db1f56026c0e91677c6247a8.svg"
const iconProfile = "http://localhost:3845/assets/b48c86993d5210d5c60110b1d62770aa07ed3ec0.svg"

const blogData = [
  { id: 1, title: '푸바오 보러 중국으로', author: '오승윤', location: '중국', date: '2일 전' },
  { id: 2, title: '25년 일본 여행기', author: '김경윤', location: '일본', date: '7일 전' },
  { id: 3, title: '겨울 국내 여행', author: '조상철', location: '대한민국', date: '2일 전' },
  { id: 4, title: '싱가포르 국외현장체험', author: '오승윤', location: '이탈리아', date: '2일 전' },
  { id: 5, title: '푸바오 보러 중국으로', author: '오승윤', location: '중국', date: '2일 전', highlight: true },
  { id: 6, title: '25년 일본 여행기', author: '김경윤', location: '일본', date: '7일 전' },
  { id: 7, title: '겨울 국내 여행', author: '조상철', location: '대한민국', date: '2일 전' },
  { id: 8, title: '싱가포르 국외현장체험', author: '오승윤', location: '이탈리아', date: '2일 전' },
]

function BlogDetail() {
  const navigate = useNavigate()

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          <img src={iconBack} alt="back" className={styles.backIcon} />
        </button>
        <h1 className={styles.title}>블로그</h1>
      </header>

      {/* Divider */}
      <div className={styles.divider} />

      {/* Content Area */}
      <div className={styles.contentArea}>
        {/* Filter */}
        <div className={styles.filters}>
          <button className={styles.filterButton}>
            <span className={styles.filterText}>조회수 많은 순</span>
            <img src={iconArrow} alt="" className={styles.filterArrow} />
          </button>
        </div>

        {/* Blog List */}
        <div className={styles.blogList}>
          {blogData.map((item) => (
            <div 
              key={item.id} 
              className={`${styles.blogItem} ${item.highlight ? styles.blogItemHighlight : ''}`}
            >
              <div className={styles.blogText}>
                <p className={styles.blogTitle}>{item.title}</p>
                <div className={styles.blogMeta}>
                  <span className={styles.metaText}>{item.author}</span>
                  <span className={styles.dot}>·</span>
                  <span className={styles.metaText}>{item.location}</span>
                  <span className={styles.dot}>·</span>
                  <span className={styles.metaText}>{item.date}</span>
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

export default BlogDetail
