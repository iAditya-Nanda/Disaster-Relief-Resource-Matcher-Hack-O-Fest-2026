import React, { useState } from 'react';
import { Camera, Map, Mail, BellRing, ShieldAlert, Key, Globe, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';

export const Settings: React.FC = () => {
  const { user } = useAuthStore();
  const [showKey, setShowKey] = useState(false);

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 slide-in-from-bottom-4 pb-20 max-w-6xl mx-auto">
      {/* Header Profile Card */}
      <div className="flex flex-col md:flex-row items-center gap-12 clay-card bg-white p-12 border border-gray-100 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-50 rounded-full blur-[100px] -mr-40 -mt-40 opacity-50 group-hover:scale-125 transition-transform duration-1000"></div>
        
        <div className="relative">
          <div className="w-48 h-48 rounded-[3rem] bg-gradient-to-br from-teal-500 to-teal-700 p-1.5 shadow-2xl shadow-teal-500/30 group-hover:rotate-3 transition-transform duration-500">
            <div className="w-full h-full bg-white rounded-[2.8rem] flex items-center justify-center text-teal-600 overflow-hidden relative border-4 border-white">
              <span className="text-7xl font-black italic">{user?.email?.charAt(0).toUpperCase()}</span>
            </div>
          </div>
          <button 
            onClick={() => alert('Launching photo uploader...')}
            className="absolute -bottom-2 -right-2 bg-black text-white p-4 rounded-3xl shadow-2xl border-4 border-white hover:scale-110 active:scale-90 transition-all cursor-pointer"
          >
            <Camera size={24} />
          </button>
        </div>

        <div className="text-center md:text-left space-y-4 relative">
          <div className="inline-flex items-center gap-2 bg-teal-50 px-4 py-1.5 rounded-full border border-teal-100 mb-2">
            <CheckCircle2 size={16} className="text-teal-600" />
            <span className="text-[10px] font-black text-teal-700 uppercase tracking-widest">Verified Relief Agency</span>
          </div>
          <h2 className="text-5xl font-black text-gray-950 tracking-tighter leading-none italic">{user?.user_metadata?.full_name || 'Himachal Aid Org'}</h2>
          <p className="text-gray-400 font-bold text-base tracking-tight">{user?.email}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-6">
             <div className="flex items-center gap-2 text-[11px] font-black text-gray-500 uppercase tracking-widest">
                <Globe size={16} className="text-teal-500" /> Region: <span className="text-gray-950">Himachal Pradesh</span>
             </div>
             <div className="flex items-center gap-2 text-[11px] font-black text-gray-500 uppercase tracking-widest">
                <ShieldAlert size={16} className="text-amber-500" /> Protocol: <span className="text-gray-950">HP-RELIEF-2026</span>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Account Details & Security */}
        <div className="lg:col-span-2 space-y-10">
          <div className="clay-card bg-white p-10 border border-gray-100 shadow-sm space-y-10">
            <div className="flex items-center justify-between border-b border-gray-50 pb-8">
               <h3 className="text-2xl font-black text-gray-950 tracking-tight flex items-center gap-4 italic">
                 <Mail size={24} className="text-teal-600" /> Agency Identity
               </h3>
               <button className="text-[11px] font-black text-teal-600 border border-teal-100 px-4 py-2 rounded-xl hover:bg-teal-50 uppercase tracking-widest transition-colors">Edit Profile</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">Official Manifest Name</label>
                  <div className="p-5 bg-gray-50/50 rounded-2xl border border-gray-100 text-gray-950 font-black text-sm">{user?.user_metadata?.full_name}</div>
               </div>
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">Command Liaison</label>
                  <div className="p-5 bg-gray-50/50 rounded-2xl border border-gray-100 text-gray-950 font-black text-sm italic">Coordinator Beta-1</div>
               </div>
               <div className="md:col-span-2 space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">Encrypted Communication Channel</label>
                  <div className="p-5 bg-gray-50/50 rounded-2xl border border-gray-100 text-gray-950 font-black text-sm">{user?.email}</div>
               </div>
            </div>
          </div>

          <div className="clay-card bg-white p-10 border border-gray-100 shadow-sm space-y-8">
             <h3 className="text-2xl font-black text-gray-950 tracking-tight flex items-center gap-4 italic">
               <Key size={24} className="text-amber-500" /> Master Credentials
             </h3>
             <div className="space-y-6">
                <div className="p-6 bg-gradient-to-r from-gray-50 to-white rounded-[24px] border border-gray-100 flex items-center justify-between group">
                   <div className="space-y-1">
                      <h4 className="text-sm font-black text-gray-950">Neural Link Access</h4>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Validated: T-Minus 72h</p>
                   </div>
                   <div className="flex items-center gap-4">
                      <code className="text-xs font-mono font-black text-amber-900 bg-amber-50 px-4 py-2 rounded-xl border border-amber-100 shadow-inner">
                         {showKey ? 'hp_live_942x_relay_v2' : '••••••••••••••••'}
                      </code>
                      <button 
                        onClick={() => setShowKey(!showKey)}
                        className="p-3 bg-white rounded-2xl border border-gray-100 text-gray-400 hover:text-teal-600 shadow-sm transition-all hover:scale-105"
                      >
                         {showKey ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                   </div>
                </div>
                <button className="flex items-center gap-2 text-[10px] font-black text-amber-600 hover:text-amber-700 transition-all uppercase tracking-[0.2em] pl-1 group">
                   Update Cipher Key <span className="group-hover:translate-x-2 transition-transform">→</span>
                </button>
             </div>
          </div>
        </div>

        {/* Right Column: Preferences & Regional */}
        <div className="space-y-10">
           <div className="clay-card bg-gray-950 text-white p-10 border-none relative overflow-hidden group shadow-2xl shadow-gray-950/20">
               <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-[100px] group-hover:scale-125 transition-transform duration-1000"></div>
               <h4 className="text-[10px] font-black text-teal-500 uppercase tracking-[0.4em] mb-8 italic">Neural Command Prefs</h4>
               <div className="space-y-8">
                  <div className="flex items-center justify-between group/row">
                     <span className="text-sm font-black text-teal-50 transition-colors group-hover/row:text-white uppercase tracking-tight">Auto-Alert Sync</span>
                     <div className="w-14 h-7 bg-teal-600 rounded-full relative p-1.5 cursor-pointer shadow-inner shadow-black/20">
                        <div className="w-4 h-4 bg-white rounded-full absolute right-1.5 shadow-sm"></div>
                     </div>
                  </div>
                  <div className="flex items-center justify-between group/row">
                     <span className="text-sm font-black text-teal-50 transition-colors group-hover/row:text-white uppercase tracking-tight">Geo-Fence Map</span>
                     <div className="w-14 h-7 bg-teal-600 rounded-full relative p-1.5 cursor-pointer shadow-inner shadow-black/20">
                        <div className="w-4 h-4 bg-white rounded-full absolute right-1.5 shadow-sm"></div>
                     </div>
                  </div>
                  <div className="flex items-center justify-between opacity-30 cursor-not-allowed">
                     <span className="text-sm font-black italic uppercase tracking-tight">Deep Triage AI</span>
                     <div className="w-14 h-7 bg-gray-800 rounded-full relative p-1.5">
                        <div className="w-4 h-4 bg-gray-600 rounded-full"></div>
                     </div>
                  </div>
               </div>
           </div>

           <div className="clay-card p-10 space-y-10 bg-white border-gray-100">
             <h3 className="text-2xl font-black text-gray-950 tracking-tight flex items-center gap-4 italic">
               <BellRing size={24} className="text-amber-500" /> Notifications
             </h3>
             <div className="space-y-5">
                <div className="flex items-center justify-between p-6 bg-gray-50/50 rounded-2xl border border-gray-100 group hover:border-teal-200 transition-all cursor-pointer">
                   <div className="flex items-center gap-4">
                     <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 group-hover:text-teal-500">
                       <Map size={20} />
                     </div>
                     <span className="font-black text-[11px] text-gray-800 uppercase tracking-widest leading-none">Radius Comms</span>
                   </div>
                   <span className="text-[10px] font-black text-teal-700 bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-100 italic">50.0KM</span>
                </div>
                <div className="flex items-center justify-between p-6 bg-gray-50/50 rounded-2xl border border-gray-100 group hover:border-amber-400 transition-all cursor-pointer">
                   <div className="flex items-center gap-4">
                     <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 group-hover:text-amber-500">
                       <ShieldAlert size={20} />
                     </div>
                     <span className="font-black text-[11px] text-gray-800 uppercase tracking-widest leading-none">Priority SMS</span>
                   </div>
                   <span className="text-[10px] font-black text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100 italic">SYNCED</span>
                </div>
             </div>
             <button 
               onClick={() => alert('All system parameters synced to relief cloud.')}
               className="w-full bg-teal-600 hover:bg-teal-700 text-white font-black py-6 rounded-[28px] shadow-2xl shadow-teal-600/20 transition-all hover:scale-[1.02] active:scale-95 text-xs uppercase tracking-[0.3em] italic"
             >
               Finalize Params
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};
