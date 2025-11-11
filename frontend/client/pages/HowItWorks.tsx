import { FileUp, Shield, FileText } from "lucide-react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function HowItWorks() {
  useDocumentTitle("DepGuardian | How It Works");
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 text-white flex flex-col pb-20">
      <Header />

      <section className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold">How It Works</h1>
        </div>

        <div className="space-y-10">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 mb-3">
              <FileUp className="h-7 w-7 text-white" />
            </div>
            <h2 className="text-xl font-bold mb-1">1. Upload Your File</h2>
            <p className="text-gray-400 text-sm max-w-md">
              Upload package.json, requirements.txt, or other supported files.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 mb-3">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <h2 className="text-xl font-bold mb-1">2. We Analyze</h2>
            <p className="text-gray-400 text-sm max-w-md">
              We check vulnerabilities, licenses, and outdated packages.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 mb-3">
              <FileText className="h-7 w-7 text-white" />
            </div>
            <h2 className="text-xl font-bold mb-1">3. Get Report</h2>
            <p className="text-gray-400 text-sm max-w-md">
              Receive a clear, concise, actionable security report.
            </p>
          </div>
        </div>
      </section>

      <BottomNav />
    </div>
  );
}
