import { geoContains } from "d3-geo";
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

const STEP = 1.5; // espacement des points de la trame, en degrés

// Pays qui accueillent un showroom (codes ISO numériques) : Maroc, France, Sénégal, Arabie saoudite.
const HIGHLIGHT = new Set(["504", "250", "686", "682"]);

/**
 * Trame des terres émergées, calculée une fois au moment de la construction du site.
 * Chaque point est encodé en dixièmes de degré : [lon, lat, lon, lat, …].
 */
function buildLand() {
  const topo = countries110 as unknown as Topology<{ countries: GeometryCollection }>;
  const all = feature(topo, topo.objects.countries) as FeatureCollection<Geometry>;
  const land: number[] = [];
  const highlight: number[] = [];
  for (let lat = -58; lat <= 80; lat += STEP) {
    const lonStep = STEP / Math.max(Math.cos((lat * Math.PI) / 180), 0.2);
    for (let lon = -180; lon < 180; lon += lonStep) {
      const hit = all.features.find((f) => geoContains(f, [lon, lat]));
      if (!hit) continue;
      (HIGHLIGHT.has(String(hit.id)) ? highlight : land).push(Math.round(lon * 10), Math.round(lat * 10));
    }
  }
  return { land, highlight };
}

const grid = buildLand();

export function ShowroomMap({ locale }: { locale: Locale }) {
  const c = homeSystem[locale].showrooms;
  const points: MapPoint[] = company.showrooms.map((s) => ({
    id: s.id,
    lon: s.lon,
    lat: s.lat,
    city: s.city[locale],
    country: s.country[locale],
    address: s.address,
    hq: !!s.hq,
    morocco: s.country.fr === "Maroc",
    coords: `${Math.abs(s.lat).toFixed(2)}° ${s.lat >= 0 ? "N" : "S"} · ${Math.abs(s.lon).toFixed(2)}° ${s.lon >= 0 ? "E" : "W"}`,
  }));
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
          land={grid.land}
          highlight={grid.highlight}
          points={points}
          labels={{ hq: c.hq, onRequest: c.onRequest, cta: c.cta, list: c.list }}
          contactHref={`/${locale}/contact`}
        />
      </div>
    </section>
  );
}
