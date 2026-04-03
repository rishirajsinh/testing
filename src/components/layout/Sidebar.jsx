import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useLocalStorage from '../../hooks/useLocalStorage';

const teacherMenu = [
  { icon: '📊', label: 'Overview', path: '/dashboard/teacher' },
  { icon: '📋', label: 'Attendance', path: '/dashboard/teacher', hash: 'attendance' },
  { icon: '✏️', label: 'Marks Entry', path: '/dashboard/teacher', hash: 'marks' },
  { icon: '🧠', label: 'AI Insights', path: '/dashboard/teacher', hash: 'insights' },
  { icon: '📄', label: 'Reports', path: '/dashboard/teacher', hash: 'reports' },
  { icon: '⚠️', label: 'Risk Detection', path: '/dashboard/teacher', hash: 'risk' },
  { icon: '👥', label: 'Students', path: '/dashboard/teacher', hash: 'students' },
  { icon: '⚙️', label: 'Settings', path: '/dashboard/settings' },
];

const studentMenu = [
  { icon: '📊', label: 'Overview', path: '/dashboard/student' },
  { icon: '📋', label: 'My Attendance', path: '/dashboard/student', hash: 'attendance' },
  { icon: '📝', label: 'My Marks', path: '/dashboard/student', hash: 'study-plan' },
  { icon: '🧠', label: 'AI Study Plan', path: '/dashboard/student', hash: 'study-plan' },
  { icon: '📄', label: 'Report Card', path: '/dashboard/student', hash: 'report-card' },
  { icon: '🏆', label: 'Achievements', path: '/dashboard/student', hash: 'achievements' },
  { icon: '⚙️', label: 'Settings', path: '/dashboard/settings' },
];

const adminMenu = [
  { icon: '📊', label: 'Overview', path: '/dashboard/admin' },
  { icon: '👥', label: 'Students', path: '/dashboard/admin', hash: 'students' },
  { icon: '👨‍🏫', label: 'Teachers', path: '/dashboard/admin', hash: 'teachers' },
  { icon: '🧠', label: 'AI Analytics', path: '/dashboard/admin', hash: 'ai-analytics' },
  { icon: '📢', label: 'Announcements', path: '/dashboard/admin', hash: 'announcements' },
  { icon: '⚙️', label: 'Settings', path: '/dashboard/settings' },
];

export default function Sidebar() {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useLocalStorage('eduflow_sidebar_collapsed', false);
  const location = useLocation();

  const role = user?.role || 'teacher';
  const menu = role === 'student' ? studentMenu : role === 'admin' ? adminMenu : teacherMenu;

  const roleColors = {
    teacher: 'var(--primary)',
    student: 'var(--cyan)',
    admin: 'var(--violet)',
  };

  return (
    <aside style={{
      position: 'fixed',
      top: 0,
      left: 0,
      bottom: 0,
      width: collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)',
      background: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border-default)',
      backdropFilter: 'blur(20px)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.3s var(--smooth)',
      zIndex: 100,
      overflow: 'hidden',
    }}>
      {/* Logo Area */}
      <div style={{
        padding: collapsed ? '20px 16px' : '20px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        borderBottom: '1px solid var(--border-default)',
        minHeight: '72px',
      }}>
        <div style={{
          width: 38, height: 38, minWidth: 38,
          borderRadius: '10px',
          background: 'linear-gradient(135deg, var(--primary), var(--violet))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '18px',
          animation: 'float 3s ease-in-out infinite',
          boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)',
        }}>🧠</div>
        {!collapsed && (
          <span style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.1rem',
            fontWeight: 700,
            background: 'linear-gradient(135deg, var(--primary-light), var(--violet))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            whiteSpace: 'nowrap',
          }}>EduFlow AI</span>
        )}
      </div>

      {/* Role Badge */}
      <div style={{
        padding: collapsed ? '12px 8px' : '12px 20px',
        display: 'flex',
        justifyContent: 'center',
      }}>
        <div style={{
          padding: collapsed ? '6px' : '6px 16px',
          borderRadius: 'var(--radius-full)',
          background: `${roleColors[role]}15`,
          border: `1px solid ${roleColors[role]}40`,
          color: roleColors[role],
          fontSize: '0.75rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          whiteSpace: 'nowrap',
          textAlign: 'center',
        }}>
          {collapsed ? role[0].toUpperCase() : role}
        </div>
      </div>

      {/* Menu Items */}
      <nav style={{
        flex: 1,
        padding: '8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        overflowY: 'auto',
      }}>
        {menu.map((item, idx) => {
          const isActive = item.hash
            ? location.pathname === item.path && location.hash === `#${item.hash}`
            : location.pathname === item.path && (!location.hash || location.hash === '#overview');

          return (
            <NavLink
              key={item.label + idx}
              to={item.hash ? `${item.path}#${item.hash}` : item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: collapsed ? '12px 16px' : '10px 16px',
                borderRadius: 'var(--radius-md)',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                background: isActive ? `${roleColors[role]}15` : 'transparent',
                border: isActive ? `1px solid ${roleColors[role]}30` : '1px solid transparent',
                transition: 'all 0.3s var(--smooth)',
                fontSize: '0.9rem',
                fontWeight: isActive ? 600 : 400,
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                justifyContent: collapsed ? 'center' : 'flex-start',
                position: 'relative',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'var(--bg-card)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
            >
              <span style={{ fontSize: '1.1rem', minWidth: '24px', textAlign: 'center' }}>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
              {isActive && (
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 3,
                  height: '60%',
                  borderRadius: '0 4px 4px 0',
                  background: roleColors[role],
                }} />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid var(--border-default)',
      }}>
        <button onClick={() => setCollapsed(!collapsed)} style={{
          width: '100%',
          padding: '10px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-default)',
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          fontSize: '0.85rem',
          transition: 'all 0.3s var(--smooth)',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
        >
          {collapsed ? '→' : '← Collapse'}
        </button>
      </div>
    </aside>
  );
}
