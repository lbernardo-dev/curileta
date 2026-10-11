'use client';

import { useCallback, useSyncExternalStore } from 'react';

type BrowserStorageKind = 'local' | 'session';

const CHANGE_EVENT = 'curileta:browser-storage-change';

function getStorage(kind: BrowserStorageKind): Storage | null {
  if (typeof window === 'undefined') return null;
  try {
    return kind === 'local' ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}

function readStorageValue(kind: BrowserStorageKind, key: string, fallback: string | null): string | null {
  try {
    return getStorage(kind)?.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

function subscribeToStorage(kind: BrowserStorageKind, key: string, onChange: () => void) {
  if (typeof window === 'undefined') return () => {};

  const handleStorage = (event: StorageEvent) => {
    const storage = getStorage(kind);
    if ((!event.storageArea || event.storageArea === storage) && (!event.key || event.key === key)) onChange();
  };
  const handleSameTabChange = (event: Event) => {
    const detail = (event as CustomEvent<{ kind: BrowserStorageKind; key: string }>).detail;
    if (detail?.kind === kind && detail.key === key) onChange();
  };

  window.addEventListener('storage', handleStorage);
  window.addEventListener(CHANGE_EVENT, handleSameTabChange);
  return () => {
    window.removeEventListener('storage', handleStorage);
    window.removeEventListener(CHANGE_EVENT, handleSameTabChange);
  };
}

export function setBrowserStorageValue(kind: BrowserStorageKind, key: string, value: string): boolean {
  try {
    const storage = getStorage(kind);
    if (!storage) return false;
    storage.setItem(key, value);
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: { kind, key } }));
    return true;
  } catch {
    return false;
  }
}

export function removeBrowserStorageValue(kind: BrowserStorageKind, key: string): boolean {
  try {
    const storage = getStorage(kind);
    if (!storage) return false;
    storage.removeItem(key);
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: { kind, key } }));
    return true;
  } catch {
    return false;
  }
}

export function useBrowserStorageValue(kind: BrowserStorageKind, key: string | null, fallback: string | null = null) {
  const subscribe = useCallback((onChange: () => void) => {
    if (!key) return () => {};
    return subscribeToStorage(kind, key, onChange);
  }, [key, kind]);
  const getSnapshot = useCallback(() => key ? readStorageValue(kind, key, fallback) : fallback, [fallback, key, kind]);
  const getServerSnapshot = useCallback(() => fallback, [fallback]);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useClientHydrated() {
  return useSyncExternalStore(
    useCallback(() => () => {}, []),
    useCallback(() => true, []),
    useCallback(() => false, []),
  );
}
