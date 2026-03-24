import { motion } from 'framer-motion';

export const HeaderSkeleton = () => (
  <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-12 animate-pulse">
    <div className="space-y-4 flex-1">
      <div className="h-20 bg-slate-200 rounded-3xl w-2/3"></div>
      <div className="h-4 bg-slate-100 rounded-full w-1/3 border-l-4 border-blue-200"></div>
    </div>
    <div className="h-14 bg-slate-100 rounded-full w-64 shadow-sm"></div>
  </div>
);

export const StatCardSkeleton = () => (
  <div className="bg-white p-8 rounded-[45px] border border-slate-50 shadow-sm space-y-4 animate-pulse">
    <div className="flex justify-between items-start">
      <div className="space-y-3 flex-1">
        <div className="h-2 bg-slate-100 rounded-full w-12"></div>
        <div className="h-12 bg-slate-200 rounded-2xl w-20"></div>
        <div className="h-4 bg-slate-100 rounded-full w-24"></div>
      </div>
      <div className="w-14 h-14 bg-slate-100 rounded-2xl"></div>
    </div>
  </div>
);

export const ItemCardSkeleton = () => (
  <div className="bg-white rounded-[50px] p-10 border border-slate-100 shadow-sm flex items-center justify-between gap-8 animate-pulse">
    <div className="flex-1 space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-6 bg-slate-100 rounded-full w-20"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-slate-100"></div>
      </div>
      <div className="h-10 bg-slate-200 rounded-2xl w-48"></div>
      <div className="flex items-center gap-10 pt-2">
        <div className="space-y-2">
          <div className="h-2 bg-slate-50 rounded-full w-10"></div>
          <div className="h-10 bg-slate-100 rounded-xl w-16"></div>
        </div>
        <div className="w-0.5 h-10 bg-slate-50"></div>
        <div className="space-y-2">
          <div className="h-2 bg-slate-50 rounded-full w-10"></div>
          <div className="h-4 bg-slate-100 rounded-full w-24"></div>
        </div>
      </div>
    </div>
    <div className="space-y-3">
      <div className="w-12 h-12 bg-slate-50 rounded-2xl"></div>
      <div className="w-12 h-12 bg-slate-50 rounded-2xl"></div>
    </div>
  </div>
);

export const MapSkeleton = () => (
  <div className="h-[550px] w-full bg-slate-100 rounded-[60px] border-8 border-white shadow-2xl animate-pulse relative overflow-hidden">
     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]"></div>
     <div className="absolute top-8 right-8 flex gap-3">
        <div className="w-14 h-14 bg-white/50 rounded-2xl shadow-lg"></div>
        <div className="w-14 h-14 bg-white/50 rounded-2xl shadow-lg"></div>
     </div>
  </div>
);
