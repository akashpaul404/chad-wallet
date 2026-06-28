"use client";

export default function TokenHeaderSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 bg-[#161618] rounded-xl border border-white/5 animate-pulse">
      {/* Left: logo + name */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-white/10" />
        <div className="flex flex-col gap-2">
          <div className="w-32 h-5 bg-white/10 rounded" />
          <div className="w-24 h-3 bg-white/5 rounded" />
        </div>
      </div>
      {/* Right: price + stats */}
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-end gap-2">
          <div className="w-20 h-5 bg-white/10 rounded" />
          <div className="w-14 h-3 bg-white/5 rounded" />
        </div>
        <div className="hidden sm:flex flex-col items-end gap-2">
          <div className="w-12 h-3 bg-white/5 rounded" />
          <div className="w-16 h-4 bg-white/10 rounded" />
        </div>
        <div className="hidden sm:flex flex-col items-end gap-2">
          <div className="w-12 h-3 bg-white/5 rounded" />
          <div className="w-16 h-4 bg-white/10 rounded" />
        </div>
      </div>
    </div>
  );
}
