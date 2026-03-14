import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styles from './CommunityBlogDetail.module.css'
import BottomNav from '../../../components/BottomNav/BottomNav'
import { getBlogDetail } from '../../../api/recommendApi'

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

function CommunityBlogDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const data = await getBlogDetail(id)
        setBlog(data)
      } catch (err) {
        console.error('블로그 상세 로드 실패:', err)
        setError('게시글을 불러오지 못했습니다.')
      } finally {
        setLoading(false)
      }
    }
    fetchBlog()
  }, [id])

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          <BackIcon />
        </button>
        <h1 className={styles.headerTitle}>블로그</h1>
      </header>

      <div className={styles.divider} />

      <div className={styles.contentArea}>
        {loading ? (
          <p className={styles.loadingState}>불러오는 중...</p>
        ) : error ? (
          <p className={styles.errorState}>{error}</p>
        ) : blog ? (
          <>
            <div className={styles.titleSection}>
              <h2 className={styles.title}>{blog.title}</h2>
              <div className={styles.meta}>
                <span>{blog.author}</span>
                <span className={styles.dot}>·</span>
                <span>{blog.country}</span>
                <span className={styles.dot}>·</span>
                <span>{blog.date}</span>
              </div>
            </div>
            <div className={styles.metaDivider} />
            <div className={styles.body}>
              {blog.content}
            </div>
          </>
        ) : null}
      </div>

      <BottomNav activePage="community" />
    </div>
  )
}

export default CommunityBlogDetail
