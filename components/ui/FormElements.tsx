import React from 'react';
import { Loader2 } from 'lucide-react';

export const Label = ({ children, htmlFor, className = "" }: { children: React.ReactNode, htmlFor?: string, className?: string }) => (
  <label htmlFor={htmlFor} className={`text-[11px] font-black text-black dark:text-white uppercase tracking-widest block mb-2 ${className}`}>
    {children}
  </label>
);

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className = "", ...props }, ref) => (
  <input
    ref={ref}
    className={`w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-black dark:border-zinc-800 text-black dark:text-white rounded-none focus:ring-2 focus:ring-[#75E2FF] focus:border-[#75E2FF] transition-all outline-none text-sm placeholder:text-slate-400 dark:placeholder:text-zinc-600 disabled:opacity-50 disabled:bg-slate-50 dark:disabled:bg-zinc-950 ${className}`}
    {...props}
  />
));

export const Button = React.forwardRef<HTMLButtonElement, any>(({ children, loading, variant = "primary", className = "", ...props }, ref) => {
  const variants = {
    primary: "bg-black text-white dark:bg-white dark:text-black hover:bg-zinc-900 dark:hover:bg-zinc-100 border border-black dark:border-white",
    secondary: "bg-white text-black dark:bg-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-black dark:border-zinc-700",
    accent: "bg-[#75E2FF] text-black hover:bg-[#5CD4F2] border border-black",
    destructive: "bg-red-600 text-white hover:bg-red-700 border border-black",
    ghost: "bg-transparent text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 border-none"
  };
  
  return (
    <button
      ref={ref}
      {...props}
      className={`font-extrabold py-3 px-8 rounded-full transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 outline-none uppercase tracking-tighter text-sm ${variants[variant as keyof typeof variants]} ${className}`}
    >
      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : children}
    </button>
  );
});

export const Dialog = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />
      <div className="relative bg-white dark:bg-zinc-950 w-full max-w-lg rounded-none border-2 border-black dark:border-zinc-800 shadow-[10px_10px_0px_0px_rgba(117,226,255,1)] overflow-hidden animate-in zoom-in-95 fade-in duration-200">
        <div className="px-6 py-5 border-b-2 border-black dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900">
          <h3 className="font-black text-xl text-black dark:text-white uppercase tracking-tight">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-black dark:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
};