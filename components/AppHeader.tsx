import { Clock, Coffee, Settings, Wifi } from 'lucide-react';

interface AppHeaderProps {
  currentTime: string;
}

export default function AppHeader({ currentTime }: AppHeaderProps) {
  return (
    <header className="min-h-14 bg-[#131b2e] border-b border-slate-800/80 px-3 sm:px-4 flex items-center justify-between gap-3 z-20 shrink-0">
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-600/30">
          POS
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-slate-800/80 flex items-center justify-center text-blue-400 border border-slate-700/50">
            <Coffee className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold leading-tight text-white tracking-wide">Brew &amp; Bean</h1>
            <p className="text-[11px] text-slate-400 leading-none">
              Point of Sale <span className="text-slate-600">•</span> Terminal 01
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-6 text-xs">
        <div className="flex items-center space-x-2 bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-500/20 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <Wifi className="w-3.5 h-3.5" />
          <span>Online</span>
        </div>

        <div className="hidden sm:flex items-center space-x-2 text-slate-300 font-medium bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/40">
          <Clock className="w-4 h-4 text-blue-400" />
          <span>{currentTime || '10:24 AM'}</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">
            {new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
          </span>
        </div>

        <button className="p-2 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-700/60 rounded-lg transition-colors border border-slate-700/50">
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
