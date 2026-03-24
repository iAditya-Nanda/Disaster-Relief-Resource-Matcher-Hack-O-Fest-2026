import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LogOut,
  Stethoscope,
  Activity,
  Map,
  Users
} from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';

const menuItems = [
  { id: 'dashboard', label: 'Overview', icon: Stethoscope, path: '/doctor' },
  { id: 'queue', label: 'Triage Queue', icon: Activity, path: '/doctor/queue' },
  { id: 'map', label: 'Health Map', icon: Map, path: '/doctor/map' },
  { id: 'patients', label: 'Patient Logs', icon: Users, path: '/doctor/patients' },
];

interface SidebarProps {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const { signOut } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const navVariants = {
    open: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
    closed: { transition: { staggerChildren: 0.03, staggerDirection: -1 } }
  };

  const itemVariants = {
    open: { x: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 30 } },
    closed: { x: -20, opacity: 0, transition: { duration: 0.2, ease: 'easeIn' as const } }
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 340 : 110 }}
      transition={{ type: 'spring', stiffness: 200, damping: 28 }}
      className="bg-white h-screen flex flex-col relative z-20 shrink-0 border-r border-slate-200 shadow-xl shadow-slate-200/50"
    >
      <div className="p-8 flex items-center h-32 whitespace-nowrap overflow-hidden">
        <div
          onClick={() => navigate('/doctor')}
          className="w-16 h-16 bg-rose-600 rounded-[22px] flex items-center justify-center shadow-lg shadow-rose-500/20 border-2 border-white shrink-0 relative z-10 cursor-pointer active:scale-95 transition-transform"
        >
          <Stethoscope className="text-white" size={32} />
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="ml-6 flex items-baseline cursor-default"
            >
              <span className="text-slate-900 text-2xl font-black tracking-tighter leading-none whitespace-nowrap">Sahayata</span>
              <span className="text-xl font-black text-rose-600 tracking-tighter italic ml-0.5">-Doctor</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.nav
        variants={navVariants}
        animate={isOpen ? "open" : "closed"}
        className="flex-1 px-6 py-4 space-y-4 overflow-x-hidden no-scrollbar"
      >
        {menuItems.map(item => {
          const isActive = (item.id === 'dashboard' && location.pathname === '/doctor') || location.pathname === item.path;
          return (
            <motion.button
              key={item.id}
              onClick={() => navigate(item.path)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative w-full group flex items-center transition-all duration-300 outline-none cursor-pointer`}
            >
              <motion.div
                layout
                className={`flex items-center transition-all duration-500 rounded-[30px] overflow-hidden relative ${isActive ? 'bg-white shadow-[0_15px_45px_-10px_rgba(239,68,68,0.15)] ring-2 ring-rose-500/5' : 'text-slate-400 hover:bg-white/70 hover:shadow-lg hover:shadow-slate-200/20'} ${isOpen ? 'w-full p-4 h-[84px]' : 'w-16 h-16 rounded-full mx-auto justify-center p-0'}`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeIndicatorPill"
                    className={`absolute inset-0 bg-gradient-to-br from-rose-50/20 to-transparent ${isOpen ? 'border-r-4 border-rose-600' : 'border-2 border-rose-600/20 rounded-full'}`}
                  />
                )}

                <div className={`shrink-0 flex items-center justify-center relative z-10 ${isOpen ? 'w-14 h-14' : 'w-full h-full'} ${isActive ? 'scale-110 text-rose-600' : 'text-slate-400 group-hover:text-rose-600 group-hover:scale-110 transition-all duration-300'}`}>
                  <item.icon size={28} strokeWidth={isActive ? 2.5 : 2} className="drop-shadow-sm" />
                </div>

                {isOpen && (
                  <motion.div
                    variants={itemVariants}
                    className="ml-6 flex flex-col text-left relative z-10"
                  >
                    <span className={`font-black text-lg tracking-tight leading-none ${isActive ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-transform'}`}>{item.label}</span>
                  </motion.div>
                )}
              </motion.div>
            </motion.button>
          );
        })}
      </motion.nav>

      <div className="p-8 border-t border-slate-200">
        <motion.button
          onClick={handleSignOut}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`flex items-center transition-all group overflow-hidden whitespace-nowrap mx-auto relative cursor-pointer ${isOpen ? 'w-full p-4 rounded-[30px] h-[84px] bg-white shadow-sm' : 'w-16 h-16 rounded-full justify-center p-0 bg-white border border-slate-200 shadow-sm'}`}
        >
          <div className={`flex items-center justify-center transition-all relative z-10 ${isOpen ? 'w-14 h-14' : 'w-full h-full'}`}>
            <LogOut size={24} className="text-slate-400 group-hover:text-rose-600 group-hover:rotate-12 transition-all" />
          </div>
          {isOpen && (
            <motion.span
              variants={itemVariants}
              animate={isOpen ? "open" : "closed"}
              className="ml-6 font-black text-sm text-slate-400 group-hover:text-rose-600"
            >
              End Session
            </motion.span>
          )}
        </motion.button>
      </div>
    </motion.aside>
  );
}
