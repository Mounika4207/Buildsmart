import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Common Route Guards
import ProtectedRoute from './components/common/ProtectedRoute';
import RoleGuard from './components/common/RoleGuard';

// Public Pages
import Home from './pages/Home';
import ExploreTurfs from './pages/ExploreTurfs';
import TurfDetails from './pages/TurfDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import NotFound from './pages/NotFound';

// Booking Flow Pages
import BookingCheckout from './pages/BookingCheckout';
import BookingConfirmation from './pages/BookingConfirmation';

// Customer Pages
import CustomerDashboard from './pages/CustomerDashboard';
import MyBookings from './pages/MyBookings';
import Profile from './pages/Profile';

// Turf Owner Pages
import OwnerDashboard from './pages/OwnerDashboard';
import OwnerTurfs from './pages/OwnerTurfs';
import AddEditTurf from './pages/AddEditTurf';
import OwnerBookings from './pages/OwnerBookings';
import OwnerSchedule from './pages/OwnerSchedule';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminTurfs from './pages/AdminTurfs';
import AdminUsers from './pages/AdminUsers';

export const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public Browsing Routes with MainLayout */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/turfs" element={<ExploreTurfs />} />
              <Route path="/turfs/:id" element={<TurfDetails />} />

              {/* Protected Booking Flow */}
              <Route
                path="/booking/checkout"
                element={
                  <ProtectedRoute>
                    <BookingCheckout />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/booking/confirmation/:bookingId"
                element={
                  <ProtectedRoute>
                    <BookingConfirmation />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Authentication Routes with AuthLayout */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </Route>

            {/* Customer Dashboard Portal */}
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<CustomerDashboard />} />
              <Route path="/my-bookings" element={<MyBookings />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* Turf Owner Portal (Protected with RoleGuard) */}
            <Route
              element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={['owner', 'admin']}>
                    <DashboardLayout />
                  </RoleGuard>
                </ProtectedRoute>
              }
            >
              <Route path="/owner/dashboard" element={<OwnerDashboard />} />
              <Route path="/owner/turfs" element={<OwnerTurfs />} />
              <Route path="/owner/turfs/new" element={<AddEditTurf />} />
              <Route path="/owner/turfs/:id/edit" element={<AddEditTurf />} />
              <Route path="/owner/bookings" element={<OwnerBookings />} />
              <Route path="/owner/schedule" element={<OwnerSchedule />} />
            </Route>

            {/* Admin Portal (Protected with RoleGuard) */}
            <Route
              element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={['admin']}>
                    <DashboardLayout />
                  </RoleGuard>
                </ProtectedRoute>
              }
            >
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/turfs" element={<AdminTurfs />} />
              <Route path="/admin/users" element={<AdminUsers />} />
            </Route>
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
