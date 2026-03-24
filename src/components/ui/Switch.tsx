import * as React from 'react';
import { cn } from './utils';

type SwitchProps = {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
} & Omit<React.ComponentProps<'button'>, 'onChange'>;

function Switch({ checked = false, onCheckedChange, disabled, className, ...props }: SwitchProps) {
  const handleClick = () => {
    if (disabled) return;
    onCheckedChange?.(!checked);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      data-slot="switch"
      data-state={checked ? 'checked' : 'unchecked'}
      onClick={handleClick}
      className={cn(
        'peer inline-flex h-5 w-9 items-center rounded-full border border-transparent transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        checked ? 'bg-primary' : 'bg-input',
        className
      )}
      {...props}
    >
      <span
        data-slot="switch-thumb"
        className={cn(
          'pointer-events-none block h-4 w-4 rounded-full bg-background shadow transition-transform',
          checked ? 'translate-x-4' : 'translate-x-0.5'
        )}
      />
    </button>
  );
}

export { Switch };