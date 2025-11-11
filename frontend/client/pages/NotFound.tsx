import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Home, AlertCircle } from "lucide-react";
import { Header } from "@/components/Header";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const NotFound = () => {
  useDocumentTitle("DepGuardian | Page Not Found");

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 text-white flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="mb-8 flex justify-center">
            <div className="rounded-full bg-blue-900/40 p-6 border-2 border-blue-700/60">
              <AlertCircle className="w-20 h-20 text-blue-400" />
            </div>
          </div>
          
          <h1 className="text-7xl font-bold mb-4 text-blue-400">404</h1>
          <h2 className="text-2xl font-semibold mb-3 text-slate-200">
            Page Not Found
          </h2>
          <p className="text-lg text-slate-400 mb-8">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
          
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200"
          >
            <Home className="w-5 h-5" />
            Return to Home
          </button>
          
          <p className="mt-6 text-sm text-slate-500">
            Path: <code className="bg-slate-800/60 px-2 py-1 rounded text-slate-300">{location.pathname}</code>
          </p>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
