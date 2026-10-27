import { useEffect, useRef, useState } from 'react';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useConsent } from '../utils/consent';

// Master switch for all in-app ad slots.
export const ADS_ENABLED = true;

/**
 * Display banner zones served by the acscdn (aclib) ad network.
 * `screens` controls which viewport classes each banner is eligible for:
 *   small  = under 600px, medium = 600-1199px, large = 1200px and up.
 */
const BANNERS = {
  banner300x100: { zoneId: '12372262', width: 300, height: 100, screens: ['small'] },
  banner250: { zoneId: '12372298', width: 250, height: 250, screens: ['small'] },
  banner300: { zoneId: '12372238', width: 300, height: 250, screens: ['small', 'medium', 'large'] },
  banner336: { zoneId: '12372270', width: 336, height: 280, screens: ['medium', 'large'] },
  banner468: { zoneId: '12372254', width: 468, height: 60, screens: ['medium', 'large'] },
  banner728: { zoneId: '12372246', width: 728, height: 90, screens: ['large'] },
};

// Screen-class presets: which banner to render on each viewport.
const AUTO_PRESETS = {
  small: ['banner300x100', 'banner300', 'banner250'],
  medium: ['banner468', 'banner336', 'banner300'],
  large: ['banner728', 'banner336', 'banner300'],
};

function screenClass(width) {
  if (width < 600) return 'small';
  if (width < 1200) return 'medium';
  return 'large';
}

let aclibReady = null;

// Loads aclib.js once and resolves when its banner API is callable.
function ensureAclib() {
  if (window.aclib && typeof window.aclib.runBanner === 'function') {
    return Promise.resolve();
  }
  if (!aclibReady) {
    aclibReady = new Promise((resolve) => {
      if (!document.querySelector('script[src*="acscdn.com/script/aclib.js"]')) {
        const loader = document.createElement('script');
        loader.src = '//acscdn.com/script/aclib.js';
        loader.async = true;
        document.head.appendChild(loader);
      }
      let elapsed = 0;
      const poll = () => {
        if (window.aclib && typeof window.aclib.runBanner === 'function') {
          resolve();
        } else if (elapsed > 15000) {
          aclibReady = null; // allow a retry on the next slot
          resolve();
        } else {
          elapsed += 150;
          setTimeout(poll, 150);
        }
      };
      poll();
    });
  }
  return aclibReady;
}

// Serializes banner injection so zones are requested one at a time.
let queue = Promise.resolve();

function runBanner(container, zoneId) {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.text = `aclib.runBanner({ zoneId: '${zoneId}' });`;
  container.appendChild(script);
}

/**
 * Responsive display-banner slot.
 *
 * Props:
 *  - variant: 'leaderboard' | 'square' | 'inline' | name of a BANNERS entry
 *      leaderboard — 728x90 on large screens, 468x60 on medium, 300x100 on small
 *      square      — 300x250 on large/medium, 250x250 on small
 *      inline      — compact banner for between paragraphs (300x250 / 300x100)
 *      (or an explicit banner name like "banner336")
 *  - sx: styling for the wrapper Box
 */
export default function AdSlot({ variant = 'leaderboard', sx }) {
  const ref = useRef(null);
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const isLarge = useMediaQuery(theme.breakpoints.up('lg'));
  const sizeClass = isSmall ? 'small' : isLarge ? 'large' : 'medium';
  const { adsAllowed } = useConsent();
  const [attempted, setAttempted] = useState('');

  let candidates;
  if (BANNERS[variant]) {
    candidates = [variant];
  } else if (variant === 'square') {
    candidates = sizeClass === 'small' ? ['banner250', 'banner300'] : ['banner300', 'banner250'];
  } else if (variant === 'inline') {
    candidates = sizeClass === 'small' ? ['banner300', 'banner300x100', 'banner250'] : ['banner336', 'banner300'];
  } else {
    candidates = AUTO_PRESETS[sizeClass];
  }

  const banner = candidates.map((name) => BANNERS[name]).find((ad) => ad && ad.screens.includes(sizeClass));
  const bannerKey = banner ? `${variant}-${banner.zoneId}-${sizeClass}` : '';

  useEffect(() => {
    const container = ref.current;
    if (!container || !banner || !adsAllowed) return undefined;
    if (attempted === bannerKey) return undefined;
    let cancelled = false;
    setAttempted(bannerKey);
    queue = queue.then(async () => {
      if (cancelled) return;
      await ensureAclib();
      if (cancelled || !container.isConnected) return;
      if (window.aclib && typeof window.aclib.runBanner === 'function') {
        runBanner(container, banner.zoneId);
      }
    });
    return () => {
      cancelled = true;
      container.innerHTML = '';
    };
  }, [banner, bannerKey, adsAllowed, attempted]);

  if (!ADS_ENABLED || !banner || !adsAllowed) return null;

  return (
    <Box
      sx={{
        textAlign: 'center',
        minHeight: banner.height + 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        ...sx,
      }}
    >
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
        Advertisement
      </Typography>
      <Box
        ref={ref}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: banner.height,
          width: '100%',
          maxWidth: banner.width,
          overflow: 'hidden',
        }}
      />
    </Box>
  );
}
