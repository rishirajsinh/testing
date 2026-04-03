import { Radar, RadarChart as ReRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

export default function RadarChartComponent({ data, title = 'Subject Analysis' }) {
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
      <ResponsiveContainer width="100%" height={280}>
        <ReRadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
          <PolarGrid stroke="rgba(255,255,255,0.1)" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
          <Tooltip
            contentStyle={{
              background: 'rgba(2, 8, 23, 0.95)',
              border: '1px solid var(--border-default)',
              borderRadius: '8px',
              fontSize: '0.85rem',
            }}
          />
          <Radar name="Score" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} strokeWidth={2} />
          {data[0]?.classAvg !== undefined && (
            <Radar name="Class Avg" dataKey="classAvg" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.1} strokeWidth={2} strokeDasharray="4 4" />
          )}
        </ReRadarChart>
      </ResponsiveContainer>
    </div>
  );
}
