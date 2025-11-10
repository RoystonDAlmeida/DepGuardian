import { Home, HelpCircle, Upload, FileText } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

export function BottomNav() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-blue-900/30 bg-slate-950/80 backdrop-blur-sm z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 max-w-6xl">
        <div className="flex items-center justify-around gap-1 sm:gap-6 lg:gap-8">
          {/* Home */}
          <Link
            to="/"
            className={`flex flex-col items-center gap-1 py-2 px-2 sm:px-4 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              isActive('/')
                ? 'text-blue-400 bg-blue-500/10'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <Home className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-xs font-medium">Home</span>
          </Link>

          {/* Upload */}
          <Link
            to="/upload"
            className={`flex flex-col items-center gap-1 py-2 px-2 sm:px-4 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              isActive('/upload')
                ? 'text-blue-400 bg-blue-500/10'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <Upload className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-xs font-medium">Upload</span>
          </Link>

          {/* Reports */}
          <Link
            to="/reports"
            className={`flex flex-col items-center gap-1 py-2 px-2 sm:px-4 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              isActive('/reports')
                ? 'text-blue-400 bg-blue-500/10'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-xs font-medium">Reports</span>
          </Link>

          {/* How It Works */}
          <Link
            to="/how-it-works"
            className={`flex flex-col items-center gap-1 py-2 px-2 sm:px-4 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              isActive('/how-it-works')
                ? 'text-blue-400 bg-blue-500/10'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-xs font-medium">How it works?</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
