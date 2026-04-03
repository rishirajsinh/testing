import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;
  return (
    <div style={{
      background: 'rgba(2, 8, 23, 0.95)',
      border: '1px solid var(--border-default)',
      borderRadius: '8px',
      padding: '10px 14px',
      backdropFilter: 'blur(20px)',
    }}>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>{label}</div>
      {payload.map((entry, i) => (
        <div key={i} style={{ fontSize: '0.85rem', color: entry.color, fontWeight: 600 }}>
          {entry.name}: {entry.value}%
        </div>
      ))}
    </div>
  );
};

export default function PerformanceChart({ data, title = 'Performance Trend' }) {
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
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={{ stroke: 'var(--border-default)' }} />
          <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={{ stroke: 'var(--border-default)' }} domain={[0, 100]} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '12px', color: 'var(--text-secondary)' }} />
          <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1', r: 4 }} activeDot={{ r: 6, fill: '#8b5cf6' }} name="Score" />
          {data[0]?.classAvg !== undefined && (
            <Line type="monotone" dataKey="classAvg" stroke="#06b6d4" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Class Average" />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
