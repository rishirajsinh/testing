import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Toast from '../ui/Toast';
import useLocalStorage from '../../hooks/useLocalStorage';

export default function DashboardLayout() {
  const [collapsed] = useLocalStorage('eduflow_sidebar_collapsed', false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-deep)' }}>
      <Sidebar />
      <div style={{
        flex: 1,
        marginLeft: collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)',
        transition: 'margin-left 0.3s var(--smooth)',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}>
        <TopBar />
        <main style={{
          flex: 1,
          padding: '24px',
          overflowY: 'auto',
          animation: 'fadeIn 0.4s ease',
        }}>
          <Outlet />
        </main>
      </div>
      <Toast />
    </div>
  );
}
