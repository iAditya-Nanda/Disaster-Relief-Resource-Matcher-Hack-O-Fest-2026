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
  ArrowRight,
  Inbox,
  X,
  MapPin,
  Package
} from 'lucide-react';

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
  
  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Food');
  const [quantity, setQuantity] = useState(0);
  const [unit, setUnit] = useState('Units');
  const [submitting, setSubmitting] = useState(false);

  const { session } = useAuthStore();

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setResources(data || []);
    } catch (err) {
      console.error('Error fetching resources:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        
        const res = await axios.post(`${API_URL}/api/resources`, {
          title, category, quantity, unit, lat, lng
        }, {
          headers: { Authorization: `Bearer ${session?.access_token}` }
        });

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
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12 pb-20 px-4"
    >
      <div className="flex flex-col md:flex-row justify-between items-end gap-10">
        <div className="flex flex-col gap-4 flex-1">
          <h2 className="text-6xl font-black text-slate-900 tracking-[-0.04em] leading-tight">
            Aid Stock.
          </h2>
          <p className="text-lg font-medium text-slate-400 tracking-tight leading-relaxed max-w-xl border-l-4 border-blue-500 pl-6">
            Logistical oversight of disaster relief inventory. Manage and track essential supplies across all regional hubs.
          </p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto mb-2">
           <div className="relative group w-full md:w-80">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Search stock..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-100 focus:border-blue-200 focus:ring-[8px] focus:ring-blue-500/5 rounded-full py-4 pl-14 pr-6 text-sm font-semibold transition-all outline-none"
              />
           </div>
           <button 
             onClick={() => setIsModalOpen(true)}
             className="flex items-center gap-3 bg-[#2F5FE3] hover:bg-blue-600 text-white px-8 py-4 rounded-full text-xs font-black tracking-widest shadow-lg shadow-blue-500/20 transition-all uppercase border-2 border-white shrink-0"
           >
             <Plus size={18} strokeWidth={3} />
             Add Resource
           </button>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredResources.length === 0 ? (
        <div className="h-[400px] flex flex-col items-center justify-center text-center p-12 bg-white rounded-[50px] shadow-sm border border-slate-50">
          <div className="w-24 h-24 bg-slate-50 rounded-[35px] flex items-center justify-center mb-8 shadow-inner">
            <Inbox className="text-slate-200" size={40} />
          </div>
          <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-4 italic uppercase">Empty Stock.</h3>
          <p className="text-base text-slate-400 font-bold max-w-sm tracking-tight opacity-60">No active relief assets found in this sector.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatePresence>
            {filteredResources.map((res, i) => (
              <motion.div 
                key={res.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-[45px] p-8 flex items-center justify-between group hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] transition-all duration-700 relative overflow-hidden border border-transparent hover:border-blue-50"
              >
                <div className="flex-1 relative z-10 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 tracking-widest uppercase">{res.category}</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50"></div>
                  </div>
                  
                  <h4 className="text-3xl font-black text-slate-900 tracking-tight leading-none group-hover:text-blue-700 transition-colors uppercase">{res.title}</h4>
                  
                  <div className="flex items-center gap-8 pt-2">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-slate-300 tracking-widest uppercase">Stock qty.</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-black text-slate-900 tracking-tighter leading-none">{res.quantity}</span>
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">{res.unit}</span>
                      </div>
                    </div>
                    <div className="w-[1px] h-10 bg-slate-100"></div>
                    <div className="space-y-1">
                       <p className="text-[9px] font-black text-slate-300 tracking-widest uppercase">Location</p>
                       <div className="flex items-center gap-2">
                          <MapPin size={12} className="text-red-500" />
                          <span className="text-xs font-black text-slate-900">Hub {res.id.slice(0, 4)}</span>
                       </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 relative z-10">
                  <button className="w-12 h-12 rounded-[18px] bg-slate-50 text-slate-200 flex items-center justify-center hover:bg-black hover:text-white transition-all border border-slate-100 shadow-sm">
                    <Edit3 size={18} />
                  </button>
                  <button onClick={() => deleteResource(res.id)} className="w-12 h-12 rounded-[18px] bg-slate-50 text-slate-200 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all border border-slate-100 shadow-sm">
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <div className="absolute right-0 top-0 h-full w-40 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity pointer-events-none p-8 flex items-center justify-center">
                   <Package size={120} strokeWidth={1} className="rotate-12 group-hover:rotate-6 transition-transform duration-1000" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl"
            ></motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white w-full max-w-lg rounded-[50px] shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="p-10 pb-6 flex justify-between items-center bg-slate-50/50 border-b border-slate-100">
                <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-none italic uppercase">New Resource.</h3>
                <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 flex items-center justify-center text-slate-300 hover:text-slate-900 hover:bg-white rounded-full transition-all">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAddResource} className="p-10 space-y-8">
                <div className="space-y-3">
                  <label className="text-[9px] font-black text-slate-300 tracking-widest px-4 uppercase">Item Name</label>
                  <input 
                    type="text" 
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Medical Kits"
                    className="w-full bg-slate-50 border border-slate-100 focus:border-blue-200 focus:bg-white focus:ring-[8px] focus:ring-blue-500/5 rounded-full py-5 px-8 text-base font-bold transition-all outline-none" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[9px] font-black text-slate-300 tracking-widest px-4 uppercase">Category</label>
                    <select 
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 focus:border-blue-200 focus:bg-white rounded-full py-5 px-8 text-base font-bold transition-all outline-none appearance-none cursor-pointer"
                    >
                      <option>Food</option>
                      <option>Medicine</option>
                      <option>Shelter</option>
                      <option>Clothing</option>
                      <option>Water</option>
                      <option>Blood</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[9px] font-black text-slate-300 tracking-widest px-4 uppercase">Quantity Unit</label>
                    <input 
                      type="text" 
                      required
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      placeholder="e.g. Boxes"
                      className="w-full bg-slate-50 border border-slate-100 focus:border-blue-200 focus:bg-white rounded-full py-5 px-8 text-base font-bold transition-all outline-none" 
                    />
                  </div>
                </div>

                <div className="bg-slate-50/50 p-8 rounded-[35px] border border-slate-100">
                   <div className="flex items-center gap-8 justify-between">
                      <p className="text-[9px] font-black text-slate-300 tracking-widest uppercase">Stock Quantity</p>
                      <div className="flex items-center gap-6">
                        <button type="button" onClick={() => setQuantity(Math.max(0, quantity - 1))} className="w-12 h-12 flex items-center justify-center bg-white border border-slate-100 rounded-2xl hover:bg-slate-900 hover:text-white transition-all text-xl font-black shadow-sm">-</button>
                        <input type="number" required value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value) || 0)} className="w-20 bg-transparent text-center text-4xl font-black outline-none no-spinner" />
                        <button type="button" onClick={() => setQuantity(quantity + 1)} className="w-12 h-12 flex items-center justify-center bg-white border border-slate-100 rounded-2xl hover:bg-slate-900 hover:text-white transition-all text-xl font-black shadow-sm">+</button>
                      </div>
                   </div>
                </div>

                <button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full bg-slate-900 hover:bg-blue-600 disabled:opacity-50 text-white py-6 rounded-full text-base font-black tracking-widest shadow-xl transition-all flex items-center justify-center gap-4 active:scale-95 group uppercase border-2 border-transparent hover:border-blue-100"
                >
                  {submitting ? 'Saving...' : (
                    <>
                      <span>Save Resource</span>
                      <ArrowRight size={22} strokeWidth={3} className="group-hover:translate-x-2 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
