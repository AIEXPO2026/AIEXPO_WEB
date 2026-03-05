import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";
import BottomNav from "../../components/BottomNav/BottomNav";
import { getRecommendations } from "../../api/recommendApi";
import { getBookmarks, addBookmark, deleteBookmark } from "../../api/profileApi";

import singaporeBanner from "../../assets/singapore-banner.png";
import machuPicchu from "../../assets/machu-picchu.png";

const BANNER_SLIDES = [
  { image: singaporeBanner, alt: "싱가포르" },
  { image: machuPicchu, alt: "마추픽추" },
];

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

function MapIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 28.875L12 25.9875L5.8 28.4625C5.35556 28.6458 4.94444 28.5945 4.56667 28.3085C4.18889 28.0225 4 27.6384 4 27.1562V7.90625C4 7.60833 4.08356 7.34479 4.25067 7.11563C4.41778 6.88646 4.64533 6.71458 4.93333 6.6L12 4.125L20 7.0125L26.2 4.5375C26.6444 4.35417 27.0556 4.40596 27.4333 4.69288C27.8111 4.97979 28 5.36342 28 5.84375V25.0938C28 25.3917 27.9169 25.6552 27.7507 25.8844C27.5844 26.1135 27.3564 26.2854 27.0667 26.4L20 28.875ZM18.6667 25.5062V9.41875L13.3333 7.49375V23.5812L18.6667 25.5062Z" fill="#B8B8B8"/>
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

function normalizeItem(item) {
  return {
    destinationId: item.destinationId ?? item.id,
    title:    item.name     ?? item.title    ?? "",
    location: item.location ?? item.country  ?? item.city ?? "",
    category: item.theme    ?? item.category ?? "",
    image:    item.imageUrl ?? item.image_url ?? item.image ?? null,
  };
}

const THEME_OPTIONS = [
  { label: "전체", value: "전체" },
  { label: "자연", value: "자연" },
  { label: "역사", value: "역사" },
  { label: "휴양", value: "휴양" },
  { label: "문화", value: "문화" },
  { label: "랜드마크", value: "랜드마크" },
  { label: "국립공원", value: "국립공원" },
];
const SORT_OPTIONS = [
  { label: "기본 순", value: "기본 순" },
  { label: "인기 순", value: "인기 순" },
  { label: "가나다 순", value: "가나다 순" },
];

