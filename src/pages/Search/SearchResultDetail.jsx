import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./SearchResultDetail.module.css";
import BottomNav from "../../components/BottomNav/BottomNav";

function StarIcon({ active }) {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16 4.77L19.09 11.04L19.18 11.22L19.38 11.25L26.3 12.26L21.14 17.29L21 17.43L21.03 17.63L22.22 24.52L16.17 21.34L16 21.25L15.83 21.34L9.78 24.52L10.97 17.63L11 17.43L10.86 17.29L5.7 12.26L12.62 11.25L12.82 11.22L12.91 11.04L16 4.77Z"
        fill={active ? "#FFC300" : "#D9D9D9"}
      />
    </svg>
  );
}

function SearchResultDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const item = location.state?.item;

  const [starred, setStarred] = useState(item?.favorite ?? false);

  if (!item) {
    navigate(-1);
    return null;
  }

  const mapQuery = encodeURIComponent(`${item.title} ${item.location}`);
  const mapSrc   = `https://maps.google.com/maps?q=${mapQuery}&output=embed&z=14`;

  return (
    <div className={styles.container}>
      {/* 지도 영역 */}
      <div className={styles.mapArea}>
        <iframe
          className={styles.mapFrame}
          src={mapSrc}
          title="지도"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      {/* 하단 정보 시트 */}
      <div className={styles.sheet}>
        <div className={styles.dragHandle} />

        <div className={styles.card}>
          {item.image && (
            <img
              className={styles.thumb}
              src={item.image}
              alt={item.title}
              onError={(e) => { e.target.style.display = "none"; }}
            />
          )}

          <div className={styles.textBlock}>
            <div className={styles.name}>{item.title}</div>
            <div className={styles.meta}>
              <span>{item.location}</span>
              {item.category && (
                <>
                  <span className={styles.metaDot}>·</span>
                  <span>{item.category}</span>
                </>
              )}
            </div>
            {item.description && (
              <p className={styles.description}>{item.description}</p>
            )}
          </div>

          <button
            className={styles.starBtn}
            type="button"
            aria-label="favorite"
            onClick={() => setStarred((p) => !p)}
          >
            <StarIcon active={starred} />
          </button>
        </div>
      </div>

      <BottomNav activePage="home" />
    </div>
  );
}

export default SearchResultDetail;
