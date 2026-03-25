import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../../supabaseClient';
import { useAuthStore } from '../../../store/authStore';
import axios from 'axios';
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Inbox,
  X,
  Package,
  Activity,
  ChevronRight
} from 'lucide-react';
import { HeaderSkeleton, ItemCardSkeleton } from '../components/Skeleton';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface Resource {
  id: string;
  title: string;
  category: string;
  quantity: number;
  unit: string;
  status: string;
  created_at: string;
}

export default function Inventory() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Food');
  const [quantity, setQuantity] = useState<number>(0);
  const [unit, setUnit] = useState('Units');
  const [submitting, setSubmitting] = useState(false);

  const { session, user } = useAuthStore();

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const headers: Record<string, string> = {};
      if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`;
      if (user?.id) headers['x-test-user-id'] = user.id;

      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setResources(data || []);
    } catch (err) {
      console.error('Error fetching resources:', err);
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  };

  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        
        const headers: Record<string, string> = {};
        if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`;
        if (user?.id) headers['x-test-user-id'] = user.id;

        const res = await axios.post(`${API_URL}/api/resources`, {
          title, category, quantity, unit, lat, lng
        }, { headers });

        if (res.status === 201) {
          setIsModalOpen(false);
          fetchResources();
          setTitle('');
          setQuantity(0);
        }
        setSubmitting(false);
      }, () => {
        alert("Please enable location to add resources.");
        setSubmitting(false);
      });
    } catch (err) {
      console.error('Error adding resource:', err);
      setSubmitting(false);
    }
  };

  const deleteResource = async (id: string) => {
    if (!confirm('Are you sure you want to remove this resource?')) return;
    try {
      const { error } = await supabase.from('resources').delete().eq('id', id);
      if (error) throw error;
      setResources(resources.filter(r => r.id !== id));
    } catch (err) {
      console.error('Error deleting resource:', err);
    }
  };

  const filteredResources = resources.filter(r => 
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-12 pb-20 px-2"
      >
        {loading ? (
          <div className="space-y-12">
            <HeaderSkeleton />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1,2,3,4].map(i => <ItemCardSkeleton key={i} />)}
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row justify-between items-end gap-10">
              <div className="flex flex-col gap-4 flex-1">
                <h2 className="text-[64px] font-black text-slate-900 tracking-[-0.04em] leading-none whitespace-nowrap">
                  Resource <span className="text-blue-600">Hub.</span>
                </h2>
                <p className="text-lg font-medium text-slate-400 tracking-tight leading-relaxed max-w-xl border-l-4 border-blue-600 pl-6 text-xs opacity-80">
                  Real-time Logistical oversight of disaster relief inventory
                </p>
              </div>
              
              <div className="flex items-center gap-4 w-full md:w-auto mb-2">
                 <div className="relative group w-full md:w-80 border-b-2 border-slate-200 focus-within:border-blue-600 transition-colors pb-2">
                    <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      type="text" 
                      placeholder="Filter stock..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-transparent pl-8 pr-4 text-xs font-black tracking-tight outline-none placeholder:text-slate-200"
                    />
                 </div>
                 <button 
                   onClick={() => setIsModalOpen(true)}
                   className="flex items-center gap-3 bg-slate-900 hover:bg-blue-600 text-white px-8 py-5 rounded-[25px] text-[10px] font-black tracking-tight shadow-xl transition-all group shrink-0"
                 >
                   <Plus size={16} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
                   Add Asset
                 </button>
              </div>
            </div>

            {filteredResources.length === 0 ? (
              <div className="h-[400px] flex flex-col items-center justify-center text-center p-12 bg-white rounded-[60px] shadow-sm border border-slate-100">
                <div className="w-24 h-24 bg-slate-50 rounded-[35px] flex items-center justify-center mb-8 shadow-inner border border-white">
                  <Inbox className="text-slate-200" size={32} />
                </div>
                <h3 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Zero Stock.</h3>
                <p className="text-[10px] font-black text-slate-400 max-w-xs leading-relaxed tracking-tight opacity-60">No active assets detected in this node</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredResources.map((res, i) => (
                  <motion.div 
                    key={res.id}
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white rounded-[50px] p-10 flex items-center justify-between group hover:shadow-[0_45px_100px_-20px_rgba(0,0,0,0.08)] transition-all duration-700 relative overflow-hidden border-4 border-transparent hover:border-blue-50"
                  >
                    <div className="flex-1 relative z-10 space-y-6">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-blue-600 bg-blue-50/50 px-4 py-1.5 rounded-full border border-blue-100 tracking-tight">{res.category}</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></div>
                      </div>
                      
                      <h4 className="text-4xl font-black text-slate-900 tracking-tighter leading-none group-hover:text-blue-600 transition-colors">{res.title}</h4>
                      
                      <div className="flex items-center gap-12">
                        <div className="flex flex-col">
                          <p className="text-[10px] font-black text-slate-300 tracking-tight mb-1">Stock Qty.</p>
                          <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black text-slate-900 tracking-tighter leading-none">{res.quantity}</span>
                            <span className="text-xs font-black text-slate-400 tracking-tight">{res.unit}</span>
                          </div>
                        </div>
                        <div className="w-[2px] h-12 bg-slate-50"></div>
                        <div className="flex flex-col">
                           <p className="text-[10px] font-black text-slate-300 tracking-tight mb-1">Terminal</p>
                           <div className="flex items-center gap-2">
                              <Activity size={14} className="text-blue-600" />
                              <span className="text-xs font-black text-slate-900 tracking-tight">Hub-{res.id.slice(0, 3)}</span>
                           </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 relative z-10">
                       <button className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-300 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all border border-slate-100 shadow-sm active:scale-90">
                         <Edit3 size={20} />
                       </button>
                       <button onClick={() => deleteResource(res.id)} className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-300 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all border border-slate-100 shadow-sm active:scale-90">
                         <Trash2 size={20} />
                       </button>
                    </div>
                    
                    <div className="absolute right-[-20px] top-[-20px] opacity-[0.01] group-hover:opacity-[0.06] transition-all duration-1000 rotate-12 group-hover:rotate-0 group-hover:scale-110 pointer-events-none">
                       <Package size={220} strokeWidth={1} />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Add Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-3xl"
              ></motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 100, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 100, scale: 0.95 }}
                className="bg-white w-full max-w-xl rounded-[60px] shadow-2xl relative z-10 overflow-hidden border-8 border-white"
              >
                <div className="p-12 pb-6 flex justify-between items-center border-b border-slate-50">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Add Asset.</h3>
                    <p className="text-[10px] font-black text-slate-400 tracking-tight uppercase">Initialize new resource node</p>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="w-14 h-14 flex items-center justify-center text-slate-200 hover:text-slate-900 bg-slate-50 rounded-2xl transition-all">
                    <X size={28} />
                  </button>
                </div>

                <form onSubmit={handleAddResource} className="p-12 space-y-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-300 tracking-tight px-6 uppercase">Nomenclature</label>
                    <input 
                      type="text" 
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Purified Water Bricks"
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-100 focus:bg-white focus:ring-[15px] focus:ring-blue-500/5 rounded-[30px] py-6 px-10 text-lg font-black transition-all outline-none placeholder:text-slate-200" 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-300 tracking-tight px-6 uppercase">Cluster</label>
                      <select 
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-[30px] py-6 px-10 text-base font-black transition-all outline-none appearance-none cursor-pointer"
                      >
                        <option>Food</option>
                        <option>Medicine</option>
                        <option>Shelter</option>
                        <option>Clothing</option>
                        <option>Water</option>
                        <option>Blood</option>
                      </select>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-300 tracking-tight px-6 uppercase">Metric</label>
                      <input 
                        type="text" 
                        required
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        placeholder="e.g. Liters"
                        className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-[30px] py-6 px-10 text-base font-black transition-all outline-none" 
                      />
                    </div>
                  </div>

                  <div className="bg-slate-50 p-10 rounded-[40px] border-2 border-white shadow-inner">
                     <div className="flex items-center gap-8 justify-between">
                        <div className="flex flex-col">
                           <p className="text-[10px] font-black text-slate-300 tracking-tight uppercase mb-1">Quantity</p>
                           <p className="text-[8px] font-bold text-slate-400 tracking-tighter">Adjustment Mode</p>
                        </div>
                        <div className="flex items-center gap-8">
                          <button type="button" onClick={() => setQuantity(Math.max(0, quantity - 1))} className="w-14 h-14 flex items-center justify-center bg-white border border-slate-100 rounded-2xl hover:bg-slate-900 hover:text-white transition-all text-xl font-black shadow-xl scale-110">-</button>
                          <input type="number" required value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value) || 0)} className="w-32 bg-transparent text-center text-6xl font-black outline-none tracking-tighter" />
                          <button type="button" onClick={() => setQuantity(quantity + 1)} className="w-14 h-14 flex items-center justify-center bg-white border border-slate-100 rounded-2xl hover:bg-slate-900 hover:text-white transition-all text-xl font-black shadow-xl scale-110">+</button>
                        </div>
                     </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full bg-slate-900 hover:bg-blue-600 disabled:opacity-50 text-white py-8 rounded-[35px] text-lg font-black tracking-tight shadow-2xl transition-all flex items-center justify-center gap-6 active:scale-95 group uppercase border-4 border-white/10"
                  >
                    {submitting ? 'Initializing Node...' : (
                      <>
                        <span>Verify & Save</span>
                        <ChevronRight size={24} strokeWidth={3} className="group-hover:translate-x-2 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
