import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Landing from './pages/Landing';
import AdminDashboard from './pages/admin/AdminDashboard';
import Users from './pages/admin/Users';
import Properties from './pages/admin/Properties';
import Projects from './pages/admin/Projects';
import Payments from './pages/admin/Payments';
import HomeownerDashboard from './pages/homeowner/HomeownerDashboard';
import HomeownerPayments from './pages/homeowner/HomeownerPayments';
import HomeownerProgress from './pages/homeowner/HomeownerProgress';
import FirmDashboard from './pages/firm/FirmDashboard';
import FirmProjects from './pages/firm/FirmProjects';
import EngineerDashboard from './pages/engineer/EngineerDashboard';

const App = () => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <p>Loading...</p>
    </div>
  );

  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={!user ? <Landing /> : <Navigate to={`/${user.role}`} />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to={`/${user.role}`} />} />

        {/* Admin Routes */}
        <Route path="/admin" element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} />
        <Route path="/admin/users" element={user?.role === 'admin' ? <Users /> : <Navigate to="/login" />} />
        <Route path="/admin/properties" element={user?.role === 'admin' ? <Properties /> : <Navigate to="/login" />} />
        <Route path="/admin/projects" element={user?.role === 'admin' ? <Projects /> : <Navigate to="/login" />} />
        <Route path="/admin/payments" element={user?.role === 'admin' ? <Payments /> : <Navigate to="/login" />} />

        {/* Homeowner Routes */}
        <Route path="/homeowner" element={user?.role === 'homeowner' ? <HomeownerDashboard /> : <Navigate to="/login" />} />
        <Route path="/homeowner/payments" element={user?.role === 'homeowner' ? <HomeownerPayments /> : <Navigate to="/login" />} />
        <Route path="/homeowner/payments/:project_id" element={user?.role === 'homeowner' ? <HomeownerPayments /> : <Navigate to="/login" />} />
        <Route path="/homeowner/progress" element={user?.role === 'homeowner' ? <HomeownerProgress /> : <Navigate to="/login" />} />
        <Route path="/homeowner/progress/:project_id" element={user?.role === 'homeowner' ? <HomeownerProgress /> : <Navigate to="/login" />} />

        {/* Firm Routes */}
        <Route path="/firm" element={user?.role === 'firm' ? <FirmDashboard /> : <Navigate to="/login" />} />
        <Route path="/firm/projects" element={user?.role === 'firm' ? <FirmProjects /> : <Navigate to="/login" />} />
        <Route path="/firm/projects/:id" element={user?.role === 'firm' ? <FirmProjects /> : <Navigate to="/login" />} />

        {/* Engineer Routes */}
        <Route path="/engineer" element={user?.role === 'engineer' ? <EngineerDashboard /> : <Navigate to="/login" />} />

        {/* Catch all - must be last */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;