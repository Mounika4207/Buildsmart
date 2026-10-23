import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import DashboardSidebar from '../components/layout/DashboardSidebar';

export const DashboardLayout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1, minHeight: 'calc(100vh - 120px)' }}>
        <DashboardSidebar />
        <main
          style={{
            flex: 1,
            padding: '2.5rem 2rem',
            backgroundColor: 'var(--bg-dark)',
            overflowX: 'hidden',
          }}
          className="dashboard-content"
        >
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <Outlet />
          </div>
        </main>
      </div>
      <Footer />

      <style>{`
        @media (max-width: 868px) {
          .dashboard-sidebar {
            display: none !important;
          }
          .dashboard-content {
            padding: 1.5rem 1rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;
