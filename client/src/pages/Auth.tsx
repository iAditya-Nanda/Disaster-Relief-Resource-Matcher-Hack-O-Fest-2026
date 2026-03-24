import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { motion } from 'framer-motion';
import { Shield, ChevronRight } from 'lucide-react';

export default function AuthPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setMockAuth } = useAuthStore();

  const handlePortalAccess = (userId: string, role: 'NGO' | 'Needy' | 'Doctor' | 'Admin', path: string) => {
    setLoading(true);
    setMockAuth(userId, role);
    setTimeout(() => {
      navigate(path);
    }, 500);
  };

  const portals = [
    {
      id: 'ngo',
      role: 'NGO' as const,
      title: 'NGO Login',
      desc: 'Access resource hubs and real-time triage maps',
      icon: '/icons/ngo.png',
      path: '/ngo',
      userId: 'bb89335a-ddbb-4030-92e7-6681240c20a8',
      color: 'hover:border-red-500/20'
    },
    {
      id: 'needy',
      role: 'Needy' as const,
      title: 'Needy Login',
      desc: 'Request immediate emergency relief and support',
      icon: '/icons/needy.png',
      path: '/needy',
      userId: 'd186ad60-7978-4db6-8188-fa439d017bff',
      color: 'hover:border-blue-500/20'
    },
    {
      id: 'doctor',
      role: 'Doctor' as const,
      title: 'Doctor Login',
      desc: 'Expert medical node for triage and consultations',
      icon: '/icons/doctor.png',
      path: '/doctor',
      userId: 'e1234567-doctor-4000-8000-1234567890ab',
      color: 'hover:border-emerald-500/20'
    },
    {
      id: 'admin',
      role: 'Admin' as const,
      title: 'Admin Login',
      desc: 'Global command center for system oversight',
      icon: '/icons/admin.png',
      path: '/admin',
      userId: 'admin-master-0000-8000-000000000000',
      color: 'hover:border-amber-500/20'
    }
  ];

  return (
    <div className="h-screen w-screen grid lg:grid-cols-2 bg-white selection:bg-blue-100 overflow-hidden">
      {/* Left Decoration Side */}
      <div className="hidden lg:flex flex-col justify-between p-16 bg-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 opacity-90"></div>
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        
        <div className="relative h-full flex flex-col justify-between text-white z-10">
          <div className="space-y-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="text-blue-600" size={24} />
              </div>
              <span className="text-2xl font-bold tracking-tight">Himachal-Sahayata</span>
            </div>
            
            <div className="space-y-6">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-7xl font-black leading-none tracking-tighter"
              >
                The Modern <br/> Relief Network.
              </motion.h1>
              <p className="text-xl text-blue-100/70 font-medium max-w-md leading-relaxed">
                A unified grid for disaster response. Connecting ground reality to resource hubs in real-time.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 py-8 border-t border-white/10">
            <div className="flex -space-x-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-12 h-12 rounded-2xl border-4 border-blue-600 bg-blue-100 overflow-hidden shadow-sm">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+10}`} alt="User" />
                </div>
              ))}
            </div>
            <p className="text-sm font-semibold tracking-wide text-blue-100">
              Trusted by 100+ local NGOs & medical teams
            </p>
          </div>
        </div>
      </div>

      {/* Right Form Side -> Now Grid Side */}
      <div className="h-full flex flex-col justify-center items-center p-4 lg:p-12 bg-slate-50 relative overflow-hidden">
        <div className="w-full max-w-xl space-y-6 relative z-10 px-4">
          <div className="text-center lg:text-left space-y-1">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">
              Welcome back.
            </h2>
            <p className="text-slate-400 font-medium tracking-wide">
              Select the appropriate node to initialize your dashboard access.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {portals.map((portal, idx) => (
              <motion.button
                key={portal.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * idx }}
                onClick={() => handlePortalAccess(portal.userId, portal.role, portal.path)}
                disabled={loading}
                className={`w-full group flex items-center gap-6 p-6 bg-white border border-slate-200 rounded-[40px] transition-all transform hover:-translate-y-2 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.08)] hover:shadow-[0_30px_70px_-10px_rgba(0,0,0,0.15)] ${portal.color} ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="shrink-0 relative">
                   <div className="absolute inset-0 bg-slate-100 rounded-full blur-2xl group-hover:bg-blue-100 transition-colors opacity-0 group-hover:opacity-100"></div>
                   <img src={portal.icon} alt={portal.title} className="w-20 h-20 object-contain relative z-10 group-hover:scale-110 transition-transform duration-500" />
                </div>
                
                <div className="flex flex-col text-left space-y-1 overflow-hidden">
                  <h3 className="text-xl font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors truncate">{portal.title}</h3>
                  <p className="text-sm font-medium text-slate-400 group-hover:text-slate-500 transition-colors line-clamp-1">{portal.desc}</p>
                </div>

                <div className="ml-auto shrink-0 w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0">
                   <ChevronRight className="text-blue-600" size={20} />
                </div>
              </motion.button>
            ))}
          </div>

          <div className="pt-6 flex flex-col items-center gap-4 border-t border-slate-100">
            <p className="text-xs font-medium text-slate-400 tracking-wide leading-none italic">
              Crafted with passion for the Hack-O-Fest 2026 by
            </p>
            <div className="flex items-center gap-2 group">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
               <p className="text-base font-black text-slate-800 tracking-tighter transition-all cursor-default group-hover:tracking-widest">Kajal | Sourav | Aditya</p>
            </div>
          </div>
        </div>

        {loading && (
          <div className="fixed inset-0 bg-white/60 backdrop-blur-md z-50 flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-6 text-xs font-black uppercase tracking-[0.3em] text-slate-900 animate-pulse">Handshaking Node...</p>
          </div>
        )}
      </div>
    </div>
  );
}
