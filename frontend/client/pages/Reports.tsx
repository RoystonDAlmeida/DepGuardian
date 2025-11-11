import { FileText, ChevronRight, Calendar, TrendingUp, AlertTriangle, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { parseReportPackages, getStats, getHighestRisk } from "@/utils/packageUtils";
import { ConfirmDialog, Toast } from "@/utils/deleteUtils";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function Reports() {
  useDocumentTitle("DepGuardian | Reports");
  
  const [reports, setReports] = useState(() => 
    JSON.parse(localStorage.getItem("depguardian_reports") || "[]")
  );
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; title: string } | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Sort reports by date (newest first)
  const sortedReports = [...reports].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const handleDeleteClick = (e: React.MouseEvent, reportId: string, reportTitle: string) => {
    e.preventDefault(); // Prevent navigation
    setDeleteConfirm({ id: reportId, title: reportTitle });
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirm) return;

    try {
      const updatedReports = reports.filter((r: any) => r.id !== deleteConfirm.id);
      localStorage.setItem("depguardian_reports", JSON.stringify(updatedReports));
      setReports(updatedReports);
      setToast({ message: 'Report deleted successfully', type: 'success' });
    } catch (error) {
      setToast({ message: 'Failed to delete report', type: 'error' });
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirm(null);
  };

  const handleCloseToast = () => {
    setToast(null);
  };

  // Auto-hide toast after 3 seconds
  if (toast) {
    setTimeout(() => setToast(null), 3000);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col">
      <Header />
      
      <main className="flex-1 pb-24">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold">Saved Reports</h1>
            {reports.length > 0 && (
              <span className="text-sm text-slate-400">
                {reports.length} {reports.length === 1 ? 'report' : 'reports'}
              </span>
            )}
          </div>

          {reports.length === 0 && (
            <div className="mt-20 flex flex-col items-center text-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-blue-900/20 border-2 border-blue-700/40 flex items-center justify-center mb-6">
                <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-blue-400" />
              </div>
              <p className="text-blue-300 text-lg sm:text-xl font-semibold mb-2">No saved reports yet</p>
              <p className="text-slate-400 text-sm sm:text-base max-w-md px-4">
                Analyze a dependency file to generate your first security report and track vulnerabilities.
              </p>
            </div>
          )}

          <div className="space-y-4">
            {sortedReports.map((report: any) => {
              // Parse packages to get stats
              const packages = parseReportPackages(report);
              const stats = getStats(packages);
              const highestRisk = getHighestRisk(stats);
              const totalDeps = packages.length;

              // Format date
              const date = new Date(report.created_at);
              const formattedDate = date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div key={report.id} className="relative group">
                  <Link
                    to={`/reports/${report.id}`}
                    className="block"
                  >
                    <div className="bg-gradient-to-br from-slate-900/60 to-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 sm:p-6 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
                      {/* Header Section */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 min-w-0 mr-3">
                          <h2 className="text-lg sm:text-xl font-bold text-white mb-2 truncate group-hover:text-blue-400 transition-colors">
                            {report.title || "Dependency Report"}
                          </h2>
                          <div className="flex items-center gap-2 text-slate-400 text-xs sm:text-sm">
                            <Calendar className="w-4 h-4 flex-shrink-0" />
                            <span>{formattedDate}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => handleDeleteClick(e, report.id, report.title || "Dependency Report")}
                            className="p-2 rounded-lg bg-red-900/20 hover:bg-red-900/40 border border-red-700/30 hover:border-red-500/50 text-red-400 hover:text-red-300 transition-all duration-200 opacity-0 group-hover:opacity-100"
                            title="Delete report"
                          >
                            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-slate-500 group-hover:text-blue-400 transition-colors flex-shrink-0" />
                        </div>
                      </div>

                      {/* Stats Section */}
                      {totalDeps > 0 && (
                        <div className="space-y-3">
                          {/* Risk Level Badge */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium ${
                              highestRisk === "High" 
                                ? "bg-rose-500/20 border border-rose-500/50 text-rose-400" 
                                : highestRisk === "Medium"
                                ? "bg-yellow-500/20 border border-yellow-500/50 text-yellow-400"
                                : "bg-lime-500/20 border border-lime-500/50 text-lime-400"
                            }`}>
                              <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              <span>{highestRisk} Risk</span>
                            </div>
                            <div className="flex items-center gap-2 bg-slate-800/60 px-3 py-1.5 rounded-full text-xs sm:text-sm text-slate-300">
                              <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              <span>{totalDeps} Dependencies</span>
                            </div>
                          </div>

                          {/* Vulnerability Breakdown */}
                          <div className="flex items-center gap-3 sm:gap-4">
                            {stats.High > 0 && (
                              <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                                <span className="text-xs sm:text-sm text-slate-300">
                                  <span className="font-semibold text-rose-400">{stats.High}</span> High
                                </span>
                              </div>
                            )}
                            {stats.Medium > 0 && (
                              <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                <span className="text-xs sm:text-sm text-slate-300">
                                  <span className="font-semibold text-yellow-400">{stats.Medium}</span> Medium
                                </span>
                              </div>
                            )}
                            {stats.Low > 0 && (
                              <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-lime-500"></div>
                                <span className="text-xs sm:text-sm text-slate-300">
                                  <span className="font-semibold text-lime-400">{stats.Low}</span> Low
                                </span>
                              </div>
                            )}
                            {stats.Secure > 0 && (
                              <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                <span className="text-xs sm:text-sm text-slate-300">
                                  <span className="font-semibold text-blue-400">{stats.Secure}</span> Secure
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Progress Bar */}
                          <div className="w-full h-2 bg-slate-800/60 rounded-full overflow-hidden">
                            <div className="h-full flex">
                              {stats.High > 0 && (
                                <div 
                                  className="bg-rose-500"
                                  style={{ width: `${(stats.High / totalDeps) * 100}%` }}
                                ></div>
                              )}
                              {stats.Medium > 0 && (
                                <div 
                                  className="bg-yellow-500"
                                  style={{ width: `${(stats.Medium / totalDeps) * 100}%` }}
                                ></div>
                              )}
                              {stats.Low > 0 && (
                                <div 
                                  className="bg-lime-500"
                                  style={{ width: `${(stats.Low / totalDeps) * 100}%` }}
                                ></div>
                              )}
                              {stats.Secure > 0 && (
                                <div 
                                  className="bg-blue-500"
                                  style={{ width: `${(stats.Secure / totalDeps) * 100}%` }}
                                ></div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* No data state */}
                      {totalDeps === 0 && (
                        <div className="text-slate-400 text-sm">
                          No package data available
                        </div>
                      )}
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <BottomNav />

      {/* Confirmation Dialog */}
      {deleteConfirm && (
        <ConfirmDialog
          title="Delete Report"
          message={`Are you sure you want to delete "${deleteConfirm.title}"? This action cannot be undone.`}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={handleCloseToast}
        />
      )}
    </div>
  );
}