import styles from './Profilemodal.module.css';

function LogoutModal({ onClose, onConfirm }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalCompact} onClick={(e) => e.stopPropagation()}>
        <div className={styles.confirmIconArea}>
          <span className={styles.confirmEmoji}>👋</span>
        </div>
        <h2 className={styles.confirmTitle}>로그아웃 하시겠어요?</h2>
        <p className={styles.confirmDesc}>로그아웃 후 다시 로그인하면<br />모든 기능을 이용할 수 있습니다.</p>

        <div className={styles.confirmButtons}>
          <button type="button" className={styles.cancelButton} onClick={onClose}>
            취소
          </button>
          <button type="button" className={styles.dangerButton} onClick={onConfirm}>
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogoutModal;