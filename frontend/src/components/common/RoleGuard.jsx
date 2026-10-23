import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSkeleton from './LoadingSkeleton';

/**
 * Role-based authorization guard
 * Ensures user has one of allowedRoles (e.g. ['owner', 'admin'])
 */
export const RoleGuard = ({ allowedRoles = [], children }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ padding: '4rem 1.5rem', minHeight: '60vh' }} className="container">
        <LoadingSkeleton count={3} height="60px" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // If unauthorized for this specific role, redirect to their corresponding dashboard
    if (user?.role === 'owner') {
      return <Navigate to="/owner/dashboard" replace />;
    } else if (user?.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

export default RoleGuard;
