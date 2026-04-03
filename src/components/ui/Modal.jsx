export default function Modal({ isOpen, onClose, title, children, maxWidth = '500px' }) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.2s ease',
      }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(8px)',
      }} />

      {/* Modal Content */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth,
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'var(--bg-space)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-xl)',
          animation: 'fadeInScale 0.3s var(--spring)',
          boxShadow: 'var(--shadow-float)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        {title && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-default)',
          }}>
            <h3 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.1rem',
              fontWeight: 600,
            }}>{title}</h3>
            <button
              onClick={onClose}
              style={{
                width: 32, height: 32,
                borderRadius: '50%',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-default)',
                color: 'var(--text-muted)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '14px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.target.style.borderColor = 'var(--danger)'; e.target.style.color = 'var(--danger)'; }}
              onMouseLeave={e => { e.target.style.borderColor = 'var(--border-default)'; e.target.style.color = 'var(--text-muted)'; }}
            >✕</button>
          </div>
        )}
        
        {/* Body */}
        <div style={{ padding: '24px' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
