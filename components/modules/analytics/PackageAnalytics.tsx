import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase/client';
import { AnalyticsSummary } from './AnalyticsSummary';
import { PollResults } from './PollResults';
import { EmployeeEngagementTable } from './EmployeeEngagementTable';
import { EmptyAnalyticsState } from './EmptyAnalyticsState';
import { RefreshCw, Download, BarChart3, Users, PieChart } from 'lucide-react';
import { toast } from 'sonner';

interface PackageAnalyticsProps {
  packageId: string;
}

export const PackageAnalytics: React.FC<PackageAnalyticsProps> = ({ packageId }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    stats: any;
    polls: any[];
    employees: any[];
    viewedIds: Map<string, string>; // Map of ID to most recent timestamp
  } | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, [packageId]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch Events
      const { data: events, error: eventsError } = await supabase
        .from('analytics_events')
        .select('*')
        .eq('package_id', packageId)
        .order('created_at', { ascending: false });

      if (eventsError) throw eventsError;

      // 2. Fetch All Employees (for the engagement table)
      const { data: employees, error: empError } = await supabase
        .from('employees')
        .select('*');

      if (empError) throw empError;

      // 3. Fetch Blocks (to get poll details)
      const { data: blocks, error: blocksError } = await supabase
        .from('content_blocks')
        .select('*')
        .eq('package_id', packageId);

      if (blocksError) throw blocksError;

      // Process Data
      const viewEvents = events.filter(e => e.event_type === 'open');
      const pollEvents = events.filter(e => e.event_type === 'submit_poll');
      
      // Map of unique viewer IDs to their latest interaction timestamp
      const interactionMap = new Map<string, string>();
      events.forEach(e => {
        if (!interactionMap.has(e.employee_id)) {
          interactionMap.set(e.employee_id, e.created_at);
        }
      });
      
      const pollBreakdown = blocks
        .filter(b => b.type === 'poll')
        .map(b => {
          const relevantEvents = pollEvents.filter(e => e.metadata?.block_id === b.id);
          const votes: Record<string, number> = {};
          relevantEvents.forEach(e => {
            const opt = e.metadata?.selected_option;
            if (opt) votes[opt] = (votes[opt] || 0) + 1;
          });
          return {
            question: b.content.question,
            options: b.content.options || [],
            votes,
            totalVotes: relevantEvents.length
          };
        });

      setData({
        stats: {
          totalViews: viewEvents.length,
          uniqueViewers: interactionMap.size,
          totalEmployees: employees.length,
          pollResponses: pollEvents.length
        },
        polls: pollBreakdown,
        employees: employees || [],
        viewedIds: interactionMap
      });

    } catch (err: any) {
      toast.error('Failed to sync analytics: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center">
        <RefreshCw className="w-10 h-10 animate-spin text-black mb-4" />
        <span className="text-[10px] font-black uppercase tracking-widest text-black">Crunching Engagement Matrix</span>
      </div>
    );
  }

  // Handle Empty State
  if (data?.stats.totalViews === 0) {
    return <EmptyAnalyticsState />;
  }

  if (!data) return null;

  return (
    <div className="space-y-16 animate-in fade-in duration-500 pb-24">
      {/* Summary Scorecards */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#75E2FF]" />
            Performance Snapshot
          </h2>
          <button 
            onClick={fetchAnalytics}
            className="p-2 border border-black hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        <AnalyticsSummary stats={data.stats} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Poll Charts */}
        <section className="space-y-6">
          <h2 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
            <PieChart className="w-4 h-4 text-[#75E2FF]" />
            Sentiment Analysis
          </h2>
          {data.polls.length > 0 ? (
            <PollResults polls={data.polls} />
          ) : (
            <div className="p-12 border-2 border-dashed border-slate-200 text-center text-slate-400 bg-slate-50">
              <span className="text-[10px] font-black uppercase tracking-widest">No Poll Blocks Configured</span>
            </div>
          )}
        </section>

        {/* Engagement Ledger */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
              <Users className="w-4 h-4 text-[#75E2FF]" />
              Engagement Ledger
            </h2>
            <button className="text-[9px] font-black uppercase tracking-widest flex items-center gap-1 hover:text-[#75E2FF] transition-colors">
              <Download className="w-3 h-3" /> Export CSV
            </button>
          </div>
          <EmployeeEngagementTable 
            employees={data.employees} 
            viewedIds={data.viewedIds} 
          />
        </section>
      </div>
    </div>
  );
};