import type { SVGProps } from "react";

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width={18} height={18} {...base} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LinkedinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width={18} height={18} {...base} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <line x1="7.5" y1="10.5" x2="7.5" y2="16.5" />
      <circle cx="7.5" cy="7" r="0.9" fill="currentColor" stroke="none" />
      <path d="M11.5 16.5v-3.5c0-1.4 1-2.4 2.3-2.4s2.2 1 2.2 2.4v3.5" />
      <line x1="11.5" y1="10.5" x2="11.5" y2="16.5" />
    </svg>
  );
}

export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width={18} height={18} {...base} {...props}>
      <path d="M15 8.5h-2c-.9 0-1.5.6-1.5 1.6V12H15l-.4 3h-2.6v6.5h-3V15H7v-3h2V9.6C9 7.2 10.6 5.5 13 5.5h2v3z" />
    </svg>
  );
}

export function WhatsAppIcon({ size = 18, ...props }: { size?: number } & React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6.5 17.5 5 21l3.6-1.4A8 8 0 1 0 6.5 17.5Z" />
      <path d="M9 9.8c0 3 2.7 5.6 5.6 5.6.5 0 1-.2 1-.7v-1c0-.3-.3-.6-.6-.6h-1.2c-.3 0-.5-.1-.6-.4L12.6 11c-.1-.3 0-.6.2-.8l.5-.5c.2-.2.2-.5 0-.8L12 7.4c-.2-.3-.5-.3-.8-.2-1.7.8-2.2 1.7-2.2 2.6Z" />
    </svg>
  );
}
