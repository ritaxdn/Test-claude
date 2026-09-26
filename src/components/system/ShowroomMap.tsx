import { geoContains, geoDistance, geoGraticule, geoOrthographic, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { FeatureCollection, Geometry } from "geojson";
import countries110 from "world-atlas/countries-110m.json";
import { company } from "@/content/company";
import { homeSystem } from "@/content/home-system";
import type { Locale } from "@/lib/i18n/config";
import { Reveal } from "@/components/ui/Reveal";
import { Pill } from "./Cta";
import { ShowroomMapClient, type MapPoint } from "./ShowroomMapClient";

const W = 1000;
const H = 700;
const CENTER: [number, number] = [10, 31]; // centre du globe (lon, lat), entre Dakar, Paris et Djeddah
const STEP = 1.25; // espacement des points de la trame, en degrés

// Pays qui accueillent un showroom (codes ISO numériques) : Maroc, France, Sénégal, Arabie saoudite.
const HIGHLIGHT = new Set(["504", "250", "686", "682"]);

/** Globe calculé une fois, au moment de la construction du site. */
function buildGlobe() {
  const topo = countries110 as unknown as Topology<{ countries: GeometryCollection }>;
  const all = feature(topo, topo.objects.countries) as FeatureCollection<Geometry>;
  const projection = geoOrthographic()
    .rotate([-CENTER[0], -CENTER[1]])
    .scale(440)
    .translate([W / 2, H / 2 + 20])
    .clipAngle(90);
  const path = geoPath(projection);
  const [cx, cy] = projection.translate();
  const r = projection.scale();

  // Trame de points posée sur la sphère (densité constante en latitude/longitude).
  let dots = "";
  let highlight = "";
  for (let lat = -80; lat <= 80; lat += STEP) {
    const lonStep = STEP / Math.max(Math.cos((lat * Math.PI) / 180), 0.2);
    for (let lon = -180; lon < 180; lon += lonStep) {
      if (geoDistance([lon, lat], CENTER) > Math.PI / 2 - 0.02) continue;
      const hit = all.features.find((f) => geoContains(f, [lon, lat]));
      if (!hit) continue;
      const [x, y] = projection([lon, lat])!;
      if (x < 0 || x > W || y < 0 || y > H) continue;
      const seg = `M${x.toFixed(1)} ${y.toFixed(1)}h0`;
      if (HIGHLIGHT.has(String(hit.id))) highlight += seg;
      else dots += seg;
    }
  }

  const graticule = path(geoGraticule().step([15, 15])()) ?? "";
  const hq = company.showrooms.find((s) => s.hq) ?? company.showrooms[0];

  const points: Omit<MapPoint, "city" | "country">[] = company.showrooms.map((s) => {
    const [x, y] = projection([s.lon, s.lat])!;
    const arc =
      s.id === hq.id ? "" : (path({ type: "LineString", coordinates: [[hq.lon, hq.lat], [s.lon, s.lat]] }) ?? "");
    return {
      id: s.id,
      x: Math.round(x * 10) / 10,
      y: Math.round(y * 10) / 10,
      address: s.address,
      hq: !!s.hq,
      arc,
      coords: `${Math.abs(s.lat).toFixed(2)}° ${s.lat >= 0 ? "N" : "S"} · ${Math.abs(s.lon).toFixed(2)}° ${s.lon >= 0 ? "E" : "W"}`,
      morocco: s.country.fr === "Maroc",
    };
  });
  return { dots, highlight, graticule, sphere: { cx, cy, r }, points };
}

const globe = buildGlobe();

export function ShowroomMap({ locale }: { locale: Locale }) {
  const c = homeSystem[locale].showrooms;
  const points: MapPoint[] = globe.points.map((p) => {
    const s = company.showrooms.find((x) => x.id === p.id)!;
    return { ...p, city: s.city[locale], country: s.country[locale] };
  });
  return (
    <section className="px-3 pb-12 md:px-5 md:pb-16">
      <div className="mx-auto max-w-7xl px-3 md:px-7">
        <Reveal>
          <Pill>{c.eyebrow}</Pill>
          <h2 className="display mt-4 text-[clamp(2rem,5vw,4.6rem)] text-deep">
            <span className="block">{c.title[0]}</span>
            <span className="iridescent-text block">{c.title[1]}</span>
          </h2>
          <p className="data-label mt-5 text-deep">{c.markets.join("  ·  ")}</p>
        </Reveal>
        <ShowroomMapClient
          width={W}
          height={H}
          dots={globe.dots}
          highlight={globe.highlight}
          graticule={globe.graticule}
          sphere={globe.sphere}
          points={points}
          labels={{ hq: c.hq, onRequest: c.onRequest, cta: c.cta, list: c.list }}
          contactHref={`/${locale}/contact`}
        />
      </div>
    </section>
  );
}
