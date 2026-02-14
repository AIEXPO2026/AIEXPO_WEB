import { useRegisterSW } from 'virtual:pwa-register/react'
import styles from './ReloadPrompt.module.css'

function ReloadPrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW()

  function close() {
    setNeedRefresh(false)
  }

  if (!needRefresh) return null

  return (
    <div className={styles.overlay}>
      <div className={styles.toast}>
        <p className={styles.message}>새로운 버전이 있습니다.</p>
        <div className={styles.buttons}>
          <button className={styles.updateBtn} onClick={() => updateServiceWorker(true)}>
            업데이트
          </button>
          <button className={styles.closeBtn} onClick={close}>
            닫기
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReloadPrompt
