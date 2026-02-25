import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getMyProjects, makePayment, getMyPayments, getPaymentSummary } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const HomeownerPayments = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const { project_id } = useParams();
  const [projects, setProjects] = useState([]);
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState(null);
  const [selectedProject, setSelectedProject] = useState(project_id || '');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    amount: '',
    payment_method: 'Mpesa',
    reference_number: '',
    notes: ''
  });

  useEffect(() => {
    fetchProjects();
    fetchPayments();
  }, []); // eslint-disable-line

  useEffect(() => {
    if (selectedProject) fetchSummary(selectedProject);
  }, [selectedProject]);

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

  const fetchPayments = async () => {
    try {
      const res = await getMyPayments();
      setPayments(res.data);
    } catch (error) {
      toast.error('Failed to load payments');
    }
  };

  const fetchSummary = async (projectId) => {
    try {
      const res = await getPaymentSummary(projectId);
      setSummary(res.data);
    } catch (error) {
      console.error('Failed to load summary');
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      await makePayment({ ...form, project_id: selectedProject });
      toast.success('Payment submitted successfully! Awaiting confirmation.');
      setShowModal(false);
      setForm({ amount: '', payment_method: 'Mpesa', reference_number: '', notes: '' });
      fetchPayments();
      fetchSummary(selectedProject);
    } catch (error) {
      toast.error('Failed to submit payment');
    }
  };

  const statusColor = (status) => {
    if (status === 'confirmed') return '#10B981';
    if (status === 'failed') return '#EF4444';
    return '#F97316';
  };

  const filteredPayments = payments.filter(p =>
    String(p.project_id) === String(selectedProject)
  );

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <div style={styles.sidebarLogo}>
          <span>🏗️</span>
          <span style={styles.logoText}>Homebuild</span>
        </div>
        <nav style={styles.nav}>
          <div style={styles.navItem} onClick={() => navigate('/homeowner')}>📊 Dashboard</div>
          <div style={{...styles.navItem, ...styles.navItemActive}}>💰 Payments</div>
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

      <div style={styles.main}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.headerTitle}>Payments</h1>
            <p style={styles.headerSub}>Track and manage your construction payments</p>
          </div>
          <button style={styles.createBtn} onClick={() => setShowModal(true)}>
            💳 Make Payment
          </button>
        </div>

        {/* Project Selector */}
        <div style={styles.filterCard}>
          <label style={styles.filterLabel}>Select Project:</label>
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

        {/* Payment Summary */}
        {summary && (
          <div style={styles.summaryGrid}>
            <div style={{...styles.summaryCard, borderTop: '4px solid #1B3A6B'}}>
              <div style={styles.summaryLabel}>Total Project Cost</div>
              <div style={styles.summaryValue}>KES {Number(summary.total_cost).toLocaleString()}</div>
            </div>
            <div style={{...styles.summaryCard, borderTop: '4px solid #8B5CF6'}}>
              <div style={styles.summaryLabel}>Funded by Homebuild (70%)</div>
              <div style={styles.summaryValue}>KES {Number(summary.funded_amount).toLocaleString()}</div>
            </div>
            <div style={{...styles.summaryCard, borderTop: '4px solid #F97316'}}>
              <div style={styles.summaryLabel}>Your Contribution (30%)</div>
              <div style={styles.summaryValue}>KES {Number(summary.homeowner_contribution).toLocaleString()}</div>
            </div>
            <div style={{...styles.summaryCard, borderTop: '4px solid #10B981'}}>
              <div style={styles.summaryLabel}>Total Paid</div>
              <div style={styles.summaryValue}>KES {Number(summary.total_paid).toLocaleString()}</div>
            </div>
            <div style={{...styles.summaryCard, borderTop: '4px solid #EF4444'}}>
              <div style={styles.summaryLabel}>Balance Remaining</div>
              <div style={styles.summaryValue}>KES {Number(summary.balance).toLocaleString()}</div>
            </div>
          </div>
        )}

        {/* Payment History */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Payment History</h2>
          {loading ? <p>Loading...</p> : filteredPayments.length === 0 ? (
            <p style={styles.emptyText}>No payments made yet for this project.</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>Amount</th>
                  <th style={styles.th}>Method</th>
                  <th style={styles.th}>Reference</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Notes</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map(payment => (
                  <tr key={payment.id} style={styles.tableRow}>
                    <td style={styles.td}>KES {Number(payment.amount).toLocaleString()}</td>
                    <td style={styles.td}>{payment.payment_method}</td>
                    <td style={styles.td}>{payment.reference_number}</td>
                    <td style={styles.td}>{new Date(payment.payment_date).toLocaleDateString()}</td>
                    <td style={styles.td}>
                      <span style={{...styles.badge, backgroundColor: statusColor(payment.status)}}>
                        {payment.status}
                      </span>
                    </td>
                    <td style={styles.td}>{payment.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>Make a Payment</h2>
            <p style={styles.modalSub}>Payment will be confirmed by admin after verification</p>
            <form onSubmit={handlePayment} style={styles.form}>
              <input
                style={styles.input}
                placeholder="Amount (KES)"
                type="number"
                value={form.amount}
                onChange={(e) => setForm({...form, amount: e.target.value})}
                required
              />
              <select
                style={styles.input}
                value={form.payment_method}
                onChange={(e) => setForm({...form, payment_method: e.target.value})}
              >
                <option value="Mpesa">Mpesa</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cash">Cash</option>
                <option value="Cheque">Cheque</option>
              </select>
              <input
                style={styles.input}
                placeholder="Reference Number / Transaction ID"
                value={form.reference_number}
                onChange={(e) => setForm({...form, reference_number: e.target.value})}
                required
              />
              <textarea
                style={{...styles.input, resize: 'vertical'}}
                placeholder="Notes (optional)"
                rows={3}
                value={form.notes}
                onChange={(e) => setForm({...form, notes: e.target.value})}
              />
              <div style={styles.modalActions}>
                <button type="button" style={styles.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" style={styles.submitBtn}>Submit Payment</button>
              </div>
            </form>
          </div>
        </div>
      )}
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
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' },
  headerTitle: { fontSize: '28px', fontWeight: '700', color: '#1B3A6B', margin: 0 },
  headerSub: { color: '#888', margin: '4px 0 0 0' },
  createBtn: { backgroundColor: '#F97316', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px 20px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' },
  filterCard: { backgroundColor: '#fff', borderRadius: '12px', padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' },
  filterLabel: { fontSize: '14px', fontWeight: '600', color: '#1B3A6B', whiteSpace: 'nowrap' },
  filterSelect: { padding: '10px 16px', borderRadius: '8px', border: '1.5px solid #E0E0E0', fontSize: '14px', flex: 1, outline: 'none' },
  summaryGrid: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '24px' },
  summaryCard: { backgroundColor: '#fff', borderRadius: '12px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center' },
  summaryLabel: { fontSize: '12px', color: '#888', marginBottom: '8px' },
  summaryValue: { fontSize: '16px', fontWeight: '700', color: '#1B3A6B' },
  section: { backgroundColor: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  sectionTitle: { fontSize: '18px', fontWeight: '600', color: '#1B3A6B', marginTop: 0, marginBottom: '20px' },
  emptyText: { textAlign: 'center', color: '#888', padding: '32px 0' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHeader: { backgroundColor: '#F5F5F5' },
  th: { padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#888', textTransform: 'uppercase' },
  tableRow: { borderBottom: '1px solid #F0F0F0' },
  td: { padding: '14px 16px', fontSize: '14px', color: '#333' },
  badge: { color: '#fff', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { backgroundColor: '#fff', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '440px' },
  modalTitle: { fontSize: '20px', fontWeight: '700', color: '#1B3A6B', marginTop: 0, marginBottom: '4px' },
  modalSub: { color: '#888', fontSize: '14px', marginBottom: '24px' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  input: { padding: '12px 16px', borderRadius: '8px', border: '1.5px solid #E0E0E0', fontSize: '15px', outline: 'none' },
  modalActions: { display: 'flex', gap: '12px', marginTop: '8px' },
  cancelBtn: { flex: 1, padding: '12px', borderRadius: '8px', border: '1.5px solid #E0E0E0', backgroundColor: '#fff', cursor: 'pointer', fontSize: '15px' },
  submitBtn: { flex: 1, padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#F97316', color: '#fff', cursor: 'pointer', fontSize: '15px', fontWeight: '600' },
};

export default HomeownerPayments;