'use client';

import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { LoginPage } from '@/components/modules/auth/LoginPage';
import { MainDashboard } from '@/components/modules/dashboard/MainDashboard';
import { EmployeeList } from '@/components/modules/crm/EmployeeList';
import { PackageList } from '@/components/modules/cms/PackageList';
import { PackageEditor } from '@/components/modules/cms/PackageEditor';
import { SettingsPage } from '@/components/modules/settings/SettingsPage';
import { 
  LayoutDashboard, 
  Users, 
  Layers, 
  Settings as SettingsIcon, 
  LogOut,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';

type Module = 'dashboard' | 'crm' | 'cms' | 'settings' | 'cms-editor';

export default function AppRoot() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeModule, setActiveModule] = useState<Module>('dashboard');
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="w-12 h-1 border-t-2 border-[#75E2FF] animate-pulse mx-auto" />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50">Initializing Core OS</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <LoginPage onLoginSuccess={() => window.location.reload()} />;
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-black flex font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-black border-r border-zinc-800 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col p-8">
          {/* Logo */}
          <div className="mb-16">
            <h2 className="text-2xl font-black text-white tracking-tighter uppercase">DOTMENT</h2>
            <div className="h-0.5 w-8 bg-[#75E2FF] mt-2" />
          </div>

          <nav className="flex-1 space-y-2">
            <NavItem 
              icon={LayoutDashboard} 
              label="Dashboard" 
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
            <div className="pt-8 pb-4">
              <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest px-4">Preference</span>
            </div>
            <NavItem 
              icon={SettingsIcon} 
              label="Settings" 
              active={activeModule === 'settings'} 
              onClick={() => navigate('settings')} 
            />
          </nav>

          <div className="mt-auto pt-8 border-t border-zinc-900">
            <button 
              onClick={() => supabase.auth.signOut()}
              className="w-full flex items-center gap-3 px-4 py-3 text-zinc-500 hover:text-white transition-colors group"
            >
              <LogOut className="w-4 h-4 group-hover:text-red-500" />
              <span className="text-xs font-black uppercase tracking-widest">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Viewport */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto bg-zinc-50 dark:bg-black">
        {/* Top Header */}
        <header className="h-20 bg-white dark:bg-black border-b border-black dark:border-zinc-800 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 text-black dark:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
              <span>Enterprise</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-black dark:text-[#75E2FF]">
                {activeModule === 'cms-editor' ? 'Editor' : activeModule}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[10px] font-black text-black dark:text-white uppercase tracking-tight">
                {session.user.email}
              </span>
              <span className="text-[8px] font-bold text-[#75E2FF] uppercase tracking-widest">Admin Node #1</span>
            </div>
            <div className="w-10 h-10 bg-black dark:bg-zinc-800 border border-[#75E2FF] flex items-center justify-center">
              <span className="text-xs font-black text-white">AD</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8 md:p-12 max-w-7xl mx-auto w-full">
          {activeModule === 'dashboard' && (
            <MainDashboard 
              userEmail={session.user.email} 
              onNavigate={(mod) => navigate(mod)}
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
      </main>
    </div>
  );
}

function NavItem({ icon: Icon, label, active, onClick }: { 
  icon: any, 
  label: string, 
  active?: boolean, 
  onClick: () => void 
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-4 py-3.5 transition-all group ${
        active 
          ? 'bg-[#75E2FF] text-black shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]' 
          : 'text-zinc-500 hover:text-white hover:bg-zinc-900'
      }`}
    >
      <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${active ? 'text-black' : ''}`} />
      <span className="text-[11px] font-black uppercase tracking-widest">{label}</span>
      {active && <div className="ml-auto w-1.5 h-1.5 bg-black rounded-full" />}
    </button>
  );
}
