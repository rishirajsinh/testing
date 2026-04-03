export default function HeatmapCalendar({ data = [], title = 'Attendance Heatmap' }) {
  const getColor = (present) => {
    if (present === true) return '#10b981';
    if (present === false) return '#f43f5e';
    return 'var(--bg-card)';
  };

  const weeks = [];
  let currentWeek = [];
  data.forEach((day, i) => {
    currentWeek.push(day);
    if (currentWeek.length === 5 || i === data.length - 1) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  });

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px',
    }}>
      <h4 style={{
        fontFamily: 'var(--font-heading)',
        fontSize: '0.95rem',
        fontWeight: 600,
        marginBottom: '16px',
        color: 'var(--text-primary)',
      }}>{title}</h4>
      
      {/* Day labels */}
      <div style={{ display: 'flex', gap: '3px', marginBottom: '4px', paddingLeft: '4px' }}>
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(d => (
          <div key={d} style={{
            width: '28px', height: '16px',
            fontSize: '0.6rem',
            color: 'var(--text-muted)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{d}</div>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
        {weeks.map((week, wi) => (
          <div key={wi} style={{ display: 'flex', gap: '3px' }}>
            {week.map((day, di) => (
              <div
                key={di}
                title={`${day.date}: ${day.present ? 'Present' : 'Absent'}`}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '4px',
                  background: getColor(day.present),
                  opacity: 0.8,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  border: '1px solid transparent',
                }}
                onMouseEnter={e => {
                  e.target.style.opacity = '1';
                  e.target.style.transform = 'scale(1.2)';
                  e.target.style.border = '1px solid var(--text-primary)';
                }}
                onMouseLeave={e => {
                  e.target.style.opacity = '0.8';
                  e.target.style.transform = 'scale(1)';
                  e.target.style.border = '1px solid transparent';
                }}
              />
            ))}
            {/* Pad remaining */}
            {Array.from({ length: 5 - week.length }).map((_, i) => (
              <div key={`pad-${i}`} style={{ width: '28px', height: '28px' }} />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '16px', marginTop: '12px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: 12, height: 12, borderRadius: 2, background: '#10b981' }} /> Present
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: 12, height: 12, borderRadius: 2, background: '#f43f5e' }} /> Absent
        </div>
      </div>
    </div>
  );
}
