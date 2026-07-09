"use client";

/**
 * Central analytics helper. All providers are optional and only fire if the
 * corresponding script has been loaded (see components/Analytics.tsx), which
 * itself only loads when the matching env var is set. Safe to call anywhere,
 * including before providers are ready (calls are simply no-ops).
 */

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    lintrk?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

export type AnalyticsEventName =
  | "form_submit"
  | "whatsapp_click"
  | "phone_click"
  | "email_click"
  | "brochure_download"
  | "quote_request"
  | "demo_request"
  | "video_play"
  | "product_view_time"
  | "scroll_depth"
  | "cta_click";

export type AnalyticsEventParams = Record<string, string | number | boolean | undefined>;

export function trackEvent(name: AnalyticsEventName, params: AnalyticsEventParams = {}) {
  if (typeof window === "undefined") return;

  const payload = { event: name, ...params };

  // Google Tag Manager / GA4 dataLayer
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);

  // Direct gtag fallback if GTM isn't wired to forward the event
  window.gtag?.("event", name, params);

  // Meta Pixel — map to a generic custom event, keep GA4 name for consistency
  window.fbq?.("trackCustom", name, params);

  // Microsoft Clarity custom tag
  window.clarity?.("set", name, JSON.stringify(params));
}

export function trackLinkedInConversion(conversionId?: string) {
  if (typeof window === "undefined" || !conversionId) return;
  window.lintrk?.("track", { conversion_id: conversionId });
}
