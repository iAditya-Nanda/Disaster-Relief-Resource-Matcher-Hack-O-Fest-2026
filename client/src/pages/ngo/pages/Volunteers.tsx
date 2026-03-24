import React from 'react';
import { Users, UserPlus, Mail, ShieldCheck, MapPin, MoreHorizontal } from 'lucide-react';
import volunteerIcon from '../../../assets/volunteer_community_3d.png';

export const Volunteers: React.FC = () => {
  // Mock data for hackathon demo
  const volunteers = [
    { name: "Rahul Sharma", role: "Logistics", status: "Active", location: "Shimla Sector 4", id: "V-01" },
    { name: "Suman Devi", role: "Medical Aid", status: "On Duty", location: "Beas Basin", id: "V-02" },
    { name: "Aman Gupta", role: "Food Distribution", status: "Idle", location: "Manali West", id: "V-03" },
    { name: "Priya Neogi", role: "Psychological Support", status: "Active", location: "Kullu Valley", id: "V-04" },
  ];

  return (
    <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-1000">
      {/* Top Banner */}
      <div className="clay-card p-10 bg-gradient-to-r from-teal-50 to-white flex items-center justify-between border-teal-100/50">
        <div className="flex items-center gap-8">
           <div className="w-24 h-24 bg-white rounded-[32px] p-4 clay-card border-none flex items-center justify-center">
              <img src={volunteerIcon} alt="Volunteers" className="w-full h-full object-contain" />
           </div>
           <div>
              <h3 className="text-3xl font-black text-gray-900 tracking-tighter italic">Human Capital</h3>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">24 Active Field Personnel Syncing</p>
           </div>
        </div>
        <button 
          onClick={() => alert('Opening Invite Portal...')}
          className="bg-black text-white px-10 py-5 rounded-[24px] flex items-center gap-3 shadow-xl shadow-black/20 hover:scale-105 transition-all font-black text-xs tracking-widest uppercase italic"
        >
          <UserPlus size={18} /> Recruit Personnel
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Main List */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between px-4">
             <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">Active Fleet</h4>
             <button className="text-[10px] font-black text-teal-600 uppercase tracking-widest hover:underline">View All Records</button>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {volunteers.map((v, i) => (
              <div key={i} className="clay-card bg-white p-8 flex flex-col md:flex-row items-center justify-between gap-8 border-gray-50 group hover:border-teal-200 transition-all">
                <div className="flex items-center gap-8 flex-1">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-[28px] bg-gray-50 flex items-center justify-center text-teal-800 font-black text-3xl border border-gray-200 shadow-inner group-hover:bg-teal-50 transition-colors">
                      {v.name.charAt(0)}
                    </div>
                    {v.status !== 'Idle' && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-teal-500 rounded-full border-4 border-white animate-pulse"></div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                       <h4 className="font-black text-gray-950 text-2xl tracking-tight leading-none">{v.name}</h4>
                       <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">{v.id}</span>
                    </div>
                    <div className="flex items-center gap-6 mt-3">
                      <span className="text-teal-600 font-black text-[10px] uppercase tracking-[0.1em] flex items-center gap-2 bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
                         <ShieldCheck size={12} /> {v.role}
                      </span>
                      <span className="text-gray-400 font-bold text-[10px] uppercase tracking-widest flex items-center gap-2">
                        <MapPin size={12} /> {v.location}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 w-full md:w-auto">
                   <div className={`px-6 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-widest border transition-all ${
                     v.status === 'Idle' 
                     ? 'bg-gray-50 text-gray-400 border-gray-100' 
                     : 'bg-teal-600 text-white border-none shadow-lg shadow-teal-500/20'
                   }`}>
                     {v.status}
                   </div>
                   <div className="flex items-center gap-2">
                      <button 
                        onClick={() => alert(`Starting encrypted chat with ${v.name}...`)}
                        className="p-4 rounded-2xl bg-white text-gray-400 hover:text-teal-600 border border-gray-100 clay-card shadow-sm hover:scale-105 transition-all"
                      >
                        <Mail size={20} />
                      </button>
                      <button className="p-4 rounded-2xl bg-white text-gray-400 hover:text-gray-900 border border-gray-100 clay-card shadow-sm hover:scale-105 transition-all">
                        <MoreHorizontal size={20} />
                      </button>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Highlight */}
        <div className="lg:col-span-1 space-y-10">
          <div className="clay-card bg-gray-950 text-white p-10 border-none relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-teal-500/10 rounded-full blur-[80px]"></div>
            
            <Users size={48} className="mb-8 text-teal-400 opacity-50 group-hover:rotate-12 transition-transform" />
            <h3 className="text-2xl font-black mb-4 italic tracking-tighter leading-tight">Response Merit</h3>
            <p className="text-gray-400 font-medium text-sm mb-12 leading-relaxed">
              <span className="text-white">Dr. Suman Devi</span> handled <span className="text-teal-400">42 emergency cases</span> with 100% success rate this term.
            </p>
            
            <button className="w-full bg-white/5 hover:bg-white/10 text-white font-black py-4 rounded-2xl border border-white/10 transition-all text-[10px] tracking-[0.3em] uppercase italic">
              View Leaderboard
            </button>
          </div>

          <div className="clay-card p-10 space-y-8 bg-white border-gray-100">
             <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">Fleet Efficiency</h4>
             <div className="space-y-6">
                <div className="space-y-3">
                   <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Tasks Complete</span>
                      <span className="text-xs font-black text-teal-600 italic">92%</span>
                   </div>
                   <div className="w-full h-2 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                      <div className="w-[92%] h-full bg-teal-500 rounded-full shadow-[0_0_10px_rgba(20,184,166,0.3)]"></div>
                   </div>
                </div>
                <div className="space-y-3">
                   <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Average Lag</span>
                      <span className="text-xs font-black text-amber-500 italic">14m</span>
                   </div>
                   <div className="w-full h-2 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                      <div className="w-[75%] h-full bg-amber-400 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.3)]"></div>
                   </div>
                </div>
             </div>
             <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100/50">
                <p className="text-[9px] text-gray-400 font-black italic leading-relaxed uppercase tracking-tighter">
                  Real-time telemetry active for all personnel.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
