import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAllUsers, getAllProjects, getAllProperties } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: 0,
    projects: 0,
    properties: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [users, projects, properties] = await Promise.all([
          getAllUsers(),
          getAllProjects(),
          getAllProperties(),
        ]);
        setStats({
          users: users.data.length,
          projects: projects.data.length,
          properties: properties.data.length,
        });
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <div style={styles.sidebarLogo}>
          <span style={styles.logoIcon}>🏗️</span>
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
          <div style={styles.logoutBtn} onClick={handleLogout}>
            🚪 <span>Logout</span>
          </div>
        </div>
      </div>

      <div style={styles.main}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.headerTitle}>Dashboard</h1>
            <p style={styles.headerSub}>Welcome back, {user?.full_name}</p>
          </div>
        </div>

        {loading ? (
          <p>Loading stats...</p>
        ) : (
          <div style={styles.statsGrid}>
            <div style={{...styles.statCard, borderTop: '4px solid #1B3A6B'}}>
              <div style={styles.statIcon}>👥</div>
              <div style={styles.statNumber}>{stats.users}</div>
              <div style={styles.statLabel}>Total Users</div>
            </div>
            <div style={{...styles.statCard, borderTop: '4px solid #F97316'}}>
              <div style={styles.statIcon}>🏗️</div>
              <div style={styles.statNumber}>{stats.projects}</div>
              <div style={styles.statLabel}>Active Projects</div>
            </div>
            <div style={{...styles.statCard, borderTop: '4px solid #10B981'}}>
              <div style={styles.statIcon}>🏠</div>
              <div style={styles.statNumber}>{stats.properties}</div>
              <div style={styles.statLabel}>Properties</div>
            </div>
          </div>
        )}

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Quick Actions</h2>
          <div style={styles.actionsGrid}>
            <div style={styles.actionCard} onClick={() => navigate('/admin/users')}>
              <div style={styles.actionIcon}>➕</div>
              <div style={styles.actionText}>Create User Account</div>
            </div>
            <div style={styles.actionCard} onClick={() => navigate('/admin/properties')}>
              <div style={styles.actionIcon}>✅</div>
              <div style={styles.actionText}>Verify Properties</div>
            </div>
            <div style={styles.actionCard} onClick={() => navigate('/admin/projects')}>
              <div style={styles.actionIcon}>📋</div>
              <div style={styles.actionText}>Manage Projects</div>
            </div>
            <div style={styles.actionCard} onClick={() => navigate('/admin/payments')}>
              <div style={styles.actionIcon}>💳</div>
              <div style={styles.actionText}>Confirm Payments</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', minHeight: '100vh', backgroundColor: '#F5F5F5', fontFamily: "'Segoe UI', sans-serif" },
  sidebar: { width: '240px', backgroundColor: '#1B3A6B', display: 'flex', flexDirection: 'column', padding: '24px 0', position: 'fixed', height: '100vh', overflowY: 'hidden' },
  sidebarLogo: { display: 'flex', alignItems: 'center', gap: '10px', padding: '0 24px 32px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)' },
  logoIcon: { fontSize: '24px' },
  logoText: { color: '#fff', fontSize: '20px', fontWeight: '700' },
  nav: { display: 'flex', flexDirection: 'column', padding: '24px 0', flex: 1 },
  navItem: { padding: '14px 24px', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '15px', borderLeft: '3px solid transparent' },
  navItemActive: { color: '#fff', backgroundColor: 'rgba(255,255,255,0.1)', borderLeft: '3px solid #F97316' },
  sidebarBottom: { borderTop: '1px solid rgba(255,255,255,0.1)', position: 'sticky', bottom: 0, backgroundColor: '#1B3A6B' },
  logoutBtn: { padding: '14px 24px', color: '#fff', cursor: 'pointer', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#EF4444', margin: '12px', borderRadius: '8px', fontWeight: '600' },
  main: { marginLeft: '240px', flex: 1, padding: '32px' },
  header: { marginBottom: '32px' },
  headerTitle: { fontSize: '28px', fontWeight: '700', color: '#1B3A6B', margin: 0 },
  headerSub: { color: '#888', margin: '4px 0 0 0' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' },
  statCard: { backgroundColor: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center' },
  statIcon: { fontSize: '32px', marginBottom: '8px' },
  statNumber: { fontSize: '36px', fontWeight: '700', color: '#1B3A6B' },
  statLabel: { color: '#888', fontSize: '14px', marginTop: '4px' },
  section: { backgroundColor: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  sectionTitle: { fontSize: '18px', fontWeight: '600', color: '#1B3A6B', marginTop: 0, marginBottom: '20px' },
  actionsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' },
  actionCard: { backgroundColor: '#F5F5F5', borderRadius: '10px', padding: '20px', textAlign: 'center', cursor: 'pointer' },
  actionIcon: { fontSize: '28px', marginBottom: '8px' },
  actionText: { fontSize: '13px', fontWeight: '600', color: '#1B3A6B' },
};

export default AdminDashboard;