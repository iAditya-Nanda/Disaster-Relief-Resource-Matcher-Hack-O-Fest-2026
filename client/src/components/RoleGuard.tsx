import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface RoleGuardProps {
  allowedRoles: Array<'NGO' | 'Needy' | 'Doctor'>;
  fallbackRoute?: string;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, fallbackRoute = '/auth' }) => {
  const { role, session, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="min-h-screen bg-thiings-bg flex items-center justify-center font-sans">
        <div className="inline-flex items-center px-6 py-3 rounded-full text-amber-800 bg-amber-100 border border-amber-200 font-bold animate-pulse-ring shadow-sm">
          Loading Dashboard Context...
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to={fallbackRoute} replace />;
  }

  if (role && !allowedRoles.includes(role)) {
    // Basic redirect based on known role mapping
    if (role === 'NGO') return <Navigate to="/ngo" replace />;
    if (role === 'Needy') return <Navigate to="/needy" replace />;
    if (role === 'Doctor') return <Navigate to="/doctor" replace />;
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};
