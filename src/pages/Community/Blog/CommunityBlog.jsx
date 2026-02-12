import { useNavigate } from 'react-router-dom'
import styles from './CommunityBlog.module.css'
import BottomNav from '../../../components/BottomNav/BottomNav'

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
          <BackIcon />
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
            <DropdownArrow />
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
      <BottomNav activePage="blog" />
    </div>
  )
}

export default BlogDetail
