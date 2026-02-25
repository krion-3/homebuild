import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyProjects, getMyProperties, getMyPayments, createProperty } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const HomeownerDashboard = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [properties, setProperties] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [propertyForm, setPropertyForm] = useState({ location: '', land_size: '' });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

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
      const [projectsRes, propertiesRes, paymentsRes] = await Promise.all([
        getMyProjects(),
        getMyProperties(),
        getMyPayments()
      ]);
      setProjects(projectsRes.data);
      setProperties(propertiesRes.data);
      setPayments(paymentsRes.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitProperty = async (e) => {
    e.preventDefault();
    try {
      await createProperty(propertyForm);
      toast.success('Property submitted successfully! Admin will verify it shortly.');
      setShowPropertyModal(false);
      setPropertyForm({ location: '', land_size: '' });
      fetchData();
    } catch (error) {
      toast.error('Failed to submit property');
    }
  };

  const totalPaid = payments
    .filter(p => p.status === 'confirmed')
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const statusColor = (status) => {
    if (status === 'active') return '#10B981';
    if (status === 'completed') return '#1B3A6B';
    if (status === 'suspended') return '#EF4444';
    return '#F97316';
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
            <div style={styles.navItem} onClick={() => navigate('/homeowner/payments')}>💰 Payments</div>
            <div style={styles.navItem} onClick={() => navigate('/homeowner/progress')}>📸 Progress</div>
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

      {/* Main Content */}
      <div style={{ marginLeft: isMobile ? '0' : '240px', flex: 1, padding: isMobile ? '20px 16px 80px' : '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: isMobile ? '22px' : '28px', fontWeight: '700', color: '#1B3A6B', margin: 0 }}>
              Welcome, {user?.full_name} 👋
            </h1>
            <p style={{ color: '#888', margin: '4px 0 0 0', fontSize: '14px' }}>Track your home construction progress</p>
          </div>
          <button style={styles.createBtn} onClick={() => setShowPropertyModal(true)}>
            ➕ {isMobile ? '' : 'Submit Property'}
          </button>
        </div>

        {loading ? <p>Loading...</p> : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
              <div style={{...styles.statCard, borderTop: '4px solid #1B3A6B'}}>
                <div style={styles.statIcon}>🏗️</div>
                <div style={styles.statNumber}>{projects.length}</div>
                <div style={styles.statLabel}>My Projects</div>
              </div>
              <div style={{...styles.statCard, borderTop: '4px solid #10B981'}}>
                <div style={styles.statIcon}>🏠</div>
                <div style={styles.statNumber}>{properties.length}</div>
                <div style={styles.statLabel}>My Properties</div>
              </div>
              <div style={{...styles.statCard, borderTop: '4px solid #F97316', gridColumn: isMobile ? 'span 2' : 'span 1'}}>
                <div style={styles.statIcon}>💰</div>
                <div style={{ fontSize: isMobile ? '16px' : '28px', fontWeight: '700', color: '#1B3A6B' }}>KES {totalPaid.toLocaleString()}</div>
                <div style={styles.statLabel}>Total Paid</div>
              </div>
            </div>

            {properties.length > 0 && (
              <div style={{...styles.section, marginBottom: '24px'}}>
                <h2 style={styles.sectionTitle}>My Properties</h2>
                {properties.map(property => (
                  <div key={property.id} style={styles.propertyCard}>
                    <div style={styles.propertyInfo}>
                      <div style={styles.propertyLocation}>📍 {property.location}</div>
                      <div style={styles.propertySub}>Land Size: {property.land_size}</div>
                    </div>
                    <span style={{...styles.badge, backgroundColor: property.verified ? '#10B981' : '#F97316'}}>
                      {property.verified ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>My Projects</h2>
              {projects.length === 0 ? (
                <p style={styles.emptyText}>No projects assigned yet. Submit your property and contact admin.</p>
              ) : (
                projects.map(project => (
                  <div key={project.id} style={styles.projectCard}>
                    <div style={styles.projectHeader}>
                      <div>
                        <h3 style={styles.projectTitle}>{project.location}</h3>
                        <p style={styles.projectSub}>
                          Firm: {project.firm_name} | Engineer: {project.engineer_name}
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
                        <div style={styles.projectStatLabel}>Funded (70%)</div>
                        <div style={styles.projectStatValue}>KES {Number(project.funded_amount).toLocaleString()}</div>
                      </div>
                      <div style={styles.projectStat}>
                        <div style={styles.projectStatLabel}>Your Share (30%)</div>
                        <div style={styles.projectStatValue}>KES {Number(project.homeowner_contribution).toLocaleString()}</div>
                      </div>
                      <div style={styles.projectStat}>
                        <div style={styles.projectStatLabel}>Start Date</div>
                        <div style={styles.projectStatValue}>{new Date(project.start_date).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      <button style={styles.actionBtn} onClick={() => navigate(`/homeowner/progress/${project.id}`)}>
                        📸 View Progress
                      </button>
                      <button style={styles.actionBtnOutline} onClick={() => navigate(`/homeowner/payments/${project.id}`)}>
                        💳 Make Payment
                      </button>
                    </div>
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

      {/* Property Modal */}
      {showPropertyModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>Submit Property Details</h2>
            <p style={styles.modalSub}>Admin will verify your title deed and approve your property</p>
            <form onSubmit={handleSubmitProperty} style={styles.form}>
              <input
                style={styles.input}
                placeholder="Location (e.g Nairobi, Karen)"
                value={propertyForm.location}
                onChange={(e) => setPropertyForm({...propertyForm, location: e.target.value})}
                required
              />
              <input
                style={styles.input}
                placeholder="Land Size (e.g 0.5 acres)"
                value={propertyForm.land_size}
                onChange={(e) => setPropertyForm({...propertyForm, land_size: e.target.value})}
                required
              />
              <p style={styles.noteText}>
                📌 Please bring your original title deed to the Homebuild office for physical verification.
              </p>
              <div style={styles.modalActions}>
                <button type="button" style={styles.cancelBtn} onClick={() => setShowPropertyModal(false)}>Cancel</button>
                <button type="submit" style={styles.submitBtn}>Submit Property</button>
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
  createBtn: { backgroundColor: '#F97316', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 16px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
  statCard: { backgroundColor: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center' },
  statIcon: { fontSize: '28px', marginBottom: '8px' },
  statNumber: { fontSize: '28px', fontWeight: '700', color: '#1B3A6B' },
  statLabel: { color: '#888', fontSize: '14px', marginTop: '4px' },
  section: { backgroundColor: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  sectionTitle: { fontSize: '18px', fontWeight: '600', color: '#1B3A6B', marginTop: 0, marginBottom: '16px' },
  emptyText: { textAlign: 'center', color: '#888', padding: '24px 0' },
  propertyCard: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1.5px solid #E0E0E0', borderRadius: '10px', padding: '14px', marginBottom: '12px' },
  propertyInfo: { display: 'flex', flexDirection: 'column', gap: '4px' },
  propertyLocation: { fontSize: '15px', fontWeight: '600', color: '#1B3A6B' },
  propertySub: { fontSize: '13px', color: '#888' },
  projectCard: { border: '1.5px solid #E0E0E0', borderRadius: '12px', padding: '16px', marginBottom: '16px' },
  projectHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' },
  projectTitle: { fontSize: '16px', fontWeight: '700', color: '#1B3A6B', margin: '0 0 4px 0' },
  projectSub: { fontSize: '13px', color: '#888', margin: 0 },
  badge: { color: '#fff', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap' },
  projectStat: { textAlign: 'center' },
  projectStatLabel: { fontSize: '12px', color: '#888', marginBottom: '4px' },
  projectStatValue: { fontSize: '13px', fontWeight: '600', color: '#1B3A6B' },
  actionBtn: { backgroundColor: '#1B3A6B', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 16px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  actionBtnOutline: { backgroundColor: '#fff', color: '#F97316', border: '2px solid #F97316', borderRadius: '8px', padding: '10px 16px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  bottomNav: { position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#1B3A6B', display: 'flex', justifyContent: 'space-around', padding: '10px 0', zIndex: 100, boxShadow: '0 -2px 10px rgba(0,0,0,0.15)' },
  bottomNavItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', padding: '4px 12px' },
  bottomNavIcon: { fontSize: '22px' },
  bottomNavLabel: { color: 'rgba(255,255,255,0.8)', fontSize: '11px', marginTop: '2px' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' },
  modal: { backgroundColor: '#fff', borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '440px' },
  modalTitle: { fontSize: '20px', fontWeight: '700', color: '#1B3A6B', marginTop: 0, marginBottom: '4px' },
  modalSub: { color: '#888', fontSize: '14px', marginBottom: '20px' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  input: { padding: '12px 16px', borderRadius: '8px', border: '1.5px solid #E0E0E0', fontSize: '15px', outline: 'none' },
  noteText: { fontSize: '13px', color: '#F97316', backgroundColor: '#FFF7ED', padding: '12px', borderRadius: '8px', margin: 0 },
  modalActions: { display: 'flex', gap: '12px' },
  cancelBtn: { flex: 1, padding: '12px', borderRadius: '8px', border: '1.5px solid #E0E0E0', backgroundColor: '#fff', cursor: 'pointer', fontSize: '15px' },
  submitBtn: { flex: 1, padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#F97316', color: '#fff', cursor: 'pointer', fontSize: '15px', fontWeight: '600' },
};

export default HomeownerDashboard;