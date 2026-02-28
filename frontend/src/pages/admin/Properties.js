import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProperties, verifyProperty } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Properties = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
            <div style={{...styles.navItem, ...styles.navItemActive}}>🏠 Properties</div>
            <div style={styles.navItem} onClick={() => navigate('/admin/projects')}>🏗️ Projects</div>
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
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: isMobile ? '22px' : '28px', fontWeight: '700', color: '#1B3A6B', margin: 0 }}>Properties</h1>
          <p style={{ color: '#888', margin: '4px 0 0 0', fontSize: '14px' }}>Review and verify submitted title deeds</p>
        </div>

        {loading ? <p>Loading properties...</p> : isMobile ? (
          // Mobile: card layout
          <div>
            {properties.length === 0 ? (
              <p style={styles.emptyText}>No properties submitted yet.</p>
            ) : (
              properties.map(property => (
                <div key={property.id} style={styles.propertyCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: '700', color: '#1B3A6B' }}>{property.homeowner_name}</div>
                      <div style={{ fontSize: '13px', color: '#888' }}>{property.homeowner_email}</div>
                    </div>
                    <span style={{...styles.badge, backgroundColor: property.verified ? '#10B981' : '#F97316'}}>
                      {property.verified ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#555', marginBottom: '4px' }}>📍 {property.location}</div>
                  <div style={{ fontSize: '13px', color: '#555', marginBottom: '8px' }}>📐 {property.land_size}</div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {property.title_deed_url ? (
                      <a href={property.title_deed_url} target="_blank" rel="noreferrer" style={styles.link}>View Document</a>
                    ) : (
                      <span style={{ color: '#aaa', fontSize: '13px' }}>No document</span>
                    )}
                    {!property.verified && (
                      <button style={styles.verifyBtn} onClick={() => handleVerify(property.id)}>✅ Verify</button>
                    )}
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
  propertyCard: { backgroundColor: '#fff', borderRadius: '12px', padding: '16px', marginBottom: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  emptyText: { textAlign: 'center', color: '#888', padding: '24px 0' },
  tableCard: { backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHeader: { backgroundColor: '#F5F5F5' },
  th: { padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#888', textTransform: 'uppercase' },
  tableRow: { borderBottom: '1px solid #F0F0F0' },
  td: { padding: '14px 16px', fontSize: '14px', color: '#333' },
  badge: { color: '#fff', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  verifyBtn: { backgroundColor: '#1B3A6B', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 14px', fontSize: '13px', cursor: 'pointer', fontWeight: '600' },
  link: { color: '#F97316', fontWeight: '600', textDecoration: 'none', fontSize: '13px' },
  bottomNav: { position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#1B3A6B', display: 'flex', justifyContent: 'space-around', padding: '10px 0', zIndex: 100, boxShadow: '0 -2px 10px rgba(0,0,0,0.15)' },
  bottomNavItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', padding: '4px 8px' },
  bottomNavIcon: { fontSize: '22px' },
  bottomNavLabel: { color: 'rgba(255,255,255,0.8)', fontSize: '11px', marginTop: '2px' },
};

export default Properties;