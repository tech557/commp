import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase/client';
import { Lock, Mail, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { Button, Input, Label } from '../../ui/FormElements';

const Alert = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-start gap-3 p-4 bg-red-50 border border-black rounded-none text-red-800 animate-in fade-in slide-in-from-top-1 duration-200">
    <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
    <div className="text-xs font-bold uppercase tracking-tight leading-tight">{children}</div>
  </div>
);

export const LoginPage: React.FC<{ onLoginSuccess: () => void }> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('mahmoud.samaha@dotment.com');
  const [password, setPassword] = useState('Dotmeny@7');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured) {
      setError('Database configuration missing.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || 'Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white">
      {/* Visual Identity Side */}
      <div className="hidden md:flex md:w-1/2 bg-black items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#75E2FF] translate-x-1/2 -translate-y-1/2" />
        <div className="z-10 flex flex-col">
          <h1 className="text-[120px] font-black text-white leading-none tracking-tighter select-none">
            DOT<br/>MENT
          </h1>
          <div className="mt-8 flex items-center gap-4">
             <div className="h-0.5 w-12 bg-[#75E2FF]" />
             <p className="text-white text-xs font-black uppercase tracking-[0.3em]">Communication OS</p>
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-sm space-y-12">
          <div className="space-y-4">
            <h1 className="md:hidden text-4xl font-black tracking-tighter uppercase mb-8">DOTMENT</h1>
            <h2 className="text-3xl font-black text-black uppercase tracking-tight">Portal Access</h2>
            <p className="text-slate-500 font-medium text-sm">Welcome back. Authenticate to manage enterprise communications.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            {error && <Alert>{error}</Alert>}

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Identity / Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="IDENTITY@DOTMENT.COM"
                  className="uppercase font-bold border-black placeholder:text-slate-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Security Code</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="border-black placeholder:text-slate-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <Button type="submit" variant="accent" loading={loading} className="w-full">
              Authenticate
              {!loading && <ArrowRight className="w-4 h-4 ml-1" />}
            </Button>
          </form>

          <div className="pt-12 border-t border-slate-100 flex justify-between items-center">
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">© 2024 DOTMENT INC</span>
             <div className="flex gap-4">
               <a href="#" className="text-[10px] font-black uppercase tracking-widest text-black hover:text-[#75E2FF] transition-colors">Privacy</a>
               <a href="#" className="text-[10px] font-black uppercase tracking-widest text-black hover:text-[#75E2FF] transition-colors">Terms</a>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};