export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black">
      <div className="space-y-4 text-center">
        <div className="w-16 h-1 bg-[#75E2FF] mx-auto mb-8 animate-pulse" />
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">
          System Online
        </h1>
        <p className="text-[#75E2FF] font-black uppercase tracking-[0.3em] text-xs">
          Next.js Rendering Engine Operational
        </p>
        <div className="pt-12">
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-3 border border-zinc-800 hover:border-[#75E2FF] transition-colors text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white"
          >
            Refresh Interface
          </button>
        </div>
      </div>
    </div>
  );
}