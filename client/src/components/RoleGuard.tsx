import type { ReactNode } from 'react';
// This will be expanded when we add auth state management (Zustand)
interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: string[];
  userRole?: string;
}

export const RoleGuard = ({ children, allowedRoles, userRole }: RoleGuardProps) => {
  if (!userRole || !allowedRoles.includes(userRole)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
        <div className="p-8 bg-slate-800 border border-red-500 rounded-lg shadow-xl">
          <h2 className="text-2xl font-bold text-red-400">Access Denied</h2>
          <p className="mt-2 opacity-80">You do not have permission to view this dashboard.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
