// ProgressLoader.tsx
const TEXT_MAP: Record<string, string> = {
  "parser_agent": "Parsing your file…",
  "fetcher_agent": "Fetching metadata…",
  "analyzer_agent": "Analyzing dependencies…",
  "reporter_agent": "Preparing final report…",
};

export default function ProgressLoader({ step }: { step: string }) {
  return (
    <div className="flex flex-col items-center text-center py-10">
      <div className="w-16 h-16 rounded-full border-4 border-blue-600 border-t-transparent animate-spin mb-6" />

      <p className="text-blue-300 text-xl font-semibold">
        {TEXT_MAP[step] || "Processing…"}
      </p>
    </div>
  );
}
