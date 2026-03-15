export const COUNTRY_SEARCH_ENGINES = {
  "대한민국": [
    { code: "naver", label: "네이버" },
    { code: "google", label: "구글" },
    { code: "bing", label: "빙" },
  ],
  "일본": [
    { code: "google", label: "구글" },
    { code: "yahoo", label: "야후 재팬" },
    { code: "bing", label: "빙" },
  ],
  "미국": [
    { code: "google", label: "구글" },
    { code: "bing", label: "빙" },
    { code: "duckduckgo", label: "덕덕고" },
  ],
  "대만": [
    { code: "google", label: "구글" },
    { code: "bing", label: "빙" },
  ],
  "태국": [
    { code: "google", label: "구글" },
    { code: "bing", label: "빙" },
  ],
  "프랑스": [
    { code: "google", label: "구글" },
    { code: "bing", label: "빙" },
  ],
}

export const DEFAULT_ENGINES = [
  { code: "google", label: "구글" },
  { code: "bing", label: "빙" },
]

export const SUPPORTED_COUNTRIES = Object.keys(COUNTRY_SEARCH_ENGINES)

export const getEnginesForCountry = (country) =>
  COUNTRY_SEARCH_ENGINES[country] ?? DEFAULT_ENGINES
