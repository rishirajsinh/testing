import { useEffect, useState } from 'react';

export default function RiskMeter({ score = 0, size = 120, animated = true }) {
  const [displayScore, setDisplayScore] = useState(0);
  
  useEffect(() => {
    if (!animated) { setDisplayScore(score); return; }
    let start = 0;
    const duration = 1500;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(start + (score - start) * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [score, animated]);

  const getColor = (s) => {
    if (s >= 70) return '#f43f5e';
    if (s >= 50) return '#f59e0b';
    if (s >= 30) return '#eab308';
    return '#10b981';
  };

  const color = getColor(displayScore);
  const radius = (size - 16) / 2;
  const circumference = Math.PI * radius;
  const offset = circumference - (displayScore / 100) * circumference;

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <svg width={size} height={size / 2 + 20} viewBox={`0 0 ${size} ${size / 2 + 20}`}>
        {/* Background arc */}
        <path
          d={`M 8,${size / 2 + 8} A ${radius},${radius} 0 0 1 ${size - 8},${size / 2 + 8}`}
          fill="none"
          stroke="var(--border-default)"
          strokeWidth="8"
          strokeLinecap="round"
        />
        {/* Value arc */}
        <path
          d={`M 8,${size / 2 + 8} A ${radius},${radius} 0 0 1 ${size - 8},${size / 2 + 8}`}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: animated ? 'stroke-dashoffset 1.5s ease-out' : 'none',
            filter: `drop-shadow(0 0 8px ${color}80)`,
          }}
        />
        {/* Score text */}
        <text
          x={size / 2}
          y={size / 2 - 2}
          textAnchor="middle"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: `${size / 4}px`,
            fontWeight: 700,
            fill: color,
          }}
        >{displayScore}</text>
        <text
          x={size / 2}
          y={size / 2 + 14}
          textAnchor="middle"
          style={{
            fontSize: '10px',
            fill: 'var(--text-muted)',
          }}
        >/100</text>
      </svg>
    </div>
  );
}
