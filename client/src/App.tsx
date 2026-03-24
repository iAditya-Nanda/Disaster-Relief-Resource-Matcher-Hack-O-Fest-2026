import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { useAuthStore } from './store/authStore';
import { RoleGuard } from './components/RoleGuard';

// Pages
import AuthPage from './pages/Auth';
import NgoDashboard from './pages/NgoDashboard';
import NeedyDashboard from './pages/NeedyDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const { setAuth, fetchRole, loading: storeLoading } = useAuthStore();
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setAuth(session, session?.user ?? null);
      if (session?.user) {
        await fetchRole(session.user.id);
      }
      setAppLoading(false);
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setAuth(session, session?.user ?? null);
      if (session?.user) {
        await fetchRole(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [setAuth, fetchRole]);

  if (appLoading || storeLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50 font-sans">
        <div className="w-16 h-16 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 font-bold tracking-widest uppercase animate-pulse">Initializing Sahara...</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />

        <Route element={<RoleGuard allowedRoles={['NGO']} />}>
          <Route path="/ngo/*" element={<NgoDashboard />} />
        </Route>

        <Route element={<RoleGuard allowedRoles={['Needy']} />}>
          <Route path="/needy/*" element={<NeedyDashboard />} />
        </Route>

        <Route element={<RoleGuard allowedRoles={['Doctor']} />}>
          <Route path="/doctor/*" element={<DoctorDashboard />} />
        </Route>

        <Route element={<RoleGuard allowedRoles={['Admin']} />}>
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Route>

        <Route path="/" element={<Navigate to="/auth" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
