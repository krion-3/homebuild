import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAllProjects, getProjectMilestones } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const FirmProjects = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, [user.id]); // eslint-disable-line

  const fetchProjects = async () => {
    try {
      const res = await getAllProjects();
      console.log('All projects:', res.data);
      console.log('Current user id:', user.id);
      console.log('User object:', user);
      const firmProjects = res.data.filter(p => Number(p.firm_id) === Number(user.id));
      console.log('Firm projects:', firmProjects);
      console.log('URL id param:', id);
      console.log('Project ids:', firmProjects.map(p => p.id));
      setProjects(firmProjects);
      if (id) {
        const project = firmProjects.find(p => Number(p.id) === Number(id));
        console.log('Found project by id:', project);
        if (project) {
          setSelectedProject(project);
          fetchMilestones(project.id);
        }
      }
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
    } catch (error) {
      toast.error('Failed to load milestones');
    }
  };

  const handleSelectProject = (project) => {
    setSelectedProject(project);
    fetchMilestones(project.id);
  };

  const statusColor = (status) => {
    if (status === 'active') return '#10B981';
    if (status === 'completed') return '#1B3A6B';
    if (status === 'suspended') return '#EF4444';
    return '#F97316';
  };

  const milestoneStatusColor = (status) => {
    if (status === 'completed') return '#10B981';
    if (status === 'in_progress') return '#F97316';
    return '#888';
  };

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <div style={styles.sidebarLogo}>
          <span>🏗️</span>
          <span style={styles.logoText}>Homebuild</span>
        </div>
        <nav style={styles.nav}>
          <div style={styles.navItem} onClick={() => navigate('/firm')}>📊 Dashboard</div>
          <div style={{...styles.navItem, ...styles.navItemActive}}>🏗️ My Projects</div>
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

      <div style={styles.main}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.headerTitle}>My Projects</h1>
            <p style={styles.headerSub}>View project details and milestone progress</p>
          </div>
        </div>

        {loading ? <p>Loading...</p> : (
          <div style={styles.twoCol}>
            <div style={styles.projectsList}>
              <h2 style={styles.sectionTitle}>Projects</h2>
              {projects.length === 0 ? (
                <p style={styles.emptyText}>No projects assigned yet.</p>
              ) : (
                projects.map(project => (
                  <div
                    key={project.id}
                    style={{
                      ...styles.projectCard,
                      borderLeft: selectedProject?.id === project.id ? '4px solid #F97316' : '4px solid transparent'
                    }}
                    onClick={() => handleSelectProject(project)}
                  >
                    <div style={styles.projectTitle}>{project.location}</div>
                    <div style={styles.projectSub}>Homeowner: {project.homeowner_name}</div>
                    <div style={styles.projectSub}>Engineer: {project.engineer_name}</div>
                    <div style={styles.projectRow}>
                      <span style={{...styles.badge, backgroundColor: statusColor(project.status)}}>
                        {project.status}
                      </span>
                      <span style={styles.cost}>KES {Number(project.total_cost).toLocaleString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div style={styles.detailsPanel}>
              <h2 style={styles.sectionTitle}>
                {selectedProject ? `Milestones — ${selectedProject.location}` : 'Select a project'}
              </h2>
              {!selectedProject ? (
                <p style={styles.emptyText}>Click on a project to view its milestones.</p>
              ) : milestones.length === 0 ? (
                <p style={styles.emptyText}>No milestones created yet.</p>
              ) : (
                <>
                  <div style={styles.progressCard}>
                    <div style={styles.progressHeader}>
                      <span style={styles.progressLabel}>Overall Progress</span>
                      <span style={styles.progressPercent}>
                        {Math.round((milestones.filter(m => m.status === 'completed').length / milestones.length) * 100)}%
                      </span>
                    </div>
                    <div style={styles.progressBar}>
                      <div style={{
                        ...styles.progressFill,
                        width: `${Math.round((milestones.filter(m => m.status === 'completed').length / milestones.length) * 100)}%`
                      }} />
                    </div>
                    <p style={styles.progressSub}>
                      {milestones.filter(m => m.status === 'completed').length} of {milestones.length} milestones completed
                    </p>
                  </div>
                  {milestones.map(milestone => (
                    <div key={milestone.id} style={styles.milestoneCard}>
                      <div style={styles.milestoneHeader}>
                        <div>
                          <div style={styles.milestoneTitle}>{milestone.title}</div>
                          <div style={styles.milestoneSub}>{milestone.description}</div>
                          <div style={styles.milestoneDue}>
                            Due: {new Date(milestone.due_date).toLocaleDateString()}
                            {milestone.completed_at && (
                              <span style={styles.completedAt}>
                                &nbsp;· Completed: {new Date(milestone.completed_at).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                        <span style={{...styles.badge, backgroundColor: milestoneStatusColor(milestone.status)}}>
                          {milestone.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', minHeight: '100vh', backgroundColor: '#F5F5F5', fontFamily: "'Segoe UI', sans-serif" },
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
  main: { marginLeft: '240px', flex: 1, padding: '32px' },
  header: { marginBottom: '32px' },
  headerTitle: { fontSize: '28px', fontWeight: '700', color: '#1B3A6B', margin: 0 },
  headerSub: { color: '#888', margin: '4px 0 0 0' },
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' },
  projectsList: { backgroundColor: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  detailsPanel: { backgroundColor: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  sectionTitle: { fontSize: '18px', fontWeight: '600', color: '#1B3A6B', marginTop: 0, marginBottom: '20px' },
  emptyText: { textAlign: 'center', color: '#888', padding: '16px 0' },
  projectCard: { padding: '16px', borderRadius: '8px', border: '1.5px solid #E0E0E0', marginBottom: '12px', cursor: 'pointer' },
  projectTitle: { fontSize: '15px', fontWeight: '600', color: '#1B3A6B', marginBottom: '4px' },
  projectSub: { fontSize: '13px', color: '#888', marginBottom: '4px' },
  projectRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' },
  cost: { fontSize: '13px', fontWeight: '600', color: '#F97316' },
  badge: { color: '#fff', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  progressCard: { backgroundColor: '#F5F5F5', borderRadius: '10px', padding: '16px', marginBottom: '16px' },
  progressHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' },
  progressLabel: { fontSize: '14px', fontWeight: '600', color: '#1B3A6B' },
  progressPercent: { fontSize: '16px', fontWeight: '700', color: '#F97316' },
  progressBar: { backgroundColor: '#E0E0E0', borderRadius: '8px', height: '10px', overflow: 'hidden', marginBottom: '8px' },
  progressFill: { backgroundColor: '#F97316', height: '100%', borderRadius: '8px' },
  progressSub: { fontSize: '13px', color: '#888', margin: 0 },
  milestoneCard: { border: '1.5px solid #E0E0E0', borderRadius: '10px', padding: '16px', marginBottom: '12px' },
  milestoneHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  milestoneTitle: { fontSize: '15px', fontWeight: '600', color: '#1B3A6B', marginBottom: '4px' },
  milestoneSub: { fontSize: '13px', color: '#888', marginBottom: '4px' },
  milestoneDue: { fontSize: '12px', color: '#F97316', fontWeight: '600' },
  completedAt: { color: '#10B981' },
};

export default FirmProjects;