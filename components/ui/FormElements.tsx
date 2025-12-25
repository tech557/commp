import React from 'react';
import { Loader2 } from 'lucide-react';

// Fix: Making children optional to resolve 'children is missing' errors across multiple modules
export const Label = ({ children, htmlFor, className = "" }: { children?: React.ReactNode, htmlFor?: string, className?: string }) => (
  <label htmlFor={htmlFor} className={`text-[11px] font-black text-black uppercase tracking-widest block mb-2 ${className}`}>
    {children}
  </label>
);

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className = "", ...props }, ref) => (
  <input
    ref={ref}
    className={`w-full px-4 py-3 bg-white border border-black rounded-none focus:ring-0 focus:border-brand-blue transition-all outline-none text-sm placeholder:text-slate-400 disabled:opacity-50 disabled:bg-slate-50 ${className}`}
    {...props}
  />
));

export const Button = React.forwardRef<HTMLButtonElement, any>(({ children, loading, variant = "primary", className = "", ...props }, ref) => {
  const variants = {
    primary: "bg-black text-white hover:bg-slate-900 border border-black",
    secondary: "bg-white text-black hover:bg-slate-50 border border-black",
    accent: "bg-[#75E2FF] text-black hover:bg-[#5CD4F2] border border-black",
    destructive: "bg-red-600 text-white hover:bg-red-700 border border-black",
    ghost: "bg-transparent text-black hover:bg-slate-100 border-none"
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

// Fix: Making children optional to resolve 'children is missing' errors in dialog usage
export const Dialog = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children?: React.ReactNode }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />
      <div className="relative bg-white w-full max-w-lg rounded-none border border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] overflow-hidden animate-in zoom-in-95 fade-in duration-200">
        <div className="px-6 py-4 border-b border-black flex items-center justify-between">
          <h3 className="font-black text-xl text-black uppercase tracking-tight">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 text-black transition-colors">
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