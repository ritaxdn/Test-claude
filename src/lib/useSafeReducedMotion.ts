"use client";

import { useSyncExternalStore } from "react";

const query = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void) {
  const mediaQuery = window.matchMedia(query);
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia(query).matches;
}

function getServerSnapshot() {
  return false;
}

/**
 * SSR-safe alternative to framer-motion's useReducedMotion: framer-motion reads
 * matchMedia synchronously on the first client render, which mismatches the server
 * render and triggers a hydration error. useSyncExternalStore guarantees the server
 * snapshot (false) is used for the first client render too, then updates after mount.
 */
export function useSafeReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
