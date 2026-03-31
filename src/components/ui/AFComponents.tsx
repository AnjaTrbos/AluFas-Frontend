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
        variant === 'primary' && 'bg-[#0f172a] text-white shadow-sm hover:bg-[#0f172a]/90',
        variant === 'secondary' && 'border-2 border-[#0f172a] bg-white text-[#0f172a] hover:bg-[#f2f2f2]',
        variant === 'danger' && 'bg-[#993333] text-white hover:bg-[#993333]/80',
        variant === 'ghost' && 'bg-transparent text-[#0f172a] hover:bg-[#f2f2f2]',
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
        color === 'navy' && 'bg-[#0f172a] text-white',
        color === 'red' && 'bg-[#993333] text-white',
        color === 'light' && 'bg-[#f2f2f2] text-[#808080]',
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
      <Search className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-[#808080] sm:h-6 sm:w-6" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel ?? placeholder}
        className="h-12 w-full rounded-2xl border border-[#bfbfbf] bg-white pr-4 text-lg font-bold text-[#404040] placeholder:text-[#808080] outline-none focus:ring-2 focus:ring-[#bfbfbf] sm:h-14 sm:text-2xl"
        style={{ paddingLeft: '3.25rem' }}
      />
    </div>
  );
}

export function FilterButton() {
  return (
    <button className="inline-flex items-center gap-3 rounded-2xl border border-[#bfbfbf] bg-white px-6 py-4 text-lg font-semibold text-[#404040] shadow-sm">
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
    <div className="inline-flex rounded-2xl bg-[#f2f2f2] p-1">
      {resolvedTabs.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => onChange?.(value)}
          className={cn(
            'rounded-xl px-4 py-2 text-sm font-semibold transition',
            active === value ? 'bg-white text-[#0f172a] shadow-sm' : 'text-[#808080] hover:text-[#404040]'
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}