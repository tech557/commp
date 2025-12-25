import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase/client';
import { User, Shield, LogOut, Building2, Save } from 'lucide-react';
import { Button, Input, Label } from '../../ui/FormElements';
import { toast } from 'sonner';

interface SettingsPageProps {
  userEmail: string;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ userEmail }) => {
  const [adminName, setAdminName] = useState<string>('Administrator');
  const [companyId, setCompanyId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase
        .from('admins')
        .select('id, full_name, company_id')
        .eq('email', userEmail)
        .single();
      if (data) {
        setAdminName(data.full_name || 'Administrator');
        setCompanyId(data.company_id || '');
        setProfileId(data.id);
      }
    };
    fetchProfile();
  }, [userEmail]);

  const handleSaveCompanyId = async () => {
    if (!profileId) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from('admins')
        .update({ company_id: companyId })
        .eq('id', profileId);
      
      if (error) throw error;
      toast.success('Organization ID updated');
    } catch (err: any) {
      toast.error('Failed to update: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-4xl font-black text-black dark:text-white tracking-normal uppercase">System Settings</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1 font-medium">Configure your environment and security preferences.</p>
      </header>

      <div className="space-y-8">
        {/* Organization ID Setting */}
        <section className="bg-white dark:bg-zinc-950 border-2 border-black dark:border-zinc-800 p-8 shadow-[8px_8px_0px_0px_rgba(117,226,255,1)]">
          <h2 className="text-xs font-black uppercase tracking-widest text-black dark:text-white flex items-center gap-2 mb-6">
            <Building2 className="w-4 h-4 text-[#75E2FF]" />
            Organization Identity
          </h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="company_id">Enterprise Company ID</Label>
              <div className="flex gap-2">
                <Input 
                  id="company_id" 
                  placeholder="e.g. DOTMENT-GLOBAL" 
                  value={companyId}
                  onChange={(e) => setCompanyId(e.target.value.toUpperCase())}
                  className="font-mono font-bold tracking-widest"
                />
                <Button variant="accent" onClick={handleSaveCompanyId} loading={loading}>
                  <Save className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-[10px] text-zinc-400 mt-2 font-bold uppercase tracking-tight">
                Used to categorize distribution segments and content clusters.
              </p>
            </div>
          </div>
        </section>

        {/* Profile Card */}
        <section className="bg-white dark:bg-zinc-950 border-2 border-black dark:border-zinc-800 p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
            <div className="w-20 h-20 bg-black dark:bg-white flex items-center justify-center border-2 border-black shrink-0">
              <User className="w-10 h-10 text-[#75E2FF] dark:text-black" />
            </div>
            <div className="min-w-0">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Authenticated Account</h3>
              <p className="text-xl font-black text-black dark:text-white tracking-normal mb-1">{adminName}</p>
              <p className="text-sm font-bold text-zinc-400 dark:text-zinc-500 lowercase truncate mb-3">{userEmail}</p>
              <div className="flex flex-wrap gap-2">
                <div className="px-2 py-0.5 bg-[#75E2FF] text-black text-[9px] font-black uppercase tracking-widest border border-black">Admin Privileges</div>
                <div className="px-2 py-0.5 bg-black text-white text-[9px] font-black uppercase tracking-widest border border-black dark:border-zinc-700">Secured</div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-zinc-100 dark:border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Infrastructure Role</span>
              <span className="text-xs font-bold text-black dark:text-white uppercase">Global Controller</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Access Token</span>
              <span className="text-xs font-mono bg-zinc-50 dark:bg-black px-2 py-1 border border-zinc-100 dark:border-zinc-800 text-black dark:text-white">*****_STABLE</span>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
            <Shield className="w-3 h-3" /> 
            Security Controls
          </h2>
          <div className="bg-red-50 dark:bg-red-950/10 border-2 border-red-600 p-8 space-y-6">
            <p className="text-sm font-bold text-red-950 dark:text-red-400 leading-tight">
              Session termination will immediately invalidate all active access tokens for this workstation.
            </p>
            <Button 
              variant="destructive" 
              className="w-full rounded-none shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Terminate Active Session
            </Button>
          </div>
        </section>

        {/* System Info */}
        <footer className="pt-12 flex items-center justify-center gap-6">
          <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">DOTMENT OS v2.5.0-ALPHA</span>
          <div className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-800" />
          <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 text-center">Region: Global/US-EAST</span>
        </footer>
      </div>
    </div>
  );
};