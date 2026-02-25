import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, createUser, toggleUserStatus } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Users = () => {
  const { logoutUser } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    full_name: '', email: '', password: '', role: 'homeowner', phone: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await createUser(form);
      toast.success('User account created successfully');
      setShowModal(false);
      setForm({ full_name: '', email: '', password: '', role: 'homeowner', phone: '' });
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create user');
    }
  };

  const handleToggle = async (id) => {
    try {
      const res = await toggleUserStatus(id);
      toast.success(res.data.message);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const roleColor = (role) => {
    if (role === 'admin') return '#1B3A6B';
    if (role === 'homeowner') return '#10B981';
    if (role === 'engineer') return '#F97316';
    if (role === 'firm') return '#8B5CF6';
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
          <div style={styles.navItem} onClick={() => navigate('/admin')}>📊 Dashboard</div>
          <div style={{...styles.navItem, ...styles.navItemActive}}>👥 Users</div>
          <div style={styles.navItem} onClick={() => navigate('/admin/properties')}>🏠 Properties</div>
          <div style={styles.navItem} onClick={() => navigate('/admin/projects')}>🏗️ Projects</div>
          <div style={styles.navItem} onClick={() => navigate('/admin/payments')}>💰 Payments</div>
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
            <h1 style={styles.headerTitle}>Users</h1>
            <p style={styles.headerSub}>Manage all platform accounts</p>
          </div>
          <button style={styles.createBtn} onClick={() => setShowModal(true)}>
            ➕ Create Account
          </button>
        </div>

        {loading ? <p>Loading users...</p> : (
          <div style={styles.tableCard}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Phone</th>
                  <th style={styles.th}>Role</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} style={styles.tableRow}>
                    <td style={styles.td}>{user.full_name}</td>
                    <td style={styles.td}>{user.email}</td>
                    <td style={styles.td}>{user.phone}</td>
                    <td style={styles.td}>
                      <span style={{...styles.badge, backgroundColor: roleColor(user.role)}}>
                        {user.role}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span style={{...styles.badge, backgroundColor: user.is_active ? '#10B981' : '#EF4444'}}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <button
                        style={{...styles.toggleBtn, backgroundColor: user.is_active ? '#EF4444' : '#10B981'}}
                        onClick={() => handleToggle(user.id)}
                      >
                        {user.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>Create New Account</h2>
            <form onSubmit={handleCreateUser} style={styles.form}>
              <input style={styles.input} placeholder="Full Name" value={form.full_name} onChange={(e) => setForm({...form, full_name: e.target.value})} required />
              <input style={styles.input} placeholder="Email Address" type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required />
              <input style={styles.input} placeholder="Phone Number" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} required />
              <input style={styles.input} placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} required />
              <select style={styles.input} value={form.role} onChange={(e) => setForm({...form, role: e.target.value})}>
                <option value="homeowner">Homeowner</option>
                <option value="engineer">Engineer</option>
                <option value="firm">Firm</option>
              </select>
              <div style={styles.modalActions}>
                <button type="button" style={styles.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" style={styles.submitBtn}>Create Account</button>
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
  logoutBtn: { padding: '14px 24px', color: '#fff', cursor: 'pointer', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#EF4444', margin: '12px', borderRadius: '8px', fontWeight: '600' },
  main: { marginLeft: '240px', flex: 1, padding: '32px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' },
  headerTitle: { fontSize: '28px', fontWeight: '700', color: '#1B3A6B', margin: 0 },
  headerSub: { color: '#888', margin: '4px 0 0 0' },
  createBtn: { backgroundColor: '#F97316', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px 20px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' },
  tableCard: { backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHeader: { backgroundColor: '#F5F5F5' },
  th: { padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#888', textTransform: 'uppercase' },
  tableRow: { borderBottom: '1px solid #F0F0F0' },
  td: { padding: '14px 16px', fontSize: '14px', color: '#333' },
  badge: { color: '#fff', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  toggleBtn: { color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer', fontWeight: '600' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { backgroundColor: '#fff', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '440px' },
  modalTitle: { fontSize: '20px', fontWeight: '700', color: '#1B3A6B', marginTop: 0, marginBottom: '24px' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  input: { padding: '12px 16px', borderRadius: '8px', border: '1.5px solid #E0E0E0', fontSize: '15px', outline: 'none' },
  modalActions: { display: 'flex', gap: '12px', marginTop: '8px' },
  cancelBtn: { flex: 1, padding: '12px', borderRadius: '8px', border: '1.5px solid #E0E0E0', backgroundColor: '#fff', cursor: 'pointer', fontSize: '15px' },
  submitBtn: { flex: 1, padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#F97316', color: '#fff', cursor: 'pointer', fontSize: '15px', fontWeight: '600' },
};

export default Users;