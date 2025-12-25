import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';
import { 
  LayoutDashboard, 
  Users, 
  Layers, 
  Settings as SettingsIcon, 
  LogOut,
  ChevronRight,
  ShieldCheck,
  Menu,
  X,
  Activity
} from 'lucide-react';

import { supabase, isSupabaseConfigured } from './lib/supabase/client';
import { LoginPage } from './components/modules/auth/LoginPage';
import { MainDashboard } from './components/modules/dashboard/MainDashboard';
import { EmployeeList } from './components/modules/crm/EmployeeList';
import { PackageList } from './components/modules/cms/PackageList';
import { PackageEditor } from './components/modules/cms/PackageEditor';
import { SettingsPage } from './components/modules/settings/SettingsPage';
import { PublicView } from './components/modules/cms/PublicView';

type Module = 'dashboard' | 'crm' | 'cms' | 'settings' | 'cms-editor';

const App = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeModule, setActiveModule] = useState<Module>('dashboard');
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Simple Router Logic
  const queryParams = new URLSearchParams(window.location.search);
  const publicSlug = queryParams.get('p');
  const publicToken = queryParams.get('t');

  useEffect(() => {
    const init = async () => {
      try {
        if (!isSupabaseConfigured) {
          setLoading(false);
          return;
        }
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
      } catch (e) {
        console.error("Authentication check failed", e);
      } finally {
        setLoading(false);
      }
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleEditPackage = (id: string) => {
    setSelectedPackageId(id);
    setActiveModule('cms-editor');
  };

  const navigate = (module: Module) => {
    setActiveModule(module);
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  };

  // 1. Render Public View if URL parameters are present
  if (publicSlug && publicToken) {
    return (
      <>
        <PublicView slug={publicSlug} token={publicToken} />
        <Toaster position="bottom-center" richColors theme="light" />
      </>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-2 border-zinc-900 border-t-[#75E2FF] rounded-full animate-spin mb-6" />
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#75E2FF] animate-pulse">Initializing Security Protocols</p>
      </div>
    );
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-8">
        <div className="max-w-md w-full border border-red-900 bg-red-950/10 p-10 text-center">
          <ShieldCheck className="w-12 h-12 text-red-500 mx-auto mb-6" />
          <h1 className="text-xl font-black uppercase tracking-tight text-white mb-4">Core Infrastructure Error</h1>
          <p className="text-sm text-red-400 font-medium mb-8">Environment keys for Supabase are missing or invalid.</p>
          <button onClick={() => window.location.reload()} className="w-full py-3 bg-red-600 text-white font-black uppercase tracking-widest text-xs">Retry Connection</button>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-white">
        <LoginPage onLoginSuccess={() => window.location.reload()} />
        <Toaster position="bottom-right" richColors theme="dark" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex font-sans selection:bg-[#75E2FF] selection:text-black">
      {/* Sidebar Navigation */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-black border-r border-zinc-900 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col p-8 bg-grid">
          <div className="mb-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#75E2FF] flex items-center justify-center" onClick={() => window.location.href = '/'}>
                <ShieldCheck className="w-5 h-5 text-black cursor-pointer" />
              </div>
              <div onClick={() => navigate('dashboard')} className="cursor-pointer">
                <h2 className="text-xl font-black text-white tracking-tighter uppercase leading-none">DOTMENT</h2>
                <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Enterprise Portal</span>
              </div>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-zinc-500 p-2">
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 space-y-1">
            <NavItem 
              icon={LayoutDashboard} 
              label="Overview" 
              active={activeModule === 'dashboard'} 
              onClick={() => navigate('dashboard')} 
            />
            <NavItem 
              icon={Users} 
              label="Personnel" 
              active={activeModule === 'crm'} 
              onClick={() => navigate('crm')} 
            />
            <NavItem 
              icon={Layers} 
              label="Campaigns" 
              active={activeModule === 'cms' || activeModule === 'cms-editor'} 
              onClick={() => navigate('cms')} 
            />
            <div className="pt-10 pb-4">
              <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest px-4 block">System Control</span>
            </div>
            <NavItem 
              icon={SettingsIcon} 
              label="Config" 
              active={activeModule === 'settings'} 
              onClick={() => navigate('settings')} 
            />
          </nav>

          <div className="mt-auto pt-8 border-t border-zinc-900">
            <div className="px-4 mb-6">
              <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Authenticated</p>
              <p className="text-[10px] font-black text-zinc-400 truncate uppercase tracking-tight">{session.user.email}</p>
            </div>
            <button 
              onClick={() => supabase.auth.signOut()}
              className="w-full flex items-center gap-3 px-4 py-3 text-zinc-600 hover:text-red-500 transition-all group"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Terminate Session</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-black relative">
        <header className="h-20 border-b border-zinc-900 flex items-center justify-between px-8 bg-black/50 backdrop-blur-md z-40 shrink-0">
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 text-zinc-500 hover:text-white"
              >
                <Menu className="w-6 h-6" />
              </button>
            )}
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em]">
              <span className="text-zinc-600 hidden sm:inline">Root</span>
              <ChevronRight className="w-3 h-3 text-zinc-800 hidden sm:inline" />
              <span className="text-[#75E2FF]">
                {activeModule === 'cms-editor' ? 'Editor v2.5' : activeModule.replace('-', ' ')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest leading-none mb-1 text-right">Status</span>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-white uppercase">Operational</span>
              </div>
            </div>
            <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 flex items-center justify-center">
              <Activity className="w-4 h-4 text-[#75E2FF]" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-grid relative custom-scrollbar">
          <div className="p-8 md:p-12 max-w-7xl mx-auto w-full relative z-10">
            {activeModule === 'dashboard' && (
              <MainDashboard 
                userEmail={session.user.email} 
                onNavigate={(mod) => navigate(mod as any)}
                onEditPackage={handleEditPackage}
              />
            )}
            {activeModule === 'crm' && <EmployeeList />}
            {activeModule === 'cms' && <PackageList onSelect={handleEditPackage} />}
            {activeModule === 'cms-editor' && selectedPackageId && (
              <PackageEditor 
                packageId={selectedPackageId} 
                onBack={() => setActiveModule('cms')} 
              />
            )}
            {activeModule === 'settings' && <SettingsPage userEmail={session.user.email} />}
          </div>
        </div>
      </main>
      <Toaster position="bottom-right" richColors theme="dark" />
    </div>
  );
};

const NavItem = ({ icon: Icon, label, active, onClick }: { 
  icon: any, 
  label: string, 
  active?: boolean, 
  onClick: () => void 
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-4 py-4 transition-all group relative overflow-hidden ${
        active 
          ? 'text-black' 
          : 'text-zinc-500 hover:text-white hover:bg-zinc-900/50'
      }`}
    >
      {active && (
        <div className="absolute inset-0 bg-[#75E2FF] z-0" />
      )}
      <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 relative z-10 ${active ? 'text-black' : ''}`} />
      <span className="text-[11px] font-black uppercase tracking-[0.2em] relative z-10">{label}</span>
      {active && <div className="ml-auto w-1 h-1 bg-black rounded-full relative z-10" />}
    </button>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}