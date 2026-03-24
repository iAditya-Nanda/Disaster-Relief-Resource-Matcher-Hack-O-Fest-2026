import React from 'react';
import { TrendingUp, AlertTriangle, Activity, Users } from 'lucide-react';

export const StatsGrid: React.FC = () => {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      <div className="clay-card bg-teal-500 text-white border-none shadow-[inset_2px_2px_5px_rgba(255,255,255,0.3),_4px_10px_20px_rgba(20,184,166,0.3)]">
        <div className="bg-white/20 p-2 rounded-2xl w-fit mb-4">
          <TrendingUp size={24} className="text-white" />
        </div>
        <h3 className="text-4xl font-black mb-1">1,204</h3>
        <p className="text-teal-100 font-medium text-sm">Items Dispatched</p>
        <div className="mt-4 text-xs font-bold bg-white/10 py-1 px-2 rounded-lg w-fit">
          ↑ 12% this week
        </div>
      </div>

      <div className="clay-card bg-amber-400 text-amber-950 border-none shadow-[inset_2px_2px_5px_rgba(255,255,255,0.5),_4px_10px_20px_rgba(251,191,36,0.3)]">
        <div className="bg-white/30 p-2 rounded-2xl w-fit mb-4">
          <AlertTriangle size={24} className="text-amber-900" />
        </div>
        <h3 className="text-4xl font-black mb-1">37</h3>
        <p className="text-amber-900 font-bold opacity-80 text-sm">Urgent SOS Flags</p>
        <div className="mt-4 text-xs font-bold bg-black/10 py-1 px-2 rounded-lg w-fit">
          Requires Action
        </div>
      </div>

      <div className="clay-card bg-blue-50 border-blue-100 shadow-sm border flex flex-col">
        <div className="bg-blue-200/50 p-2 rounded-2xl w-fit mb-4">
          <Activity size={24} className="text-blue-700" />
        </div>
        <h3 className="text-4xl font-black text-blue-900 mb-1">89%</h3>
        <p className="text-blue-700 font-bold opacity-80 text-sm">Sync Efficiency</p>
        <div className="mt-4 w-full bg-blue-100 h-1.5 rounded-full overflow-hidden">
          <div className="bg-blue-500 h-full w-[89%]" />
        </div>
      </div>

      <div className="clay-card bg-white shadow-sm border border-gray-100 flex flex-col">
        <div className="bg-gray-100 p-2 rounded-2xl w-fit mb-4">
          <Users size={24} className="text-gray-600" />
        </div>
        <h3 className="text-4xl font-black text-gray-900 mb-1">24</h3>
        <p className="text-gray-500 font-bold opacity-80 text-sm">Active Volunteers</p>
        <div className="mt-4 flex -space-x-2">
           {[1,2,3,4].map(i => (
             <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-600">
               P{i}
             </div>
           ))}
           <div className="w-8 h-8 rounded-full bg-teal-50 border-2 border-white flex items-center justify-center text-[10px] font-bold text-teal-600">
             +20
           </div>
        </div>
      </div>
    </section>
  );
};
