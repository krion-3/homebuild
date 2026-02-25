import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProperties, verifyProperty } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Properties = () => {
  const { logoutUser } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const res = await getAllProperties();
      setProperties(res.data);
    } catch (error) {
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id) => {
    try {
      await verifyProperty(id);
      toast.success('Property verified successfully');
      fetchProperties();
    } catch (error) {
      toast.error('Failed to verify property');
    }
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
          <div style={{...styles.navItem, ...styles.navItemActive}}>🏠 Properties</div>
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
            <h1 style={styles.headerTitle}>Properties</h1>
            <p style={styles.headerSub}>Review and verify submitted title deeds</p>
          </div>
        </div>

        {loading ? <p>Loading properties...</p> : (
          <div style={styles.tableCard}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>Homeowner</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Location</th>
                  <th style={styles.th}>Land Size</th>
                  <th style={styles.th}>Title Deed</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {properties.map(property => (
                  <tr key={property.id} style={styles.tableRow}>
                    <td style={styles.td}>{property.homeowner_name}</td>
                    <td style={styles.td}>{property.homeowner_email}</td>
                    <td style={styles.td}>{property.location}</td>
                    <td style={styles.td}>{property.land_size}</td>
                    <td style={styles.td}>
                      {property.title_deed_url ? (
                        <a href={property.title_deed_url} target="_blank" rel="noreferrer" style={styles.link}>View Document</a>
                      ) : (
                        <span style={{color: '#aaa'}}>Not uploaded</span>
                      )}
                    </td>
                    <td style={styles.td}>
                      <span style={{...styles.badge, backgroundColor: property.verified ? '#10B981' : '#F97316'}}>
                        {property.verified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td style={styles.td}>
                      {!property.verified && (
                        <button style={styles.verifyBtn} onClick={() => handleVerify(property.id)}>Verify</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
  tableCard: { backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHeader: { backgroundColor: '#F5F5F5' },
  th: { padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#888', textTransform: 'uppercase' },
  tableRow: { borderBottom: '1px solid #F0F0F0' },
  td: { padding: '14px 16px', fontSize: '14px', color: '#333' },
  badge: { color: '#fff', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  verifyBtn: { backgroundColor: '#1B3A6B', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer', fontWeight: '600' },
  link: { color: '#F97316', fontWeight: '600', textDecoration: 'none' },
};

export default Properties;