function Home() {
  const navigate = useNavigate();

  const [type, setType] = useState("일반");
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState("전체");
  const [sort, setSort] = useState("기본 순");
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const [currentSlide, setCurrentSlide] = useState(0);
  const timerRef = useRef(null);
  const dragStartX = useRef(null);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNER_SLIDES.length);
    }, 3500);
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  const goToSlide = (index) => {
    clearInterval(timerRef.current);
    setCurrentSlide(index);
    startTimer();
  };

  const handleDragStart = (e) => {
    dragStartX.current = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
  };

  const handleDragEnd = (e) => {
    if (dragStartX.current === null) return;
    const endX = e.type === "touchend" ? e.changedTouches[0].clientX : e.clientX;
    const diff = dragStartX.current - endX;
    dragStartX.current = null;
    if (Math.abs(diff) < 30) return;
    const next = diff > 0
      ? (currentSlide + 1) % BANNER_SLIDES.length
      : (currentSlide - 1 + BANNER_SLIDES.length) % BANNER_SLIDES.length;
    goToSlide(next);
  };

  const [items, setItems] = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());

  useEffect(() => {
    const load = async () => {
      const [recs, bookmarks] = await Promise.all([
        getRecommendations().catch(() => []),
        getBookmarks().catch(() => []),
      ]);
      setItems((Array.isArray(recs) ? recs : []).map(normalizeItem));
      setBookmarkedIds(new Set(
        (Array.isArray(bookmarks) ? bookmarks : []).map((b) => b.destinationId)
      ));
    };
    load();
  }, []);

  const handleToggleBookmark = async (e, destinationId) => {
    e.stopPropagation();
    const isCurrentlyBookmarked = bookmarkedIds.has(destinationId);
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (isCurrentlyBookmarked) next.delete(destinationId);
      else next.add(destinationId);
      return next;
    });
    try {
      if (isCurrentlyBookmarked) {
        await deleteBookmark(destinationId);
      } else {
        await addBookmark(destinationId);
      }
    } catch {
      setBookmarkedIds((prev) => {
        const next = new Set(prev);
        if (isCurrentlyBookmarked) next.add(destinationId);
        else next.delete(destinationId);
        return next;
      });
    }
  };

  const filtered = useMemo(() => {
    let list = items;
    if (theme !== "전체") {
      list = list.filter((d) => d.category === theme);
    }
    if (sort === "인기 순") {
      list = [...list].sort(
        (a, b) =>
          Number(bookmarkedIds.has(b.destinationId)) -
          Number(bookmarkedIds.has(a.destinationId))
      );
    } else if (sort === "가나다 순") {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title, "ko"));
    }
    return list;
  }, [items, theme, sort, bookmarkedIds]);

  const handleSearch = () => {
    const q = query.trim();
    if (!q) return;
    navigate("/search-result", { state: { query: q, type } });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.serviceTitle}>길담</h1>
      </header>
      <section className={styles.bannerSection}>
        <div
          className={styles.bannerCard}
          onMouseDown={handleDragStart}
          onMouseUp={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchEnd={handleDragEnd}
        >
          <img className={styles.bannerImage} src={BANNER_SLIDES[currentSlide].image} alt={BANNER_SLIDES[currentSlide].alt} />
          <div className={styles.bannerOverlay}>
            <div className={styles.bannerIndicator}>
              {BANNER_SLIDES.map((_, i) => (
                <span
                  key={i}
                  className={`${styles.dot} ${i === currentSlide ? styles.dotActive : ""}`}
                  onClick={() => goToSlide(i)}
                  style={{ cursor: "pointer" }}
                />
              ))}
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
                  onClick={() => { setType("일반"); setShowTypeDropdown(false); }}
                >
                  일반 서치
                </button>
                <button
                  className={styles.dropdownItem}
                  type="button"
                  onClick={() => { setType("슈퍼"); setShowTypeDropdown(false); }}
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
              onKeyDown={handleKeyDown}
            />
            <button className={styles.searchIconBtn} type="button" onClick={handleSearch} aria-label="검색">
              <SearchIcon />
            </button>
          </div>
        </div>
      </section>

      <div className={styles.divider} />

      <div className={styles.listHeader}>
        <h2 className={styles.sectionTitle}>여행지 추천</h2>

        <div className={styles.pills}>
          <div className={styles.pillWrapper}>
            <button
              className={`${styles.pill} ${theme !== "전체" ? styles.pillActive : ""}`}
              type="button"
              onClick={() => { setShowThemeDropdown((p) => !p); setShowSortDropdown(false); }}
            >
              <span>{theme}</span>
              <DropdownArrow />
            </button>
            {showThemeDropdown && (
              <div className={styles.pillDropdown}>
                {THEME_OPTIONS.map(({ label, value }) => (
                  <button
                    key={value}
                    className={`${styles.pillDropdownItem} ${theme === value ? styles.pillDropdownItemActive : ""}`}
                    type="button"
                    onClick={() => { setTheme(value); setShowThemeDropdown(false); }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className={styles.pillWrapper}>
            <button
              className={`${styles.pill} ${sort !== "기본 순" ? styles.pillActive : ""}`}
              type="button"
              onClick={() => { setShowSortDropdown((p) => !p); setShowThemeDropdown(false); }}
            >
              <span>{sort}</span>
              <DropdownArrow />
            </button>
            {showSortDropdown && (
              <div className={styles.pillDropdown}>
                {SORT_OPTIONS.map(({ label, value }) => (
                  <button
                    key={value}
                    className={`${styles.pillDropdownItem} ${sort === value ? styles.pillDropdownItemActive : ""}`}
                    type="button"
                    onClick={() => { setSort(value); setShowSortDropdown(false); }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.list}>
        {filtered.map((item) => (
          <div key={item.destinationId} className={styles.row}>
            <div className={styles.left}>
              <img
                className={styles.thumb}
                src={item.image || ""}
                alt={item.title}
                onError={(e) => { e.target.style.visibility = "hidden"; }}
              />
              <div className={styles.text}>
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
              </div>
            </div>

            <div className={styles.actions}>
              <button
                className={styles.iconBtn}
                type="button"
                aria-label="bookmark"
                onClick={(e) => handleToggleBookmark(e, item.destinationId)}
              >
                <StarIcon active={bookmarkedIds.has(item.destinationId)} />
              </button>
              <button
                className={styles.iconBtn}
                type="button"
                aria-label="지도 보기"
                onClick={() => navigate("/search-result/detail", { state: { item } })}
              >
                <MapIcon />
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
