export function PlaylabDecor({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 800 400"
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <path
        d="M0 60 Q 150 10 300 70 T 600 50 T 800 90"
        stroke="white"
        strokeOpacity="0.5"
        strokeWidth="3"
        strokeDasharray="2 14"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M0 320 Q 200 380 380 320 T 800 340"
        stroke="white"
        strokeOpacity="0.4"
        strokeWidth="3"
        strokeDasharray="2 14"
        strokeLinecap="round"
        fill="none"
      />
      {[
        [60, 40],
        [730, 60],
        [120, 340],
        [700, 300],
        [400, 30],
        [260, 200],
        [560, 220],
      ].map(([cx, cy], i) => (
        <g key={i} transform={`translate(${cx} ${cy})`} opacity={0.85}>
          <path
            d="M0 -10 L2.5 -3 L10 -3 L4 1.5 L6 9 L0 4.5 L-6 9 L-4 1.5 L-10 -3 L-2.5 -3 Z"
            fill="var(--rainbow-coral)"
          />
        </g>
      ))}
    </svg>
  );
}
