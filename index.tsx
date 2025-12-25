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
  Activity,
  Sun,
  Moon,
  PanelLeftClose,
  PanelLeft,
  ShieldAlert,
  UserPlus
} from 'lucide-react';

import { supabase, isSupabaseConfigured } from './lib/supabase/client';
import { LoginPage } from './components/modules/auth/LoginPage';
import { MainDashboard } from './components/modules/dashboard/MainDashboard';
import { EmployeeList } from './components/modules/crm/EmployeeList';
import { PackageList } from './components/modules/cms/PackageList';
import { PackageEditor } from './components/modules/cms/PackageEditor';
import { SettingsPage } from './components/modules/settings/SettingsPage';
import { PublicView } from './components/modules/cms/PublicView';
import { AdminDirectory } from './components/modules/admin/AdminDirectory';
import { AdminProfile } from './types/admin';

type Module = 'dashboard' | 'crm' | 'cms' | 'settings' | 'cms-editor' | 'admin-directory';
type Theme = 'light' | 'dark';

const App = () => {
  const [session, setSession] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeModule, setActiveModule] = useState<Module>('dashboard');
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('dotment-theme');
    return (saved as Theme) || 'dark';
  });

  // Simple Router Logic
  const queryParams = new URLSearchParams(window.location.search);
  const publicSlug = queryParams.get('p');
  const publicToken = queryParams.get('t');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('dotment-theme', theme);
  }, [theme]);

  useEffect(() => {
    // Failsafe: Don't stay on loading screen for more than 5 seconds
    const fallbackTimer = setTimeout(() => {
      setLoading(false);
    }, 5000);

    const init = async () => {
      try {
        if (!isSupabaseConfigured) {
          setLoading(false);
          clearTimeout(fallbackTimer);
          return;
        }

        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        
        if (currentSession) {
          const { data: profile, error } = await supabase
            .from('admins')
            .select('*')
            .eq('id', currentSession.user.id)
            .maybeSingle(); // Use maybeSingle to avoid errors if profile is missing
          
          if (profile) setUserProfile(profile);
        }
      } catch (e) {
        console.error("Initialization failed", e);
      } finally {
        setLoading(false);
        clearTimeout(fallbackTimer);
      }
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      if (newSession) {
        const { data: profile } = await supabase
          .from('admins')
          .select('*')
          .eq('id', newSession.user.id)
          .maybeSingle();
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
      clearTimeout(fallbackTimer);
    };
  }, []);

  const handleEditPackage = (id: string) => {
    setSelectedPackageId(id);
    setActiveModule('cms-editor');
  };

  const navigate = (module: Module) => {
    setActiveModule(module);
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  };

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  // 1. Render Public View if URL parameters are present
  if (publicSlug && publicToken) {
    return (
      <div className={theme}>
        <PublicView slug={publicSlug} token={publicToken} />
        <Toaster position="bottom-center" richColors theme={theme} />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-2 border-zinc-200 dark:border-zinc-900 border-t-[#75E2FF] rounded-full animate-spin mb-6" />
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#75E2FF] animate-pulse">Initializing Security Protocols</p>
      </div>
    );
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-8">
        <div className="max-w-md w-full border border-red-500 bg-red-50 dark:bg-red-950/10 p-10 text-center">
          <ShieldCheck className="w-12 h-12 text-red-500 mx-auto mb-6" />
          <h1 className="text-xl font-black uppercase tracking-tight text-red-600 dark:text-red-400 mb-4">Core Infrastructure Error</h1>
          <p className="text-sm text-red-700 dark:text-red-300 font-medium mb-8">Environment keys for Supabase are missing or invalid.</p>
          <button onClick={() => window.location.reload()} className="w-full py-3 bg-red-600 text-white font-black uppercase tracking-widest text-xs">Retry Connection</button>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
        <LoginPage onLoginSuccess={() => window.location.reload()} />
        <Toaster position="bottom-right" richColors theme={theme} />
      </div>
    );
  }

  const isSuperAdmin = userProfile?.role === 'super_admin';

  return (
    <div className={`min-h-screen bg-white dark:bg-black flex font-sans transition-colors duration-300 selection:bg-[#75E2FF] selection:text-black`}>
      {/* Sidebar Navigation */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 bg-white dark:bg-black border-r border-zinc-200 dark:border-zinc-900 transform transition-all duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isSidebarCollapsed ? 'w-24' : 'w-72'}`}
      >
        <div className="h-full flex flex-col p-6 bg-grid">
          <div className={`mb-12 flex items-center justify-between ${isSidebarCollapsed ? 'flex-col gap-4' : ''}`}>
            <div className={`flex items-center gap-3 ${isSidebarCollapsed ? 'flex-col' : ''}`}>
              <div className="w-10 h-10 bg-[#75E2FF] flex items-center justify-center shrink-0 cursor-pointer" onClick={() => window.location.href = '/'}>
                <ShieldCheck className="w-6 h-6 text-black" />
              </div>
              {!isSidebarCollapsed && (
                <div onClick={() => navigate('dashboard')} className="cursor-pointer">
                  <h2 className="text-xl font-black text-black dark:text-white tracking-tighter uppercase leading-none">DOTMENT</h2>
                  <span className="text-[8px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Enterprise OS</span>
                </div>
              )}
            </div>
            {!isSidebarCollapsed && (
              <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-zinc-500 p-2">
                <X className="w-5 h-5" />
              </button>
            )}
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
              className="hidden lg:flex p-2 text-zinc-400 hover:text-[#75E2FF] transition-colors"
            >
              {isSidebarCollapsed ? <PanelLeft className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
            </button>
          </div>

          <nav className="flex-1 space-y-2">
            <NavItem 
              icon={LayoutDashboard} 
              label="Overview" 
              active={activeModule === 'dashboard'} 
              onClick={() => navigate('dashboard')}
              isCollapsed={isSidebarCollapsed}
            />
            <NavItem 
              icon={Users} 
              label="Personnel" 
              active={activeModule === 'crm'} 
              onClick={() => navigate('crm')}
              isCollapsed={isSidebarCollapsed}
            />
            <NavItem 
              icon={Layers} 
              label="Campaigns" 
              active={activeModule === 'cms' || activeModule === 'cms-editor'} 
              onClick={() => navigate('cms')}
              isCollapsed={isSidebarCollapsed}
            />
            
            {isSuperAdmin && (
              <>
                <div className={`pt-8 pb-2 ${isSidebarCollapsed ? 'text-center' : 'px-4'}`}>
                  {!isSidebarCollapsed ? (
                    <span className="text-[9px] font-black text-zinc-400 dark:text-zinc-700 uppercase tracking-widest block">Privileged Access</span>
                  ) : (
                    <div className="h-px bg-zinc-100 dark:bg-zinc-800 w-full" />
                  )}
                </div>
                <NavItem 
                  icon={ShieldAlert} 
                  label="Admin Directory" 
                  active={activeModule === 'admin-directory'} 
                  onClick={() => navigate('admin-directory')}
                  isCollapsed={isSidebarCollapsed}
                />
              </>
            )}

            <div className={`pt-8 pb-2 ${isSidebarCollapsed ? 'text-center' : 'px-4'}`}>
               {!isSidebarCollapsed ? (
                 <span className="text-[9px] font-black text-zinc-400 dark:text-zinc-700 uppercase tracking-widest block">System Control</span>
               ) : (
                 <div className="h-px bg-zinc-100 dark:bg-zinc-800 w-full" />
               )}
            </div>
            <NavItem 
              icon={SettingsIcon} 
              label="Config" 
              active={activeModule === 'settings'} 
              onClick={() => navigate('settings')}
              isCollapsed={isSidebarCollapsed}
            />
          </nav>

          <div className="mt-auto pt-6 border-t border-zinc-100 dark:border-zinc-900">
            {!isSidebarCollapsed && (
              <div className="px-4 mb-6">
                <p className="text-[8px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-1">Authenticated</p>
                <p className="text-[10px] font-black text-zinc-600 dark:text-zinc-400 truncate uppercase tracking-tight leading-tight">{session.user.email}</p>
                {userProfile && (
                  <span className="mt-1 inline-block px-1.5 py-0.5 bg-black dark:bg-zinc-800 text-[#75E2FF] text-[7px] font-black uppercase tracking-widest border border-black dark:border-zinc-700">
                    {userProfile.role.replace('_', ' ')}
                  </span>
                )}
              </div>
            )}
            <button 
              onClick={() => supabase.auth.signOut()}
              className={`w-full flex items-center gap-4 px-4 py-3 text-zinc-500 hover:text-red-500 transition-all group ${isSidebarCollapsed ? 'justify-center' : ''}`}
            >
              <LogOut className="w-4 h-4" />
              {!isSidebarCollapsed && <span className="text-[10px] font-black uppercase tracking-widest">Terminate Session</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-white dark:bg-black relative transition-colors duration-300">
        <header className="h-20 border-b border-zinc-200 dark:border-zinc-900 flex items-center justify-between px-8 bg-white/50 dark:bg-black/50 backdrop-blur-md z-40 shrink-0">
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 text-zinc-500 hover:text-black dark:hover:text-white"
              >
                <Menu className="w-6 h-6" />
              </button>
            )}
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em]">
              <span className="text-zinc-400 dark:text-zinc-600 hidden sm:inline">Root</span>
              <ChevronRight className="w-3 h-3 text-zinc-200 dark:text-zinc-800 hidden sm:inline" />
              <span className="text-[#75E2FF]">
                {activeModule === 'cms-editor' ? 'Editor v2.5' : activeModule.replace('-', ' ')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={toggleTheme}
              className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-none text-zinc-500 hover:text-black dark:hover:text-white transition-all flex items-center gap-2"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[9px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-widest leading-none mb-1 text-right">Status</span>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-black dark:text-white uppercase">Operational</span>
              </div>
            </div>
            <div className="w-10 h-10 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center">
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
            {activeModule === 'admin-directory' && isSuperAdmin && <AdminDirectory />}
            {activeModule === 'settings' && <SettingsPage userEmail={session.user.email} />}
          </div>
        </div>
      </main>
      <Toaster position="bottom-right" richColors theme={theme} />
    </div>
  );
};

const NavItem = ({ icon: Icon, label, active, onClick, isCollapsed }: { 
  icon: any, 
  label: string, 
  active?: boolean, 
  onClick: () => void,
  isCollapsed: boolean
}) => {
  return (
    <button
      onClick={onClick}
      title={isCollapsed ? label : undefined}
      className={`w-full flex items-center gap-4 px-4 py-4 transition-all group relative overflow-hidden ${
        active 
          ? 'text-black' 
          : 'text-zinc-400 dark:text-zinc-500 hover:text-black dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
      } ${isCollapsed ? 'justify-center' : ''}`}
    >
      {active && (
        <div className="absolute inset-0 bg-[#75E2FF] z-0" />
      )}
      <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 relative z-10 ${active ? 'text-black' : ''}`} />
      {!isCollapsed && <span className="text-[11px] font-black uppercase tracking-[0.2em] relative z-10">{label}</span>}
      {active && !isCollapsed && <div className="ml-auto w-1 h-1 bg-black rounded-full relative z-10" />}
    </button>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}