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

export function SearchBar({
  value = '',
  onChange = () => {},
  placeholder = 'Søk...',
  'aria-label': ariaLabel,
}: {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  'aria-label'?: string;
}) {
  return (
    <div className="relative flex-1">
      <Search className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-400 sm:h-6 sm:w-6" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel ?? placeholder}
        className="h-12 w-full rounded-2xl border border-slate-300 bg-white pr-4 text-lg font-bold text-slate-800 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-slate-300 sm:h-14 sm:text-2xl"
        style={{ paddingLeft: '3.25rem' }}
      />
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

const DEFAULT_TABS = [
  { value: 'active', label: 'Aktive' },
  { value: 'archived', label: 'Arkiverte' },
];

export function SegmentedTabs<T extends string>({
  tabs,
  active,
  onChange,
}: {
  tabs?: Array<{ value: T; label: string }>;
  active: T;
  onChange?: (tab: T) => void;
}) {
  const resolvedTabs = (tabs ?? DEFAULT_TABS) as Array<{ value: T; label: string }>;
  return (
    <div className="inline-flex rounded-2xl bg-slate-100 p-1">
      {resolvedTabs.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => onChange?.(value)}
          className={cn(
            'rounded-xl px-4 py-2 text-sm font-semibold transition',
            active === value ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}