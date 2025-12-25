import React, { useState, useEffect } from 'react';
import { Search, UserPlus, RefreshCw, ShieldCheck, Mail, Edit3, Trash2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase/client';
import { AdminProfile } from '../../../types/admin';
import { AdminDialog } from './AdminDialog';
import { toast } from 'sonner';

export const AdminDirectory: React.FC = () => {
  const [admins, setAdmins] = useState<AdminProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAdmins(data || []);
    } catch (err: any) {
      toast.error('Failed to sync directory');
    } finally {
      setLoading(false);
    }
  };

  const filteredAdmins = admins.filter(a => 
    a.email.toLowerCase().includes(search.toLowerCase()) || 
    a.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-[#75E2FF]" />
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Privileged Directory</span>
          </div>
          <h1 className="text-4xl font-black text-black dark:text-white tracking-normal uppercase">Admin Staff</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1 max-w-lg font-medium">
            Manage infrastructure controllers and administrative accounts. Only visible to Super Admins.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={fetchAdmins}
            className="p-3 bg-white dark:bg-black border-2 border-black dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(117,226,255,0.1)]"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button 
            className="inline-flex items-center px-8 py-3.5 text-xs font-black text-black bg-[#75E2FF] rounded-full hover:bg-[#5CD4F2] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all uppercase tracking-widest" 
            onClick={() => setIsDialogOpen(true)}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Provision Admin
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <Search className="w-4 h-4 text-zinc-400" />
        </div>
        <input
          type="text"
          placeholder="SEARCH ACCESS KEYS..."
          className="w-full pl-12 pr-4 py-4 bg-white dark:bg-black border-2 border-black dark:border-zinc-800 text-[10px] font-black uppercase tracking-[0.2em] outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-white dark:bg-black border-2 border-black dark:border-zinc-800 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-zinc-50 dark:bg-zinc-900 border-b-2 border-black dark:border-zinc-800">
              <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest">Identity</th>
              <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-center">Security Role</th>
              <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest">Organization ID</th>
              <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  <RefreshCw className="w-4 h-4 animate-spin mx-auto mb-2" />
                  Syncing Permissions...
                </td>
              </tr>
            ) : filteredAdmins.map((admin) => (
              <tr key={admin.id} className="group hover:bg-[#75E2FF]/5 transition-colors">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-black dark:bg-zinc-800 flex items-center justify-center border border-black text-white font-black text-xs">
                      {admin.full_name?.[0] || 'A'}
                    </div>
                    <div>
                      <div className="font-black text-sm uppercase tracking-tight text-black dark:text-white">{admin.full_name || 'Unnamed Admin'}</div>
                      <div className="text-[9px] font-bold text-zinc-400 lowercase">{admin.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest border border-black ${
                    admin.role === 'super_admin' ? 'bg-black text-white' : 'bg-white text-black'
                  }`}>
                    {admin.role.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <span className="text-[10px] font-mono font-bold text-zinc-500 dark:text-zinc-400">
                    {admin.company_id || 'NOT_ASSIGNED'}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                   <div className="flex items-center justify-end gap-2">
                     <button className="p-2 text-zinc-400 hover:text-black dark:hover:text-white transition-colors">
                       <Edit3 className="w-4 h-4" />
                     </button>
                     <button className="p-2 text-red-500 hover:bg-red-50 transition-colors">
                       <Trash2 className="w-4 h-4" />
                     </button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdminDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        onSuccess={fetchAdmins} 
      />
    </div>
  );
};