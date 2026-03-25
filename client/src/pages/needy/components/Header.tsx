import { Menu, Search, Bell, Zap, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const { user } = useAuthStore();

  return (
    <header className="h-28 flex justify-between items-center px-10 relative z-10 shrink-0 border-b border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-8 flex-1">
        <button 
          onClick={onToggleSidebar}
          className="w-12 h-12 flex items-center justify-center bg-white text-slate-400 hover:text-emerald-600 border border-slate-100 rounded-2xl transition-all shadow-xl shadow-slate-200/40 active:scale-95 group"
        >
          <Menu size={20} className="group-hover:rotate-180 transition-transform duration-700" />
        </button>
        
        <div className="relative group max-w-lg w-full hidden sm:block">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-600 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search aid, broadcasts, or local help..." 
            className="w-full bg-white border border-slate-100 focus:border-emerald-100 focus:bg-white focus:ring-[10px] focus:ring-emerald-500/5 rounded-full py-4 px-14 text-sm font-bold transition-all outline-none placeholder:text-slate-300 tracking-tight"
          />
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4">
          <button className="w-12 h-12 flex items-center justify-center bg-white text-slate-400 hover:text-emerald-600 border border-slate-100 rounded-2xl transition-all relative group shadow-sm">
            <Bell size={20} strokeWidth={2.5}/>
            <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white group-hover:scale-125 transition-transform animate-pulse"></div>
          </button>
          <button className="w-12 h-12 flex items-center justify-center bg-white text-slate-400 hover:text-emerald-600 border border-slate-100 rounded-2xl transition-all group shadow-sm">
            <Zap size={20} className="group-hover:fill-emerald-500 transition-all text-emerald-500/20" />
          </button>
        </div>
        
        <div className="h-10 w-[1px] bg-slate-200"></div>

        <div className="flex items-center gap-6 group cursor-pointer p-2 pl-6 rounded-full border border-slate-50 hover:bg-slate-50 transition-all duration-700">
          <div className="text-right hidden md:block">
            <p className="text-base font-bold text-slate-900 tracking-tight leading-none mb-1">
              {user?.user_metadata?.full_name?.split(' ')[0] || 'Refugee'}
            </p>
            <div className="flex items-center justify-end gap-1.5 opacity-60">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-600"></div>
              <p className="text-[10px] text-slate-400 font-bold tracking-tight">User Node</p>
            </div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-500 p-1 shadow-md overflow-hidden group-hover:rotate-6 transition-transform duration-700 border-2 border-white relative shrink-0 flex items-center justify-center text-white font-black text-xl uppercase">
             {user?.email?.charAt(0).toUpperCase()}
          </div>
          <ChevronRight size={16} className="text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-2 transition-all mr-4" />
        </div>
      </div>
    </header>
  );
}
