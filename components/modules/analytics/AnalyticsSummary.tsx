import React from 'react';
import { Eye, Users, BarChart2 } from 'lucide-react';

interface AnalyticsSummaryProps {
  stats: {
    totalViews: number;
    uniqueViewers: number;
    totalEmployees: number;
    pollResponses: number;
  };
}

export const AnalyticsSummary: React.FC<AnalyticsSummaryProps> = ({ stats }) => {
  const engagementRate = stats.totalEmployees > 0 
    ? Math.round((stats.uniqueViewers / stats.totalEmployees) * 100) 
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Reach Card with Circular Progress */}
      <div className="bg-white border-2 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center gap-6">
        <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="32" cy="32" r="28"
              fill="none" stroke="#F1F5F9" strokeWidth="6"
            />
            <circle
              cx="32" cy="32" r="28"
              fill="none" stroke="#75E2FF" strokeWidth="6"
              strokeDasharray={175}
              strokeDashoffset={175 - (175 * engagementRate) / 100}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <span className="absolute text-[11px] font-black">{engagementRate}%</span>
        </div>
        <div>
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Reach</div>
          <div className="text-2xl font-black tracking-tighter uppercase leading-none">
            {stats.uniqueViewers} <span className="text-slate-300">/ {stats.totalEmployees}</span>
          </div>
        </div>
      </div>

      <SummaryCard icon={Eye} label="Total Views" value={stats.totalViews} />
      <SummaryCard icon={BarChart2} label="Poll Responses" value={stats.pollResponses} />
      <SummaryCard icon={Users} label="Unique Visitors" value={stats.uniqueViewers} />
    </div>
  );
};

const SummaryCard = ({ icon: Icon, label, value }: any) => (
  <div className="bg-white border-2 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
    <div className="flex items-center justify-between mb-4">
      <Icon className="w-5 h-5 text-black" />
      <div className="w-1.5 h-1.5 rounded-full bg-[#75E2FF] animate-pulse" />
    </div>
    <div className="text-3xl font-black tracking-tighter uppercase mb-1">{value}</div>
    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</div>
  </div>
);