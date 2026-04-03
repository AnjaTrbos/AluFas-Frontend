import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import KSFastkammerScreen from './KSFastkammerScreen';

function LocationStateView() {
  const location = useLocation();
  return (
    <div>
      <div data-testid="pathname">{location.pathname}</div>
      <div data-testid="state">{JSON.stringify(location.state)}</div>
    </div>
  );
}

describe('KSFastkammerScreen', () => {
  it('renders and updates progress when selecting a system option', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter
        initialEntries={[{
          pathname: '/ks-fastkammer',
          state: { projectNumber: 'AF-2024-001', projectName: 'Elkjop Hercules' },
        }]}
      >
        <Routes>
          <Route path="/ks-fastkammer" element={<KSFastkammerScreen />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('0 / 12')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'AWS/ADS 70 HI' }));
    expect(screen.getByText('1 / 12')).toBeInTheDocument();
  });

  it('navigates to success with fastkammer title', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter
        initialEntries={[{
          pathname: '/ks-fastkammer',
          state: { projectNumber: 'AF-2024-001', projectName: 'Elkjop Hercules' },
        }]}
      >
        <Routes>
          <Route path="/ks-fastkammer" element={<KSFastkammerScreen />} />
          <Route path="/success" element={<LocationStateView />} />
        </Routes>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: /send skjema/i }));

    expect(screen.getByTestId('pathname').textContent).toBe('/success');
    const navState = JSON.parse(screen.getByTestId('state').textContent ?? '{}');
    expect(navState.formTitle).toBe('KS Fastkammer');
  });
});
