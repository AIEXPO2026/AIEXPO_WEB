import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";
import BottomNav from "../../components/BottomNav/BottomNav";

import singaporeBanner from "../../assets/singapore-banner.png";
import machuPicchu from "../../assets/machu-picchu.png";

const BANNERS = [singaporeBanner, machuPicchu];

import { getRecommendations } from "../../api/recommendApi";
import { getBookmarks, addBookmark, deleteBookmark } from "../../api/profileApi";

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

  const [currentBanner, setCurrentBanner] = useState(0);
  const touchStartX = useRef(null);

  const [items, setItems] = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());

  useEffect(() => {
    const load = async () => {
      const [recs, bookmarks] = await Promise.all([
        getRecommendations().catch(() => []),
        getBookmarks().catch(() => []),
      ]);
      const list = Array.isArray(recs) ? recs : [];
      setItems(list.map(normalizeItem));

      const ids = new Set(
        (Array.isArray(bookmarks) ? bookmarks : []).map((b) => b.destinationId)
      );
      setBookmarkedIds(ids);
    };
    load();
  }, []);

  const handleToggleBookmark = async (e, destinationId) => {
    e.stopPropagation();
    const isBookmarked = bookmarkedIds.has(destinationId);

    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (isBookmarked) next.delete(destinationId);
      else next.add(destinationId);
      return next;
    });

    try {
      if (isBookmarked) {
        await deleteBookmark(destinationId);
      } else {
        await addBookmark(destinationId);
      }
    } catch {
      setBookmarkedIds((prev) => {
        const next = new Set(prev);
        if (isBookmarked) next.add(destinationId);
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

  const handleBannerTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleBannerTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 40) return;
    if (delta < 0) {
      setCurrentBanner((p) => (p + 1) % BANNERS.length);
    } else {
      setCurrentBanner((p) => (p - 1 + BANNERS.length) % BANNERS.length);
    }
  };

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
        <h1 className={styles.serviceTitle}>서비스명</h1>
      </header>
      <section className={styles.bannerSection}>
        <div
          className={styles.bannerCard}
          onTouchStart={handleBannerTouchStart}
          onTouchEnd={handleBannerTouchEnd}
        >
          <div
            className={styles.bannerTrack}
            style={{ transform: `translateX(-${currentBanner * 100}%)` }}
          >
            {BANNERS.map((src, i) => (
              <img key={i} className={styles.bannerSlide} src={src} alt={`배너 ${i + 1}`} />
            ))}
          </div>
          <div className={styles.bannerOverlay}>
            <div className={styles.bannerIndicator}>
              {BANNERS.map((_, i) => (
                <span
                  key={i}
                  className={`${styles.dot} ${i === currentBanner ? styles.dotActive : ""}`}
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
          {/* 테마 드롭다운 */}
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

          {/* 정렬 드롭다운 */}
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
          <div
            key={item.destinationId}
            className={styles.row}
          >
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
                aria-label="travel"
                onClick={() => navigate("/search-result/detail", { state: { item } })}
              >
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
