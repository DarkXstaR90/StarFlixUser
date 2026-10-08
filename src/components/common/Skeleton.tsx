import React from 'react';

export const AnimeCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col gap-2.5 animate-pulse">
      <div className="aspect-[3/4] w-full rounded-2xl bg-[#0D1722] border border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
      </div>
      <div className="h-4 bg-[#0D1722] rounded-md w-3/4" />
      <div className="h-3 bg-[#0D1722] rounded-md w-1/2" />
    </div>
  );
};

export const HeroSkeleton: React.FC = () => {
  return (
    <div className="relative w-full aspect-[21/9] min-h-[460px] max-h-[680px] bg-[#08111A] animate-pulse overflow-hidden rounded-3xl border border-white/5">
      <div className="absolute bottom-12 left-10 space-y-4 max-w-xl">
        <div className="h-6 w-32 bg-white/10 rounded-full" />
        <div className="h-12 w-96 bg-white/10 rounded-xl" />
        <div className="h-4 w-full bg-white/10 rounded-md" />
        <div className="h-4 w-2/3 bg-white/10 rounded-md" />
        <div className="flex gap-4 pt-4">
          <div className="h-12 w-36 bg-white/15 rounded-xl" />
          <div className="h-12 w-32 bg-white/10 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export const TableRowSkeleton: React.FC<{ cols?: number }> = ({ cols = 5 }) => {
  return (
    <tr className="border-b border-white/5 animate-pulse">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="py-4 px-4">
          <div className="h-4 bg-[#0D1722] rounded w-full" />
        </td>
      ))}
    </tr>
  );
};
