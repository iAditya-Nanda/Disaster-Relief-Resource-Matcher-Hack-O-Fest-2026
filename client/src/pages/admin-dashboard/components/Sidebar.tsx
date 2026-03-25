import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, 
  LayoutDashboard, 
  Globe, 
  Stethoscope, 
  HeartHandshake,
  Shield
} from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';

const menuItems = [
  { id: 'dashboard', label: 'Control Overview', icon: LayoutDashboard, path: '/admin' },
  { id: 'ngos', label: 'NGO Network', icon: Globe, path: '/admin/ngos' },
  { id: 'doctors', label: 'Medical Board', icon: Stethoscope, path: '/admin/doctors' },
  { id: 'needys', label: 'Relief Requestors', icon: HeartHandshake, path: '/admin/needys' },
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
      className="bg-slate-900 h-screen flex flex-col relative z-20 shrink-0 border-r border-slate-800 shadow-2xl shadow-slate-900/50"
    >
      <div className="p-8 flex items-center h-32 whitespace-nowrap overflow-hidden">
        <div 
          onClick={() => navigate('/admin')}
          className="w-16 h-16 bg-amber-500 rounded-[22px] flex items-center justify-center border-2 border-slate-800 shrink-0 relative z-10 cursor-pointer active:scale-95 transition-transform p-3 shadow-[0_0_20px_rgba(245,158,11,0.3)]"
        >
           <Shield size={32} className="text-slate-900" />
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="ml-6 flex items-baseline cursor-default"
            >
              <span className="text-white text-2xl font-black tracking-tighter leading-none whitespace-nowrap">Sahara</span>
              <span className="text-xl font-black text-amber-500 tracking-tighter ml-0.5">.Admin</span>
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
          const isActive = (item.id === 'dashboard' && location.pathname === '/admin') || location.pathname === item.path;
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
                className={`flex items-center transition-all duration-500 rounded-[30px] overflow-hidden relative ${isActive ? 'bg-slate-800 shadow-[0_15px_45px_-10px_rgba(245,158,11,0.15)] ring-2 ring-amber-500/5' : 'text-slate-500 hover:bg-slate-800/50 hover:shadow-lg hover:shadow-slate-900/20'} ${isOpen ? 'w-full p-4 h-[84px]' : 'w-16 h-16 rounded-full mx-auto justify-center p-0'}`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeIndicatorPillAdmin"
                    className={`absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent ${isOpen ? 'border-r-4 border-amber-500' : 'border-2 border-amber-500/20 rounded-full'}`}
                  />
                )}
                
                <div className={`shrink-0 flex items-center justify-center relative z-10 ${isOpen ? 'w-14 h-14' : 'w-full h-full'} ${isActive ? 'scale-110 text-amber-500' : 'text-slate-500 group-hover:text-amber-500 group-hover:scale-110 transition-all duration-300'}`}>
                  <item.icon size={28} strokeWidth={isActive ? 2.5 : 2} className="drop-shadow-sm" />
                </div>
                
                {isOpen && (
                  <motion.div 
                    variants={itemVariants}
                    className="ml-6 flex flex-col text-left relative z-10"
                  >
                    <span className={`font-black text-lg tracking-tight leading-none ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-transform'}`}>{item.label}</span>
                    {isActive && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] font-black text-amber-500 tracking-tight mt-1">Status: Active</motion.span>}
                  </motion.div>
                )}
              </motion.div>
            </motion.button>
          );
        })}
      </motion.nav>

      <div className="p-8 border-t border-slate-800/50">
        <motion.button 
          onClick={handleSignOut}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`flex items-center transition-all group overflow-hidden whitespace-nowrap mx-auto relative cursor-pointer ${isOpen ? 'w-full p-4 rounded-[30px] h-[84px] bg-slate-800/50 hover:bg-rose-500/10 transition-colors' : 'w-16 h-16 rounded-full justify-center p-0 bg-slate-800/50 border border-slate-700 shadow-sm'}`}
        >
          <div className={`flex items-center justify-center transition-all relative z-10 ${isOpen ? 'w-14 h-14' : 'w-full h-full'}`}>
            <LogOut size={24} className="text-slate-500 group-hover:text-rose-500 group-hover:rotate-12 transition-all" />
          </div>
          {isOpen && (
            <motion.span 
              variants={itemVariants}
              animate={isOpen ? "open" : "closed"}
              className="ml-6 font-black text-sm text-slate-500 group-hover:text-rose-500"
            >
              Terminate Control
            </motion.span>
          )}
        </motion.button>
      </div>
    </motion.aside>
  );
}
