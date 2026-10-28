export function Logo({ tag = "Academy", href = "/" }: { tag?: string; href?: string }) {
  return (
    <a href={href} className="logo" aria-label="CELLULIFT Academy">
      <span className="w">Cellulift</span>
      <svg width="140" height="14" viewBox="0 0 160 20" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="ecg" x1="0" y1="0" x2="160" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#00BCD4" /><stop offset=".25" stopColor="#7B61FF" /><stop offset=".5" stopColor="#E91E8C" /><stop offset=".75" stopColor="#FF5722" /><stop offset="1" stopColor="#FFC107" />
          </linearGradient>
        </defs>
        <path d="M0 10 H50 L58 10 L64 2 L72 18 L80 6 L86 10 H100 L106 10 L112 4 L118 16 L124 10 H160" stroke="url(#ecg)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="t">{tag}</span>
    </a>
  );
}
