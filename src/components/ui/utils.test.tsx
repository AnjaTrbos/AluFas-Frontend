import { describe, expect, it } from 'vitest';
import { cn } from './utils';

describe('cn', () => {
  it('joins only truthy class names', () => {
    expect(cn('px-4', false, undefined, 'py-2', null, 'font-bold')).toBe('px-4 py-2 font-bold');
  });
});
