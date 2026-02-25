import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProjects, getProjectPayments, updatePaymentStatus } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Payments = () => {
  const { logoutUser } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [payments, setPayments] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');

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
    <div style={styles.container}>
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
          <div style={styles.logoutBtn} onClick={() => { logoutUser(); navigate('/login'); }}>
            🚪 <span>Logout</span>
          </div>
        </div>
      </div>

      <div style={styles.main}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.headerTitle}>Payments</h1>
            <p style={styles.headerSub}>Review and confirm homeowner payments</p>
          </div>
        </div>

        <div style={styles.filterCard}>
          <label style={styles.filterLabel}>Select Project to view payments:</label>
          <select style={styles.filterSelect} value={selectedProject} onChange={handleProjectChange}>
            <option value="">-- Select a Project --</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.homeowner_name} — {p.location}</option>
            ))}
          </select>
        </div>

        {selectedProject && (
          <div style={styles.tableCard}>
            {payments.length === 0 ? (
              <p style={styles.emptyText}>No payments found for this project</p>
            ) : (
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
            )}
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
  logoutBtn: { padding: '14px 24px', color: '#fff', cursor: 'pointer', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#EF4444', margin: '12px', borderRadius: '8px', fontWeight: '600' },
  main: { marginLeft: '240px', flex: 1, padding: '32px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' },
  headerTitle: { fontSize: '28px', fontWeight: '700', color: '#1B3A6B', margin: 0 },
  headerSub: { color: '#888', margin: '4px 0 0 0' },
  filterCard: { backgroundColor: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' },
  filterLabel: { fontSize: '14px', fontWeight: '600', color: '#1B3A6B', whiteSpace: 'nowrap' },
  filterSelect: { padding: '10px 16px', borderRadius: '8px', border: '1.5px solid #E0E0E0', fontSize: '14px', flex: 1, outline: 'none' },
  tableCard: { backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' },
  emptyText: { padding: '32px', textAlign: 'center', color: '#888' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHeader: { backgroundColor: '#F5F5F5' },
  th: { padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#888', textTransform: 'uppercase' },
  tableRow: { borderBottom: '1px solid #F0F0F0' },
  td: { padding: '14px 16px', fontSize: '14px', color: '#333' },
  badge: { color: '#fff', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  actionBtns: { display: 'flex', gap: '8px' },
  confirmBtn: { backgroundColor: '#10B981', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer', fontWeight: '600' },
  rejectBtn: { backgroundColor: '#EF4444', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer', fontWeight: '600' },
};

export default Payments;