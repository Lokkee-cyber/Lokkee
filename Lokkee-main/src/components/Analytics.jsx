import { useEffect } from 'react';

export default function Analytics({ measurementId }) {
  useEffect(() => {
    if (!measurementId || typeof window === 'undefined') return undefined;
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);
    window.gtag = window.gtag || function () {};
    window.gtag('js', new Date());
    window.gtag('config', measurementId, { send_page_view: true });
    return () => script.remove();
  }, [measurementId]);

  return null;
}
