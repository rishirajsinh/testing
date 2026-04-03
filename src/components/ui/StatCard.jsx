import useCounter from '../../hooks/useCounter';
import { useEffect, useRef, useState } from 'react';

export default function StatCard({ icon, value, label, suffix = '', color = 'var(--primary)', delay = 0 }) {
  const { count, start } = useCounter(typeof value === 'number' ? value : 0, 2000, false);
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !visible) {
          setVisible(true);
          start();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [visible, start]);

  return (
    <div
      ref={ref}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        backdropFilter: 'blur(20px)',
        animation: visible ? `float 3s ease-in-out infinite ${delay * 0.3}s` : 'none',
        transition: 'all 0.4s var(--spring)',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
        e.currentTarget.style.boxShadow = `0 30px 60px ${color}30, 0 0 0 1px ${color}30`;
        e.currentTarget.style.borderColor = `${color}50`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = '';
        e.currentTarget.style.borderColor = 'var(--border-default)';
      }}
    >
      {/* Glow accent */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '3px',
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        opacity: 0.6,
      }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span style={{ fontSize: '1.8rem' }}>{icon}</span>
        <div style={{
          width: 8, height: 8,
          borderRadius: '50%',
          background: color,
          boxShadow: `0 0 10px ${color}`,
          animation: 'pulse 2s ease-in-out infinite',
        }} />
      </div>
      
      <div style={{
        fontFamily: 'var(--font-heading)',
        fontSize: '2rem',
        fontWeight: 700,
        color: 'var(--text-primary)',
        lineHeight: 1.2,
      }}>
        {typeof value === 'number' ? count : value}{suffix}
      </div>
      
      <div style={{
        fontSize: '0.85rem',
        color: 'var(--text-secondary)',
        marginTop: '4px',
      }}>{label}</div>
    </div>
  );
}
