import React, { useEffect, useState } from 'react';
import { Package } from '../../../types/package';
import { supabase } from '../../../lib/supabase/client';
import { Plus, Users, FileText, ArrowRight, Layout, Clock, ExternalLink } from 'lucide-react';
import { Button } from '../../ui/FormElements';

interface MainDashboardProps {
  userEmail: string;
  onNavigate: (module: 'crm' | 'cms') => void;
  onEditPackage: (id: string) => void;
}

export const MainDashboard: React.FC<MainDashboardProps> = ({ userEmail, onNavigate, onEditPackage }) => {
  const [recentPackages, setRecentPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const { data, error } = await supabase
          .from('packages')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) throw error;
        setRecentPackages(data || []);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecent();
  }, []);

  const adminName = userEmail.split('@')[0].replace('.', ' ');

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Header */}
      <header>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-[#75E2FF]" />
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">System Operational</span>
        </div>
        <h1 className="text-5xl font-black tracking-normal text-foreground">
          Welcome back, <span className="text-[#75E2FF]">{adminName}</span>
        </h1>
        <p className="text-muted-foreground mt-2 font-medium max-w-xl">
          Everything is running smoothly. You have {recentPackages.length} active campaigns in the pipeline.
        </p>
      </header>

      {/* Quick Actions Hero */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#75E2FF] border-2 border-black p-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(117,226,255,0.1)] group">
          <div className="w-12 h-12 bg-black flex items-center justify-center mb-6">
            <Plus className="w-6 h-6 text-[#75E2FF]" />
          </div>
          <h3 className="text-2xl font-black tracking-normal mb-2 text-black">Initialize Campaign</h3>
          <p className="text-black/70 font-bold text-sm mb-8 leading-relaxed">
            Create a new communication package and broadcast it to your organization via WhatsApp.
          </p>
          <Button 
            variant="primary" 
            className="w-full bg-black text-white rounded-none hover:bg-zinc-900"
            onClick={() => onNavigate('cms')}
          >
            Create New Package <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <div className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-800 p-10 shadow-[12px_12px_0px_0px_rgba(227,228,229,1)] dark:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          <div className="w-12 h-12 bg-black dark:bg-white flex items-center justify-center mb-6">
            <Users className="w-6 h-6 text-[#75E2FF] dark:text-black" />
          </div>
          <h3 className="text-2xl font-black tracking-normal mb-2 text-foreground">Personnel Registry</h3>
          <p className="text-muted-foreground font-bold text-sm mb-8 leading-relaxed">
            Manage your audience segments, verify identities, and track individual engagement rates.
          </p>
          <Button 
            variant="secondary" 
            className="w-full rounded-none dark:bg-zinc-800 dark:text-white"
            onClick={() => onNavigate('crm')}
          >
            Manage Employees <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Recent Activity */}
      <section className="space-y-6 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-foreground">
            <Clock className="w-4 h-4 text-[#75E2FF]" />
            Recent Distribution
          </h2>
          <button 
            onClick={() => onNavigate('cms')}
            className="text-[10px] font-black uppercase tracking-widest text-[#75E2FF] hover:underline"
          >
            View All Content
          </button>
        </div>

        <div className="bg-white dark:bg-zinc-950 border-2 border-black dark:border-zinc-800 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-900 border-b-2 border-black dark:border-zinc-800">
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-foreground">Campaign Title</th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-foreground">Status</th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-right text-foreground">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-black border-t-[#75E2FF] animate-spin" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Syncing Registry...</span>
                    </div>
                  </td>
                </tr>
              ) : recentPackages.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-muted-foreground text-[10px] font-black uppercase">
                    No active packages found.
                  </td>
                </tr>
              ) : (
                recentPackages.map((pkg) => (
                  <tr key={pkg.id} className="group hover:bg-[#75E2FF]/5 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-black dark:bg-zinc-800 flex items-center justify-center border border-black group-hover:border-[#75E2FF]">
                          <FileText className="w-4 h-4 text-white dark:text-[#75E2FF]" />
                        </div>
                        <span className="font-black text-sm tracking-normal text-foreground group-hover:text-[#75E2FF] transition-colors">{pkg.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest border border-black ${
                        pkg.status === 'published' ? 'bg-[#75E2FF] text-black' : 'bg-black text-white'
                      }`}>
                        {pkg.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button 
                        onClick={() => onEditPackage(pkg.id)}
                        className="p-2 text-muted-foreground hover:text-foreground transition-all"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};