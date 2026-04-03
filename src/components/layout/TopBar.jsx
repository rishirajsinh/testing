import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNotification } from '../../context/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { getInitials, getDisplayName } from '../../utils/avatarHelpers';

export default function TopBar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { info } = useNotification();
  const navigate = useNavigate();
  const [searchFocused, setSearchFocused] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifCount] = useState(3);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initials = getInitials(user?.name || '');
  const displayName = getDisplayName(user?.name || '');

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
    info('Successfully logged out');
  };

  const handleNavigate = (path) => {
    setShowUserMenu(false);
    navigate(path);
  };

  const iconBtnStyle = {
    width: 36, height: 36,
    borderRadius: '50%',
    background: 'var(--bg-deep)',
    border: '1px solid var(--border-default)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '16px',
    transition: 'all 0.3s var(--spring)',
    color: 'var(--text-primary)',
    position: 'relative',
    cursor: 'pointer',
  };

  return (
    <header style={{
      height: 'var(--topbar-height)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      borderBottom: '1px solid var(--border-default)',
      background: 'var(--bg-card)',
      backdropFilter: 'blur(20px)',
      gap: '16px',
    }}>
      {/* Search */}
      <div style={{
        position: 'relative',
        flex: 1,
        maxWidth: '400px',
      }}>
        <span style={{
          position: 'absolute',
          left: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: '14px',
          color: 'var(--text-muted)',
        }}>🔍</span>
        <input
          type="text"
          placeholder="Search students, reports..."
          style={{
            width: '100%',
            padding: '10px 12px 10px 36px',
            borderRadius: 'var(--radius-full)',
            background: searchFocused ? 'var(--bg-card-hover)' : 'var(--bg-deep)',
            border: `1px solid ${searchFocused ? 'var(--primary)' : 'var(--border-default)'}`,
            color: 'var(--text-primary)',
            fontSize: '0.85rem',
            transition: 'all 0.3s var(--smooth)',
            outline: 'none',
          }}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
      </div>

      {/* Right Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          style={iconBtnStyle}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-default)'}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {/* Notifications */}
        <button
          style={iconBtnStyle}
          onClick={() => info('No new notifications')}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-default)'}
        >
          🔔
          {notifCount > 0 && (
            <span style={{
              position: 'absolute',
              top: -4, right: -4,
              width: 18, height: 18,
              borderRadius: '50%',
              background: 'var(--danger)',
              color: 'white',
              fontSize: '0.6rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid var(--bg-card)',
            }}>{notifCount}</span>
          )}
        </button>

        {/* ═══ Profile Dropdown ═══ */}
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '6px 12px 6px 6px',
              borderRadius: 'var(--radius-full)',
              background: showUserMenu ? 'rgba(99,102,241,0.1)' : 'var(--bg-deep)',
              border: `1px solid ${showUserMenu ? 'rgba(99,102,241,0.4)' : 'var(--border-default)'}`,
              transition: 'all 0.3s var(--spring)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)';
              e.currentTarget.style.background = 'rgba(99,102,241,0.08)';
            }}
            onMouseLeave={e => {
              if (!showUserMenu) {
                e.currentTarget.style.borderColor = 'var(--border-default)';
                e.currentTarget.style.background = 'var(--bg-deep)';
              }
            }}
          >
            {/* Avatar */}
            <div style={{
              width: 32, height: 32,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary), var(--violet))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white',
              fontSize: '0.7rem',
              fontWeight: 700,
              flexShrink: 0,
            }}>{initials}</div>

            {/* Name + Role */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.2 }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                {displayName}
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                {user?.role || 'teacher'}
              </span>
            </div>

            {/* Arrow */}
            <span style={{
              fontSize: '9px',
              color: 'var(--text-muted)',
              display: 'inline-block',
              transform: showUserMenu ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease',
            }}>▼</span>
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              width: '240px',
              background: 'var(--bg-space)',
              border: '1px solid var(--border-default)',
              borderRadius: '16px',
              padding: '8px',
              zIndex: 1000,
              boxShadow: '0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(99,102,241,0.1)',
              animation: 'fadeInScale 0.2s cubic-bezier(0.34,1.56,0.64,1)',
            }}>
              {/* User Info Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 8px',
              }}>
                <div style={{
                  width: 40, height: 40,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary), var(--violet))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  flexShrink: 0,
                }}>{initials}</div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {user?.name || 'User'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {user?.email || 'user@eduflow.ai'}
                  </div>
                  <span style={{
                    display: 'inline-block',
                    marginTop: '4px',
                    fontSize: '0.65rem',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(99,102,241,0.15)',
                    color: 'var(--primary-light)',
                    fontWeight: 600,
                    textTransform: 'capitalize',
                  }}>{user?.role || 'teacher'}</span>
                </div>
              </div>

              <div style={{ height: 1, background: 'var(--border-default)', margin: '6px 0' }} />

              {/* Menu Items */}
              {[
                { icon: '👤', label: 'My Profile', onClick: () => handleNavigate('/dashboard/settings') },
                { icon: '⚙️', label: 'Settings', onClick: () => handleNavigate('/dashboard/settings') },
                { icon: theme === 'dark' ? '☀️' : '🌙', label: 'Change Theme', onClick: () => { toggleTheme(); setShowUserMenu(false); } },
                { icon: '🔔', label: 'Notifications', onClick: () => { info('No new notifications'); setShowUserMenu(false); } },
              ].map(item => (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(99,102,241,0.08)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >{item.icon} {item.label}</button>
              ))}

              <div style={{ height: 1, background: 'var(--border-default)', margin: '6px 0' }} />

              {/* Logout */}
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(239,68,68,0.1)';
                  e.currentTarget.style.color = '#ef4444';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >🚪 Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
