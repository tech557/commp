import React from 'react';

interface PollResultsProps {
  polls: Array<{
    question: string;
    options: string[];
    votes: Record<string, number>;
    totalVotes: number;
  }>;
}

export const PollResults: React.FC<PollResultsProps> = ({ polls }) => {
  if (polls.length === 0) return null;

  return (
    <div className="space-y-8">
      {polls.map((poll, i) => (
        <div key={i} className="bg-white border-2 border-black p-8 shadow-[12px_12px_0px_0px_rgba(117,226,255,0.1)]">
          <h3 className="text-xl font-black uppercase tracking-tight mb-8 leading-tight">
            {poll.question}
          </h3>
          
          <div className="space-y-8">
            {poll.options.map((option, idx) => {
              const voteCount = poll.votes[option] || 0;
              const percentage = poll.totalVotes > 0 ? Math.round((voteCount / poll.totalVotes) * 100) : 0;
              
              return (
                <div key={idx} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black uppercase tracking-widest text-black flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${percentage > 0 ? 'bg-[#75E2FF]' : 'bg-slate-200'}`} />
                      {option}
                    </span>
                    <span className="text-[10px] font-black text-slate-400">
                      {voteCount} VOTES <span className="text-black ml-1">({percentage}%)</span>
                    </span>
                  </div>
                  <div className="h-5 w-full bg-slate-50 border border-black relative overflow-hidden">
                    <div 
                      className="h-full bg-[#75E2FF] transition-all duration-1000 ease-in-out border-r border-black"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-10 pt-6 border-t border-slate-100 flex justify-between items-center">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Aggregate Response Matrix</span>
            <div className="px-3 py-1 bg-black text-white text-[8px] font-black uppercase tracking-widest">
              N={poll.totalVotes}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};