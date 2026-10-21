import { useEffect } from 'react';
import { useConsent } from '../utils/consent';

const DEFAULT_MEASUREMENT_ID = 'G-EX87YT857K';

export default function Analytics({ measurementId }) {
  const { adsAllowed: consented } = useConsent();
  const id = measurementId || DEFAULT_MEASUREMENT_ID;

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    window[`ga-disable-${id}`] = !consented;
    if (!consented) return undefined;

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.appendChild(script);
    window.gtag('js', new Date());
    window.gtag('config', id, { send_page_view: true });
    return () => script.remove();
  }, [id, consented]);

  return null;
}
