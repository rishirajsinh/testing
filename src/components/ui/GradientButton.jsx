export default function GradientButton({ children, onClick, variant = 'primary', size = 'md', disabled = false, loading = false, style: customStyle = {} }) {
  const sizes = {
    sm: { padding: '8px 16px', fontSize: '0.8rem' },
    md: { padding: '12px 28px', fontSize: '0.95rem' },
    lg: { padding: '16px 36px', fontSize: '1.05rem' },
  };

  const variants = {
    primary: {
      background: 'linear-gradient(135deg, var(--primary), var(--violet))',
      hoverShadow: '0 10px 30px rgba(99, 102, 241, 0.5)',
    },
    cyan: {
      background: 'linear-gradient(135deg, var(--cyan), var(--emerald))',
      hoverShadow: '0 10px 30px rgba(6, 182, 212, 0.5)',
    },
    danger: {
      background: 'linear-gradient(135deg, var(--danger), #e11d48)',
      hoverShadow: '0 10px 30px rgba(244, 63, 94, 0.5)',
    },
    ghost: {
      background: 'transparent',
      hoverShadow: 'var(--shadow-glow)',
    },
  };

  const v = variants[variant] || variants.primary;
  const s = sizes[size] || sizes.md;

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        ...s,
        borderRadius: 'var(--radius-full)',
        background: variant === 'ghost' ? 'transparent' : v.background,
        color: variant === 'ghost' ? 'var(--text-primary)' : 'white',
        border: variant === 'ghost' ? '1px solid var(--border-default)' : 'none',
        fontWeight: 600,
        transition: 'all 0.4s var(--spring)',
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        position: 'relative',
        overflow: 'hidden',
        ...customStyle,
      }}
      onMouseEnter={e => {
        if (!disabled) {
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.boxShadow = v.hoverShadow;
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = '';
      }}
    >
      {loading && (
        <div style={{
          width: 16, height: 16,
          border: '2px solid transparent',
          borderTop: '2px solid currentColor',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
      )}
      {children}
    </button>
  );
}
