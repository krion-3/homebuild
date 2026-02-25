import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getMyProjects, getProjectMilestones, getMilestoneUpdates } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const HomeownerProgress = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const { project_id } = useParams();
  const [projects, setProjects] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [updates, setUpdates] = useState({});
  const [selectedProject, setSelectedProject] = useState(project_id || '');
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchProjects();
  }, []); // eslint-disable-line

  useEffect(() => {
    if (selectedProject) fetchMilestones(selectedProject);
  }, [selectedProject]); // eslint-disable-line

  const fetchProjects = async () => {
    try {
      const res = await getMyProjects();
      setProjects(res.data);
      if (!project_id && res.data.length > 0) setSelectedProject(res.data[0].id);
    } catch (error) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const fetchMilestones = async (projectId) => {
    try {
      const res = await getProjectMilestones(projectId);
      setMilestones(res.data);
      res.data.forEach(milestone => fetchUpdates(milestone.id));
    } catch (error) {
      toast.error('Failed to load milestones');
    }
  };

  const fetchUpdates = async (milestoneId) => {
    try {
      const res = await getMilestoneUpdates(milestoneId);
      setUpdates(prev => ({ ...prev, [milestoneId]: res.data }));
    } catch (error) {
      console.error('Failed to load updates for milestone', milestoneId);
    }
  };

  const statusColor = (status) => {
    if (status === 'completed') return '#10B981';
    if (status === 'in_progress') return '#F97316';
    return '#888';
  };

  const completedCount = milestones.filter(m => m.status === 'completed').length;
  const progressPercent = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0;

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
            <div style={styles.navItem} onClick={() => navigate('/homeowner')}>📊 Dashboard</div>
            <div style={styles.navItem} onClick={() => navigate('/homeowner/payments')}>💰 Payments</div>
            <div style={{...styles.navItem, ...styles.navItemActive}}>📸 Progress</div>
          </nav>
          <div style={styles.sidebarBottom}>
            <div style={styles.userInfo}>
              <div style={styles.userAvatar}>👤</div>
              <div>
                <div style={styles.userName}>{user?.full_name}</div>
                <div style={styles.userRole}>Homeowner</div>
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
            Construction Progress
          </h1>
          <p style={{ color: '#888', margin: '4px 0 0 0', fontSize: '14px' }}>Track your home building journey</p>
        </div>

        <div style={styles.filterCard}>
          <label style={styles.filterLabel}>Project:</label>
          <select
            style={styles.filterSelect}
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
          >
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.location}</option>
            ))}
          </select>
        </div>

        {milestones.length > 0 && (
          <div style={styles.progressCard}>
            <div style={styles.progressHeader}>
              <span style={styles.progressLabel}>Overall Progress</span>
              <span style={styles.progressPercent}>{progressPercent}%</span>
            </div>
            <div style={styles.progressBar}>
              <div style={{...styles.progressFill, width: `${progressPercent}%`}} />
            </div>
            <p style={styles.progressSub}>
              {completedCount} of {milestones.length} milestones completed
            </p>
          </div>
        )}

        {loading ? <p>Loading...</p> : milestones.length === 0 ? (
          <div style={styles.section}>
            <p style={styles.emptyText}>No milestones found for this project yet.</p>
          </div>
        ) : (
          milestones.map(milestone => (
            <div key={milestone.id} style={styles.milestoneCard}>
              <div style={styles.milestoneHeader}>
                <div style={{ flex: 1 }}>
                  <h3 style={styles.milestoneTitle}>{milestone.title}</h3>
                  <p style={styles.milestoneSub}>{milestone.description}</p>
                  <p style={styles.milestoneDue}>
                    Due: {new Date(milestone.due_date).toLocaleDateString()}
                    {milestone.completed_at && (
                      <span style={styles.completedAt}>
                        &nbsp;· Completed: {new Date(milestone.completed_at).toLocaleDateString()}
                      </span>
                    )}
                  </p>
                </div>
                <span style={{...styles.badge, backgroundColor: statusColor(milestone.status)}}>
                  {milestone.status.replace('_', ' ')}
                </span>
              </div>

              {updates[milestone.id] && updates[milestone.id].length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, 1fr)', gap: '12px' }}>
                  {updates[milestone.id].map(update => (
                    <div key={update.id} style={styles.photoCard}>
                      {update.photo_url ? (
                        <img
                          src={update.photo_url}
                          alt={update.caption}
                          style={styles.photo}
                          onClick={() => window.open(update.photo_url, '_blank')}
                        />
                      ) : (
                        <div style={styles.noPhoto}>📷 No photo</div>
                      )}
                      <div style={styles.photoCaption}>{update.caption}</div>
                      <div style={styles.photoMeta}>
                        By {update.engineer_name} · {new Date(update.uploaded_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={styles.noUpdates}>No progress photos uploaded yet for this milestone.</p>
              )}
            </div>
          ))
        )}
      </div>

      {/* Mobile Bottom Nav */}
      {isMobile && (
        <div style={styles.bottomNav}>
          <div style={styles.bottomNavItem} onClick={() => navigate('/homeowner')}>
            <div style={styles.bottomNavIcon}>📊</div>
            <div style={styles.bottomNavLabel}>Dashboard</div>
          </div>
          <div style={styles.bottomNavItem} onClick={() => navigate('/homeowner/payments')}>
            <div style={styles.bottomNavIcon}>💰</div>
            <div style={styles.bottomNavLabel}>Payments</div>
          </div>
          <div style={styles.bottomNavItem} onClick={() => navigate('/homeowner/progress')}>
            <div style={styles.bottomNavIcon}>📸</div>
            <div style={styles.bottomNavLabel}>Progress</div>
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
  filterCard: { backgroundColor: '#fff', borderRadius: '12px', padding: '16px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' },
  filterLabel: { fontSize: '14px', fontWeight: '600', color: '#1B3A6B', whiteSpace: 'nowrap' },
  filterSelect: { padding: '10px 16px', borderRadius: '8px', border: '1.5px solid #E0E0E0', fontSize: '14px', flex: 1, outline: 'none' },
  progressCard: { backgroundColor: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '20px' },
  progressHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  progressLabel: { fontSize: '16px', fontWeight: '600', color: '#1B3A6B' },
  progressPercent: { fontSize: '24px', fontWeight: '700', color: '#F97316' },
  progressBar: { backgroundColor: '#F0F0F0', borderRadius: '8px', height: '12px', overflow: 'hidden', marginBottom: '8px' },
  progressFill: { backgroundColor: '#F97316', height: '100%', borderRadius: '8px', transition: 'width 0.5s ease' },
  progressSub: { fontSize: '13px', color: '#888', margin: 0 },
  section: { backgroundColor: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  emptyText: { textAlign: 'center', color: '#888', padding: '24px 0' },
  milestoneCard: { backgroundColor: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '20px' },
  milestoneHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', gap: '12px' },
  milestoneTitle: { fontSize: '17px', fontWeight: '700', color: '#1B3A6B', margin: '0 0 4px 0' },
  milestoneSub: { fontSize: '14px', color: '#888', margin: '0 0 4px 0' },
  milestoneDue: { fontSize: '13px', color: '#F97316', fontWeight: '600', margin: 0 },
  completedAt: { color: '#10B981' },
  badge: { color: '#fff', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap' },
  photoCard: { borderRadius: '10px', overflow: 'hidden', border: '1.5px solid #E0E0E0' },
  photo: { width: '100%', height: '160px', objectFit: 'cover', cursor: 'pointer', display: 'block' },
  noPhoto: { height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F5F5', fontSize: '24px', color: '#aaa' },
  photoCaption: { padding: '10px 12px 4px', fontSize: '13px', fontWeight: '600', color: '#333' },
  photoMeta: { padding: '0 12px 10px', fontSize: '12px', color: '#888' },
  noUpdates: { color: '#aaa', fontSize: '14px', textAlign: 'center', padding: '16px 0', margin: 0 },
  bottomNav: { position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#1B3A6B', display: 'flex', justifyContent: 'space-around', padding: '10px 0', zIndex: 100, boxShadow: '0 -2px 10px rgba(0,0,0,0.15)' },
  bottomNavItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', padding: '4px 12px' },
  bottomNavIcon: { fontSize: '22px' },
  bottomNavLabel: { color: 'rgba(255,255,255,0.8)', fontSize: '11px', marginTop: '2px' },
};

export default HomeownerProgress;