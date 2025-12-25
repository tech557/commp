import React, { useState, useEffect } from 'react';
import { Search, Plus, RefreshCw, Filter } from 'lucide-react';
import { Toaster } from 'sonner';
import { Employee } from '../../../types/employee';
import { EmployeeTable } from './EmployeeTable';
import { EmployeeDialog } from './EmployeeDialog';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase/client';

export const EmployeeList: React.FC = () => {
  const [search, setSearch] = useState('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    if (isSupabaseConfigured) {
      fetchEmployees();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('employees')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setEmployees(data || []);
    } catch (err: any) {
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  };

  const openAddDialog = () => {
    setSelectedEmployee(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDialogOpen(true);
  };

  const filteredEmployees = employees.filter(emp => {
    const searchLower = search.toLowerCase();
    return (
      emp.email.toLowerCase().includes(searchLower) ||
      emp.full_name?.toLowerCase().includes(searchLower) ||
      emp.department?.toLowerCase().includes(searchLower) ||
      emp.location?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <Toaster position="top-right" richColors closeButton />
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-[#75E2FF]" />
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Internal CRM</span>
          </div>
          <h1 className="text-4xl font-black text-foreground tracking-normal">Directory</h1>
          <p className="text-muted-foreground mt-1 max-w-lg font-medium">
            Manage your internal communication segments and employee information across the organization.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={fetchEmployees}
            disabled={loading}
            className="p-3 bg-white dark:bg-black border-2 border-black dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all disabled:opacity-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(117,226,255,0.1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button 
            className="inline-flex items-center px-8 py-3.5 text-xs font-black text-black bg-[#75E2FF] rounded-full hover:bg-[#5CD4F2] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(117,226,255,0.2)] transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none uppercase tracking-widest" 
            onClick={openAddDialog}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Employee
          </button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-white dark:bg-black rounded-none border-2 border-black dark:border-zinc-800 shadow-[8px_8px_0px_0px_rgba(227,228,229,1)] dark:shadow-[8px_8px_0px_0px_rgba(24,24,27,1)]">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="SEARCH BY IDENTITY..."
            className="w-full pl-11 pr-4 py-3.5 text-sm bg-zinc-50 dark:bg-zinc-900/50 border-none rounded-none focus:ring-0 transition-all outline-none placeholder:text-muted-foreground font-bold uppercase tracking-widest text-foreground"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="px-6 py-3.5 bg-black dark:bg-zinc-800 text-white dark:text-[#75E2FF] border-none rounded-none hover:bg-zinc-900 transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
          <Filter className="w-4 h-4" />
          Refine
        </button>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 text-muted-foreground bg-white/50 dark:bg-zinc-900/10 rounded-none border-2 border-black dark:border-zinc-800 border-dashed">
          <div className="w-12 h-12 border-4 border-black border-t-[#75E2FF] dark:border-zinc-800 dark:border-t-[#75E2FF] animate-spin" />
          <p className="mt-6 text-[10px] font-black tracking-widest text-foreground uppercase animate-pulse">Synchronizing Data Integrity</p>
        </div>
      ) : (
        <div className="space-y-4">
          <EmployeeTable 
            employees={filteredEmployees} 
            onEdit={openEditDialog} 
            onRefresh={fetchEmployees}
          />
        </div>
      )}

      {/* Dialog Overlay */}
      <EmployeeDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        onSuccess={fetchEmployees}
        employee={selectedEmployee}
      />
    </div>
  );
};