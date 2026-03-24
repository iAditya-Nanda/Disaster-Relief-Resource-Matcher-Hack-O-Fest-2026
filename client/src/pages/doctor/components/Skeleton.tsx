

export const CardSkeleton = () => (
  <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm space-y-6 relative overflow-hidden">
    <div className="w-12 h-12 bg-slate-400/40 rounded-2xl animate-pulse"></div>
    <div className="space-y-3">
       <div className="h-10 w-2/3 bg-slate-500/30 rounded-xl animate-pulse"></div>
       <div className="h-3 w-1/3 bg-slate-300/40 rounded-full animate-pulse"></div>
    </div>
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"></div>
  </div>
);

export const TriageItemSkeleton = () => (
  <div className="flex items-center gap-6 p-8 rounded-[35px] border border-slate-200 bg-white animate-pulse relative overflow-hidden mb-4 shadow-sm">
    <div className="w-20 h-20 bg-slate-500/20 rounded-3xl"></div>
    <div className="flex-1 space-y-4">
      <div className="h-6 w-1/2 bg-slate-400/30 rounded-full"></div>
      <div className="h-3 w-1/4 bg-slate-300/40 rounded-full"></div>
    </div>
    <div className="w-14 h-14 bg-slate-300/30 rounded-2xl"></div>
  </div>
);

export const PatientLogSkeleton = () => (
  <div className="flex items-center gap-8 p-8 rounded-[40px] border border-slate-200 bg-white animate-pulse relative overflow-hidden mb-4 shadow-sm">
    <div className="w-16 h-16 bg-slate-500/20 rounded-2xl"></div>
    <div className="flex-1 grid grid-cols-4 gap-8">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="space-y-2">
          <div className="h-3 w-12 bg-slate-200/50 rounded-full"></div>
          <div className="h-5 w-24 bg-slate-400/30 rounded-full"></div>
        </div>
      ))}
    </div>
    <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center"></div>
  </div>
);

export const HeaderSkeleton = () => (
  <div className="space-y-6 mb-12 animate-pulse">
    <div className="h-16 w-[400px] bg-slate-500/20 rounded-3xl"></div>
    <div className="h-5 w-[300px] bg-slate-400/20 rounded-full"></div>
  </div>
);

export const MapSkeleton = () => (
  <div className="h-[600px] w-full bg-slate-500/10 rounded-[60px] animate-pulse border-8 border-white shadow-2xl"></div>
);
