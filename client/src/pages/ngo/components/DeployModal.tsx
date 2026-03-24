import React, { useState } from 'react';
import { X, Package, Layers, MapPin, Send } from 'lucide-react';
import { supabase } from '../../../supabaseClient';
import { useAuthStore } from '../../../store/authStore';

interface DeployModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

export const DeployModal: React.FC<DeployModalProps> = ({ isOpen, onClose, onRefresh }) => {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    title: '',
    category: 'Food',
    quantity: 1,
    unit: 'Units',
    lat: 31.1048, // Default Shimla
    lng: 77.1734
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    console.log('Deploying resource:', formData);

    try {
      const { error } = await supabase.from('resources').insert([{
        provider_id: user?.id,
        title: formData.title,
        category: formData.category,
        quantity: formData.quantity,
        unit: formData.unit,
        location: `POINT(${formData.lng} ${formData.lat})`,
        status: 'available'
      }]);

      if (error) {
        console.error('Database insertion error:', error);
        // If in Dev Bypass mode, we'll simulate success since the DB might not be reachable
        if (user?.id === 'dev_user') {
          console.warn('Simulating success in Dev Mode');
          alert(`DEMO SUCCESS: "${formData.title}" deployed! (Bypassed DB check)`);
          onRefresh();
          onClose();
        } else {
          alert(`DB Error: ${error.message}`);
        }
      } else {
        alert('Resource successfully deployed to Himachal relief units!');
        onRefresh();
        onClose();
      }
    } catch (err: any) {
      console.error('Submit execution failed:', err);
      // Fallback for demo
      if (user?.id === 'dev_user') {
        alert(`DEMO SUCCESS: "${formData.title}" deployed! (Bypassed network error)`);
        onRefresh();
        onClose();
      } else {
        alert('Network Error: Could not reach the relief database.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
      <div className="absolute inset-0 bg-teal-900/40 backdrop-blur-md" onClick={onClose} />
      
      <div className="clay-card bg-white w-full max-w-xl relative p-8 md:p-12 overflow-y-auto max-h-[90vh] shadow-2xl animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors">
          <X size={24} className="text-gray-400" />
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-teal-100 rounded-2xl flex items-center justify-center">
            <Package size={28} className="text-teal-600" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-gray-950 tracking-tighter italic">Deploy Resource</h2>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Relief Logistics System</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Resource Title</label>
              <input 
                required
                className="w-full px-5 py-3 tracking-tight bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-teal-500/10 focus:outline-none clay-card font-bold text-gray-950"
                placeholder="e.g. 500 Blankets for Kullu"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Category</label>
              <select 
                className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-teal-500/10 focus:outline-none clay-card font-bold text-gray-950 appearance-none"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                <option>Food</option>
                <option>Water</option>
                <option>Medicine</option>
                <option>Shelter</option>
                <option>Clothing</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Quantity</label>
              <div className="flex gap-2">
                <input 
                  type="number"
                  className="flex-1 px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-teal-500/10 focus:outline-none clay-card font-bold text-gray-950"
                  value={formData.quantity}
                  onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})}
                />
              </div>
            </div>

            <div className="space-y-2">
               <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Latitude</label>
               <div className="flex items-center bg-gray-50 border border-gray-100 rounded-2xl px-4 clay-card">
                 <MapPin size={18} className="text-gray-400" />
                 <input 
                   className="w-full py-3 bg-transparent pl-2 focus:outline-none font-bold text-gray-800"
                   value={formData.lat}
                   onChange={e => setFormData({...formData, lat: parseFloat(e.target.value)})}
                 />
               </div>
            </div>

            <div className="space-y-2">
               <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Longitude</label>
               <div className="flex items-center bg-gray-50 border border-gray-100 rounded-2xl px-4 clay-card">
                 <MapPin size={18} className="text-gray-400" />
                 <input 
                   className="w-full py-3 bg-transparent pl-2 focus:outline-none font-bold text-gray-800"
                   value={formData.lng}
                   onChange={e => setFormData({...formData, lng: parseFloat(e.target.value)})}
                 />
               </div>
            </div>
          </div>

          <div className="bg-teal-50 p-6 rounded-3xl border border-teal-100 flex items-start gap-4">
            <Layers className="text-teal-600 shrink-0" size={24} />
            <p className="text-[11px] font-bold text-teal-800/70 tracking-tight leading-relaxed">
              By deploying this resource, it will become SEMANTICALLY VISIBLE to matching algorithms. Field workers in the specified coordinates will receive auto-triage alerts if their needs match this category.
            </p>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-black py-5 rounded-3xl shadow-xl shadow-teal-500/30 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
          >
            {loading ? 'DEPLOYING...' : <><Send size={20} /> INITIATE DEPLOYMENT</>}
          </button>
        </form>
      </div>
    </div>
  );
};
