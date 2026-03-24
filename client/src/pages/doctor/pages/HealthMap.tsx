import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  ShieldCheck, 
  Map as MapIcon, 
  Zap,
  Microscope
} from 'lucide-react';
import { HeaderSkeleton, MapSkeleton } from '../components/Skeleton';

const outbreakClusters = [
  { id: 1, pos: [31.1048, 77.1734], radius: 2000, color: 'red', name: 'Mandi Sector 7 cluster', symptoms: 'Severe Dehydration/Cholera risk', urgency: 'CRITICAL' },
  { id: 2, pos: [32.2190, 76.3234], radius: 1500, color: 'orange', name: 'Kangra Hub cluster', symptoms: 'Viral Fever/Rashes', urgency: 'MODERATE' },
];

export default function HealthMap() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-10 pb-20 px-4">
          <HeaderSkeleton />
          <MapSkeleton />
        </motion.div>
      ) : (
        <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10 pb-20 px-2 text-display">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
            <div className="space-y-2">
              <h2 className="text-[64px] font-black text-slate-900 tracking-[-0.04em] leading-none whitespace-nowrap">
                Live <span className="text-rose-600">Map.</span>
              </h2>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest border-l-4 border-rose-600 pl-4 mt-2 max-w-lg">View disease trends in your area</p>
            </div>
            
            <div className="flex gap-4 items-center bg-rose-50 border border-rose-100 p-4 rounded-[30px] shadow-sm">
               <Zap className="text-rose-600 animate-pulse" size={20} />
               <p className="text-[10px] font-black text-rose-600 tracking-widest uppercase italic leading-none">Live data active</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 h-[700px]">
            <div className="lg:col-span-9 bg-white border-8 border-white shadow-2xl rounded-[60px] overflow-hidden relative group">
              <MapContainer 
                center={[31.1048, 77.1734]} 
                zoom={9} 
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
              >
                <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                {outbreakClusters.map(cluster => (
                  <Circle key={cluster.id} center={cluster.pos as [number, number]} radius={cluster.radius} pathOptions={{ color: cluster.color, fillColor: cluster.color, fillOpacity: 0.2 }}>
                    <Popup>
                        <div className="p-2 space-y-1">
                          <p className="font-black text-slate-900 uppercase tracking-tight m-0">{cluster.name}</p>
                          <p className="text-[10px] text-rose-600 font-bold m-0 uppercase tracking-widest">{cluster.symptoms}</p>
                        </div>
                    </Popup>
                  </Circle>
                ))}
              </MapContainer>
            </div>

            <div className="lg:col-span-3 space-y-6 flex flex-col">
              <div className="bg-rose-600 p-8 rounded-[50px] text-white space-y-8 flex-1 relative overflow-hidden group shadow-2xl">
                  <div className="relative z-10 space-y-6">
                    <div className="w-16 h-16 bg-white rounded-[24px] flex items-center justify-center shadow-lg text-rose-600 shadow-rose-900/40 group-hover:rotate-12 transition-transform duration-500">
                        <Microscope size={32}/>
                    </div>
                    <h3 className="text-3xl font-black text-white tracking-tighter leading-tight uppercase m-0">Area <br/> Check.</h3>
                    <div className="flex items-center gap-4 border-l-2 border-white/20 pl-4 py-2">
                        <div className="text-white flex-1">
                          <p className="text-[8px] font-black uppercase tracking-widest opacity-60 m-0 leading-none">Risk Status</p>
                          <p className="text-xl font-black uppercase tracking-tight m-0 mt-1">LOW RISK</p>
                        </div>
                        <ShieldCheck className="text-white/40" size={32}/>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
