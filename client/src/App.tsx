import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { useAuthStore } from './store/authStore';
import { RoleGuard } from './components/RoleGuard';

// Pages
import AuthPage from './pages/Auth';
import NgoDashboard from './pages/NgoDashboard';
import NeedyDashboard from './pages/NeedyDashboard';
import DoctorDashboard from './pages/DoctorDashboard';


function App() {
  const { setAuth, fetchRole } = useAuthStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuth(session, session?.user ?? null);
      if (session?.user) fetchRole(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuth(session, session?.user ?? null);
      if (session?.user) fetchRole(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, [setAuth, fetchRole]);

  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />

        <Route element={<RoleGuard allowedRoles={['NGO']} />}>
          <Route path="/ngo" element={<NgoDashboard />} />
        </Route>

        <Route element={<RoleGuard allowedRoles={['Needy']} />}>
          <Route path="/needy" element={<NeedyDashboard />} />
        </Route>

        <Route element={<RoleGuard allowedRoles={['Doctor']} />}>
          <Route path="/doctor" element={<DoctorDashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
