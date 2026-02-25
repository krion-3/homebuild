import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, getAllProperties, getAllProjects, getAllPayments } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ users: 0, properties: 0, projects: 0, payments: 0 });
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [usersRes, propertiesRes, projectsRes, paymentsRes] = await Promise.all([
        getAllUsers(),
        getAllProperties(),
        getAllProjects(),
        getAllPayments()
      ]);
      setStats({
        users: usersRes.data.length,
        properties: propertiesRes.data.length,
        projects: projectsRes.data.length,
        payments: paymentsRes.data.length
      });
    } catch (error) {
      toast.error('Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F5F5F5', fontFamily: "'Segoe UI', sans-serif" }}>

      {/* Sidebar - desktop only */}
      {!isMobile && (
        <div style={styles.sidebar}>
          <div style={styles.sidebarLogo}>
            <span>🏗️</span>
            <span style={styles.logoText}>Homebuild</span>
          </div>
          <nav style={styles.nav}>
            <div style={{...styles.navItem, ...styles.navItemActive}}>📊 Dashboard</div>
            <div style={styles.navItem} onClick={() => navigate('/admin/users')}>👥 Users</div>
            <div style={styles.navItem} onClick={() => navigate('/admin/properties')}>🏠 Properties</div>
            <div style={styles.navItem} onClick={() => navigate('/admin/projects')}>🏗️ Projects</div>
            <div style={styles.navItem} onClick={() => navigate('/admin/payments')}>💰 Payments</div>
          </nav>
          <div style={styles.sidebarBottom}>
            <div style={styles.userInfo}>
              <div style={styles.userAvatar}>👤</div>
              <div>
                <div style={styles.userName}>{user?.full_name}</div>
                <div style={styles.userRole}>Administrator</div>
              </div>
            </div>
            <div style={styles.logoutBtn} onClick={() => { logoutUser(); navigate('/login'); }}>
              🚪 <span>Logout</span>
            </div>
          </div>
        </div>
      )}

      <div style={{ marginLeft: isMobile ? '0' : '240px', flex: 1, padding: isMobile ? '20px 16px 80px' : '32px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: isMobile ? '22px' : '28px', fontWeight: '700', color: '#1B3A6B', margin: 0 }}>
            Admin Dashboard
          </h1>
          <p style={{ color: '#888', margin: '4px 0 0 0', fontSize: '14px' }}>Welcome back, {user?.full_name}</p>
        </div>

        {loading ? <p>Loading...</p> : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
              <div style={{...styles.statCard, borderTop: '4px solid #1B3A6B'}} onClick={() => navigate('/admin/users')}>
                <div style={styles.statIcon}>👥</div>
                <div style={styles.statNumber}>{stats.users}</div>
                <div style={styles.statLabel}>Total Users</div>
              </div>
              <div style={{...styles.statCard, borderTop: '4px solid #10B981'}} onClick={() => navigate('/admin/properties')}>
                <div style={styles.statIcon}>🏠</div>
                <div style={styles.statNumber}>{stats.properties}</div>
                <div style={styles.statLabel}>Properties</div>
              </div>
              <div style={{...styles.statCard, borderTop: '4px solid #F97316'}} onClick={() => navigate('/admin/projects')}>
                <div style={styles.statIcon}>🏗️</div>
                <div style={styles.statNumber}>{stats.projects}</div>
                <div style={styles.statLabel}>Projects</div>
              </div>
              <div style={{...styles.statCard, borderTop: '4px solid #8B5CF6'}} onClick={() => navigate('/admin/payments')}>
                <div style={styles.statIcon}>💰</div>
                <div style={styles.statNumber}>{stats.payments}</div>
                <div style={styles.statLabel}>Payments</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '16px' }}>
              <div style={{...styles.quickCard}} onClick={() => navigate('/admin/users')}>
                <div style={styles.quickIcon}>👥</div>
                <div>
                  <div style={styles.quickTitle}>Manage Users</div>
                  <div style={styles.quickSub}>Add homeowners, engineers and firms</div>
                </div>
                <div style={styles.quickArrow}>→</div>
              </div>
              <div style={{...styles.quickCard}} onClick={() => navigate('/admin/properties')}>
                <div style={styles.quickIcon}>🏠</div>
                <div>
                  <div style={styles.quickTitle}>Verify Properties</div>
                  <div style={styles.quickSub}>Review and approve submitted properties</div>
                </div>
                <div style={styles.quickArrow}>→</div>
              </div>
              <div style={{...styles.quickCard}} onClick={() => navigate('/admin/projects')}>
                <div style={styles.quickIcon}>🏗️</div>
                <div>
                  <div style={styles.quickTitle}>Manage Projects</div>
                  <div style={styles.quickSub}>Create projects and assign milestones</div>
                </div>
                <div style={styles.quickArrow}>→</div>
              </div>
              <div style={{...styles.quickCard}} onClick={() => navigate('/admin/payments')}>
                <div style={styles.quickIcon}>💰</div>
                <div>
                  <div style={styles.quickTitle}>Confirm Payments</div>
                  <div style={styles.quickSub}>Review and confirm homeowner payments</div>
                </div>
                <div style={styles.quickArrow}>→</div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Mobile Bottom Nav */}
      {isMobile && (
        <div style={styles.bottomNav}>
          <div style={styles.bottomNavItem} onClick={() => navigate('/admin')}>
            <div style={styles.bottomNavIcon}>📊</div>
            <div style={styles.bottomNavLabel}>Home</div>
          </div>
          <div style={styles.bottomNavItem} onClick={() => navigate('/admin/users')}>
            <div style={styles.bottomNavIcon}>👥</div>
            <div style={styles.bottomNavLabel}>Users</div>
          </div>
          <div style={styles.bottomNavItem} onClick={() => navigate('/admin/projects')}>
            <div style={styles.bottomNavIcon}>🏗️</div>
            <div style={styles.bottomNavLabel}>Projects</div>
          </div>
          <div style={styles.bottomNavItem} onClick={() => navigate('/admin/payments')}>
            <div style={styles.bottomNavIcon}>💰</div>
            <div style={styles.bottomNavLabel}>Payments</div>
          </div>
          <div style={styles.bottomNavItem} onClick={() => { logoutUser(); navigate('/login'); }}>
            <div style={styles.bottomNavIcon}>🚪</div>
            <div style={styles.bottomNavLabel}>Logout</div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  sidebar: { width: '240px', backgroundColor: '#1B3A6B', display: 'flex', flexDirection: 'column', padding: '24px 0', position: 'fixed', height: '100vh', overflowY: 'hidden' },
  sidebarLogo: { display: 'flex', alignItems: 'center', gap: '10px', padding: '0 24px 32px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)' },
  logoText: { color: '#fff', fontSize: '20px', fontWeight: '700' },
  nav: { display: 'flex', flexDirection: 'column', padding: '24px 0', flex: 1 },
  navItem: { padding: '14px 24px', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '15px', borderLeft: '3px solid transparent' },
  navItemActive: { color: '#fff', backgroundColor: 'rgba(255,255,255,0.1)', borderLeft: '3px solid #F97316' },
  sidebarBottom: { borderTop: '1px solid rgba(255,255,255,0.1)', position: 'sticky', bottom: 0, backgroundColor: '#1B3A6B' },
  userInfo: { display: 'flex', alignItems: 'center', gap: '10px', padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)' },
  userAvatar: { fontSize: '24px' },
  userName: { color: '#fff', fontSize: '13px', fontWeight: '600' },
  userRole: { color: 'rgba(255,255,255,0.5)', fontSize: '12px' },
  logoutBtn: { padding: '14px 24px', color: '#fff', cursor: 'pointer', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#EF4444', margin: '12px', borderRadius: '8px', fontWeight: '600' },
  statCard: { backgroundColor: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center', cursor: 'pointer' },
  statIcon: { fontSize: '28px', marginBottom: '8px' },
  statNumber: { fontSize: '28px', fontWeight: '700', color: '#1B3A6B' },
  statLabel: { color: '#888', fontSize: '14px', marginTop: '4px' },
  quickCard: { backgroundColor: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' },
  quickIcon: { fontSize: '32px' },
  quickTitle: { fontSize: '16px', fontWeight: '600', color: '#1B3A6B', marginBottom: '4px' },
  quickSub: { fontSize: '13px', color: '#888' },
  quickArrow: { marginLeft: 'auto', fontSize: '20px', color: '#F97316', fontWeight: '700' },
  bottomNav: { position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#1B3A6B', display: 'flex', justifyContent: 'space-around', padding: '10px 0', zIndex: 100, boxShadow: '0 -2px 10px rgba(0,0,0,0.15)' },
  bottomNavItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', padding: '4px 8px' },
  bottomNavIcon: { fontSize: '22px' },
  bottomNavLabel: { color: 'rgba(255,255,255,0.8)', fontSize: '11px', marginTop: '2px' },
};

export default AdminDashboard;