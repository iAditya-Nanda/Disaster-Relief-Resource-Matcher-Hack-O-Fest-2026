import React, { useEffect, useState } from 'react';
import { supabase } from '../../../supabaseClient';
import { useAuthStore } from '../../../store/authStore';
import { PlusCircle, Search, Filter, Package, ChevronDown } from 'lucide-react';
import { InventoryCard } from '../components/InventoryCard';
import { DeployModal } from '../components/DeployModal';
import truckIcon from '../../../assets/relief_truck_3d.png';

export const Inventory: React.FC = () => {
  const { user } = useAuthStore();
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const categories = ['All', 'Food', 'Water', 'Medicine', 'Shelter', 'Clothing'];

  useEffect(() => {
    fetchResources();
  }, [user]);

  const fetchResources = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .eq('provider_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) setResources(data);
    setLoading(false);
  };

  const filtered = resources.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) || 
                         r.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || r.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 slide-in-from-bottom-4">
      <DeployModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onRefresh={fetchResources} 
      />

      {/* Header Banner */}
      <div className="clay-card p-10 bg-gradient-to-r from-teal-500 to-teal-700 text-white border-none flex items-center justify-between relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:scale-125 transition-transform duration-1000"></div>
         <div className="flex items-center gap-10">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-[32px] p-4 border border-white/30 flex items-center justify-center shadow-2xl">
               <img src={truckIcon} alt="Truck" className="w-full h-full object-contain drop-shadow-2xl" />
            </div>
            <div>
               <h3 className="text-3xl font-black italic tracking-tighter leading-none mb-2">Supply Logistics</h3>
               <p className="text-teal-100 text-xs font-black uppercase tracking-[0.3em]">Resource Matching Engine v4.0</p>
            </div>
         </div>
         <button 
           onClick={() => setIsModalOpen(true)}
           className="bg-white text-teal-700 px-10 py-5 rounded-[24px] font-black text-xs uppercase tracking-widest italic shadow-xl shadow-black/10 hover:scale-105 transition-all flex items-center gap-3"
         >
           <PlusCircle size={18} /> Deploy Inventory
         </button>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col md:flex-row gap-8 justify-between items-center bg-white/50 backdrop-blur-sm p-6 rounded-[30px] border border-gray-100">
        <div className="relative w-full md:w-[450px]">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search regional manifests..." 
            className="w-full pl-16 pr-6 py-5 bg-white border border-gray-100 rounded-[22px] focus:border-teal-300 focus:outline-none clay-card shadow-sm font-black text-xs uppercase tracking-widest text-gray-900 transition-all placeholder:text-gray-300"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between gap-6 w-full md:w-64 px-8 py-5 bg-white border border-gray-100 rounded-[22px] font-black text-[10px] uppercase tracking-widest text-gray-700 clay-card shadow-sm hover:border-teal-200 transition-all active:scale-95"
            >
              <div className="flex items-center gap-3">
                <Filter className={categoryFilter === 'All' ? "text-gray-400" : "text-teal-500"} size={16} />
                <span>Sector: {categoryFilter}</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform text-gray-300 ${isDropdownOpen ? 'rotate-180' : ''}`} strokeWidth={3} />
            </button>

            {isDropdownOpen && (
              <>
                <div className="fixed inset-0 z-[70]" onClick={() => setIsDropdownOpen(false)}></div>
                <div className="absolute top-20 left-0 w-full bg-white border border-gray-100 rounded-[28px] shadow-2xl z-[80] p-3 animate-in fade-in zoom-in-95 duration-200">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setCategoryFilter(cat);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-6 py-4 rounded-[18px] font-black text-[10px] uppercase tracking-widest transition-all mb-1 last:mb-0 ${
                        categoryFilter === cat 
                        ? 'bg-teal-600 text-white shadow-xl shadow-teal-500/20' 
                        : 'text-gray-500 hover:bg-teal-50 hover:text-teal-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
           {[1,2,3,4,5,6].map(i => <div key={i} className="h-72 clay-card bg-gray-50/50 animate-pulse border-none" />)}
        </div>
      ) : filtered.length === 0 ? (
         <div className="clay-card flex flex-col items-center justify-center py-32 bg-white border-gray-50 text-center">
          <div className="w-24 h-24 bg-gray-50 rounded-[32px] flex items-center justify-center mb-8 border border-gray-100 shadow-inner">
            <Package size={48} className="text-gray-200" />
          </div>
          <h3 className="text-xl font-black text-gray-900 italic tracking-tight uppercase tracking-widest">Null Manifest</h3>
          <p className="text-[10px] font-black text-gray-400 max-w-xs mt-4 uppercase tracking-[0.2em] leading-relaxed">
            No integrated resources detected in the current sector. Initialize a new deployment to start tracking.
          </p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="mt-10 text-teal-600 font-black text-[10px] uppercase tracking-[0.3em] hover:tracking-[0.5em] transition-all"
          >
            Deploy First Asset →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pb-20">
          {filtered.map(res => (
            <InventoryCard key={res.id} resource={res} />
          ))}
        </div>
      )}
    </div>
  );
};
