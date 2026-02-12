import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";
import BottomNav from "../../components/BottomNav/BottomNav";

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
    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16 24.75L8 21.8625L1.8 24.3375C1.35556 24.5208 0.944444 24.4695 0.566667 24.1835C0.188889 23.8975 0 23.5134 0 23.0312V3.78125C0 3.48333 0.0835555 3.21979 0.250667 2.99063C0.417778 2.76146 0.645333 2.58958 0.933333 2.475L8 0L16 2.8875L22.2 0.4125C22.6444 0.229167 23.0556 0.280958 23.4333 0.567875C23.8111 0.854792 24 1.23842 24 1.71875V20.9688C24 21.2667 23.9169 21.5302 23.7507 21.7594C23.5844 21.9885 23.3564 22.1604 23.0667 22.275L16 24.75ZM14.6667 21.3812V5.29375L9.33333 3.36875V19.4562L14.6667 21.3812Z"
        fill="#C2C2C2"
      />
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
  { id: 5, title: "경복궁", location: "대한민국 서울", category: "역사", image: machuPicchu, favorite: false },
  { id: 6, title: "성산일출봉", location: "대한민국 제주", category: "자연", image: machuPicchu, favorite: false },
  { id: 7, title: "해운대 해수욕장", location: "대한민국 부산", category: "휴양", image: machuPicchu, favorite: true },
  { id: 8, title: "불국사", location: "대한민국 경북", category: "역사", image: machuPicchu, favorite: false },
  { id: 9, title: "전주 한옥마을", location: "대한민국 전북", category: "문화", image: machuPicchu, favorite: false },
  { id: 10, title: "설악산 국립공원", location: "대한민국 강원", category: "국립공원", image: machuPicchu, favorite: false },
  { id: 11, title: "슬품이 집", location: "대한민국 서울", category: "랜드마크", image: machuPicchu, favorite: true },
];

function Home() {
  const navigate = useNavigate();

  const [type, setType] = useState("일반");
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState("테마");
  const [sort, setSort] = useState("기본 순");
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

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
          <div className={styles.typeDropdownWrapper}>
            <button
              className={styles.typeButton}
              type="button"
              onClick={() => setShowTypeDropdown(!showTypeDropdown)}
            >
              <span>{type}</span>
              <span className={styles.typeArrow}>
                <DropdownArrow />
              </span>
            </button>

            {showTypeDropdown && (
              <div className={styles.typeDropdown}>
                <button
                  className={styles.dropdownItem}
                  type="button"
                  onClick={() => {
                    setType("일반");
                    setShowTypeDropdown(false);
                  }}
                >
                  일반 서치
                </button>
                <button
                  className={styles.dropdownItem}
                  type="button"
                  onClick={() => {
                    setType("슈퍼");
                    setShowTypeDropdown(false);
                  }}
                >
                  <span>슈퍼 서치</span>
                  <span className={styles.dropdownCredit}>10 크레딧 소요</span>
                </button>
              </div>
            )}
          </div>

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

      <BottomNav activePage="home" />
    </div>
  );
}

export default Home;
