"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import type * as LeafletNS from "leaflet";
import { categoryOf } from "@/lib/seed";
import type { CategoryId, Meetup, SponsorPin } from "@/lib/types";

const TILES = "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png";

export interface MapCenter {
  lat: number;
  lng: number;
  zoom: number;
}

interface MarkerMapProps {
  meetups: Meetup[];
  sponsors: SponsorPin[];
  center: MapCenter;
  selectedId: string | null;
  category: CategoryId | "all";
  onSelect: (id: string | null) => void;
  onSponsor: (id: string) => void;
  /** the blue "my location" dot */
  mePoint?: { lat: number; lng: number } | null;
  interactive?: boolean;
  className?: string;
}

const pinHtml = (meetup: Meetup, active: boolean, boosted: boolean) => {
  const category = categoryOf(meetup.categoryId);
  const badge = boosted ? '<span class="crew-pin-badge">⚡</span>' : "";
  return `<div class="crew-pin-inner ${boosted ? "crew-pin-bolt" : ""}" data-active="${active}" style="background:${category.color}">
      <span style="display:grid;place-items:center;font-size:15px;line-height:1">${glyph(meetup.categoryId)}</span>
      ${badge}
      <span class="crew-pin-tail" style="background:${category.color}"></span>
    </div>`;
};

