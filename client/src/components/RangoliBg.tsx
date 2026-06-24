// Rangoli / mandala SVG watermark — used ONLY in hero and footer
// 5% opacity, pointer-events none
export default function RangoliBg({ className = "" }: { className?: string }) {
  return (
    <div className={`rangoli-watermark ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 400 400"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "min(600px, 90vw)", height: "auto" }}
        fill="#7B2D2D"
      >
        {/* Outer ring of petals */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const cx = 200 + 150 * Math.cos(angle);
          const cy = 200 + 150 * Math.sin(angle);
          return (
            <ellipse
              key={`outer-${i}`}
              cx={cx}
              cy={cy}
              rx="18"
              ry="40"
              transform={`rotate(${i * 30 + 90}, ${cx}, ${cy})`}
            />
          );
        })}
        {/* Middle ring */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * 45 * Math.PI) / 180;
          const cx = 200 + 95 * Math.cos(angle);
          const cy = 200 + 95 * Math.sin(angle);
          return (
            <ellipse
              key={`mid-${i}`}
              cx={cx}
              cy={cy}
              rx="14"
              ry="32"
              transform={`rotate(${i * 45 + 90}, ${cx}, ${cy})`}
            />
          );
        })}
        {/* Inner ring */}
        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (i * 60 * Math.PI) / 180;
          const cx = 200 + 52 * Math.cos(angle);
          const cy = 200 + 52 * Math.sin(angle);
          return (
            <ellipse
              key={`inner-${i}`}
              cx={cx}
              cy={cy}
              rx="10"
              ry="22"
              transform={`rotate(${i * 60 + 90}, ${cx}, ${cy})`}
            />
          );
        })}
        {/* Center circle */}
        <circle cx="200" cy="200" r="18" />
        <circle cx="200" cy="200" r="10" fill="#D4A017" />
        {/* Outer decorative ring */}
        <circle cx="200" cy="200" r="185" fill="none" stroke="#7B2D2D" strokeWidth="2" />
        <circle cx="200" cy="200" r="175" fill="none" stroke="#D4A017" strokeWidth="1" />
      </svg>
    </div>
  );
}
