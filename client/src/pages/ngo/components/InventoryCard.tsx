import React from 'react';
import { Navigation, Box, Zap } from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  category: string;
  quantity: number;
  status: string;
}

interface InventoryCardProps {
  resource: Resource;
}

export const InventoryCard: React.FC<InventoryCardProps> = ({ resource }) => {
  return (
    <div className="clay-card p-8 group cursor-pointer hover:border-teal-200 transition-all relative overflow-hidden flex flex-col h-72">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-teal-500/5 rounded-full blur-3xl group-hover:bg-teal-500/10 transition-all"></div>
      
      <div className="flex justify-between items-start mb-6 relative">
         <div className="w-16 h-16 bg-gray-50 rounded-[22px] flex items-center justify-center border border-gray-100 shadow-inner group-hover:scale-110 group-hover:bg-white transition-all duration-500">
            <Box size={28} className="text-gray-400 group-hover:text-teal-600" />
         </div>
         <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-colors ${
           resource.status === 'available' 
           ? 'text-teal-600 bg-teal-50 border-teal-100 shadow-sm shadow-teal-500/5' 
           : 'text-amber-600 bg-amber-50 border-amber-100 shadow-sm shadow-amber-500/5'
         }`}>
           {resource.status}
         </div>
      </div>

      <div className="flex-1">
         <h3 className="text-2xl font-black text-gray-950 mb-2 italic tracking-tight line-clamp-1">{resource.title}</h3>
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-gray-50 rounded-md border border-gray-100">
               <Zap size={10} className="text-teal-500" />
               <span className="text-[10px] font-black text-gray-950">{resource.quantity}</span>
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{resource.category}</span>
         </div>
      </div>
      
      <button 
        onClick={() => alert(`Tracking distribution for: ${resource.title}\nFeature: Logistics ID ${resource.id}`)}
        className="w-full flex items-center justify-center gap-3 bg-gray-50 hover:bg-teal-600 text-gray-400 hover:text-white font-black py-4 rounded-[20px] transition-all border border-gray-100 hover:border-teal-600 text-[10px] tracking-[0.2em] uppercase italic group-hover:shadow-xl group-hover:shadow-teal-500/10"
      >
        <Navigation size={16} /> Manage Logic
      </button>
    </div>
  );
};
