import React from 'react';

interface PollBreakdownProps {
  polls: Array<{
    question: string;
    options: string[];
    votes: Record<string, number>;
    totalVotes: number;
  }>;
}

export const PollBreakdown: React.FC<PollBreakdownProps> = ({ polls }) => {
  if (polls.length === 0) return null;

  return (
    <div className="space-y-8">
      {polls.map((poll, i) => (
        <div key={i} className="bg-white border-2 border-black p-8 shadow-[12px_12px_0px_0px_rgba(227,228,229,1)]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 rounded-full bg-[#75E2FF]" />
            <h3 className="text-lg font-black uppercase tracking-tight">{poll.question}</h3>
          </div>
          
          <div className="space-y-6">
            {poll.options.map((option, idx) => {
              const voteCount = poll.votes[option] || 0;
              const percentage = poll.totalVotes > 0 ? Math.round((voteCount / poll.totalVotes) * 100) : 0;
              
              return (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-black uppercase tracking-widest text-black">{option}</span>
                    <span className="text-[10px] font-black text-slate-400">{voteCount} VOTES ({percentage}%)</span>
                  </div>
                  <div className="h-4 w-full bg-slate-100 border border-black overflow-hidden">
                    <div 
                      className="h-full bg-[#75E2FF] transition-all duration-1000 border-r border-black"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Consolidated Data</span>
            <span className="text-[9px] font-black uppercase tracking-widest text-black">Total Votes: {poll.totalVotes}</span>
          </div>
        </div>
      ))}
    </div>
  );
};