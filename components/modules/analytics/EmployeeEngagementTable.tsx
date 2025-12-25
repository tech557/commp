import React, { useState, useMemo } from 'react';
import { Mail, CheckCircle, Clock, Filter, Search, ArrowUpDown } from 'lucide-react';

interface EmployeeEngagementTableProps {
  employees: any[];
  viewedIds: Map<string, string>; // ID to Last Interaction Timestamp
}

export const EmployeeEngagementTable: React.FC<EmployeeEngagementTableProps> = ({ employees, viewedIds }) => {
  const [filterPending, setFilterPending] = useState(false);
  const [search, setSearch] = useState('');

  const sortedAndFiltered = useMemo(() => {
    return employees
      .filter(emp => {
        const isViewed = viewedIds.has(emp.id);
        const matchesSearch = emp.full_name?.toLowerCase().includes(search.toLowerCase()) || 
                             emp.email.toLowerCase().includes(search.toLowerCase());
        
        if (filterPending && isViewed) return false;
        return matchesSearch;
      })
      .sort((a, b) => {
        // Pending (false) should come before Viewed (true)
        const aViewed = viewedIds.has(a.id);
        const bViewed = viewedIds.has(b.id);
        if (aViewed === bViewed) return 0;
        return aViewed ? 1 : -1;
      });
  }, [employees, viewedIds, filterPending, search]);

  const formatLastActive = (timestamp?: string) => {
    if (!timestamp) return '---';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="SEARCH REGISTRY..."
            className="w-full pl-11 pr-4 py-3 bg-white border-2 border-black text-[10px] font-black uppercase tracking-widest outline-none focus:ring-0"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setFilterPending(!filterPending)}
          className={`px-6 py-3 border-2 border-black text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] ${
            filterPending ? 'bg-black text-white' : 'bg-[#75E2FF] text-black'
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          {filterPending ? 'Show All' : 'Pending Only'}
        </button>
      </div>

      <div className="bg-white border-2 border-black overflow-hidden shadow-[12px_12px_0px_0px_rgba(227,228,229,1)]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b-2 border-black">
              <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest">Identity</th>
              <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-center">Status</th>
              <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-right flex items-center justify-end gap-1">
                Last Active <ArrowUpDown className="w-3 h-3" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedAndFiltered.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-16 text-center text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  No records matching the current parameters
                </td>
              </tr>
            ) : (
              sortedAndFiltered.map((emp) => {
                const lastActive = viewedIds.get(emp.id);
                const isViewed = !!lastActive;
                return (
                  <tr key={emp.id} className="group hover:bg-[#75E2FF]/5 transition-all">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-black uppercase tracking-tight group-hover:text-[#75E2FF] transition-colors">{emp.full_name || 'Anonymous'}</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{emp.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        {isViewed ? (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#75E2FF] border border-black text-[9px] font-black uppercase tracking-widest text-black">
                            <CheckCircle className="w-3 h-3" />
                            Active
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 text-[9px] font-black uppercase tracking-widest text-slate-300">
                            <Clock className="w-3 h-3" />
                            Pending
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">
                        {formatLastActive(lastActive)}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};