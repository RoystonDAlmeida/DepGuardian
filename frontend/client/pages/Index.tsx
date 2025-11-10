import { Shield, Lock, TrendingUp, Upload } from "lucide-react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 text-white flex flex-col pb-24">
      <Header />

      <section className="flex-1 container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center">

          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
            Keep Your<br />
            <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-300 bg-clip-text text-transparent">
              Dependencies Secure & Up-to-Date
            </span>
          </h1>

          <p className="text-base sm:text-lg text-gray-400 max-w-xl mx-auto mb-10">
            Upload your package.json, requirements.txt dependency files to get instant security reports.
          </p>

          {/* Center Graphic */}
          <div className="flex justify-center mb-12">
            <div className="relative w-56 h-56 sm:w-72 sm:h-72">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-600/20 to-blue-800/20 blur-xl"></div>
              <div className="absolute inset-3 rounded-full border-4 border-blue-700/40 blur-sm"></div>
              <div className="absolute inset-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-800"></div>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-xl">
                  <Shield className="w-12 h-12 sm:w-16 sm:h-16 text-white fill-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">

            <div className="group p-6 rounded-2xl border border-blue-800/50 bg-blue-950/40 hover:border-blue-600/50 transition flex flex-col items-center text-center">
              <div className="mb-4 w-14 h-14 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Vulnerability Scanning</h3>
              <p className="text-gray-400 text-sm">Detect and fix known security issues.</p>
            </div>

            <div className="group p-6 rounded-2xl border border-blue-800/50 bg-blue-950/40 hover:border-blue-600/50 transition flex flex-col items-center text-center">
              <div className="mb-4 w-14 h-14 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">License Compliance</h3>
              <p className="text-gray-400 text-sm">Check outdated packages and license issues.</p>
            </div>

            <div className="group p-6 rounded-2xl border border-blue-800/50 bg-blue-950/40 hover:border-blue-600/50 transition flex flex-col items-center text-center">
              <div className="mb-4 w-14 h-14 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Popularity Insights</h3>
              <p className="text-gray-400 text-sm">Understand the health of your dependencies.</p>
            </div>

          </div>

          {/* CTA */}
          <div className="flex justify-center mb-6">
            <button className="px-10 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl font-semibold text-white shadow-lg transition flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload File to Scan
            </button>
          </div>

          {/* How it works */}
          <div id="how-it-works" className="pt-8 pb-0 border-t border-blue-900/30">
            <Link
              to="/how-it-works"
              className="text-xl font-semibold text-blue-400 hover:text-blue-300 transition"
            >
              How It Works?
            </Link>
          </div>

        </div>
      </section>

      <BottomNav />
    </div>
  );
}
