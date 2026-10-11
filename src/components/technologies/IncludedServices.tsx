import { SignalLine } from "@/components/system/SignalPath";

/** « Chaque technologie est livrée avec… » : bandeau de l'accompagnement Cellulift (catalogue et pages de gamme). */
export function IncludedServices({ label, items }: { label: string; items: readonly (readonly [string, string])[] }) {
  return (
    <>
      <p className="data-label text-deep-soft">{label}</p>
      <div className="mb-10 mt-4 grid grid-cols-2 border-t border-deep/15 lg:grid-cols-4">
        {items.map(([k, v], i) => (
          <div
            key={k}
            className="relative border-b border-deep/15 py-4 pr-4 odd:border-r lg:border-b-0 lg:border-r lg:px-5 lg:first:pl-0 lg:last:border-r-0 [&:nth-child(even)]:pl-4 lg:[&:nth-child(even)]:pl-5"
          >
            <SignalLine delay={i * 0.1} className="absolute inset-x-0 top-[-1px]" />
            <p className="data-label text-deep-soft">{k}</p>
            <p className="mt-2 font-sans text-sm font-medium text-deep">{v}</p>
          </div>
        ))}
      </div>
    </>
  );
}
