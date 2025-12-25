"use client";

import React, { useEffect, useState } from 'react';
import { EmployeeList } from '../components/modules/crm/EmployeeList';
import { PackageList } from '../components/modules/cms/PackageList';
import { PackageEditor } from '../components/modules/cms/PackageEditor';
import { LoginPage } from '../components/modules/auth/LoginPage';
import { PublicView } from '../components/modules/cms/PublicView';
import { MainDashboard } from '../components/modules/dashboard/MainDashboard';
import { SettingsPage } from '../components/modules/settings/SettingsPage';
import { supabase, isSupabaseConfigured } from '../lib/supabase/client';
import { LogOut, LayoutDashboard, Users, FileText, BarChart3, Settings, Menu, X, Sun, Moon } from 'lucide-react';

type Module = 'dashboard' | 'crm' | 'cms' | 'analytics' | 'settings' | 'editor' | 'public_view';

const AdminLayout: React.FC<{ 
  children: React.ReactNode; 
  userEmail?: string; 
  activeModule: Module;
  onNavigate: (module: Module) => void;
}> = ({ children, userEmail, activeModule, onNavigate }) => {
  const [isDark, setIsDark] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [adminProfile, setAdminProfile] = useState<{ full_name: string } | null>(null);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userEmail) return;
      const { data } = await supabase
        .from('admins')
        .select('full_name')
        .eq('email', userEmail)
        .single();
      if (data) setAdminProfile(data);
    };
    fetchProfile();
  }, [userEmail]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const navItems = [
    { name: 'Dashboard', id: 'dashboard' as Module, icon: LayoutDashboard },
    { name: 'Directory', id: 'crm' as Module, icon: Users },
    { name: 'Content', id: 'cms' as Module, icon: FileText },
    { name: 'Analytics', id: 'analytics' as Module, icon: BarChart3 },
    { name: 'Settings', id: 'settings' as Module, icon: Settings },
  ];

  const handleNav = (id: Module) => {
    onNavigate(id);
    setIsMobileMenuOpen(false);
  };

  const SidebarContent = () => (
    <>
      <div className="mb-12 cursor-pointer" onClick={() => handleNav('dashboard')}>
        <h2 className="text-2xl font-black text-white tracking-normal">
          DOTMENT
        </h2>
        <div className="h-1 w-8 bg-[#75E2FF] mt-1" />
      </div>
      
      <nav className="space-y-4 flex-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNav(item.id)}
            className={`w-full flex items-center justify-between group transition-all duration-200 ${
              activeModule === item.id || (activeModule === 'editor' && item.id === 'cms')
                ? 'text-[#75E2FF]' 
                : 'text-zinc-500 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-4 h-4" />
              <span className="text-xs font-black uppercase tracking-widest">{item.name}</span>
            </div>
            {(activeModule === item.id || (activeModule === 'editor' && item.id === 'cms')) && (
              <div className="w-1.5 h-1.5 rounded-full bg-[#75E2FF]" />
            )}
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-8 border-t border-zinc-900">
        <div className="flex items-center justify-between mb-6 px-1">
          <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Appearance</span>
          <button 
            onClick={() => setIsDark(!isDark)}
            className="w-10 h-5 bg-zinc-800 rounded-full relative transition-colors border border-zinc-700"
          >
            <div className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white flex items-center justify-center transition-all ${isDark ? 'left-[22px]' : 'left-1'}`}>
              {isDark ? <Moon className="w-2 h-2 text-black" /> : <Sun className="w-2 h-2 text-black" />}
            </div>
          </button>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-[#75E2FF] flex items-center justify-center text-xs font-black text-black">
            {(adminProfile?.full_name || userEmail || 'A')[0].toUpperCase()}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-[10px] font-black tracking-normal truncate text-white">
              {adminProfile?.full_name || 'Administrator'}
            </span>
            <span className="text-[9px] text-[#75E2FF] lowercase font-bold">
              {userEmail?.toLowerCase()}
            </span>
          </div>
        </div>
        <button 
          onClick={handleSignOut}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          Terminate Session
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background flex text-foreground transition-colors duration-300">
      <aside className="w-64 bg-black text-white p-8 hidden lg:flex flex-col border-r border-black dark:border-zinc-800 shrink-0 h-screen sticky top-0">
        <SidebarContent />
      </aside>

      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-black text-white px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-black tracking-normal">DOTMENT</h2>
          <div className="h-4 w-px bg-zinc-800" />
          <span className="text-[10px] font-black uppercase text-[#75E2FF] tracking-widest">
            {navItems.find(i => i.id === activeModule)?.name || 'Editor'}
          </span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-white hover:text-[#75E2FF]">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className="absolute top-0 right-0 w-[280px] h-full bg-black text-white p-8 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex justify-end mb-8">
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:text-[#75E2FF]">
                <X className="w-6 h-6" />
              </button>
            </div>
            <SidebarContent />
          </aside>
        </div>
      )}

      <main className="flex-1 overflow-y-auto w-full pt-20 lg:pt-0">
        <div className="max-w-7xl mx-auto p-6 md:p-12">
          {children}
        </div>
      </main>
    </div>
  );
};

