"use client";

export default function HoldersSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 py-2 border-b border-white/5">
          <div className="w-5 h-3 bg-white/10 rounded" />
          <div className="flex-1 h-3 bg-white/10 rounded" />
          <div className="w-20 h-3 bg-white/10 rounded" />
          <div className="w-12 h-3 bg-white/10 rounded" />
        </div>
      ))}
    </div>
  );
}
