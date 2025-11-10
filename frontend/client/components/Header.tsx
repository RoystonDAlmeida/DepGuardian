import { Shield } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-blue-900/30 bg-slate-950/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 max-w-6xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="text-xl font-bold text-white">DepGuardian</span>
        </div>
      </div>
    </header>
  );
}
