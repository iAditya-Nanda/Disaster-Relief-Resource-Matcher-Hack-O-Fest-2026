import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'NGO' | 'Needy' | 'Doctor'>('Needy');
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorCode(null);

    let authResponse;

    if (isLogin) {
      authResponse = await supabase.auth.signInWithPassword({ email, password });
    } else {
      authResponse = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName, role } }
      });
    }

    const { data, error } = authResponse;

    if (error) {
      setErrorCode(error.message);
      setLoading(false);
      return;
    }

    if (data.session && data.user) {
      setAuth(data.session, data.user);
      const userRole = data.user.user_metadata?.role || role;
      
      switch (userRole) {
        case 'NGO': navigate('/ngo'); break;
        case 'Needy': navigate('/needy'); break;
        case 'Doctor': navigate('/doctor'); break;
        default: navigate('/needy'); break;
      }
    } else {
      setErrorCode('Check your email for confirmation link!');
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-thiings-bg relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-teal-500/10 rounded-full blur-[80px]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-amber-500/10 rounded-full blur-[80px]"></div>

      <div className="w-full max-w-md p-10 glass-panel rounded-3xl relative z-10 transition-all duration-300">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-heading font-bold bg-gradient-to-br from-teal-700 to-teal-900 bg-clip-text text-transparent mb-2">Himachal-Sahayata</h1>
          <p className="text-gray-500 text-sm font-medium">Disaster Relief Resource Matcher</p>
        </div>

        {errorCode && (
          <div className="mb-6 w-full flex justify-center text-sm font-semibold rounded-full bg-red-50 text-red-600 border border-red-200 py-2 px-4">
            {errorCode}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {!isLogin && (
            <>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Rahul Singh" 
                  required 
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">I am a...</label>
                <select 
                  className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all appearance-none cursor-pointer"
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                >
                  <option value="Needy">Person in Need (Field Worker)</option>
                  <option value="NGO">Relief Provider (NGO/Donor)</option>
                  <option value="Doctor">Medical Professional</option>
                </select>
              </div>
            </>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com" 
              required 
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              required 
            />
          </div>

          <button 
            type="submit" 
            className="w-full mt-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-full shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed" 
            disabled={loading}
          >
            {loading ? 'Processing...' : (isLogin ? 'Log In' : 'Create Account')}
          </button>
        </form>

        <div className="text-center mt-6 flex flex-col gap-3">
          <button 
            type="button" 
            className="text-sm font-medium text-teal-700 hover:text-teal-900 transition-colors"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Need an account? Sign Up" : "Already have an account? Log In"}
          </button>

          <div className="h-px bg-gray-100 w-full my-1"></div>

          <button 
            type="button" 
            className="text-xs font-bold text-teal-800 bg-teal-50 py-2 px-4 rounded-full border border-teal-100 hover:bg-teal-100 transition-all flex items-center justify-center gap-2"
            onClick={() => {
              setAuth({ access_token: 'dev', refresh_token: 'dev' } as any, { 
                id: 'dev_user', 
                email: 'ngo.test@example.com',
                user_metadata: { role: 'NGO', full_name: 'Aditya Dev' } 
              } as any);
              navigate('/ngo');
            }}
          >
            <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-ping"></span>
            ⚡ BYPASS LOGIN (DEV MODE)
          </button>
        </div>
      </div>
    </div>
  );
}
