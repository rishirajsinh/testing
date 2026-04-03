import { useNotification } from '../../context/NotificationContext';

const typeColors = {
  success: { bg: 'rgba(16, 185, 129, 0.15)', border: '#10b981', icon: '✅' },
  error: { bg: 'rgba(244, 63, 94, 0.15)', border: '#f43f5e', icon: '❌' },
  warning: { bg: 'rgba(245, 158, 11, 0.15)', border: '#f59e0b', icon: '⚠️' },
  info: { bg: 'rgba(6, 182, 212, 0.15)', border: '#06b6d4', icon: 'ℹ️' },
};

export default function Toast() {
  const { toasts, removeToast } = useNotification();

  return (
    <div style={{
      position: 'fixed',
      top: '80px',
      right: '20px',
      zIndex: 10000,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      maxWidth: '380px',
    }}>
      {toasts.map(toast => {
        const style = typeColors[toast.type] || typeColors.info;
        return (
          <div
            key={toast.id}
            style={{
              padding: '14px 20px',
              borderRadius: 'var(--radius-md)',
              background: style.bg,
              border: `1px solid ${style.border}40`,
              backdropFilter: 'blur(20px)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              animation: 'slideInRight 0.3s var(--spring)',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
            }}
            onClick={() => removeToast(toast.id)}
          >
            <span style={{ fontSize: '1rem' }}>{style.icon}</span>
            <span style={{
              fontSize: '0.85rem',
              color: 'var(--text-primary)',
              fontWeight: 500,
              flex: 1,
            }}>{toast.message}</span>
            <span style={{
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              cursor: 'pointer',
            }}>✕</span>
            {/* Progress bar */}
            <div style={{
              position: 'absolute',
              bottom: 0, left: 0,
              height: '2px',
              background: style.border,
              animation: `toastProgress ${toast.duration || 3000}ms linear`,
            }} />
          </div>
        );
      })}
    </div>
  );
}
