import React, { useState } from 'react';
import { ContentBlock } from '../../../types/package';
import { supabase } from '../../../lib/supabase/client';
import { CheckCircle2 } from 'lucide-react';

interface PublicBlockRendererProps {
  blocks: ContentBlock[];
  packageId: string;
  employeeId: string;
}

export const PublicBlockRenderer: React.FC<PublicBlockRendererProps> = ({ blocks, packageId, employeeId }) => {
  const [submittedPolls, setSubmittedPolls] = useState<Record<string, boolean>>({});

  const handlePollSubmit = async (blockId: string, option: string) => {
    if (submittedPolls[blockId]) return;

    try {
      const { error } = await supabase.from('analytics_events').insert([{
        employee_id: employeeId,
        package_id: packageId,
        event_type: 'submit_poll',
        metadata: { block_id: blockId, selected_option: option }
      }]);

      if (error) throw error;
      setSubmittedPolls(prev => ({ ...prev, [blockId]: true }));
    } catch (err) {
      console.error('Failed to submit poll:', err);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      {blocks.map((block) => {
        const { type, content, id } = block;

        switch (type) {
          case 'header':
            return (
              <header key={id} className="pt-4">
                <h2 className="text-3xl md:text-4xl font-black text-black uppercase tracking-tighter leading-none">
                  {content.text}
                </h2>
                <div className="h-1 w-12 bg-[#75E2FF] mt-4" />
              </header>
            );

          case 'text':
            return (
              <div key={id} className="prose prose-slate max-w-none">
                <p className="text-lg leading-relaxed text-slate-700 font-medium whitespace-pre-wrap">
                  {content.body}
                </p>
              </div>
            );

          case 'image':
            return (
              <div key={id} className="overflow-hidden border border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <img 
                  src={content.url} 
                  alt={content.caption || 'Campaign Image'} 
                  className="w-full h-auto block"
                />
                {content.caption && (
                  <div className="p-3 bg-slate-50 border-t border-black italic text-xs text-slate-500 font-bold uppercase tracking-widest">
                    {content.caption}
                  </div>
                )}
              </div>
            );

          case 'poll':
            const isSubmitted = submittedPolls[id];
            return (
              <div key={id} className="bg-white border-2 border-black p-6 md:p-8 space-y-6 shadow-[12px_12px_0px_0px_rgba(117,226,255,1)]">
                <h3 className="text-xl font-black text-black uppercase tracking-tight leading-tight">
                  {content.question}
                </h3>
                
                <div className="space-y-3">
                  {isSubmitted ? (
                    <div className="py-8 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-500">
                      <div className="w-12 h-12 bg-[#75E2FF] rounded-full flex items-center justify-center mb-4">
                        <CheckCircle2 className="w-6 h-6 text-black" />
                      </div>
                      <p className="text-sm font-black uppercase tracking-widest text-black">Response Registered</p>
                      <p className="text-xs text-slate-500 mt-1 font-bold">Thank you for participating.</p>
                    </div>
                  ) : (
                    (content.options || []).map((option: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => handlePollSubmit(id, option)}
                        className="w-full py-4 px-6 text-left font-black uppercase tracking-widest text-xs border-2 border-[#E3E4E5] rounded-full transition-all hover:border-[#75E2FF] hover:text-[#75E2FF] active:scale-[0.98] focus:outline-none"
                      >
                        {option}
                      </button>
                    ))
                  )}
                </div>
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
};