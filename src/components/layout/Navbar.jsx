import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Roles', href: '#roles' },
    { name: 'Pricing', href: '#pricing' },
  ];

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      height: 'var(--nav-height)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      backdropFilter: scrolled ? 'blur(20px)' : 'blur(10px)',
      WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'blur(10px)',
      background: scrolled ? 'rgba(2, 8, 23, 0.85)' : 'rgba(2, 8, 23, 0.4)',
      borderBottom: scrolled ? '1px solid var(--border-default)' : '1px solid transparent',
      transition: 'all 0.3s var(--smooth)',
    }}>
      {/* Logo */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
        <div style={{
          width: 40, height: 40,
          borderRadius: '12px',
          background: 'linear-gradient(135deg, var(--primary), var(--violet))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '20px',
          animation: 'float 3s ease-in-out infinite',
          boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)',
        }}>🧠</div>
        <span style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.3rem',
          fontWeight: 700,
          background: 'linear-gradient(135deg, var(--primary-light), var(--violet))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>EduFlow AI</span>
      </Link>

      {/* Desktop Links */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '32px',
        '@media (max-width: 768px)': { display: 'none' },
      }} className="nav-links-desktop">
        {navLinks.map(link => (
          <a key={link.name} href={link.href} style={{
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            fontWeight: 500,
            transition: 'color 0.3s',
            cursor: 'pointer',
          }}
          onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
          onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
          >{link.name}</a>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Theme Toggle */}
        <button onClick={toggleTheme} style={{
          width: 40, height: 40,
          borderRadius: '50%',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-default)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '18px',
          transition: 'all 0.3s var(--spring)',
          color: 'var(--text-primary)',
        }}
        onMouseEnter={e => { e.target.style.transform = 'scale(1.1)'; e.target.style.borderColor = 'var(--primary)'; }}
        onMouseLeave={e => { e.target.style.transform = 'scale(1)'; e.target.style.borderColor = 'var(--border-default)'; }}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {isAuthenticated ? (
          <Link to="/dashboard" className="btn-gradient" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
            <span>Dashboard →</span>
          </Link>
        ) : (
          <>
            <Link to="/login" style={{
              color: 'var(--text-secondary)',
              fontSize: '0.9rem',
              fontWeight: 500,
              padding: '8px 16px',
              transition: 'color 0.3s',
            }} className="hide-mobile">Login</Link>
            <Link to="/register" className="btn-gradient" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
              <span>Get Started</span>
            </Link>
          </>
        )}

        {/* Mobile menu */}
        <button onClick={() => setMobileOpen(!mobileOpen)} style={{
          display: 'none',
          width: 40, height: 40,
          borderRadius: '8px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-default)',
          color: 'var(--text-primary)',
          fontSize: '20px',
          alignItems: 'center',
          justifyContent: 'center',
        }} className="mobile-menu-btn">
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={{
          position: 'absolute',
          top: 'var(--nav-height)',
          left: 0, right: 0,
          background: 'rgba(2, 8, 23, 0.95)',
          backdropFilter: 'blur(20px)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          borderBottom: '1px solid var(--border-default)',
          animation: 'fadeIn 0.3s ease',
        }}>
          {navLinks.map(link => (
            <a key={link.name} href={link.href} style={{
              color: 'var(--text-secondary)',
              fontSize: '1rem',
              padding: '8px 0',
            }}>{link.name}</a>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-links-desktop { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          .hide-mobile { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
