import React, { useEffect, useState } from 'react';
import { Package, ContentBlock } from '../../../types/package';
import { supabase } from '../../../lib/supabase/client';
import { PublicBlockRenderer } from './PublicBlockRenderer';
import { Loader2, ShieldAlert, Lock } from 'lucide-react';

interface PublicViewProps {
  slug: string;
  token: string;
}

export const PublicView: React.FC<PublicViewProps> = ({ slug, token }) => {
  const [pkg, setPkg] = useState<Package | null>(null);
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<'not_found' | 'unauthorized' | 'server' | null>(null);
  const [employeeId, setEmployeeId] = useState<string | null>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true);

        // 1. Verify Employee Token
        const { data: employee, error: empError } = await supabase
          .from('employees')
          .select('id')
          .eq('id', token)
          .single();

        if (empError || !employee) {
          setError('unauthorized');
          setLoading(false);
          return;
        }
        setEmployeeId(employee.id);

        // 2. Fetch Package (Must be published)
        const { data: packageData, error: pkgError } = await supabase
          .from('packages')
          .select('*')
          .eq('slug', slug)
          .eq('status', 'published')
          .single();

        if (pkgError || !packageData) {
          setError('not_found');
          setLoading(false);
          return;
        }
        setPkg(packageData);

        // 3. Fetch Blocks
        const { data: blocksData, error: blocksError } = await supabase
          .from('content_blocks')
          .select('*')
          .eq('package_id', packageData.id)
          .order('sort_order', { ascending: true });

        if (blocksError) throw blocksError;
        setBlocks(blocksData || []);

        // 4. Log View Event
        await supabase.from('analytics_events').insert([{
          employee_id: employee.id,
          package_id: packageData.id,
          event_type: 'open'
        }]);

      } catch (err) {
        console.error('Public view error:', err);
        setError('server');
      } finally {
        setLoading(false);
      }
    };

    if (slug && token) {
      initialize();
    }
  }, [slug, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 border-4 border-black border-t-[#75E2FF] animate-spin mb-4" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black">Deciphering Content</p>
      </div>
    );
  }

  if (error === 'unauthorized') {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-12 text-center">
        <div className="w-20 h-20 bg-red-50 border-2 border-red-600 flex items-center justify-center mb-8">
          <Lock className="w-8 h-8 text-red-600" />
        </div>
        <h1 className="text-3xl font-black text-black uppercase tracking-tighter mb-4">Identity Verification Failed</h1>
        <p className="text-slate-500 font-medium text-sm max-w-xs mx-auto">
          The security token associated with this link is invalid or expired. Please contact your administrator.
        </p>
      </div>
    );
  }

  if (error === 'not_found' || !pkg) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-12 text-center">
        <div className="w-20 h-20 bg-slate-50 border-2 border-black flex items-center justify-center mb-8">
          <ShieldAlert className="w-8 h-8 text-black" />
        </div>
        <h1 className="text-3xl font-black text-black uppercase tracking-tighter mb-4">Campaign Unavailable</h1>
        <p className="text-slate-500 font-medium text-sm max-w-xs mx-auto">
          This communication package has been retired or is not currently active.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-[#75E2FF]">
      {/* Sticky Public Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b-2 border-black">
        <div className="max-w-[600px] mx-auto px-6 h-16 flex items-center justify-center">
          <h1 className="text-lg font-black uppercase tracking-[0.4em] text-black select-none">
            DOTMENT
          </h1>
        </div>
      </header>

      {/* Content Canvas */}
      <main className="max-w-[600px] mx-auto px-6 pt-12">
        <PublicBlockRenderer 
          blocks={blocks} 
          packageId={pkg.id} 
          employeeId={employeeId!} 
        />

        <footer className="py-16 border-t border-slate-100 flex flex-col items-center gap-6">
          <div className="w-1 h-12 bg-slate-100" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">
            END OF TRANSMISSION<br/>
            © 2024 DOTMENT SECURE COMMS
          </span>
        </footer>
      </main>
    </div>
  );
};