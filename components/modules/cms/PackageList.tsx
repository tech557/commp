import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw, FileText, ChevronRight, Layout } from 'lucide-react';
import { supabase } from '../../../lib/supabase/client';
import { Package } from '../../../types/package';
import { PackageDialog } from './PackageDialog';
import { toast } from 'sonner';

interface PackageListProps {
  onSelect: (pkgId: string) => void;
}

export const PackageList: React.FC<PackageListProps> = ({ onSelect }) => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPackages(data || []);
    } catch (err: any) {
      toast.error('Failed to load packages');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-[#75E2FF]" />
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Distribution Engine</span>
          </div>
          <h1 className="text-4xl font-black text-foreground tracking-normal">Packages</h1>
          <p className="text-muted-foreground mt-1 max-w-lg font-medium">
            Create and manage rich communication packages for your workforce.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={fetchPackages}
            className="p-3 text-muted-foreground hover:text-foreground transition-all"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button 
            className="inline-flex items-center px-8 py-3.5 text-xs font-black text-black bg-[#75E2FF] rounded-full hover:bg-[#5CD4F2] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(117,226,255,0.2)] transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none uppercase tracking-widest" 
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Package
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-black rounded-none border-2 border-black dark:border-zinc-800 shadow-sm overflow-hidden">
        {loading && packages.length === 0 ? (
          <div className="p-20 flex flex-col items-center justify-center text-muted-foreground">
            <div className="w-10 h-10 border-4 border-zinc-100 border-t-[#75E2FF] animate-spin mb-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Loading packages...</span>
          </div>
        ) : packages.length === 0 ? (
          <div className="p-20 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-900 rounded-none border border-black dark:border-zinc-800 flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-zinc-200 dark:text-zinc-800" />
            </div>
            <h3 className="text-lg font-black text-foreground tracking-normal">No packages yet</h3>
            <p className="text-muted-foreground text-sm mt-1 max-w-xs font-medium">
              Start by creating your first communication package. It's where your content lives.
            </p>
            <button 
              onClick={() => setIsDialogOpen(true)}
              className="mt-6 text-[#75E2FF] text-[10px] font-black uppercase tracking-widest hover:underline"
            >
              Create your first package
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-900 border-b-2 border-black dark:border-zinc-800">
                  <th className="px-6 py-5 text-[10px] font-black text-black dark:text-white uppercase tracking-widest">Package</th>
                  <th className="px-6 py-5 text-[10px] font-black text-black dark:text-white uppercase tracking-widest">Status</th>
                  <th className="px-6 py-5 text-[10px] font-black text-black dark:text-white uppercase tracking-widest">Created</th>
                  <th className="px-6 py-5 text-[10px] font-black text-black dark:text-white uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black dark:divide-zinc-800">
                {packages.map((pkg) => (
                  <tr 
                    key={pkg.id} 
                    className="group hover:bg-[#75E2FF]/5 cursor-pointer transition-colors"
                    onClick={() => onSelect(pkg.id)}
                  >
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-black dark:bg-zinc-900 flex items-center justify-center shrink-0 border border-black dark:border-zinc-800 group-hover:border-[#75E2FF] transition-colors">
                          <Layout className="w-5 h-5 text-white dark:text-[#75E2FF]" />
                        </div>
                        <div>
                          <div className="font-black text-foreground tracking-normal text-lg group-hover:text-[#75E2FF] transition-colors">{pkg.title}</div>
                          <div className="text-[10px] font-black text-muted-foreground tracking-widest mt-0.5">/{pkg.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className={`inline-flex items-center px-3 py-1 text-[9px] font-black uppercase tracking-widest border ${
                        pkg.status === 'published' 
                          ? 'bg-[#75E2FF] text-black border-black' 
                          : 'bg-black text-white border-black dark:bg-zinc-800 dark:border-zinc-700'
                      }`}>
                        {pkg.status}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-foreground font-bold uppercase text-xs">
                      {formatDate(pkg.created_at)}
                    </td>
                    <td className="px-6 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="p-2 text-zinc-300 group-hover:text-[#75E2FF] transition-all">
                          <ChevronRight className="w-6 h-6" />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <PackageDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        onSuccess={(id) => {
          fetchPackages();
          onSelect(id);
        }}
      />
    </div>
  );
};