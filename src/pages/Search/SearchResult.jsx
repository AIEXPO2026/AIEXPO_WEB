import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./SearchResult.module.css";
import BottomNav from "../../components/BottomNav/BottomNav";
import { search, superSearch } from "../../api/searchApi";
import { getBookmarks, addBookmark, deleteBookmark } from "../../api/profileApi";

// ── 아이콘 ──────────────────────────────────────────
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
  );
}

function DropdownArrow() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 4L6 8L10 4" stroke="#5a5a5a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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

// API 응답 필드 정규화
function normalizeItem(item) {
  return {
    destinationId: item.destinationId ?? item.id,
    title:       item.name       ?? item.title    ?? "",
    location:    item.location   ?? item.country  ?? item.city ?? "",
    category:    item.theme      ?? item.category ?? "",
    image:       item.imageUrl   ?? item.image_url ?? item.image ?? null,
    description: item.description ?? "",
  };
}

const ATMOSPHERE_OPTIONS = ["전체", "낭만적", "활동적", "힐링", "모험"];
const TYPE_OPTIONS       = ["전체", "자연", "역사", "문화", "휴양", "랜드마크", "국립공원"];
const COST_OPTIONS       = ["전체", "저예산", "중간", "고급"];

function SearchResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const { query = "", type = "일반" } = location.state ?? {};

  const [results, setResults]     = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  const [atmosphere, setAtmosphere] = useState("분위기");
  const [placeType, setPlaceType]   = useState("유형");
  const [cost, setCost]             = useState("비용");

  const [showAtmosphere, setShowAtmosphere] = useState(false);
  const [showType, setShowType]             = useState(false);
  const [showCost, setShowCost]             = useState(false);

  const closeAll = () => {
    setShowAtmosphere(false);
    setShowType(false);
    setShowCost(false);
  };

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

  useEffect(() => {
    if (!query.trim()) return;

    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const [data, bookmarks] = await Promise.all([
          type === "슈퍼" ? superSearch(query) : search(query),
          getBookmarks().catch(() => []),
        ]);
        const list = Array.isArray(data) ? data : [];
        setResults(list.map(normalizeItem));

        const ids = new Set(
          (Array.isArray(bookmarks) ? bookmarks : []).map((b) => b.destinationId)
        );
        setBookmarkedIds(ids);
      } catch {
        setError("검색에 실패했습니다. 다시 시도해주세요.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, type]);

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <header className={styles.header}>
        <button className={styles.backBtn} type="button" onClick={() => navigate(-1)}>
          <BackIcon />
        </button>
        <h1 className={styles.title}>검색결과</h1>
        <div className={styles.headerSpacer} />
      </header>

      <div className={styles.divider} />

      {/* 필터 pill 행 */}
      <div className={styles.filterRow}>
        {/* 분위기 */}
        <div className={styles.pillWrapper}>
          <button
            className={`${styles.pill} ${atmosphere !== "분위기" ? styles.pillActive : ""}`}
            type="button"
            onClick={() => { closeAll(); setShowAtmosphere((p) => !p); }}
          >
            <span>{atmosphere}</span>
            <DropdownArrow />
          </button>
          {showAtmosphere && (
            <div className={styles.pillDropdown}>
              {ATMOSPHERE_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  className={`${styles.pillDropdownItem} ${atmosphere === opt || (opt === "전체" && atmosphere === "분위기") ? styles.pillDropdownItemActive : ""}`}
                  type="button"
                  onClick={() => { setAtmosphere(opt === "전체" ? "분위기" : opt); setShowAtmosphere(false); }}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 유형 */}
        <div className={styles.pillWrapper}>
          <button
            className={`${styles.pill} ${placeType !== "유형" ? styles.pillActive : ""}`}
            type="button"
            onClick={() => { closeAll(); setShowType((p) => !p); }}
          >
            <span>{placeType}</span>
            <DropdownArrow />
          </button>
          {showType && (
            <div className={styles.pillDropdown}>
              {TYPE_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  className={`${styles.pillDropdownItem} ${placeType === opt || (opt === "전체" && placeType === "유형") ? styles.pillDropdownItemActive : ""}`}
                  type="button"
                  onClick={() => { setPlaceType(opt === "전체" ? "유형" : opt); setShowType(false); }}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 비용 */}
        <div className={styles.pillWrapper}>
          <button
            className={`${styles.pill} ${cost !== "비용" ? styles.pillActive : ""}`}
            type="button"
            onClick={() => { closeAll(); setShowCost((p) => !p); }}
          >
            <span>{cost}</span>
            <DropdownArrow />
          </button>
          {showCost && (
            <div className={styles.pillDropdown}>
              {COST_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  className={`${styles.pillDropdownItem} ${cost === opt || (opt === "전체" && cost === "비용") ? styles.pillDropdownItemActive : ""}`}
                  type="button"
                  onClick={() => { setCost(opt === "전체" ? "비용" : opt); setShowCost(false); }}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 결과 목록 */}
      <div className={styles.list}>
        {loading && (
          <div className={styles.empty}>
            <p className={styles.emptyText}>검색 중...</p>
          </div>
        )}
        {!loading && error && (
          <div className={styles.empty}>
            <p className={styles.emptyText}>{error}</p>
          </div>
        )}
        {!loading && !error && results.length === 0 && (
          <div className={styles.empty}>
            <p className={styles.emptyText}>검색 결과가 없습니다.</p>
            <p className={styles.emptySubText}>다른 키워드로 검색해보세요.</p>
          </div>
        )}
        {!loading && !error && results.map((item) => (
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

export default SearchResult;
