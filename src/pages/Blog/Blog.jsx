import { useNavigate } from 'react-router-dom'
import styles from './Blog.module.css'

const blogData = [
  { id: 1, title: '푸바오 보러 중국으로', author: '오승윤', location: '중국', time: '2일 전' },
  { id: 2, title: '25년 일본 여행기', author: '김경윤', location: '일본', time: '7일 전' },
  { id: 3, title: '겨울 국내 여행', author: '조상철', location: '대한민국', time: '2일 전' },
  { id: 4, title: '싱가포르 국외현장체험', author: '오승윤', location: '이탈리아', time: '2일 전' },
  { id: 5, title: '푸바오 보러 중국으로', author: '오승윤', location: '중국', time: '2일 전', highlighted: true },
  { id: 6, title: '25년 일본 여행기', author: '김경윤', location: '일본', time: '7일 전' },
  { id: 7, title: '겨울 국내 여행', author: '조상철', location: '대한민국', time: '2일 전' },
  { id: 8, title: '싱가포르 국외현장체험', author: '오승윤', location: '이탈리아', time: '2일 전' },
]

function BackIcon() {
  return (
    <svg width="16" height="32" viewBox="0 0 16 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 4L2 16L14 28" stroke="#252525" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
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

function Blog() {
  const navigate = useNavigate()

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate('/ranking')}>
          <BackIcon />
        </button>
        <h1 className={styles.title}>블로그</h1>
      </header>

      <div className={styles.divider} />

      <div className={styles.filters}>
        <button className={styles.filterButton}>
          <span>조회수 많은 순</span>
          <DropdownArrow />
        </button>
      </div>

      <div className={styles.blogList}>
        {blogData.map((item) => (
          <div
            key={item.id}
            className={`${styles.blogItem} ${item.highlighted ? styles.blogItemHighlighted : ''}`}
          >
            <span className={styles.blogTitle}>{item.title}</span>
            <div className={styles.blogMeta}>
              <span>{item.author}</span>
              <span className={styles.dot}>·</span>
              <span>{item.location}</span>
              <span className={styles.dot}>·</span>
              <span>{item.time}</span>
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

export default Blog
