import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface RoleGuardProps {
  allowedRoles: ('NGO' | 'Needy' | 'Doctor' | 'Admin')[];
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles }) => {
  const { user, role, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center font-sans">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (role && !allowedRoles.includes(role as any)) {
    // If user has the wrong role, send them to their role-specific page
    return <Navigate to={`/${role.toLowerCase()}`} replace />;
  }

  return <Outlet />;
};
