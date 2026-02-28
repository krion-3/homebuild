import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProjects, getAllProperties, getAllUsers, createProject, updateProjectStatus, createMilestone } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Projects = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [properties, setProperties] = useState([]);
  const [firms, setFirms] = useState([]);
  const [engineers, setEngineers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [search, setSearch] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [form, setForm] = useState({
    property_id: '', firm_id: '', engineer_id: '', total_cost: '', start_date: '', expected_end_date: ''
  });
  const [milestoneForm, setMilestoneForm] = useState({
    title: '', description: '', due_date: ''
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [projectsRes, propertiesRes, usersRes] = await Promise.all([
        getAllProjects(),
        getAllProperties(),
        getAllUsers()
      ]);
      setProjects(projectsRes.data);
      setProperties(propertiesRes.data.filter(p => p.verified));
      setFirms(usersRes.data.filter(u => u.role === 'firm'));
      setEngineers(usersRes.data.filter(u => u.role === 'engineer'));
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await createProject(form);
      toast.success('Project created successfully');
      setShowModal(false);
      setForm({ property_id: '', firm_id: '', engineer_id: '', total_cost: '', start_date: '', expected_end_date: '' });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create project');
    }
  };

  const handleCreateMilestone = async (e) => {
    e.preventDefault();
    try {
      await createMilestone({ ...milestoneForm, project_id: selectedProjectId });
      toast.success('Milestone created successfully');
      setShowMilestoneModal(false);
      setMilestoneForm({ title: '', description: '', due_date: '' });
    } catch (error) {
      toast.error('Failed to create milestone');
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateProjectStatus(id, { status });
      toast.success('Project status updated');
      fetchData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const statusColor = (status) => {
    if (status === 'active') return '#10B981';
    if (status === 'completed') return '#1B3A6B';
    if (status === 'suspended') return '#EF4444';
    return '#F97316';
  };

  const filteredProjects = projects.filter(p =>
    p.homeowner_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.location?.toLowerCase().includes(search.toLowerCase()) ||
    p.firm_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.engineer_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.status?.toLowerCase().includes(search.toLowerCase())
  );

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
            <div style={styles.navItem} onClick={() => navigate('/admin')}>📊 Dashboard</div>
            <div style={styles.navItem} onClick={() => navigate('/admin/users')}>👥 Users</div>
            <div style={styles.navItem} onClick={() => navigate('/admin/properties')}>🏠 Properties</div>
            <div style={{...styles.navItem, ...styles.navItemActive}}>🏗️ Projects</div>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: isMobile ? '22px' : '28px', fontWeight: '700', color: '#1B3A6B', margin: 0 }}>Projects</h1>
            <p style={{ color: '#888', margin: '4px 0 0 0', fontSize: '14px' }}>Manage all construction projects</p>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              style={{ ...styles.searchInput, width: isMobile ? '140px' : '200px' }}
              placeholder="🔍 Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button style={styles.createBtn} onClick={() => setShowModal(true)}>
              ➕ {isMobile ? '' : 'New Project'}
            </button>
          </div>
        </div>

        {loading ? <p>Loading projects...</p> : isMobile ? (
          // Mobile: card layout
          <div>
            {filteredProjects.length === 0 ? (
              <p style={styles.emptyText}>No projects found.</p>
            ) : (
              filteredProjects.map(project => (
                <div key={project.id} style={styles.projectCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: '700', color: '#1B3A6B' }}>{project.location}</div>
                      <div style={{ fontSize: '13px', color: '#888' }}>Owner: {project.homeowner_name}</div>
                      <div style={{ fontSize: '13px', color: '#888' }}>Firm: {project.firm_name}</div>
                      <div style={{ fontSize: '13px', color: '#888' }}>Engineer: {project.engineer_name}</div>
                    </div>
                    <span style={{...styles.badge, backgroundColor: statusColor(project.status)}}>
                      {project.status}
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', backgroundColor: '#F5F5F5', borderRadius: '8px', padding: '10px', marginBottom: '12px' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: '#888' }}>Total Cost</div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#1B3A6B' }}>KES {Number(project.total_cost).toLocaleString()}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: '#888' }}>Funded (70%)</div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#1B3A6B' }}>KES {Number(project.funded_amount).toLocaleString()}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <select
                      style={{ ...styles.statusSelect, flex: 1 }}
                      value={project.status}
                      onChange={(e) => handleStatusUpdate(project.id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="suspended">Suspended</option>
                    </select>
                    <button
                      style={styles.milestoneBtn}
                      onClick={() => { setSelectedProjectId(project.id); setShowMilestoneModal(true); }}
                    >
                      + Milestone
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          // Desktop: table layout
          <div style={styles.tableCard}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>Homeowner</th>
                  <th style={styles.th}>Location</th>
                  <th style={styles.th}>Firm</th>
                  <th style={styles.th}>Engineer</th>
                  <th style={styles.th}>Total Cost</th>
                  <th style={styles.th}>Funded (70%)</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.length === 0 ? (
                  <tr><td colSpan="8" style={styles.emptyText}>No projects found</td></tr>
                ) : (
                  filteredProjects.map(project => (
                    <tr key={project.id} style={styles.tableRow}>
                      <td style={styles.td}>{project.homeowner_name}</td>
                      <td style={styles.td}>{project.location}</td>
                      <td style={styles.td}>{project.firm_name}</td>
                      <td style={styles.td}>{project.engineer_name}</td>
                      <td style={styles.td}>KES {Number(project.total_cost).toLocaleString()}</td>
                      <td style={styles.td}>KES {Number(project.funded_amount).toLocaleString()}</td>
                      <td style={styles.td}>
                        <span style={{...styles.badge, backgroundColor: statusColor(project.status)}}>
                          {project.status}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <select
                            style={styles.statusSelect}
                            value={project.status}
                            onChange={(e) => handleStatusUpdate(project.id, e.target.value)}
                          >
                            <option value="pending">Pending</option>
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                            <option value="suspended">Suspended</option>
                          </select>
                          <button
                            style={styles.milestoneBtn}
                            onClick={() => { setSelectedProjectId(project.id); setShowMilestoneModal(true); }}
                          >
                            + Milestone
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
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

      {/* Create Project Modal */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>Create New Project</h2>
            <form onSubmit={handleCreateProject} style={styles.form}>
              <select style={styles.input} value={form.property_id} onChange={(e) => setForm({...form, property_id: e.target.value})} required>
                <option value="">Select Verified Property</option>
                {properties.map(p => (
                  <option key={p.id} value={p.id}>{p.homeowner_name} — {p.location}</option>
                ))}
              </select>
              <select style={styles.input} value={form.firm_id} onChange={(e) => setForm({...form, firm_id: e.target.value})} required>
                <option value="">Select Construction Firm</option>
                {firms.map(f => (
                  <option key={f.id} value={f.id}>{f.full_name}</option>
                ))}
              </select>
              <select style={styles.input} value={form.engineer_id} onChange={(e) => setForm({...form, engineer_id: e.target.value})} required>
                <option value="">Select Engineer</option>
                {engineers.map(e => (
                  <option key={e.id} value={e.id}>{e.full_name}</option>
                ))}
              </select>
              <input
                style={styles.input}
                placeholder="Total Project Cost (KES)"
                type="number"
                value={form.total_cost}
                onChange={(e) => setForm({...form, total_cost: e.target.value})}
                required
              />
              <label style={styles.label}>Start Date</label>
              <input
                style={styles.input}
                type="date"
                value={form.start_date}
                onChange={(e) => setForm({...form, start_date: e.target.value})}
                required
              />
              <label style={styles.label}>Expected End Date</label>
              <input
                style={styles.input}
                type="date"
                value={form.expected_end_date}
                onChange={(e) => setForm({...form, expected_end_date: e.target.value})}
                required
              />
              <div style={styles.modalActions}>
                <button type="button" style={styles.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" style={styles.submitBtn}>Create Project</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Milestone Modal */}
      {showMilestoneModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>Add Milestone</h2>
            <p style={styles.modalSub}>Adding milestone to Project #{selectedProjectId}</p>
            <form onSubmit={handleCreateMilestone} style={styles.form}>
              <input
                style={styles.input}
                placeholder="Milestone Title (e.g Foundation)"
                value={milestoneForm.title}
                onChange={(e) => setMilestoneForm({...milestoneForm, title: e.target.value})}
                required
              />
              <textarea
                style={{...styles.input, resize: 'vertical'}}
                placeholder="Description"
                rows={3}
                value={milestoneForm.description}
                onChange={(e) => setMilestoneForm({...milestoneForm, description: e.target.value})}
                required
              />
              <label style={styles.label}>Due Date</label>
              <input
                style={styles.input}
                type="date"
                value={milestoneForm.due_date}
                onChange={(e) => setMilestoneForm({...milestoneForm, due_date: e.target.value})}
                required
              />
              <div style={styles.modalActions}>
                <button type="button" style={styles.cancelBtn} onClick={() => setShowMilestoneModal(false)}>Cancel</button>
                <button type="submit" style={styles.submitBtn}>Create Milestone</button>
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
  searchInput: { padding: '10px 16px', borderRadius: '8px', border: '1.5px solid #E0E0E0', fontSize: '14px', outline: 'none' },
  createBtn: { backgroundColor: '#F97316', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 16px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
  projectCard: { backgroundColor: '#fff', borderRadius: '12px', padding: '16px', marginBottom: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  emptyText: { padding: '32px', textAlign: 'center', color: '#888' },
  tableCard: { backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHeader: { backgroundColor: '#F5F5F5' },
  th: { padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#888', textTransform: 'uppercase' },
  tableRow: { borderBottom: '1px solid #F0F0F0' },
  td: { padding: '14px 16px', fontSize: '14px', color: '#333' },
  badge: { color: '#fff', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  statusSelect: { padding: '6px 10px', borderRadius: '6px', border: '1.5px solid #E0E0E0', fontSize: '13px', cursor: 'pointer' },
  milestoneBtn: { backgroundColor: '#1B3A6B', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer', fontWeight: '600', whiteSpace: 'nowrap' },
  bottomNav: { position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#1B3A6B', display: 'flex', justifyContent: 'space-around', padding: '10px 0', zIndex: 100, boxShadow: '0 -2px 10px rgba(0,0,0,0.15)' },
  bottomNavItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', padding: '4px 8px' },
  bottomNavIcon: { fontSize: '22px' },
  bottomNavLabel: { color: 'rgba(255,255,255,0.8)', fontSize: '11px', marginTop: '2px' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' },
  modal: { backgroundColor: '#fff', borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '440px', maxHeight: '90vh', overflowY: 'auto' },
  modalTitle: { fontSize: '20px', fontWeight: '700', color: '#1B3A6B', marginTop: 0, marginBottom: '4px' },
  modalSub: { color: '#888', fontSize: '14px', marginBottom: '20px' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  input: { padding: '12px 16px', borderRadius: '8px', border: '1.5px solid #E0E0E0', fontSize: '15px', outline: 'none' },
  label: { fontSize: '13px', fontWeight: '600', color: '#888', marginBottom: '-8px' },
  modalActions: { display: 'flex', gap: '12px' },
  cancelBtn: { flex: 1, padding: '12px', borderRadius: '8px', border: '1.5px solid #E0E0E0', backgroundColor: '#fff', cursor: 'pointer', fontSize: '15px' },
  submitBtn: { flex: 1, padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#F97316', color: '#fff', cursor: 'pointer', fontSize: '15px', fontWeight: '600' },
};

export default Projects;