export default function SkeletonLoader({ count = 3, type = 'card' }) {
  if (type === 'card') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} style={{
            padding: '24px',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-default)',
          }}>
            <div className="skeleton skeleton-avatar" style={{ marginBottom: '16px' }} />
            <div className="skeleton skeleton-title" />
            <div className="skeleton skeleton-text" />
            <div className="skeleton skeleton-text" style={{ width: '75%' }} />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} style={{
            display: 'flex', gap: '16px', padding: '12px 16px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-card)',
          }}>
            <div className="skeleton skeleton-avatar" />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div className="skeleton skeleton-text" style={{ width: '40%' }} />
              <div className="skeleton skeleton-text" style={{ width: '60%' }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton skeleton-text" style={{ width: `${70 + Math.random() * 30}%` }} />
      ))}
    </div>
  );
}
