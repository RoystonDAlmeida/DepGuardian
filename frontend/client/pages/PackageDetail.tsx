import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { getVulnBadges, getStatusBadge } from "@/utils/packageUtils";
import { AlertTriangle, Shield, ExternalLink, TrendingUp, Calendar } from "lucide-react";

export default function PackageDetail() {
  const { id, packageId } = useParams();
  const navigate = useNavigate();

  const saved = JSON.parse(localStorage.getItem("depguardian_reports") || "[]");
  const report = saved.find((r) => r.id === id);

  let packages = [];
  try {
    if (report?.data?.raw_output) {
      const jsonMatch = report.data.raw_output.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch && jsonMatch[1]) {
        const parsed = JSON.parse(jsonMatch[1]);
        packages = parsed.final_report?.packages || [];
      }
    } else if (report?.data?.final_report?.packages) {
      packages = report.data.final_report.packages;
    }
  } catch (e) {
    console.error("Error parsing report data:", e);
  }

  const pkg = packages[parseInt(packageId)];

  if (!pkg) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white p-8">
        <p className="text-center text-gray-400">Package not found.</p>
      </div>
    );
  }

  const riskColors = {
    High: { bg: "bg-rose-500/20", border: "border-rose-500", text: "text-rose-400", icon: "bg-rose-500" },
    Medium: { bg: "bg-yellow-500/20", border: "border-yellow-500", text: "text-yellow-400", icon: "bg-yellow-500" },
    Low: { bg: "bg-lime-500/20", border: "border-lime-500", text: "text-lime-400", icon: "bg-lime-500" },
    Secure: { bg: "bg-blue-500/20", border: "border-blue-500", text: "text-blue-400", icon: "bg-blue-500" }
  };

  const colors = riskColors[pkg.risk_level] || riskColors.Secure;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col">
      <Header />
      <main className="flex-1 pb-24 max-w-4xl mx-auto w-full">
        <div className="p-4">
          <button onClick={() => navigate(`/reports/${id}`)} className="text-slate-400 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>

          {/* Package Header */}
          <div className={`${colors.bg} border ${colors.border} rounded-2xl p-6 mb-6`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{pkg.name}</h1>
                <p className="text-slate-400 text-lg">Version {pkg.version}</p>
              </div>
              <div className={`${colors.icon} w-16 h-16 rounded-xl flex items-center justify-center`}>
                {pkg.risk_level === "High" ? (
                  <AlertTriangle className="w-8 h-8 text-white" />
                ) : pkg.risk_level === "Secure" ? (
                  <Shield className="w-8 h-8 text-white" />
                ) : (
                  <TrendingUp className="w-8 h-8 text-white" />
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {getVulnBadges(pkg)}
              {getStatusBadge(pkg)}
            </div>
          </div>

          {/* Risk Level Card */}
          <div className="bg-slate-900/60 rounded-2xl border border-slate-700/50 p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              Risk Assessment
            </h2>
            <div className={`${colors.bg} border ${colors.border} rounded-xl p-4 mb-4`}>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Risk Level</span>
                <span className={`${colors.text} font-bold text-xl`}>{pkg.risk_level}</span>
              </div>
            </div>
            {pkg.suggestion && (
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                <p className="text-sm text-slate-300 leading-relaxed">{pkg.suggestion}</p>
              </div>
            )}
          </div>

          {/* Security Status */}
          <div className="bg-slate-900/60 rounded-2xl border border-slate-700/50 p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-teal-400" />
              Security Status
            </h2>
            <p className="text-slate-300 leading-relaxed">{pkg.security}</p>
          </div>

          {/* Version Information */}
          <div className="bg-slate-900/60 rounded-2xl border border-slate-700/50 p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              Version Information
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-slate-400">Current Version</span>
                <span className="text-white font-mono font-semibold">{pkg.version}</span>
              </div>
              <div className="border-t border-slate-700/50 pt-3">
                <p className="text-slate-300 text-sm leading-relaxed">{pkg.freshness}</p>
              </div>
            </div>
          </div>

          {/* Popularity Metrics */}
          {pkg.popularity && (
            <div className="bg-slate-900/60 rounded-2xl border border-slate-700/50 p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                Popularity
              </h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-800/60 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400 mb-1">{pkg.popularity.last_day}</div>
                  <div className="text-slate-400 text-xs">Last Day</div>
                </div>
                <div className="bg-slate-800/60 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400 mb-1">{pkg.popularity.last_week}</div>
                  <div className="text-slate-400 text-xs">Last Week</div>
                </div>
                <div className="bg-slate-800/60 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400 mb-1">{pkg.popularity.last_month}</div>
                  <div className="text-slate-400 text-xs">Last Month</div>
                </div>
              </div>
            </div>
          )}

          {/* License */}
          <div className="bg-slate-900/60 rounded-2xl border border-slate-700/50 p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">License</h2>
            <div className="bg-slate-800/60 rounded-xl p-4 font-mono text-sm text-slate-300">
              {pkg.license || "Not specified"}
            </div>
          </div>

          {/* External Links */}
          <div className="bg-slate-900/60 rounded-2xl border border-slate-700/50 p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <ExternalLink className="w-5 h-5 text-blue-400" />
              Resources
            </h2>
            <div className="space-y-2">
              <a 
                href={`https://www.npmjs.com/package/${pkg.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between bg-slate-800/60 hover:bg-slate-700/60 rounded-xl p-4 transition-colors group"
              >
                <span className="text-slate-300">View on NPM</span>
                <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
              </a>
              <a 
                href={`https://github.com/search?q=${pkg.name}&type=repositories`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between bg-slate-800/60 hover:bg-slate-700/60 rounded-xl p-4 transition-colors group"
              >
                <span className="text-slate-300">Search on GitHub</span>
                <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
              </a>
            </div>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}