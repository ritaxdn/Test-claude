import { geoContains, geoMercator } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import countries110 from "world-atlas/countries-110m.json";
import { company } from "@/content/company";
import { homeSystem } from "@/content/home-system";
import type { Locale } from "@/lib/i18n/config";
import { Heading } from "./Heading";
import { ShowroomMapClient, type MapPoint } from "./ShowroomMapClient";

const W = 1000;
const H = 640;
const STEP = 9; // écart entre les points de la trame, en pixels

// Pays qui accueillent un showroom (codes ISO numériques) : Maroc, France, Sénégal, Arabie saoudite.
const HIGHLIGHT = new Set(["504", "250", "686", "682"]);

/** Géométrie calculée une fois, au moment de la construction du site. */
function buildMap() {
  const topo = countries110 as unknown as Topology<{ countries: GeometryCollection }>;
  const all = feature(topo, topo.objects.countries) as FeatureCollection<Geometry>;
  const projection = geoMercator().fitExtent(
    [
      [0, 0],
      [W, H],
    ],
    { type: "MultiPoint", coordinates: [[-19, 5], [46, 54]] }
  );

  const near: Feature<Geometry>[] = all.features;

  let dots = "";
  let highlight = "";
  for (let y = STEP / 2; y < H; y += STEP) {
    for (let x = STEP / 2; x < W; x += STEP) {
      const lonlat = projection.invert!([x, y]);
      if (!lonlat) continue;
      const hit = near.find((f) => geoContains(f, lonlat));
      if (!hit) continue;
      const seg = `M${x} ${y}h0`;
      if (HIGHLIGHT.has(String(hit.id))) highlight += seg;
      else dots += seg;
    }
  }

  const points: Omit<MapPoint, "city" | "country">[] = company.showrooms.map((s) => {
    const [x, y] = projection([s.lon, s.lat])!;
    return { id: s.id, x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10, address: s.address, hq: !!s.hq };
  });
  return { dots, highlight, points };
}

const geometry = buildMap();

export function ShowroomMap({ locale }: { locale: Locale }) {
  const c = homeSystem[locale].showrooms;
  const points: MapPoint[] = geometry.points.map((p) => {
    const s = company.showrooms.find((x) => x.id === p.id)!;
    return { ...p, city: s.city[locale], country: s.country[locale] };
  });
  return (
    <section className="px-3 pb-24 md:px-5 md:pb-32">
      <div className="mx-auto max-w-7xl px-3 md:px-7">
        <Heading eyebrow={c.eyebrow} title={c.title} intro={c.intro} />
        <ShowroomMapClient
          width={W}
          height={H}
          dots={geometry.dots}
          highlight={geometry.highlight}
          points={points}
          labels={{ hq: c.hq, onRequest: c.onRequest, cta: c.cta, list: c.list }}
          contactHref={`/${locale}/contact`}
        />
      </div>
    </section>
  );
}
