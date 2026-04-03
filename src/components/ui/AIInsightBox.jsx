import { useState, useEffect } from 'react';

export default function AIInsightBox({ title, prompt, onGenerate, initialText = '' }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => setCursorVisible(v => !v), 530);
    return () => clearInterval(interval);
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    setText('');
    
    if (onGenerate) {
      await onGenerate(prompt, (partial) => {
        setText(partial);
      });
    } else {
      // Simulate typewriter
      const response = initialText || 'AI analysis loading...';
      for (let i = 0; i < response.length; i++) {
        await new Promise(r => setTimeout(r, 15));
        setText(response.slice(0, i + 1));
      }
    }
    setLoading(false);
  };

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid rgba(167, 139, 250, 0.3)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      animation: 'aiGlow 3s ease-in-out infinite',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        borderBottom: '1px solid var(--border-default)',
        background: 'rgba(167, 139, 250, 0.05)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.2rem' }}>🤖</span>
          <span style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '0.9rem',
            fontWeight: 600,
            color: 'var(--ai-glow)',
          }}>{title || 'AI Analysis'}</span>
          {loading && (
            <div style={{ display: 'flex', gap: '3px' }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 4, height: 4,
                  borderRadius: '50%',
                  background: 'var(--ai-glow)',
                  animation: `typingDots 1.4s infinite ${i * 0.2}s`,
                }} />
              ))}
            </div>
          )}
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading}
          style={{
            padding: '6px 16px',
            borderRadius: 'var(--radius-full)',
            background: loading ? 'var(--bg-card)' : 'linear-gradient(135deg, var(--primary), var(--violet))',
            color: 'white',
            fontSize: '0.8rem',
            fontWeight: 600,
            transition: 'all 0.3s var(--spring)',
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? 'Analyzing...' : '✦ Generate'}
        </button>
      </div>

      {/* Content */}
      <div style={{
        padding: '20px',
        minHeight: '120px',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.85rem',
        lineHeight: 1.8,
        color: 'var(--text-secondary)',
        whiteSpace: 'pre-wrap',
      }}>
        {text ? (
          <>
            {text}
            {loading && (
              <span style={{
                display: 'inline-block',
                width: '2px',
                height: '1em',
                background: 'var(--ai-glow)',
                marginLeft: '2px',
                verticalAlign: 'text-bottom',
                animation: 'blink 1s step-end infinite',
              }} />
            )}
          </>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            padding: '20px',
            opacity: 0.5,
          }}>
            <span style={{ fontSize: '2rem' }}>🧠</span>
            <span>Click "Generate" to run AI analysis</span>
          </div>
        )}
      </div>
    </div>
  );
}
