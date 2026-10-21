import { useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import { useConsent } from '../utils/consent';

const ADS = {
  banner320: {
    type: 'banner',
    key: 'ad155ddf31e83fe26eb69f408b26b35f',
    src: 'https://bauval.org/22/ad155ddf31e83fe26eb69f408b26b35f',
    width: 320,
    height: 50,
  },
  banner300: {
    type: 'banner',
    key: 'eed1b097f0ee48eb27a340234d212bcd',
    src: 'https://bauval.org/22/eed1b097f0ee48eb27a340234d212bcd',
    width: 300,
    height: 250,
  },
  squareBannerA: {
    type: 'banner',
    key: '97d05d9b5176bcdaf1dcb304cf8ed61e',
    src: 'https://bauval.org/22/97d05d9b5176bcdaf1dcb304cf8ed61e',
    width: 160,
    height: 600,
  },
  squareBannerB: {
    type: 'banner',
    key: '3e29cf9b29b98fc0b37c7d98eb07753a',
    src: 'https://bauval.org/22/3e29cf9b29b98fc0b37c7d98eb07753a',
    width: 160,
    height: 300,
  },
  native: {
    type: 'native',
    id: '3ca20e8f3a108df3474660e176bf3542',
    src: 'https://bauval.org/21/3ca20e8f3a108df3474660e176bf3542',
  },
};

// Banner scripts read a shared global `atOptions`, so they must load one at a time.
let queue = Promise.resolve();

function loadScript(container, src) {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = resolve;
    script.onerror = resolve;
    container.appendChild(script);
  });
}

export default function AdSlot({ name, sx }) {
  const ref = useRef(null);
  const ad = ADS[name];
  const { adsAllowed } = useConsent();

  useEffect(() => {
    const container = ref.current;
    if (!container || !ad || !adsAllowed) return undefined;
    let cancelled = false;

    queue = queue.then(async () => {
      if (cancelled) return;
      if (ad.type === 'banner') {
        window.atOptions = { key: ad.key, format: 'iframe', height: ad.height, width: ad.width, params: {} };
        await loadScript(container, ad.src);
      } else {
        const target = document.createElement('div');
        target.id = `container-${ad.id}`;
        container.appendChild(target);
        const script = document.createElement('script');
        script.async = true;
        script.setAttribute('data-cfasync', 'false');
        script.src = ad.src;
        container.appendChild(script);
      }
    });

    return () => {
      cancelled = true;
      container.innerHTML = '';
    };
  }, [ad, adsAllowed]);

  if (!ad || !adsAllowed) return null;

  return (
    <Box sx={{ textAlign: 'center', ...sx }}>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
        {ad.type === 'native' ? 'Sponsored' : 'Advertisement'}
      </Typography>
      <Box
        ref={ref}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          minHeight: ad.type === 'banner' ? ad.height : undefined,
          maxWidth: '100%',
          overflow: 'hidden',
        }}
      />
    </Box>
  );
}
