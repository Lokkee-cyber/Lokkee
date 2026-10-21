import { useSyncExternalStore } from 'react';

const STORAGE_KEY = 'lokkee-cookie-consent';
const listeners = new Set();
let reopened = false;

function read() {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function emit() {
  listeners.forEach((listener) => listener());
}

export function setConsent(value) {
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // Storage unavailable; choice only lasts for this page view.
  }
  reopened = false;
  emit();
}

export function reopenConsent() {
  reopened = true;
  emit();
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return `${read() || 'unset'}|${reopened ? 'open' : 'closed'}`;
}

export function useConsent() {
  const [value, panel] = useSyncExternalStore(subscribe, getSnapshot, () => 'unset|closed').split('|');
  return {
    status: value,
    adsAllowed: value === 'accepted',
    showBanner: value === 'unset' || panel === 'open',
  };
}