const svg = (inner: string) =>
  `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;

const glyph = (id: CategoryId) => {
  switch (id) {
    case "running":
      return svg('<path d="M13 2 5 13.5h5L10 22l8-11.5h-5L13 2Z" fill="#fff" stroke="none"/>');
    case "cafe":
      return svg(
        '<path d="M4.5 8h10v5.2A4.3 4.3 0 0 1 10.2 17.5H8.8a4.3 4.3 0 0 1-4.3-4.3V8Z"/><path d="M14.5 9.2h1.8a2.4 2.4 0 0 1 0 4.8h-1.8"/><path d="M7 4.6v1.4M10.4 4.6v1.4"/>',
      );
    case "hiking":
      return svg('<path d="m3 19 6.4-11.4L14 15l2.4-4L21 19H3Z"/>');
    case "boardgame":
      return svg(
        '<rect x="4" y="4" width="16" height="16" rx="4"/><circle cx="9" cy="9" r="1.1" fill="#fff"/><circle cx="15" cy="15" r="1.1" fill="#fff"/><circle cx="15" cy="9" r="1.1" fill="#fff"/><circle cx="9" cy="15" r="1.1" fill="#fff"/>',
      );
    case "photowalk":
      return svg(
        '<path d="M3.5 8.6h3.2l1.4-2h7.8l1.4 2h3.2v10.2H3.5V8.6Z"/><circle cx="12" cy="13.3" r="3.2"/>',
      );
    default:
      return svg('<circle cx="12" cy="12" r="6"/>');
  }
};

export default function MarkerMap({
  meetups,
  sponsors,
  center,
  selectedId,
  category,
  onSelect,
  onSponsor,
  mePoint,
  interactive = true,
  className = "",
}: MarkerMapProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletNS.Map | null>(null);
  const layerRef = useRef<LeafletNS.LayerGroup | null>(null);
  const sponsorLayerRef = useRef<LeafletNS.LayerGroup | null>(null);
  const meRef = useRef<LeafletNS.Marker | null>(null);
  const [ready, setReady] = useState(false);
  const handlers = useRef({ onSelect, onSponsor });
  handlers.current = { onSelect, onSponsor };

  /* create the map once */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = await import("leaflet");
      if (cancelled || !hostRef.current || mapRef.current) return;
      const map = L.map(hostRef.current, {
        center: [center.lat, center.lng],
        zoom: center.zoom,
        zoomControl: false,
        attributionControl: true,
        scrollWheelZoom: interactive,
        dragging: interactive,
        touchZoom: interactive,
        doubleClickZoom: interactive,
        zoomSnap: 0.5,
        wheelPxPerZoomLevel: 120,
      });
      L.tileLayer(TILES, {
        subdomains: "abc",
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> &middot; OSM France',
      }).addTo(map);
      map.attributionControl.setPrefix(false);

      layerRef.current = L.layerGroup().addTo(map);
      sponsorLayerRef.current = L.layerGroup().addTo(map);

      map.on("click", () => handlers.current.onSelect(null));
      mapRef.current = map;
      setReady(true);
      window.setTimeout(() => map.invalidateSize(), 120);
    })();
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      layerRef.current = null;
      sponsorLayerRef.current = null;
      meRef.current = null;
      setReady(false);
    };
    // the map is created once; later centre changes are handled below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* keep the canvas in sync with layout changes (tab switches, sheets) */
  useEffect(() => {
    if (!ready) return;
    const map = mapRef.current;
    if (!map) return;
    const observer = new ResizeObserver(() => map.invalidateSize());
    if (hostRef.current) observer.observe(hostRef.current);
    const timer = window.setInterval(() => map.invalidateSize(), 1200);
    const stop = window.setTimeout(() => window.clearInterval(timer), 6000);
    return () => {
      observer.disconnect();
      window.clearInterval(timer);
      window.clearTimeout(stop);
    };
  }, [ready]);

  /* recentre when neighbourhood changes */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.flyTo([center.lat, center.lng], center.zoom, { duration: 0.65 });
  }, [center.lat, center.lng, center.zoom]);

  /* pins */
  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    (async () => {
      const L = await import("leaflet");
      const map = mapRef.current;
      const layer = layerRef.current;
      const sponsorLayer = sponsorLayerRef.current;
      if (cancelled || !map || !layer || !sponsorLayer) return;

      layer.clearLayers();
      sponsorLayer.clearLayers();

      meetups
        .filter((meetup) => category === "all" || meetup.categoryId === category)
        .forEach((meetup) => {
          const icon = L.divIcon({
            className: "crew-pin pin-pop",
            html: pinHtml(meetup, selectedId === meetup.id, isBoosted(meetup)),
            iconSize: [40, 40],
            iconAnchor: [20, 42],
          });
          const marker = L.marker([meetup.lat, meetup.lng], {
            icon,
            zIndexOffset: selectedId === meetup.id ? 600 : isBoosted(meetup) ? 300 : 0,
          });
          marker.on("click", (event) => {
            L.DomEvent.stopPropagation(event);
            handlers.current.onSelect(meetup.id);
          });
          marker.addTo(layer);
        });

      sponsors.forEach((sponsor) => {
        const icon = L.divIcon({
          className: "sponsor-pin",
          html: `<span class="sponsor-pin-inner"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8B6BD9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11h16v9H4z"/><path d="M2.5 7.5h19V11h-19zM12 7.5V20"/><path d="M12 7.5S10.5 3 8 3a2.3 2.3 0 0 0 0 4.5h4Zm0 0S13.5 3 16 3a2.3 2.3 0 0 1 0 4.5h-4Z"/></svg>${sponsor.name.replace(
            /(성수|연남|잠실|판교)\s*/,
            "",
          )}</span>`,
          iconSize: [120, 28],
          iconAnchor: [60, 14],
        });
        const marker = L.marker([sponsor.lat, sponsor.lng], { icon, zIndexOffset: -120 });
        marker.on("click", (event) => {
          L.DomEvent.stopPropagation(event);
          handlers.current.onSponsor(sponsor.id);
        });
        marker.addTo(sponsorLayer);
      });

      if (mePoint) {
        if (meRef.current) meRef.current.remove();
        const icon = L.divIcon({
          className: "me-marker",
          html: '<span class="me-dot"></span>',
          iconSize: [18, 18],
          iconAnchor: [9, 9],
        });
        meRef.current = L.marker([mePoint.lat, mePoint.lng], {
          icon,
          interactive: false,
          zIndexOffset: -100,
        }).addTo(map);
      } else if (meRef.current) {
        meRef.current.remove();
        meRef.current = null;
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [ready, meetups, sponsors, selectedId, category, mePoint?.lat, mePoint?.lng]);

  return <div ref={hostRef} className={`h-full w-full ${className}`} aria-label="동네 지도" />;
}

const isBoosted = (meetup: Meetup) =>
  Boolean(meetup.boostedUntil && new Date(meetup.boostedUntil).getTime() > Date.now());
