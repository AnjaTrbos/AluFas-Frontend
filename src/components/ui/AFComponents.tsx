import React from 'react';
import { ChevronDown, FileText, Search } from 'lucide-react';

const cn = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ');

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

export function AFButton({
  variant = 'primary',
  fullWidth,
  leftIcon,
  rightIcon,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-4 text-lg font-semibold transition active:scale-[0.99]',
        variant === 'primary' && 'bg-slate-950 text-white shadow-sm hover:bg-slate-900',
        variant === 'secondary' && 'border-2 border-slate-900 bg-white text-slate-950 hover:bg-slate-50',
        variant === 'danger' && 'bg-red-700 text-white hover:bg-red-800',
        variant === 'ghost' && 'bg-transparent text-slate-950 hover:bg-slate-100',
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  );
}

type IconTileProps = {
  icon: React.ReactNode;
  color?: 'navy' | 'red' | 'light';
  className?: string;
};

export function IconTile({ icon, color = 'navy', className }: IconTileProps) {
  return (
    <div
      className={cn(
        'flex h-12 w-12 items-center justify-center rounded-2xl',
        color === 'navy' && 'bg-slate-950 text-white',
        color === 'red' && 'bg-red-600 text-white',
        color === 'light' && 'bg-slate-100 text-slate-500',
        className
      )}
    >
      {icon}
    </div>
  );
}

export function SearchBar({ placeholder = 'Søk prosjekter...' }: { placeholder?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-slate-400 shadow-sm">
      <Search className="h-5 w-5" />
      <input placeholder={placeholder} className="w-full bg-transparent text-base outline-none placeholder:text-slate-400" />
    </div>
  );
}

export function FilterButton() {
  return (
    <button className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-4 text-lg font-semibold text-slate-800 shadow-sm">
      <FileText className="h-5 w-5" />
      Filtrer
      <ChevronDown className="h-4 w-4" />
    </button>
  );
}

export function SegmentedTabs({
  active,
  onChange,
}: {
  active: 'active' | 'archived';
  onChange?: (tab: 'active' | 'archived') => void;
}) {
  return (
    <div className="inline-flex rounded-2xl bg-slate-100 p-1">
      <button
        type="button"
        onClick={() => onChange?.('active')}
        className={cn(
          'rounded-xl px-4 py-2 text-sm font-semibold transition',
          active === 'active' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-700'
        )}
      >
        Aktive
      </button>
      <button
        type="button"
        onClick={() => onChange?.('archived')}
        className={cn(
          'rounded-xl px-4 py-2 text-sm font-semibold transition',
          active === 'archived' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-700'
        )}
      >
        Arkiverte
      </button>
    </div>
  );
}