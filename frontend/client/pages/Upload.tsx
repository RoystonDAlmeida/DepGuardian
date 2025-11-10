import { FileUp, ScanSearch } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { useRef, useState } from "react";
import { toast } from "sonner";

export default function Upload() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Handler method to handle uploaded files

    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["text/plain", "application/json"];

    if (!allowed.includes(file.type)) {
      toast.error("Unsupported file. Only .txt or .json are allowed.");
      e.target.value = "";
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    toast.success("File accepted.");
  };


  const handleChooseFile = () => fileInputRef.current?.click();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 text-white flex flex-col pb-20">
      <Header />

      <section className="flex-1 container mx-auto px-4 py-6 sm:py-10 max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Upload your dependency file
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Use{" "}
            <code className="bg-slate-900/50 px-1 rounded text-blue-300">
              requirements.txt
            </code>{" "}
            or{" "}
            <code className="bg-slate-900/50 px-1 rounded text-blue-300">
              package.json
            </code>
          </p>
        </div>

        <div className="max-w-xl mx-auto mb-10">
          <div className="border-2 border-dashed border-blue-800/50 rounded-2xl p-6 text-center hover:border-blue-600/60 transition-colors">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600/20 to-blue-800/20 flex items-center justify-center">
                <FileUp className="w-8 h-8 text-blue-400" />
              </div>
            </div>

            <h2 className="text-xl font-semibold mb-1">Choose a file</h2>
            <p className="text-gray-400 text-sm mb-5">
              Accepted: <span className="text-blue-300 font-medium">.txt, .json</span>
            </p>

            {selectedFile && (
              <div className="mb-5 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-blue-300">{selectedFile.name}</p>
                <p className="text-gray-400 text-xs">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.json"
              onChange={handleFileSelect}
              className="hidden"
            />

            <button
              onClick={handleChooseFile}
              className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-colors"
            >
              Choose File
            </button>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            disabled={!selectedFile}
            className={`group flex items-center gap-2 w-full sm:w-auto px-10 py-4 rounded-xl font-semibold text-white transition-all text-base sm:text-lg
              ${
                selectedFile
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-blue-500/40"
                  : "bg-blue-900/30 text-gray-500 cursor-not-allowed"
              }`}
          >
            <ScanSearch className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Analyze Dependencies
          </button>
        </div>
      </section>

      <BottomNav />
    </div>
  );
}
