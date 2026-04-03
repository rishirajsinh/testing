import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
          Attendance: {entry.value}%
        </div>
      ))}
    </div>
  );
};

export default function AttendanceChart({ data, title = 'Attendance Trend' }) {
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
        <AreaChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <defs>
            <linearGradient id="attendanceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={{ stroke: 'var(--border-default)' }} />
          <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={{ stroke: 'var(--border-default)' }} domain={[0, 100]} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="rate" stroke="#06b6d4" strokeWidth={2} fill="url(#attendanceGrad)" dot={{ fill: '#06b6d4', r: 3 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
