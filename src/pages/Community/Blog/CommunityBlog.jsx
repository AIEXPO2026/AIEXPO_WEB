import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './CommunityBlog.module.css'
import BottomNav from '../../../components/BottomNav/BottomNav'
import { getBlogList } from '../../../api/recommendApi'

function PencilIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="#252525"/>
    </svg>
  )
}

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

function BlogDetail() {
  const navigate = useNavigate()
  const [blogData, setBlogData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await getBlogList()
        setBlogData(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('블로그 데이터 로드 실패:', err)
        setError('블로그 데이터를 불러오지 못했습니다.')
      } finally {
        setLoading(false)
      }
    }
    fetchBlogs()
  }, [])

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          <BackIcon />
        </button>
        <h1 className={styles.title}>블로그</h1>
        <button className={styles.writeButton} onClick={() => navigate('/community/blog/write')}>
          <PencilIcon />
        </button>
      </header>

      <div className={styles.divider} />

      <div className={styles.contentArea}>
        <div className={styles.filters}>
          <button className={styles.filterButton}>
            <span className={styles.filterText}>조회수 많은 순</span>
            <DropdownArrow />
          </button>
        </div>

        {loading ? (
          <p className={styles.loadingState}>불러오는 중...</p>
        ) : error ? (
          <p className={styles.errorState}>{error}</p>
        ) : blogData.length === 0 ? (
          <p className={styles.emptyState}>블로그 게시글이 없습니다.</p>
        ) : (
          <div className={styles.blogList}>
            {blogData.map((item, idx) => (
              <div
                key={item.id ?? idx}
                className={styles.blogItem}
                onClick={() => navigate(`/community/blog/${item.id}`)}
              >
                <div className={styles.blogText}>
                  <p className={styles.blogTitle}>{item.title}</p>
                  <div className={styles.blogMeta}>
                    <span className={styles.metaText}>{item.author ?? item.nickname}</span>
                    <span className={styles.dot}>·</span>
                    <span className={styles.metaText}>{item.country}</span>
                    <span className={styles.dot}>·</span>
                    <span className={styles.metaText}>{item.date}</span>
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

export default BlogDetail
