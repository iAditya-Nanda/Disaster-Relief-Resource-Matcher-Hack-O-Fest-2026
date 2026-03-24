import React from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { 
  Stethoscope, 
  Activity, 
  Users, 
  Map, 
  Video, 
  Bell, 
  Search, 
  LogOut,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Zap
} from 'lucide-react';

export default function DoctorDashboard() {
  const { user, signOut } = useAuthStore();

  return (
    <div className="min-h-screen bg-[#FDFDFF] font-sans text-slate-900 overflow-hidden selection:bg-emerald-100 selection:not-italic">
      {/* Sidebar Overlay */}
      <div className="flex h-screen">
        <aside className="w-80 bg-slate-900 h-full flex flex-col p-8 shrink-0 shadow-2xl shadow-slate-900/40 relative z-20">
          <div className="flex items-center gap-4 mb-16">
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Stethoscope className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter uppercase text-white leading-none">Sahara Med</h1>
              <p className="text-[10px] text-white/30 font-black tracking-widest mt-1.5 uppercase">Triage Command</p>
            </div>
          </div>

          <nav className="flex-1 space-y-3">
             {[
               { icon: Activity, label: 'Triage Queue', active: true },
               { icon: Map, label: 'Health Map' },
               { icon: Video, label: 'Telehealth' },
               { icon: Users, label: 'Patient Logs' },
             ].map((item, i) => (
               <button 
                 key={i}
                 className={`w-full flex items-center gap-4 p-4 rounded-2xl font-black text-sm transition-all group ${item.active ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
               >
                 <item.icon size={20} className={`shrink-0 ${item.active ? 'scale-110' : 'group-hover:translate-x-1'}`} />
                 <span className="uppercase tracking-widest leading-none">{item.label}</span>
               </button>
             ))}
          </nav>

          <button onClick={signOut} className="flex items-center gap-4 p-4 rounded-2xl text-slate-400 hover:text-rose-400 hover:bg-rose-400/5 transition-all mt-auto border-t border-white/5 pt-10">
             <LogOut size={20} />
             <span className="font-black text-xs uppercase tracking-[0.2em]">End Shift</span>
          </button>
        </aside>

        <main className="flex-1 flex flex-col h-full bg-slate-50/50 relative">
          <header className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-100 flex justify-between items-center px-12 relative z-10">
            <div className="relative group max-w-md w-full">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
               <input 
                 type="text" 
                 placeholder="Search medical records..." 
                 className="w-full bg-slate-50 border border-slate-50 focus:border-emerald-100 focus:bg-white rounded-2xl py-3 pl-12 pr-4 text-xs font-bold transition-all outline-none"
               />
            </div>

            <div className="flex items-center gap-8">
               <div className="flex items-center gap-3">
                 <button className="p-3 text-slate-400 hover:bg-slate-50 rounded-2xl transition-all relative">
                    <Bell size={20}/>
                    <div className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></div>
                 </button>
               </div>
               <div className="flex items-center gap-4 cursor-pointer group">
                  <div className="text-right">
                    <p className="text-sm font-black text-slate-900 tracking-tight leading-none uppercase">Dr. {user?.user_metadata?.full_name?.split(' ')[0]}</p>
                    <p className="text-[10px] text-emerald-600 font-black uppercase tracking-[0.2em] mt-1.5 opacity-70 leading-none">Chief Medical Officer</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform border-4 border-white">
                    {user?.email?.charAt(0).toUpperCase()}
                  </div>
               </div>
            </div>
          </header>

          <section className="flex-1 overflow-y-auto p-12 scroll-smooth">
             <div className="max-w-7xl mx-auto space-y-12">
                <div className="flex flex-col gap-1.5">
                   <h2 className="text-5xl font-black text-slate-900 tracking-tighter m-0">Medical Command</h2>
                   <p className="text-xs text-slate-400 font-black uppercase tracking-[0.4em] m-0">TRIAGE PROTOCOL - SECTOR 7</p>
                </div>

                <div className="grid lg:grid-cols-4 gap-6">
                   {[
                     { label: 'Patient Queue', value: '14', color: 'bg-emerald-50 text-emerald-600', sub: 'High Priority' },
                     { label: 'Medications', value: '280', color: 'bg-blue-50 text-blue-600', sub: 'Active Supply' },
                     { label: 'Critical SOS', value: '03', color: 'bg-rose-50 text-rose-600', sub: 'Immediate Response' },
                     { label: 'Network Uptime', value: '99.9%', color: 'bg-indigo-50 text-indigo-600', sub: 'Operational' },
                   ].map((stat, i) => (
                     <div key={i} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all group">
                        <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform`}>
                           <TrendingUp size={20}/>
                        </div>
                        <p className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-2">{stat.value}</p>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{stat.label}</p>
                        <p className="text-[8px] font-black uppercase tracking-[0.3em] text-emerald-500">{stat.sub}</p>
                     </div>
                   ))}
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                   <div className="bg-white border border-slate-100 shadow-sm rounded-[50px] p-10 space-y-8">
                      <div className="flex items-center justify-between">
                         <h3 className="text-xl font-black tracking-tight uppercase flex items-center gap-3">
                            <Activity className="text-emerald-500" size={20}/>
                            Awaiting Triage
                         </h3>
                         <span className="text-[10px] font-bold text-slate-400">14 PATIENTS WAITING</span>
                      </div>
                      <div className="space-y-4">
                         {[1,2,3].map(i => (
                           <div key={i} className="flex items-center gap-5 p-5 bg-slate-50/50 border border-slate-50 rounded-3xl hover:bg-white hover:border-emerald-100 transition-all group cursor-pointer">
                              <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex flex-col items-center justify-center shadow-sm">
                                <span className="text-[10px] font-black text-slate-400 leading-none mb-1">POS</span>
                                <span className="text-lg font-black text-emerald-600">{i}</span>
                              </div>
                              <div className="flex-1">
                                 <h4 className="font-black uppercase tracking-tight text-slate-900 leading-none mb-2">Severe Dehydration Case</h4>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Region: Mandi Relief Camp | 1.2 KM AWAY</p>
                              </div>
                              <button className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">
                                 <ChevronRight size={20}/>
                              </button>
                           </div>
                         ))}
                      </div>
                   </div>

                   <div className="bg-slate-900 rounded-[50px] p-10 text-white relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 blur-3xl rounded-full -translate-y-40 translate-x-40"></div>
                      <div className="relative z-10 space-y-10">
                        <div className="space-y-4">
                           <div className="p-4 bg-emerald-500 text-white w-fit rounded-[24px] shadow-lg shadow-emerald-500/30">
                              <Map size={32}/>
                           </div>
                           <h3 className="text-4xl font-black tracking-tighter uppercase leading-tight">Epidemic <br/> Heatmap Profile</h3>
                           <p className="text-white/40 text-sm font-bold uppercase tracking-widest leading-relaxed">Cross-referencing symptoms across Sector 7 to identify potential outbreaks in real-time.</p>
                        </div>
                        <div className="p-8 bg-white/5 border border-white/5 rounded-[40px] flex items-center gap-6">
                           <div className="flex-1 space-y-1">
                              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest leading-none">Predictive Intel</p>
                              <p className="text-xl font-black text-white tracking-tight">Low Outbreak Risk</p>
                           </div>
                           <ShieldCheck className="text-emerald-500/50" size={32}/>
                        </div>
                        <button className="w-full bg-emerald-500 hover:bg-emerald-400 py-6 rounded-3xl text-xs font-black uppercase tracking-[0.4em] transition-all transform active:scale-95 shadow-2xl shadow-emerald-500/20">Open Advanced Map</button>
                      </div>
                   </div>
                </div>
             </div>
          </section>
        </main>
      </div>
    </div>
  );
}
