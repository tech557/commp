import React from 'react';
import { Employee } from '../../../types/employee';
import { Mail, MapPin, Edit2, Trash2, ArrowUpRight } from 'lucide-react';
import { supabase } from '../../../lib/supabase/client';
import { toast } from 'sonner';

interface EmployeeTableProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onRefresh: () => void;
}

const getInitials = (name?: string, email?: string) => {
  if (name) return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  if (email) return email[0].toUpperCase();
  return '?';
};

export const EmployeeTable: React.FC<EmployeeTableProps> = ({ employees, onEdit, onRefresh }) => {
  const handleDelete = async (id: string, name: string) => {
    if (confirm(`TERMINATE RECORD FOR ${name.toUpperCase()}?`)) {
      try {
        const { error } = await supabase.from('employees').delete().eq('id', id);
        if (error) throw error;
        toast.success('Record purged from directory');
        onRefresh();
      } catch (err: any) {
        toast.error('Purge failed');
      }
    }
  };

  if (employees.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 border-2 border-dashed border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black animate-in fade-in duration-300">
        <p className="text-[10px] font-black text-black dark:text-white uppercase tracking-widest">No matching identities found</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-black border-2 border-black dark:border-zinc-800 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50 dark:bg-zinc-900 border-b-2 border-black dark:border-zinc-800">
              <th className="px-6 py-5 text-[10px] font-black text-black dark:text-white uppercase tracking-widest">Identity</th>
              <th className="px-6 py-5 text-[10px] font-black text-black dark:text-white uppercase tracking-widest">Department</th>
              <th className="px-6 py-5 text-[10px] font-black text-black dark:text-white uppercase tracking-widest">Location</th>
              <th className="px-6 py-5 text-[10px] font-black text-black dark:text-white uppercase tracking-widest">Tags</th>
              <th className="px-6 py-5 text-[10px] font-black text-black dark:text-white uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900">
            {employees.map((emp) => (
              <tr key={emp.id} className="group hover:bg-[#75E2FF]/5 transition-all duration-200">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-black dark:bg-zinc-800 border border-black dark:border-zinc-700 flex items-center justify-center text-white dark:text-[#75E2FF] font-black text-xs shrink-0 transition-colors group-hover:border-[#75E2FF]">
                      {getInitials(emp.full_name, emp.email)}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-black text-black dark:text-white tracking-normal text-base truncate group-hover:text-[#75E2FF] transition-colors">
                        {emp.full_name || 'Anonymous'}
                      </span>
                      <div className="flex items-center text-zinc-500 dark:text-zinc-400 text-[10px] font-bold lowercase tracking-normal mt-0.5 truncate">
                        <Mail className="w-3 h-3 mr-1.5 text-[#75E2FF]" />
                        {emp.email?.toLowerCase()}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  {emp.department ? (
                    <span className="inline-flex items-center px-3 py-1 text-[9px] font-black uppercase tracking-widest bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white border border-zinc-200 dark:border-zinc-700">
                      {emp.department}
                    </span>
                  ) : (
                    <span className="text-zinc-300 dark:text-zinc-600 text-[9px] font-black uppercase tracking-widest italic">Unassigned</span>
                  )}
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center text-black dark:text-white font-bold uppercase text-[10px] tracking-widest">
                    <MapPin className="w-3.5 h-3.5 mr-2 text-zinc-400" />
                    <span className="truncate">{emp.location || 'Global/Remote'}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-wrap gap-1.5">
                    {emp.tags && emp.tags.length > 0 ? (
                      emp.tags.slice(0, 2).map((tag, i) => (
                        <span key={i} className="inline-flex items-center px-2 py-0.5 bg-black dark:bg-zinc-800 text-white dark:text-[#75E2FF] text-[8px] font-black uppercase tracking-widest">
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-zinc-200 dark:text-zinc-800 text-[9px] font-black">---</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => onEdit(emp)}
                      className="p-2 text-black dark:text-white hover:bg-[#75E2FF] hover:text-black transition-all border border-transparent hover:border-black" 
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(emp.id, emp.full_name || emp.email)}
                      className="p-2 text-red-600 hover:bg-red-600 hover:text-white transition-all border border-transparent hover:border-black" 
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-zinc-400 hover:text-black dark:hover:text-white transition-all">
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};