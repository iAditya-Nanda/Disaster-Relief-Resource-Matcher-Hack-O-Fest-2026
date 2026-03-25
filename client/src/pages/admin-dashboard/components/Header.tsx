import { Menu, Bell, Search, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const { user } = useAuthStore();

  return (
    <header className="h-32 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-12 flex items-center justify-between sticky top-0 z-30 transition-all">
      <div className="flex items-center gap-8 flex-1 max-w-2xl">
        <button 
          onClick={onToggleSidebar}
          className="w-14 h-14 bg-slate-50 hover:bg-slate-100 rounded-2xl flex items-center justify-center transition-all cursor-pointer group active:scale-90"
        >
          <Menu size={24} className="text-slate-900 group-hover:rotate-180 transition-transform duration-500" />
        </button>

        <div className="relative group flex-1">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            <Search size={20} className="text-slate-400 group-focus-within:text-amber-500 transition-colors" />
          </div>
          <input 
            type="text" 
            placeholder="Search Global Directives..." 
            className="w-full h-16 pl-14 pr-6 bg-slate-50 border-2 border-transparent focus:border-amber-500/20 focus:bg-white rounded-3xl outline-none transition-all font-bold text-slate-900 text-lg shadow-sm focus:shadow-xl focus:shadow-amber-500/5 group"
          />
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <button className="w-14 h-14 bg-slate-50 hover:bg-amber-50 rounded-2xl flex items-center justify-center transition-all cursor-pointer relative group">
            <Bell size={24} className="text-slate-600 group-hover:text-amber-500 transition-transform group-hover:rotate-12" />
            <span className="absolute top-4 right-4 w-3.5 h-3.5 bg-amber-500 border-2 border-white rounded-full animate-pulse shadow-lg shadow-amber-500/50"></span>
          </button>
        </div>

        <div className="h-14 w-[1px] bg-slate-200/60" />

        <div className="flex items-center gap-5 p-2 pr-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-amber-200 transition-all group">
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform overflow-hidden relative">
            {user?.email?.[0].toUpperCase() ?? <ShieldCheck size={20} className="text-amber-500" />}
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 to-transparent" />
          </div>
          <div className="flex flex-col">
            <span className="text-slate-900 font-black text-sm tracking-tight leading-none truncate max-w-[120px]">
              {user?.email?.split('@')[0] ?? 'Admin'}
            </span>
            <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest mt-1">
              System Admin
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
