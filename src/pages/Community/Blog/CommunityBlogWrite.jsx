import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './CommunityBlogWrite.module.css'
import BottomNav from '../../../components/BottomNav/BottomNav'
import { writeBlog } from '../../../api/recommendApi'

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

function CommunityBlogWrite() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [country, setCountry] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const canSubmit = title.trim() && content.trim() && country.trim()

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return
    setSubmitting(true)
    setError('')
    try {
      const today = new Date().toISOString().split('T')[0]
      await writeBlog({ title: title.trim(), content: content.trim(), country: country.trim(), date: today })
      navigate('/community/blog', { replace: true })
    } catch (err) {
      console.error('블로그 작성 실패:', err)
      setError('게시글 작성에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          <BackIcon />
        </button>
        <h1 className={styles.headerTitle}>글쓰기</h1>
        <button
          className={styles.submitButton}
          onClick={handleSubmit}
          disabled={!canSubmit || submitting}
        >
          {submitting ? '등록 중' : '등록'}
        </button>
      </header>

      <div className={styles.divider} />

      <div className={styles.form}>
        <input
          className={styles.titleInput}
          type="text"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
        />
        <div className={styles.fieldDivider} />
        <input
          className={styles.countryInput}
          type="text"
          placeholder="여행 국가를 입력하세요"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          maxLength={50}
        />
        <div className={styles.fieldDivider} />
        <textarea
          className={styles.contentInput}
          placeholder="내용을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        {error && <p className={styles.errorText}>{error}</p>}
      </div>

      <BottomNav activePage="community" />
    </div>
  )
}

export default CommunityBlogWrite
