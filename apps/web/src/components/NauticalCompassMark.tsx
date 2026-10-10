export function NauticalCompassMark({ className = 'h-10 w-10' }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 48 48" className={`${className} shrink-0 rounded-2xl shadow-sm transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105`} fill="none">
      <rect width="48" height="48" rx="16" fill="#1C493B" />
      <circle cx="24" cy="24" r="17.5" stroke="#FCD878" strokeOpacity=".72" strokeWidth="1.25" />
      <circle cx="24" cy="24" r="13.5" stroke="#FCD878" strokeOpacity=".28" strokeWidth=".75" />
      <path d="M24 7v3M41 24h-3M24 41v-3M7 24h3M12 12l2.1 2.1M36 12l-2.1 2.1M36 36l-2.1-2.1M12 36l2.1-2.1" stroke="#FCD878" strokeLinecap="round" strokeWidth="1.2" />
      <path d="m24 12 3.1 8.9L36 24l-8.9 3.1L24 36l-3.1-8.9L12 24l8.9-3.1L24 12Z" stroke="#FCD878" strokeOpacity=".8" strokeWidth="1.2" />
      <g className="nautical-compass-needle">
        <path d="m24 10 3.1 13.1L24 21l-3.1 2.1L24 10Z" fill="#FFE8A3" />
        <path d="m24 38-3.1-13.1L24 27l3.1-2.1L24 38Z" fill="#D99035" />
      </g>
      <circle cx="24" cy="24" r="2.1" fill="#FFF7DC" stroke="#A96728" strokeWidth=".8" />
    </svg>
  );
}
