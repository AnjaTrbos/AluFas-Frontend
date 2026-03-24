import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AFButton, SegmentedTabs } from './AFComponents';

describe('AFButton', () => {
  it('renders content and calls click handlers', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<AFButton onClick={handleClick}>Ny aktivitet</AFButton>);

    await user.click(screen.getByRole('button', { name: 'Ny aktivitet' }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

describe('SegmentedTabs', () => {
  it('notifies when the archived tab is selected', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<SegmentedTabs active="active" onChange={handleChange} />);

    await user.click(screen.getByRole('button', { name: 'Arkiverte' }));

    expect(handleChange).toHaveBeenCalledWith('archived');
  });
});
