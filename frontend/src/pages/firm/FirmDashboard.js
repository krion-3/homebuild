import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProjects } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const FirmDashboard = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [user.id]); // eslint-disable-line

  const fetchProjects = async () => {
    try {
      const res = await getAllProjects();
      const firmProjects = res.data.filter(p => Number(p.firm_id) === Number(user.id));
      setProjects(firmProjects);
    } catch (error) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (status) => {
    if (status === 'active') return '#10B981';
    if (status === 'completed') return '#1B3A6B';
    if (status === 'suspended') return '#EF4444';
    return '#F97316';
  };

  const activeProjects = projects.filter(p => p.status === 'active').length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const totalFunded = projects.reduce((sum, p) => sum + Number(p.funded_amount), 0);

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
            <div style={styles.navItem} onClick={() => navigate('/firm/projects')}>🏗️ My Projects</div>
          </nav>
          <div style={styles.sidebarBottom}>
            <div style={styles.userInfo}>
              <div style={styles.userAvatar}>🏢</div>
              <div>
                <div style={styles.userName}>{user?.full_name}</div>
                <div style={styles.userRole}>Construction Firm</div>
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
            Welcome, {user?.full_name} 👋
          </h1>
          <p style={{ color: '#888', margin: '4px 0 0 0', fontSize: '14px' }}>Manage your assigned construction projects</p>
        </div>

        {loading ? <p>Loading...</p> : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
              <div style={{...styles.statCard, borderTop: '4px solid #1B3A6B'}}>
                <div style={styles.statIcon}>🏗️</div>
                <div style={styles.statNumber}>{projects.length}</div>
                <div style={styles.statLabel}>Total</div>
              </div>
              <div style={{...styles.statCard, borderTop: '4px solid #10B981'}}>
                <div style={styles.statIcon}>✅</div>
                <div style={styles.statNumber}>{activeProjects}</div>
                <div style={styles.statLabel}>Active</div>
              </div>
              <div style={{...styles.statCard, borderTop: '4px solid #F97316'}}>
                <div style={styles.statIcon}>🏁</div>
                <div style={styles.statNumber}>{completedProjects}</div>
                <div style={styles.statLabel}>Completed</div>
              </div>
              <div style={{...styles.statCard, borderTop: '4px solid #8B5CF6', gridColumn: isMobile ? 'span 2' : 'span 1'}}>
                <div style={styles.statIcon}>💰</div>
                <div style={{ fontSize: isMobile ? '14px' : '20px', fontWeight: '700', color: '#1B3A6B' }}>KES {totalFunded.toLocaleString()}</div>
                <div style={styles.statLabel}>Total Funded</div>
              </div>
            </div>

            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Assigned Projects</h2>
              {projects.length === 0 ? (
                <p style={styles.emptyText}>No projects assigned yet.</p>
              ) : (
                projects.map(project => (
                  <div key={project.id} style={styles.projectCard}>
                    <div style={styles.projectHeader}>
                      <div>
                        <h3 style={styles.projectTitle}>{project.location}</h3>
                        <p style={styles.projectSub}>
                          Homeowner: {project.homeowner_name} | Engineer: {project.engineer_name}
                        </p>
                      </div>
                      <span style={{...styles.badge, backgroundColor: statusColor(project.status)}}>
                        {project.status}
                      </span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: '12px', marginBottom: '16px', backgroundColor: '#F5F5F5', borderRadius: '8px', padding: '12px' }}>
                      <div style={styles.projectStat}>
                        <div style={styles.projectStatLabel}>Total Cost</div>
                        <div style={styles.projectStatValue}>KES {Number(project.total_cost).toLocaleString()}</div>
                      </div>
                      <div style={styles.projectStat}>
                        <div style={styles.projectStatLabel}>Funded</div>
                        <div style={styles.projectStatValue}>KES {Number(project.funded_amount).toLocaleString()}</div>
                      </div>
                      <div style={styles.projectStat}>
                        <div style={styles.projectStatLabel}>Start Date</div>
                        <div style={styles.projectStatValue}>{new Date(project.start_date).toLocaleDateString()}</div>
                      </div>
                      <div style={styles.projectStat}>
                        <div style={styles.projectStatLabel}>End Date</div>
                        <div style={styles.projectStatValue}>{new Date(project.expected_end_date).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <button style={styles.actionBtn} onClick={() => navigate(`/firm/projects/${project.id}`)}>
                      📋 View Details
                    </button>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>

      {/* Mobile Bottom Nav */}
      {isMobile && (
        <div style={styles.bottomNav}>
          <div style={styles.bottomNavItem} onClick={() => navigate('/firm')}>
            <div style={styles.bottomNavIcon}>📊</div>
            <div style={styles.bottomNavLabel}>Dashboard</div>
          </div>
          <div style={styles.bottomNavItem} onClick={() => navigate('/firm/projects')}>
            <div style={styles.bottomNavIcon}>🏗️</div>
            <div style={styles.bottomNavLabel}>Projects</div>
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
  statCard: { backgroundColor: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center' },
  statIcon: { fontSize: '28px', marginBottom: '8px' },
  statNumber: { fontSize: '28px', fontWeight: '700', color: '#1B3A6B' },
  statLabel: { color: '#888', fontSize: '14px', marginTop: '4px' },
  section: { backgroundColor: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  sectionTitle: { fontSize: '18px', fontWeight: '600', color: '#1B3A6B', marginTop: 0, marginBottom: '16px' },
  emptyText: { textAlign: 'center', color: '#888', padding: '24px 0' },
  projectCard: { border: '1.5px solid #E0E0E0', borderRadius: '12px', padding: '16px', marginBottom: '16px' },
  projectHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', gap: '8px' },
  projectTitle: { fontSize: '16px', fontWeight: '700', color: '#1B3A6B', margin: '0 0 4px 0' },
  projectSub: { fontSize: '13px', color: '#888', margin: 0 },
  badge: { color: '#fff', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap' },
  projectStat: { textAlign: 'center' },
  projectStatLabel: { fontSize: '12px', color: '#888', marginBottom: '4px' },
  projectStatValue: { fontSize: '13px', fontWeight: '600', color: '#1B3A6B' },
  actionBtn: { backgroundColor: '#1B3A6B', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 16px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  bottomNav: { position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#1B3A6B', display: 'flex', justifyContent: 'space-around', padding: '10px 0', zIndex: 100, boxShadow: '0 -2px 10px rgba(0,0,0,0.15)' },
  bottomNavItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', padding: '4px 12px' },
  bottomNavIcon: { fontSize: '22px' },
  bottomNavLabel: { color: 'rgba(255,255,255,0.8)', fontSize: '11px', marginTop: '2px' },
};

export default FirmDashboard;