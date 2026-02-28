import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProjects, getProjectPayments, updatePaymentStatus } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Payments = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [payments, setPayments] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await getAllProjects();
      setProjects(res.data);
    } catch (error) {
      toast.error('Failed to load projects');
    }
  };

  const fetchPayments = async (projectId) => {
    try {
      const res = await getProjectPayments(projectId);
      setPayments(res.data);
    } catch (error) {
      toast.error('Failed to load payments');
    }
  };

  const handleProjectChange = (e) => {
    setSelectedProject(e.target.value);
    if (e.target.value) fetchPayments(e.target.value);
    else setPayments([]);
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updatePaymentStatus(id, { status });
      toast.success(`Payment ${status} successfully`);
      fetchPayments(selectedProject);
    } catch (error) {
      toast.error('Failed to update payment status');
    }
  };

  const statusColor = (status) => {
    if (status === 'confirmed') return '#10B981';
    if (status === 'failed') return '#EF4444';
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
            <div style={styles.navItem} onClick={() => navigate('/admin')}>📊 Dashboard</div>
            <div style={styles.navItem} onClick={() => navigate('/admin/users')}>👥 Users</div>
            <div style={styles.navItem} onClick={() => navigate('/admin/properties')}>🏠 Properties</div>
            <div style={styles.navItem} onClick={() => navigate('/admin/projects')}>🏗️ Projects</div>
            <div style={{...styles.navItem, ...styles.navItemActive}}>💰 Payments</div>
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
          <h1 style={{ fontSize: isMobile ? '22px' : '28px', fontWeight: '700', color: '#1B3A6B', margin: 0 }}>Payments</h1>
          <p style={{ color: '#888', margin: '4px 0 0 0', fontSize: '14px' }}>Review and confirm homeowner payments</p>
        </div>

        <div style={styles.filterCard}>
          <label style={styles.filterLabel}>Project:</label>
          <select style={styles.filterSelect} value={selectedProject} onChange={handleProjectChange}>
            <option value="">-- Select a Project --</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.homeowner_name} — {p.location}</option>
            ))}
          </select>
        </div>

        {selectedProject && (
          payments.length === 0 ? (
            <div style={styles.section}>
              <p style={styles.emptyText}>No payments found for this project.</p>
            </div>
          ) : isMobile ? (
            // Mobile: card layout
            <div>
              {payments.map(payment => (
                <div key={payment.id} style={styles.paymentCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: '700', color: '#1B3A6B' }}>
                        KES {Number(payment.amount).toLocaleString()}
                      </div>
                      <div style={{ fontSize: '13px', color: '#888' }}>{payment.homeowner_name}</div>
                    </div>
                    <span style={{...styles.badge, backgroundColor: statusColor(payment.status)}}>
                      {payment.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#555', marginBottom: '4px' }}>
                    Method: {payment.payment_method}
                  </div>
                  <div style={{ fontSize: '13px', color: '#555', marginBottom: '4px' }}>
                    Ref: {payment.reference_number}
                  </div>
                  <div style={{ fontSize: '13px', color: '#555', marginBottom: '12px' }}>
                    Date: {new Date(payment.payment_date).toLocaleDateString()}
                  </div>
                  {payment.status === 'pending' && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        style={{...styles.confirmBtn, flex: 1, padding: '10px'}}
                        onClick={() => handleStatusUpdate(payment.id, 'confirmed')}
                      >
                        ✅ Confirm
                      </button>
                      <button
                        style={{...styles.rejectBtn, flex: 1, padding: '10px'}}
                        onClick={() => handleStatusUpdate(payment.id, 'failed')}
                      >
                        ❌ Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            // Desktop: table layout
            <div style={styles.tableCard}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeader}>
                    <th style={styles.th}>Homeowner</th>
                    <th style={styles.th}>Amount</th>
                    <th style={styles.th}>Method</th>
                    <th style={styles.th}>Reference</th>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map(payment => (
                    <tr key={payment.id} style={styles.tableRow}>
                      <td style={styles.td}>{payment.homeowner_name}</td>
                      <td style={styles.td}>KES {Number(payment.amount).toLocaleString()}</td>
                      <td style={styles.td}>{payment.payment_method}</td>
                      <td style={styles.td}>{payment.reference_number}</td>
                      <td style={styles.td}>{new Date(payment.payment_date).toLocaleDateString()}</td>
                      <td style={styles.td}>
                        <span style={{...styles.badge, backgroundColor: statusColor(payment.status)}}>
                          {payment.status}
                        </span>
                      </td>
                      <td style={styles.td}>
                        {payment.status === 'pending' && (
                          <div style={styles.actionBtns}>
                            <button style={styles.confirmBtn} onClick={() => handleStatusUpdate(payment.id, 'confirmed')}>Confirm</button>
                            <button style={styles.rejectBtn} onClick={() => handleStatusUpdate(payment.id, 'failed')}>Reject</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
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
  filterCard: { backgroundColor: '#fff', borderRadius: '12px', padding: '16px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' },
  filterLabel: { fontSize: '14px', fontWeight: '600', color: '#1B3A6B', whiteSpace: 'nowrap' },
  filterSelect: { padding: '10px 16px', borderRadius: '8px', border: '1.5px solid #E0E0E0', fontSize: '14px', flex: 1, outline: 'none', minWidth: '200px' },
  section: { backgroundColor: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  emptyText: { textAlign: 'center', color: '#888', padding: '24px 0' },
  paymentCard: { backgroundColor: '#fff', borderRadius: '12px', padding: '16px', marginBottom: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  tableCard: { backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHeader: { backgroundColor: '#F5F5F5' },
  th: { padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#888', textTransform: 'uppercase' },
  tableRow: { borderBottom: '1px solid #F0F0F0' },
  td: { padding: '14px 16px', fontSize: '14px', color: '#333' },
  badge: { color: '#fff', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  actionBtns: { display: 'flex', gap: '8px' },
  confirmBtn: { backgroundColor: '#10B981', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer', fontWeight: '600' },
  rejectBtn: { backgroundColor: '#EF4444', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer', fontWeight: '600' },
  bottomNav: { position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#1B3A6B', display: 'flex', justifyContent: 'space-around', padding: '10px 0', zIndex: 100, boxShadow: '0 -2px 10px rgba(0,0,0,0.15)' },
  bottomNavItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', padding: '4px 8px' },
  bottomNavIcon: { fontSize: '22px' },
  bottomNavLabel: { color: 'rgba(255,255,255,0.8)', fontSize: '11px', marginTop: '2px' },
};

export default Payments;