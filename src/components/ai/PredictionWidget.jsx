import { useState } from 'react';
import useAI from '../../hooks/useAI';

export default function PredictionWidget({ student, marks }) {
  const { loading, generateResponse } = useAI();
  const [prediction, setPrediction] = useState(null);

  // Calculate predicted score from marks trend
  const avgMarks = marks ? Object.values(marks).reduce((a, b) => a + b, 0) / Object.values(marks).length : 0;
  const predicted = Math.round(avgMarks * 1.05); // Simple prediction
  const confidence = Math.min(98, Math.max(75, 94 - Math.abs(avgMarks - 70) * 0.3));

  const handlePredict = async () => {
    await generateResponse(
      `Predict end-term performance for student with current averages: ${JSON.stringify(marks)}`,
      (p) => setPrediction(p)
    );
  };

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px',
      transition: 'all 0.4s var(--spring)',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = 'var(--shadow-glow)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = '';
      e.currentTarget.style.boxShadow = '';
    }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <span style={{ fontSize: '1.2rem' }}>📈</span>
        <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '0.9rem' }}>
          Performance Prediction
        </span>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <div style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '3rem',
          fontWeight: 700,
          background: predicted >= 60 ? 'linear-gradient(135deg, var(--emerald), var(--cyan))' : 'linear-gradient(135deg, var(--warning), var(--danger))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: 1.1,
        }}>
          {predicted}
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          Predicted End-Term Score
        </div>
      </div>

      <div style={{
        display: 'flex', justifyContent: 'center', gap: '16px',
        padding: '12px', borderRadius: 'var(--radius-md)',
        background: 'var(--bg-deep)',
        marginBottom: '12px',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Confidence</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--cyan)' }}>{Math.round(confidence)}%</div>
        </div>
        <div style={{ width: 1, background: 'var(--border-default)' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Trend</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: predicted >= avgMarks ? 'var(--emerald)' : 'var(--danger)' }}>
            {predicted >= avgMarks ? '↑ Improving' : '↓ Declining'}
          </div>
        </div>
      </div>

      <button onClick={handlePredict} disabled={loading} style={{
        width: '100%', padding: '10px',
        borderRadius: 'var(--radius-md)',
        background: 'linear-gradient(135deg, var(--primary), var(--violet))',
        color: 'white', fontSize: '0.85rem', fontWeight: 600,
        transition: 'all 0.3s var(--spring)',
        opacity: loading ? 0.6 : 1,
      }}>
        {loading ? '🔮 Predicting...' : '🧠 AI Deep Predict'}
      </button>

      {prediction && (
        <div style={{
          marginTop: '12px', padding: '12px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(167, 139, 250, 0.05)',
          border: '1px solid rgba(167, 139, 250, 0.2)',
          fontFamily: 'var(--font-mono)', fontSize: '0.78rem',
          lineHeight: 1.6, color: 'var(--text-secondary)',
          whiteSpace: 'pre-wrap', maxHeight: '200px', overflowY: 'auto',
        }}>
          {prediction}
        </div>
      )}
    </div>
  );
}
