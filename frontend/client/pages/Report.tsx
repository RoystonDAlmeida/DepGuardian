import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, ChevronRight, Search } from "lucide-react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { 
  getStats, 
  getStatusBadge, 
  getVulnBadges, 
  parseReportPackages, 
  getHighestRisk 
} from "@/utils/packageUtils";

const RISK_ORDER = ["High", "Medium", "Low", "Secure"];

export default function Report() {
  const { id } = useParams();
  const navigate = useNavigate();

  const saved = JSON.parse(localStorage.getItem("depguardian_reports") || "[]");
  const report = saved.find((r) => r.id === id);

  if (!report) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white p-8">
        <p className="text-center text-gray-400">Report not found.</p>
      </div>
    );
  }

  const packages = parseReportPackages(report);

  if (packages.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white p-8">
        <button onClick={() => navigate(-1)} className="text-gray-400 mb-4">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <p className="text-center text-gray-400">No package data found in this report.</p>
      </div>
    );
  }

  const stats = getStats(packages);
  const totalDeps = packages.length;
  const highestRisk = getHighestRisk(stats);

  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("All");

  const filteredPackages = packages.filter((pkg) => {
    if (filter !== "All" && pkg.risk_level !== filter) return false;
    if (q.length && !pkg.name.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col">
      <Header />
      <main className="flex-1 pb-24 max-w-4xl mx-auto w-full">
        <div className="p-4">
          <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold mb-6">Analysis Report</h1>
          
          {/* Overall Health Card */}
          <div className="bg-gradient-to-br from-slate-900/60 to-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 mb-6">
            <h2 className="text-lg font-semibold text-slate-300 mb-4 text-center">Overall Project Health</h2>
            
            {/* Donut Chart */}
            <div className="relative mx-auto w-40 h-40 sm:w-48 sm:h-48 flex items-center justify-center mb-4">
              <svg width="160" height="160" viewBox="0 0 192 192" className="transform -rotate-90 w-full h-full">
                <circle
                  cx="96" cy="96" r="70"
                  stroke="rgba(15,23,42,0.5)"
                  strokeWidth="24"
                  fill="none"
                />
                {/* High risk segment */}
                {stats.High > 0 && (
                  <circle
                    cx="96" cy="96" r="70"
                    stroke="#f43f5e"
                    strokeWidth="24"
                    fill="none"
                    strokeDasharray={`${(stats.High / totalDeps) * 439.6} 439.6`}
                    strokeDashoffset="0"
                  />
                )}
                {/* Medium risk segment */}
                {stats.Medium > 0 && (
                  <circle
                    cx="96" cy="96" r="70"
                    stroke="#eab308"
                    strokeWidth="24"
                    fill="none"
                    strokeDasharray={`${(stats.Medium / totalDeps) * 439.6} 439.6`}
                    strokeDashoffset={`-${(stats.High / totalDeps) * 439.6}`}
                  />
                )}
                {/* Low risk segment */}
                {stats.Low > 0 && (
                  <circle
                    cx="96" cy="96" r="70"
                    stroke="#84cc16"
                    strokeWidth="24"
                    fill="none"
                    strokeDasharray={`${(stats.Low / totalDeps) * 439.6} 439.6`}
                    strokeDashoffset={`-${((stats.High + stats.Medium) / totalDeps) * 439.6}`}
                  />
                )}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center px-2">
                <span className={`text-lg sm:text-2xl font-bold text-center leading-tight ${
                  highestRisk === "High" ? "text-rose-400" : 
                  highestRisk === "Medium" ? "text-yellow-400" : "text-lime-400"
                }`}>
                  {highestRisk}
                </span>
                <span className={`text-xs sm:text-sm font-medium text-center ${
                  highestRisk === "High" ? "text-rose-400" : 
                  highestRisk === "Medium" ? "text-yellow-400" : "text-lime-400"
                }`}>
                  Risk
                </span>
                <span className="text-slate-400 text-xs sm:text-sm mt-1">{totalDeps} Deps</span>
              </div>
            </div>

            <p className="text-center text-slate-300 text-sm mb-6">
              {highestRisk === "High" 
                ? "This project has several critical vulnerabilities that require immediate attention."
                : highestRisk === "Medium"
                ? "This project has some vulnerabilities that should be addressed."
                : "This project is in good health with minimal vulnerabilities."}
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-900/60 rounded-xl p-4 text-center border border-rose-900/30">
                <div className="text-rose-400 text-3xl font-bold mb-1">{stats.High}</div>
                <div className="text-slate-400 text-sm">High</div>
              </div>
              <div className="bg-slate-900/60 rounded-xl p-4 text-center border border-yellow-900/30">
                <div className="text-yellow-400 text-3xl font-bold mb-1">{stats.Medium}</div>
                <div className="text-slate-400 text-sm">Medium</div>
              </div>
              <div className="bg-slate-900/60 rounded-xl p-4 text-center border border-lime-900/30">
                <div className="text-lime-400 text-3xl font-bold mb-1">{stats.Low}</div>
                <div className="text-slate-400 text-sm">Low</div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Search dependencies..."
                value={q}
                onChange={e => setQ(e.target.value)}
                className="w-full bg-slate-900/60 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2 mb-6">
              {["All", "High", "Medium", "Low", "Secure"].map((level) => (
                <button
                  key={level}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    filter === level
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                      : "bg-slate-800/60 text-slate-300 hover:bg-slate-700/60"
                  }`}
                  onClick={() => setFilter(level)}
                >
                  {level}
                </button>
              ))}
            </div>

            {/* Package List */}
            <div className="space-y-3">
              {filteredPackages.map((pkg, idx) => (
                <button
                  key={pkg.name}
                  onClick={() => navigate(`/reports/${id}/package/${idx}`)}
                  className={`w-full bg-slate-900/60 hover:bg-slate-800/60 rounded-xl p-4 border-l-4 transition-all group ${
                    pkg.risk_level === "High"
                      ? "border-rose-500"
                      : pkg.risk_level === "Medium"
                      ? "border-yellow-500"
                      : pkg.risk_level === "Low"
                      ? "border-lime-500"
                      : "border-blue-500"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-white text-lg">{pkg.name}</span>
                        <span className="text-slate-500 text-sm">v{pkg.version}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {getVulnBadges(pkg)}
                        <span className="bg-slate-800/60 text-slate-300 rounded-full px-3 py-1 text-xs font-medium">
                          {pkg.license || "MIT"}
                        </span>
                        {getStatusBadge(pkg)}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-slate-300 transition-colors flex-shrink-0 ml-2" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}