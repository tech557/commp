import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase/client';
import { User, Shield, LogOut } from 'lucide-react';
import { Button } from '../../ui/FormElements';

interface SettingsPageProps {
  userEmail: string;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ userEmail }) => {
  const [adminName, setAdminName] = useState<string>('Administrator');

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase
        .from('admins')
        .select('full_name')
        .eq('email', userEmail)
        .single();
      if (data) setAdminName(data.full_name);
    };
    fetchProfile();
  }, [userEmail]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-4xl font-black text-foreground tracking-normal">System Settings</h1>
        <p className="text-muted-foreground mt-1 font-medium">Configure your environment and security preferences.</p>
      </header>

      <div className="space-y-8">
        {/* Profile Card */}
        <section className="bg-white dark:bg-zinc-950 border-2 border-black dark:border-zinc-800 p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
            <div className="w-20 h-20 bg-black dark:bg-white flex items-center justify-center border-2 border-black shrink-0">
              <User className="w-10 h-10 text-[#75E2FF] dark:text-black" />
            </div>
            <div className="min-w-0">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Authenticated Account</h3>
              <p className="text-xl font-black text-foreground tracking-normal mb-1">{adminName}</p>
              <p className="text-sm font-bold text-muted-foreground lowercase truncate mb-3">{userEmail}</p>
              <div className="flex flex-wrap gap-2">
                <div className="px-2 py-0.5 bg-[#75E2FF] text-black text-[9px] font-black uppercase tracking-widest border border-black">Admin Privileges</div>
                <div className="px-2 py-0.5 bg-black text-white text-[9px] font-black uppercase tracking-widest border border-black dark:border-zinc-700">Secured</div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-zinc-100 dark:border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Infrastructure Role</span>
              <span className="text-xs font-bold text-foreground">Global Administrator</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Access Token</span>
              <span className="text-xs font-mono bg-zinc-50 dark:bg-black px-2 py-1 border border-zinc-100 dark:border-zinc-800 text-foreground">*****_STABLE</span>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Shield className="w-3 h-3" /> 
            Security Controls
          </h2>
          <div className="bg-red-50 dark:bg-red-950/10 border-2 border-red-600 p-8 space-y-6">
            <p className="text-sm font-bold text-red-950 dark:text-red-400">
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
          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">DOTMENT OS v2.5.0-ALPHA</span>
          <div className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-800" />
          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground text-center">Region: Global/US-EAST</span>
        </footer>
      </div>
    </div>
  );
};