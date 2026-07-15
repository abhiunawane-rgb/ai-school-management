'use client';

type BusMapProps = {
  lat: number;
  lng: number;
  label?: string;
  className?: string;
};

/** OpenStreetMap embed — no Google Maps API key required */
export function BusMap({ lat, lng, label, className }: BusMapProps) {
  const delta = 0.012;
  const bbox = [
    lng - delta,
    lat - delta * 0.75,
    lng + delta,
    lat + delta * 0.75,
  ].join('%2C');
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;

  return (
    <div className={className ?? 'overflow-hidden rounded-xl border border-slate-200 bg-slate-50'}>
      <iframe
        title={label ?? 'Bus location map'}
        src={src}
        className="aspect-video w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <div className="flex items-center justify-between gap-2 border-t border-slate-100 bg-white px-3 py-2 text-xs text-slate-600">
        <span>
          {lat.toFixed(5)}, {lng.toFixed(5)}
        </span>
        <a
          href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-blue-600 hover:underline"
        >
          Open full map
        </a>
      </div>
    </div>
  );
}
