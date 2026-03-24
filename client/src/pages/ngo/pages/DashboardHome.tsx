import React, { useState } from 'react';
import { 
  TrendingUp, Heart, 
  ChevronRight, ArrowUpRight, CheckCircle2,
  AlertCircle, ShieldCheck, Zap, Navigation, Package
} from 'lucide-react';
import { StatsGrid } from '../components/StatsGrid';
import { DeployModal } from '../components/DeployModal';
import heroBg from '../../../assets/dashboard_hero_bg.png';
import truckIcon from '../../../assets/relief_truck_3d.png';
import medIcon from '../../../assets/medical_kit_3d.png';
import volunteerIcon from '../../../assets/volunteer_community_3d.png';

export const DashboardHome: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 slide-in-from-bottom-4">
      {/* Hero Section */}
      <div className="relative h-80 rounded-[40px] overflow-hidden group border border-teal-100/50 shadow-2xl shadow-teal-500/10">
         <img src={heroBg} alt="Background" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
         <div className="absolute inset-0 bg-gradient-to-r from-teal-950/80 via-teal-900/40 to-transparent flex flex-col justify-center px-16">
            <div className="flex items-center gap-3 mb-4 animate-in slide-in-from-left duration-700">
               <div className="px-3 py-1 bg-teal-500/20 backdrop-blur-md rounded-full border border-teal-400/30 flex items-center gap-2">
                  <Zap size={14} className="text-teal-400 fill-teal-400" />
                  <span className="text-[10px] font-black text-teal-100 uppercase tracking-[0.2em]">Operational Excellence</span>
               </div>
            </div>
            <h1 className="text-5xl font-black text-white tracking-tighter italic leading-none mb-6">
               COMMAND <br /> <span className="text-teal-400">CENTER ALPHA</span>
            </h1>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-fit flex items-center gap-4 bg-white text-gray-950 hover:bg-teal-50 px-10 py-5 rounded-[24px] font-black text-xs tracking-[0.2em] transition-all hover:scale-105 shadow-xl shadow-black/20 uppercase italic"
            >
              Initialize Deployment <ArrowUpRight size={18} />
            </button>
         </div>
      </div>

      <StatsGrid />

      <DeployModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onRefresh={() => {}} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {/* Supply Chain Card */}
             <div className="clay-card p-10 group cursor-pointer hover:border-teal-200 transition-all overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 opacity-10 group-hover:opacity-20 transition-opacity p-4">
                   <img src={truckIcon} alt="Truck" className="w-full h-full object-contain" />
                </div>
                <div className="w-16 h-16 bg-teal-50 rounded-[24px] flex items-center justify-center mb-8 border border-teal-100 shadow-inner group-hover:rotate-6 transition-transform">
                   <Package size={28} className="text-teal-600" />
                </div>
                <h3 className="text-2xl font-black text-gray-950 mb-3 italic tracking-tight">Active Logistics</h3>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest leading-relaxed mb-8">
                   Monitoring 12 regional distribution clusters across Sector 7.
                </p>
                <div className="flex items-center gap-3 text-teal-600 text-[10px] font-black uppercase tracking-widest">
                   Live Tracking <Navigation size={12} className="animate-pulse" />
                </div>
             </div>

             {/* Medical Card */}
             <div className="clay-card p-10 group cursor-pointer hover:border-red-200 transition-all overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 opacity-10 group-hover:opacity-20 transition-opacity p-4">
                   <img src={medIcon} alt="Medical" className="w-full h-full object-contain" />
                </div>
                <div className="w-16 h-16 bg-red-50 rounded-[24px] flex items-center justify-center mb-8 border border-red-100 shadow-inner group-hover:-rotate-6 transition-transform">
                   <Heart size={28} className="text-red-500 fill-red-500/10" />
                </div>
                <h3 className="text-2xl font-black text-gray-950 mb-3 italic tracking-tight">Health Triage</h3>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest leading-relaxed mb-8">
                   42 medical kits ready for air-drop in high-altitude zones.
                </p>
                <div className="flex items-center gap-3 text-red-500 text-[10px] font-black uppercase tracking-widest">
                   Urgent Status <AlertCircle size={12} className="animate-bounce" />
                </div>
             </div>

             {/* Volunteers Summary */}
             <div className="clay-card col-span-full p-10 flex flex-col md:flex-row items-center gap-10 hover:border-amber-200 transition-all relative overflow-hidden group">
                <div className="w-40 h-40 shrink-0 p-4 bg-amber-50 rounded-[40px] border border-amber-100 shadow-inner group-hover:scale-110 transition-transform duration-500">
                   <img src={volunteerIcon} alt="Volunteers" className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all" />
                </div>
                <div className="flex-1">
                   <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[9px] font-black uppercase tracking-widest">Personnel Sync</span>
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
                   </div>
                   <h3 className="text-3xl font-black text-gray-950 mb-4 italic tracking-tighter leading-none">Community Backbone</h3>
                   <p className="text-sm text-gray-500 font-medium mb-8 max-w-lg leading-relaxed">
                      Our volunteer network has grown by <span className="text-teal-600 font-bold">14% this week</span>. Coordination protocols are optimized for rapid response in Shimla & Beas Valley.
                   </p>
                   <div className="flex items-center gap-12">
                      <div>
                         <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Active Now</p>
                         <p className="text-2xl font-black italic">1,204</p>
                      </div>
                      <div className="w-[1px] h-10 bg-gray-100"></div>
                      <div>
                         <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Response Time</p>
                         <p className="text-2xl font-black italic text-amber-500">8.2m</p>
                      </div>
                   </div>
                </div>
                <ChevronRight className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-200 group-hover:text-teal-500 transition-colors" size={40} />
             </div>
          </div>
        </div>

        {/* Right Side Stack */}
        <div className="space-y-10">
           {/* System Health Console */}
           <div className="clay-card bg-gray-950 text-white p-10 border-none relative overflow-hidden group">
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-teal-500/10 rounded-full blur-[100px] group-hover:bg-teal-500/20 transition-all"></div>
              <p className="text-[10px] font-black text-teal-500 uppercase tracking-[0.4em] mb-10">Neural Engine Status</p>
              
              <div className="space-y-8">
                 {[
                   { label: "AI Matcher", icon: ShieldCheck, val: 99.8 },
                   { label: "GPS Mesh", icon: Navigation, val: 94.2 },
                   { label: "Relief Cloud", icon: CheckCircle2, val: 100 }
                 ].map((item, idx) => (
                   <div key={idx} className="space-y-3">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                         <span className="flex items-center gap-2">
                            <item.icon size={12} className="text-gray-500" />
                            {item.label}
                         </span>
                         <span className={item.val === 100 ? 'text-teal-500' : 'text-white'}>{item.val}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                         <div className="h-full bg-teal-500 rounded-full" style={{ width: `${item.val}%` }}></div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* Metrics Highlight */}
           <div className="clay-card p-10 bg-teal-600 text-white border-none shadow-2xl shadow-teal-500/30 group">
              <p className="text-[10px] font-black text-teal-100 uppercase tracking-[0.3em] mb-6">Total Impact</p>
              <div className="flex items-baseline gap-2 mb-2 group-hover:translate-x-1 transition-transform">
                 <span className="text-4xl font-black italic">14,302</span>
                 <ArrowUpRight size={24} className="text-teal-300" />
              </div>
              <p className="text-xs font-bold text-teal-100 opacity-70">Lives Supported Today</p>
           </div>

           {/* Quick Feedback Card */}
           <div className="clay-card p-8 bg-white border border-gray-100 flex items-center justify-between group hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-teal-600 transition-colors">
                    <TrendingUp size={24} />
                 </div>
                 <div>
                    <h4 className="text-xs font-black text-gray-950 uppercase tracking-widest">Growth Analytics</h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Real-time reports</p>
                 </div>
              </div>
              <ChevronRight size={18} className="text-gray-200 group-hover:text-gray-400 transition-colors" />
           </div>
        </div>
      </div>
    </div>
  );
};
