import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";

import singaporeBanner from "../../assets/singapore-banner.png";
import machuPicchu from "../../assets/machu-picchu.png";

function DropdownArrow() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 4L6 8L10 4" stroke="#A6A6A6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StarIcon({ active }) {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16 4.77L19.09 11.04L19.18 11.22L19.38 11.25L26.3 12.26L21.14 17.29L21 17.43L21.03 17.63L22.22 24.52L16.17 21.34L16 21.25L15.83 21.34L9.78 24.52L10.97 17.63L11 17.43L10.86 17.29L5.7 12.26L12.62 11.25L12.82 11.22L12.91 11.04L16 4.77Z"
        fill={active ? "#FFC300" : "#D9D9D9"}
      />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg width="32" height="33" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8 6.13V28.88L16 24.13L24 28.88V6.13C24 5.6 23.79 5.09 23.41 4.72C23.04 4.34 22.53 4.13 22 4.13H10C9.47 4.13 8.96 4.34 8.59 4.72C8.21 5.09 8 5.6 8 6.13Z"
        stroke="#C2C2C2"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HomeIcon({ active }) {
  return (
    <svg width="26" height="29" viewBox="0 0 27 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3.33 13.33V26.67C3.33 27.55 4.05 28.27 4.93 28.27H10V20H16.67V28.27H21.73C22.62 28.27 23.33 27.55 23.33 26.67V13.33"
        stroke={active ? "#181818" : "#B8B8B8"}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1 15L13.33 2.67L25.67 15"
        stroke={active ? "#181818" : "#B8B8B8"}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PostIcon({ active }) {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill={active ? "#181818" : "#B8B8B8"} xmlns="http://www.w3.org/2000/svg">
      <path d="M4 4H26V22H4V4ZM6 6V20H24V6H6ZM4 24H26V26H4V24Z" />
    </svg>
  );
}

function PenIcon({ active }) {
  return (
    <svg width="33" height="33" viewBox="0 0 34 34" fill={active ? "#181818" : "#B8B8B8"} xmlns="http://www.w3.org/2000/svg">
      <path d="M24.5 4.5L29.5 9.5L10 29H5V24L24.5 4.5Z" />
    </svg>
  );
}

function ProfileIcon({ active }) {
  return (
    <svg width="33" height="33" viewBox="0 0 34 34" fill={active ? "#181818" : "#B8B8B8"} xmlns="http://www.w3.org/2000/svg">
      <path d="M17 17C20.31 17 23 14.31 23 11C23 7.69 20.31 5 17 5C13.69 5 11 7.69 11 11C11 14.31 13.69 17 17 17ZM17 20C12.33 20 3 22.34 3 27V29H31V27C31 22.34 21.67 20 17 20Z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10.5 18.5C14.6421 18.5 18 15.1421 18 11C18 6.85786 14.6421 3.5 10.5 3.5C6.35786 3.5 3 6.85786 3 11C3 15.1421 6.35786 18.5 10.5 18.5Z"
        stroke="#A6A6A6"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M20 20L17 17" stroke="#A6A6A6" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const destinationData = [
  { id: 1, title: "마추픽추", location: "페루 쿠스코", category: "역사", image: machuPicchu, favorite: true },
  { id: 2, title: "에펠탑", location: "프랑스 파리", category: "랜드마크", image: machuPicchu, favorite: true },
  { id: 3, title: "그랜드 캐년", location: "미국 애리조나", category: "국립공원", image: machuPicchu, favorite: false },
  { id: 4, title: "산토리니", location: "그리스", category: "휴양", image: machuPicchu, favorite: false },
];

function Home() {
  const navigate = useNavigate();

  const [type, setType] = useState("일반");
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState("테마");
  const [sort, setSort] = useState("기본 순");

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return destinationData;
    return destinationData.filter((d) => d.title.includes(q) || d.location.includes(q) || d.category.includes(q));
  }, [query]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.serviceTitle}>서비스명</h1>
      </header>
      <section className={styles.bannerSection}>
        <div className={styles.bannerCard}>
          <img className={styles.bannerImage} src={singaporeBanner} alt="배너" />
          <div className={styles.bannerOverlay}>
            <div className={styles.bannerIndicator}>
              <span className={`${styles.dot} ${styles.dotActive}`} />
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className={styles.dot} />
            </div>
          </div>
        </div>

        <div className={styles.searchRow}>
          <button className={styles.typeButton} type="button" onClick={() => setType((p) => (p === "일반" ? "프리미엄" : "일반"))}>
            <span>{type}</span>
            <span className={styles.typeArrow}>
              <DropdownArrow />
            </span>
          </button>

          <div className={styles.searchBox}>
            <input
              className={styles.searchInput}
              placeholder="어느 나라로 떠날까요?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className={styles.searchIcon}>
              <SearchIcon />
            </div>
          </div>
        </div>
      </section>

      <div className={styles.divider} />

      <div className={styles.listHeader}>
        <h2 className={styles.sectionTitle}>여행지 추천</h2>

        <div className={styles.pills}>
          <button className={styles.pill} type="button" onClick={() => setTheme((p) => (p === "테마" ? "자연" : "테마"))}>
            <span>{theme}</span>
            <DropdownArrow />
          </button>
          <button className={styles.pill} type="button" onClick={() => setSort((p) => (p === "기본 순" ? "인기 순" : "기본 순"))}>
            <span>{sort}</span>
            <DropdownArrow />
          </button>
        </div>
      </div>

      <div className={styles.list}>
        {filtered.map((item) => (
          <div key={item.id} className={styles.row}>
            <div className={styles.left}>
              <img className={styles.thumb} src={item.image} alt={item.title} />
              <div className={styles.text}>
                <div className={styles.name}>{item.title}</div>
                <div className={styles.meta}>
                  <span>{item.location}</span>
                  <span className={styles.metaDot}>·</span>
                  <span>{item.category}</span>
                </div>
              </div>
            </div>

            <div className={styles.actions}>
              <button className={styles.iconBtn} type="button" aria-label="favorite">
                <StarIcon active={item.favorite} />
              </button>
              <button className={styles.iconBtn} type="button" aria-label="bookmark">
                <BookmarkIcon />
              </button>
            </div>
          </div>
        ))}
      </div>

      <nav className={styles.bottomNav}>
        <button className={styles.navItem} onClick={() => navigate("/")}>
          <HomeIcon active={true} />
        </button>
        <button className={styles.navItem} onClick={() => navigate("/community")}>
          <PostIcon active={false} />
        </button>
        <button className={styles.navItem} onClick={() => navigate("/write")}>
          <PenIcon active={false} />
        </button>
        <button className={styles.navItem} onClick={() => navigate("/profile")}>
          <ProfileIcon active={false} />
        </button>
      </nav>
    </div>
  );
}

export default Home;
