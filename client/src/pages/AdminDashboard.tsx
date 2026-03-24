import React from 'react';
import { useAuthStore } from '../store/authStore';
import { Shield, Settings, Users, Database, LogOut } from 'lucide-react';

export default function AdminDashboard() {
  const { signOut } = useAuthStore();

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans p-12">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
             <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Shield className="text-slate-900" size={28} />
             </div>
             <div>
                <h1 className="text-3xl font-black tracking-tighter uppercase leading-none text-amber-500">Master Control</h1>
                <p className="text-[10px] text-white/30 font-black tracking-widest mt-1.5 uppercase">System Administration</p>
             </div>
          </div>
          <button onClick={signOut} className="flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-rose-500/10 hover:text-rose-500 rounded-2xl transition-all border border-white/5">
             <LogOut size={20} />
             <span className="font-black text-xs uppercase tracking-widest">Terminate Session</span>
          </button>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
           {[
             { label: 'Global Nodes', value: '1,240', icon: Database, color: 'text-blue-400' },
             { label: 'Active Personnel', value: '42', icon: Users, color: 'text-emerald-400' },
             { label: 'System Health', value: 'NOMINAL', icon: Shield, color: 'text-amber-400' },
             { label: 'Sync Latency', value: '0.02ms', icon: Settings, color: 'text-indigo-400' }
           ].map((stat, i) => (
             <div key={i} className="bg-white/5 border border-white/5 p-8 rounded-[40px] space-y-4">
                <stat.icon size={24} className={stat.color} />
                <div>
                   <p className="text-4xl font-black tracking-tight">{stat.value}</p>
                   <p className="text-[10px] font-black uppercase tracking-widest text-white/30">{stat.label}</p>
                </div>
             </div>
           ))}
        </div>

        <div className="h-96 bg-white/5 border border-white/5 rounded-[60px] flex items-center justify-center p-20 text-center">
           <div className="max-w-md space-y-4">
              <Settings size={48} className="text-amber-500/20 mx-auto animate-spin-slow" />
              <h3 className="text-2xl font-black uppercase tracking-tight text-white/70">Console Initializing...</h3>
              <p className="text-sm text-white/40 font-medium">Accessing encrypted telemetry and global relief logs. Please hold for authentication handshake.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
