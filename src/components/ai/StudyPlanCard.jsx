import { useState } from 'react';
import useAI from '../../hooks/useAI';
import GradientButton from '../ui/GradientButton';

export default function StudyPlanCard() {
  const { loading, generateResponse } = useAI();
  const [plan, setPlan] = useState('');

  const handleGenerate = async () => {
    await generateResponse(
      'Generate a personalized daily study plan for a student weak in Mathematics and Physics, with 5 hours available.',
      (partial) => setPlan(partial)
    );
  };

  const defaultPlan = {
    morning: { time: '9:00 - 11:00 AM', subject: 'Mathematics', topic: 'Chapter 5: Algebra', tip: 'Your weakest area — dedicate focused time here', icon: '📘' },
    afternoon: { time: '2:00 - 4:00 PM', subject: 'Physics', topic: 'Numericals Practice', tip: 'Revise formulas before solving problems', icon: '🔬' },
    evening: { time: '6:00 - 7:00 PM', subject: 'English', topic: 'Quick Review: Essay Format', tip: 'Practice one 200-word essay', icon: '📖' },
  };

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid rgba(167, 139, 250, 0.3)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid var(--border-default)',
        background: 'rgba(167, 139, 250, 0.05)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.2rem' }}>🧠</span>
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '0.95rem' }}>
            Your AI Study Plan — Today
          </span>
        </div>
        <GradientButton size="sm" onClick={handleGenerate} loading={loading}>
          🔄 Regenerate
        </GradientButton>
      </div>

      <div style={{ padding: '20px' }}>
        {plan ? (
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.83rem',
            lineHeight: 1.8, color: 'var(--text-secondary)', whiteSpace: 'pre-wrap',
          }}>
            {plan}
            {loading && <span style={{
              display: 'inline-block', width: 2, height: '1em',
              background: 'var(--ai-glow)', marginLeft: 2,
              animation: 'blink 1s step-end infinite',
            }} />}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {Object.entries(defaultPlan).map(([key, session], i) => (
              <div key={key} style={{
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-deep)',
                border: '1px solid var(--border-default)',
                animation: `float 3s ease-in-out infinite ${i * 0.4}s`,
                transition: 'all 0.3s var(--spring)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = 'var(--primary)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.borderColor = 'var(--border-default)';
              }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '1.2rem' }}>{session.icon}</span>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{session.subject}</span>
                  <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{session.time}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>{session.topic}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--ai-glow)', fontStyle: 'italic' }}>"{session.tip}"</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
