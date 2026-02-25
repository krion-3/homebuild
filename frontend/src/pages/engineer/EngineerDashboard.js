import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProjects, getProjectMilestones, updateMilestoneStatus, uploadProgressUpdate } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const EngineerDashboard = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [caption, setCaption] = useState('');
  const [photo, setPhoto] = useState(null);
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

  const fetchProjects = async () => {
    try {
      const res = await getAllProjects();
      const engineerProjects = res.data.filter(p => Number(p.engineer_id) === Number(user.id));
      setProjects(engineerProjects);
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

  const handleStatusUpdate = async (milestoneId, status) => {
    try {
      await updateMilestoneStatus(milestoneId, { status });
      toast.success('Milestone status updated');
      fetchMilestones(selectedProject.id);
    } catch (error) {
      toast.error('Failed to update milestone');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('milestone_id', selectedMilestone.id);
      formData.append('caption', caption);
      if (photo) formData.append('photo', photo);
      await uploadProgressUpdate(formData);
      toast.success('Progress update uploaded successfully');
      setShowUploadModal(false);
      setCaption('');
      setPhoto(null);
    } catch (error) {
      toast.error('Failed to upload progress update');
    }
  };

  const statusColor = (status) => {
    if (status === 'completed') return '#10B981';
    if (status === 'in_progress') return '#F97316';
    return '#888';
  };

  const activeProjects = projects.filter(p => p.status === 'active').length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;

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
          </nav>
          <div style={styles.sidebarBottom}>
            <div style={styles.userInfo}>
              <div style={styles.userAvatar}>👷</div>
              <div>
                <div style={styles.userName}>{user?.full_name}</div>
                <div style={styles.userRole}>Site Engineer</div>
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
            Engineer Portal
          </h1>
          <p style={{ color: '#888', margin: '4px 0 0 0', fontSize: '14px' }}>Manage milestones and upload progress updates</p>
        </div>

        {loading ? <p>Loading...</p> : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
              <div style={{...styles.statCard, borderTop: '4px solid #1B3A6B'}}>
                <div style={styles.statIcon}>🏗️</div>
                <div style={styles.statNumber}>{projects.length}</div>
                <div style={styles.statLabel}>Assigned</div>
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
            </div>

            {isMobile ? (
              // Mobile: stacked layout
              <div>
                <div style={styles.section}>
                  <h2 style={styles.sectionTitle}>My Projects</h2>
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
                        <span style={{...styles.badge, backgroundColor: project.status === 'active' ? '#10B981' : '#888'}}>
                          {project.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                {selectedProject && (
                  <div style={{...styles.section, marginTop: '16px'}}>
                    <h2 style={styles.sectionTitle}>Milestones — {selectedProject.location}</h2>
                    {milestones.length === 0 ? (
                      <p style={styles.emptyText}>No milestones yet. Contact admin.</p>
                    ) : (
                      milestones.map(milestone => (
                        <div key={milestone.id} style={styles.milestoneCard}>
                          <div style={styles.milestoneHeader}>
                            <div>
                              <div style={styles.milestoneTitle}>{milestone.title}</div>
                              <div style={styles.milestoneSub}>{milestone.description}</div>
                              <div style={styles.milestoneDue}>Due: {new Date(milestone.due_date).toLocaleDateString()}</div>
                            </div>
                            <span style={{...styles.badge, backgroundColor: statusColor(milestone.status)}}>
                              {milestone.status.replace('_', ' ')}
                            </span>
                          </div>
                          <div style={styles.milestoneActions}>
                            <select
                              style={styles.statusSelect}
                              value={milestone.status}
                              onChange={(e) => handleStatusUpdate(milestone.id, e.target.value)}
                            >
                              <option value="pending">Pending</option>
                              <option value="in_progress">In Progress</option>
                              <option value="completed">Completed</option>
                            </select>
                            <button
                              style={styles.uploadBtn}
                              onClick={() => { setSelectedMilestone(milestone); setShowUploadModal(true); }}
                            >
                              📸 Upload
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            ) : (
              // Desktop: two column layout
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
                <div style={styles.section}>
                  <h2 style={styles.sectionTitle}>My Projects</h2>
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
                        <span style={{...styles.badge, backgroundColor: project.status === 'active' ? '#10B981' : '#888'}}>
                          {project.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                <div style={styles.section}>
                  <h2 style={styles.sectionTitle}>
                    {selectedProject ? `Milestones — ${selectedProject.location}` : 'Select a project'}
                  </h2>
                  {!selectedProject ? (
                    <p style={styles.emptyText}>Click on a project to view milestones.</p>
                  ) : milestones.length === 0 ? (
                    <p style={styles.emptyText}>No milestones yet. Contact admin.</p>
                  ) : (
                    milestones.map(milestone => (
                      <div key={milestone.id} style={styles.milestoneCard}>
                        <div style={styles.milestoneHeader}>
                          <div>
                            <div style={styles.milestoneTitle}>{milestone.title}</div>
                            <div style={styles.milestoneSub}>{milestone.description}</div>
                            <div style={styles.milestoneDue}>Due: {new Date(milestone.due_date).toLocaleDateString()}</div>
                          </div>
                          <span style={{...styles.badge, backgroundColor: statusColor(milestone.status)}}>
                            {milestone.status.replace('_', ' ')}
                          </span>
                        </div>
                        <div style={styles.milestoneActions}>
                          <select
                            style={styles.statusSelect}
                            value={milestone.status}
                            onChange={(e) => handleStatusUpdate(milestone.id, e.target.value)}
                          >
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                          </select>
                          <button
                            style={styles.uploadBtn}
                            onClick={() => { setSelectedMilestone(milestone); setShowUploadModal(true); }}
                          >
                            📸 Upload Photo
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Mobile Bottom Nav */}
      {isMobile && (
        <div style={styles.bottomNav}>
          <div style={styles.bottomNavItem} onClick={() => navigate('/engineer')}>
            <div style={styles.bottomNavIcon}>📊</div>
            <div style={styles.bottomNavLabel}>Dashboard</div>
          </div>
          <div style={styles.bottomNavItem} onClick={() => { logoutUser(); navigate('/login'); }}>
            <div style={styles.bottomNavIcon}>🚪</div>
            <div style={styles.bottomNavLabel}>Logout</div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>Upload Progress Photo</h2>
            <p style={styles.modalSub}>Milestone: {selectedMilestone?.title}</p>
            <form onSubmit={handleUpload} style={styles.form}>
              <textarea
                style={styles.textarea}
                placeholder="Write a caption describing the progress..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={3}
                required
              />
              <input
                type="file"
                accept="image/*"
                style={styles.fileInput}
                onChange={(e) => setPhoto(e.target.files[0])}
              />
              <div style={styles.modalActions}>
                <button type="button" style={styles.cancelBtn} onClick={() => setShowUploadModal(false)}>Cancel</button>
                <button type="submit" style={styles.submitBtn}>Upload</button>
              </div>
            </form>
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
  emptyText: { textAlign: 'center', color: '#888', padding: '16px 0' },
  projectCard: { padding: '14px', borderRadius: '8px', border: '1.5px solid #E0E0E0', marginBottom: '12px', cursor: 'pointer' },
  projectTitle: { fontSize: '15px', fontWeight: '600', color: '#1B3A6B', marginBottom: '4px' },
  projectSub: { fontSize: '13px', color: '#888', marginBottom: '8px' },
  badge: { color: '#fff', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  milestoneCard: { border: '1.5px solid #E0E0E0', borderRadius: '10px', padding: '14px', marginBottom: '12px' },
  milestoneHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', gap: '8px' },
  milestoneTitle: { fontSize: '15px', fontWeight: '600', color: '#1B3A6B', marginBottom: '4px' },
  milestoneSub: { fontSize: '13px', color: '#888', marginBottom: '4px' },
  milestoneDue: { fontSize: '12px', color: '#F97316', fontWeight: '600' },
  milestoneActions: { display: 'flex', gap: '8px', alignItems: 'center' },
  statusSelect: { padding: '8px 12px', borderRadius: '6px', border: '1.5px solid #E0E0E0', fontSize: '13px', cursor: 'pointer', flex: 1 },
  uploadBtn: { backgroundColor: '#1B3A6B', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 14px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' },
  bottomNav: { position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#1B3A6B', display: 'flex', justifyContent: 'space-around', padding: '10px 0', zIndex: 100, boxShadow: '0 -2px 10px rgba(0,0,0,0.15)' },
  bottomNavItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', padding: '4px 12px' },
  bottomNavIcon: { fontSize: '22px' },
  bottomNavLabel: { color: 'rgba(255,255,255,0.8)', fontSize: '11px', marginTop: '2px' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' },
  modal: { backgroundColor: '#fff', borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '440px' },
  modalTitle: { fontSize: '20px', fontWeight: '700', color: '#1B3A6B', marginTop: 0, marginBottom: '4px' },
  modalSub: { color: '#888', fontSize: '14px', marginBottom: '20px' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  textarea: { padding: '12px 16px', borderRadius: '8px', border: '1.5px solid #E0E0E0', fontSize: '15px', outline: 'none', resize: 'vertical' },
  fileInput: { padding: '8px', borderRadius: '8px', border: '1.5px solid #E0E0E0', fontSize: '14px' },
  modalActions: { display: 'flex', gap: '12px' },
  cancelBtn: { flex: 1, padding: '12px', borderRadius: '8px', border: '1.5px solid #E0E0E0', backgroundColor: '#fff', cursor: 'pointer', fontSize: '15px' },
  submitBtn: { flex: 1, padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#F97316', color: '#fff', cursor: 'pointer', fontSize: '15px', fontWeight: '600' },
};

export default EngineerDashboard;