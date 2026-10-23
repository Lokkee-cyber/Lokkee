
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    if (
      location.pathname.startsWith("/admin") ||
      location.pathname.startsWith("/manage") ||
      location.pathname.startsWith("/private")
    ) {
      return;
    }

    if (typeof window.gtag !== "function") return;

    window.gtag("event", "page_view", {
      page_title: document.title,
      page_location: window.location.href,
      page_path:
        location.pathname + location.search + location.hash,
    });
  }, [location]);

  return null;
}
