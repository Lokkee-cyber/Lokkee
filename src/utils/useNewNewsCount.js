import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { publishedArticles } from '../data/articles.js';

const storageKey = 'lokkeeverse:news-last-seen';
const firstVisitWindowMs = 7 * 24 * 60 * 60 * 1000;

const newsTimes = publishedArticles
  .filter((article) => article.status === 'published' && article.automation?.generated === true)
  .map((article) => Date.parse(article.publishedAt || article.date))
  .filter(Number.isFinite);
const latestNewsTime = newsTimes.length ? Math.max(...newsTimes) : 0;

function readLastSeen() {
  try {
    const stored = Number(window.localStorage.getItem(storageKey));
    return Number.isFinite(stored) && stored > 0 ? stored : Date.now() - firstVisitWindowMs;
  } catch {
    return Date.now() - firstVisitWindowMs;
  }
}

// Counts news stories published since the visitor last opened the News page.
export default function useNewNewsCount() {
  const { pathname } = useLocation();
  const [lastSeen, setLastSeen] = useState(readLastSeen);

  useEffect(() => {
    if (pathname !== '/news' && !pathname.startsWith('/news/')) return;
    try {
      window.localStorage.setItem(storageKey, String(latestNewsTime));
    } catch {
      // Storage can be unavailable (private mode); the badge then clears for this session only.
    }
    setLastSeen(latestNewsTime);
  }, [pathname]);

  return newsTimes.filter((time) => time > lastSeen).length;
}
