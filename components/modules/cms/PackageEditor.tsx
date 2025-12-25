import React, { useState, useEffect } from 'react';
import { Package } from '../../../types/package';
import { supabase } from '../../../lib/supabase/client';
import { ChevronLeft, Rocket, Settings, Loader2, Layout, BarChart3, FileEdit, Copy, ExternalLink } from 'lucide-react';
import { Button } from '../../ui/FormElements';
import { BlockEditor } from './BlockEditor';
import { PackageAnalytics } from '../analytics/PackageAnalytics';
import { toast } from 'sonner';

interface PackageEditorProps {
  packageId: string;
  onBack: () => void;
}

export const PackageEditor: React.FC<PackageEditorProps> = ({ packageId, onBack }) => {
  const [pkg, setPkg] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'content' | 'analytics'>('content');
  const [testEmployeeId, setTestEmployeeId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('packages')
          .select('*')
          .eq('id', packageId)
          .single();

        if (error) throw error;
        setPkg(data);

        // Fetch a random employee ID for testing the link
        const { data: employees } = await supabase.from('employees').select('id').limit(1);
        if (employees && employees.length > 0) {
          setTestEmployeeId(employees[0].id);
        }
      } catch (err: any) {
        toast.error('Failed to load package details');
        onBack();
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [packageId, onBack]);

  const handlePublish = async () => {
    try {
      const { error } = await supabase
        .from('packages')
        .update({ status: 'published' })
        .eq('id', packageId);

      if (error) throw error;
      setPkg(prev => prev ? { ...prev, status: 'published' } : null);
      toast.success('Campaign is now live');
    } catch (err: any) {
      toast.error('Failed to publish');
    }
  };

  const handleUnpublish = async () => {
    try {
      const { error } = await supabase
        .from('packages')
        .update({ status: 'draft' })
        .eq('id', packageId);

      if (error) throw error;
      setPkg(prev => prev ? { ...prev, status: 'draft' } : null);
      toast.success('Campaign retracted to draft');
    } catch (err: any) {
      toast.error('Failed to retract');
    }
  };

  const getPublicLink = () => {
    if (!pkg) return '';
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?p=${pkg.slug}&t=${testEmployeeId || 'REPLACE_WITH_EMPLOYEE_ID'}`;
  };

  const copyLink = () => {
    navigator.clipboard.writeText(getPublicLink());
    toast.success('Public link copied to clipboard');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-zinc-400">
        <Loader2 className="w-10 h-10 animate-spin text-[#75E2FF] mb-4" />
        <p className="text-[10px] font-black tracking-widest text-zinc-600 uppercase">Initializing OS/Editor...</p>
      </div>
    );
  }

  if (!pkg) return null;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Context Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b-2 border-black dark:border-zinc-800">
        <div className="flex items-center gap-6">
          <button 
            onClick={onBack}
            className="p-3 bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(117,226,255,0.1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            <ChevronLeft className="w-5 h-5 text-black dark:text-white" />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-widest border border-black dark:border-zinc-800 ${
                pkg.status === 'published' 
                  ? 'bg-[#75E2FF] text-black' 
                  : 'bg-black text-white dark:bg-zinc-800 dark:text-zinc-300'
              }`}>
                {pkg.status}
              </span>
              <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Package Engine / {view === 'content' ? 'Edit Mode' : 'Analytics Mode'}</span>
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-black dark:text-white uppercase">{pkg.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex bg-black dark:bg-zinc-900 p-1 mr-4">
            <button 
              onClick={() => setView('content')}
              className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${
                view === 'content' ? 'bg-[#75E2FF] text-black' : 'text-zinc-500 hover:text-white'
              }`}
            >
              <FileEdit className="w-3.5 h-3.5" />
              Content
            </button>
            <button 
              onClick={() => setView('analytics')}
              className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${
                view === 'analytics' ? 'bg-[#75E2FF] text-black' : 'text-zinc-500 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Analytics
            </button>
          </div>

          <button className="p-3 text-black dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800 border-2 border-black dark:border-zinc-800 transition-all">
            <Settings className="w-5 h-5" />
          </button>
          <div className="w-[2px] h-10 bg-black dark:bg-zinc-800 mx-1" />
          {pkg.status !== 'published' ? (
            <Button onClick={handlePublish} variant="accent" className="px-10 py-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(117,226,255,0.2)]">
              <Rocket className="w-4 h-4 mr-2" />
              Go Live
            </Button>
          ) : (
            <Button onClick={handleUnpublish} variant="secondary" className="px-10 py-4 border-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.5)]">
              Unpublish
            </Button>
          )}
        </div>
      </div>

      {view === 'content' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Editor Canvas */}
          <div className="lg:col-span-8">
            <BlockEditor packageId={pkg.id} />
          </div>

          {/* Sidebar / Configuration */}
          <div className="lg:col-span-4 space-y-8">
            {pkg.status === 'published' && (
              <div className="bg-[#75E2FF] border-2 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="text-xs font-black text-black uppercase tracking-widest mb-6 flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Live Deployment
                </h3>
                <p className="text-sm font-bold text-black mb-4">Your campaign is live. Test the employee experience below.</p>
                <div className="space-y-4">
                  <div className="p-3 bg-white border border-black font-mono text-[10px] break-all text-black">
                    {getPublicLink()}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={copyLink}
                      className="flex-1 py-3 bg-black text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      Copy Link
                    </button>
                    <a 
                      href={getPublicLink()} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 py-3 bg-white border border-black text-black text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Preview
                    </a>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white dark:bg-zinc-950 border-2 border-black dark:border-zinc-800 p-8 shadow-[12px_12px_0px_0px_rgba(227,228,229,1)] dark:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-xs font-black text-black dark:text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                <Layout className="w-4 h-4" />
                Campaign Properties
              </h3>
              
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-2">Package Slug</p>
                  <div className="p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 font-mono text-xs text-zinc-600 dark:text-zinc-400">
                    /p/{pkg.slug}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-2">Distribution</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-black dark:bg-white text-white dark:text-black text-[9px] font-black uppercase tracking-widest">All Staff</span>
                    <span className="px-2 py-1 border border-black dark:border-zinc-800 text-black dark:text-white text-[9px] font-black uppercase tracking-widest hover:bg-[#75E2FF] hover:text-black cursor-pointer transition-colors">+ Add Segment</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-black dark:bg-[#75E2FF]/10 border-2 border-black dark:border-[#75E2FF] p-8 shadow-[12px_12px_0px_0px_rgba(117,226,255,0.4)]">
              <h3 className="text-xs font-black text-[#75E2FF] dark:text-white uppercase tracking-widest mb-4">Pro Tip</h3>
              <p className="text-sm font-bold text-white leading-tight">
                Keep your messages short. High-intensity visuals perform 40% better on mobile distribution.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <PackageAnalytics packageId={pkg.id} />
      )}
    </div>
  );
};