export default function Home() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeModule, setActiveModule] = useState<Module>('dashboard');
  const [editingPackageId, setEditingPackageId] = useState<string | null>(null);
  const [publicRoute, setPublicRoute] = useState<{ slug: string; token: string } | null>(null);

  useEffect(() => {
    const path = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get('token');
    
    if (path.startsWith('/view/') && token) {
      const slug = path.split('/view/')[1];
      setPublicRoute({ slug, token });
      setActiveModule('public_view');
      setLoading(false);
      return;
    }

    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleEditPackage = (id: string) => {
    setEditingPackageId(id);
    setActiveModule('editor');
  };

  const handleCloseEditor = () => {
    setEditingPackageId(null);
    setActiveModule('cms');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-black border-t-[#75E2FF] animate-spin" />
          <p className="text-xs font-black uppercase tracking-widest text-foreground">System Loading</p>
        </div>
      </div>
    );
  }

  if (activeModule === 'public_view' && publicRoute) {
    return <PublicView slug={publicRoute.slug} token={publicRoute.token} />;
  }

  if (!isSupabaseConfigured) return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-white">
      <div className="max-w-lg w-full bg-white border-2 border-black p-12 text-left shadow-[20px_20px_0px_0px_rgba(0,0,0,1)]">
        <h1 className="text-4xl font-black text-black tracking-normal mb-4">Infrastructure Error</h1>
        <p className="text-muted-foreground mb-8 font-medium">Database connection keys are missing.</p>
        <button onClick={() => window.location.reload()} className="w-full py-4 bg-[#75E2FF] text-black font-black uppercase tracking-widest border border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">Retry Initialization</button>
      </div>
    </div>
  );

  if (!session) return <LoginPage onLoginSuccess={() => setLoading(false)} />;

  return (
    <AdminLayout 
      userEmail={session.user.email} 
      activeModule={activeModule}
      onNavigate={setActiveModule}
    >
      {activeModule === 'dashboard' && (
        <MainDashboard 
          userEmail={session.user.email} 
          onNavigate={(mod) => setActiveModule(mod)}
          onEditPackage={handleEditPackage}
        />
      )}
      {activeModule === 'crm' && <EmployeeList />}
      {activeModule === 'cms' && <PackageList onSelect={handleEditPackage} />}
      {activeModule === 'analytics' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div>
            <h1 className="text-4xl font-black text-foreground tracking-normal">Analytics Overview</h1>
            <p className="text-muted-foreground mt-1 font-medium">Select a campaign below to view detailed performance reports.</p>
          </div>
          <PackageList onSelect={(id) => {
            setEditingPackageId(id);
            setActiveModule('editor');
          }} />
        </div>
      )}
      {activeModule === 'settings' && <SettingsPage userEmail={session.user.email} />}
      {activeModule === 'editor' && editingPackageId && (
        <PackageEditor packageId={editingPackageId} onBack={handleCloseEditor} />
      )}
    </AdminLayout>
  );
}