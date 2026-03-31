import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import KSBrannprodukterScreen from './KSBrannprodukterScreen';

function LocationStateView() {
  const location = useLocation();
  return (
    <div>
      <div data-testid="pathname">{location.pathname}</div>
      <div data-testid="state">{JSON.stringify(location.state)}</div>
    </div>
  );
}

describe('KSBrannprodukterScreen', () => {
  it('renders the form and updates progress when a radio option is selected', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter
        initialEntries={[{
          pathname: '/ks-brannprodukter',
          state: { projectNumber: 'AF-2024-001', projectName: 'Elkjøp Hercules' },
        }]}
      >
        <Routes>
          <Route path="/ks-brannprodukter" element={<KSBrannprodukterScreen />} />
        </Routes>
      </MemoryRouter>,
    );

    // Initially 0/27
    expect(screen.getByText('0 / 27')).toBeInTheDocument();

    // Click "Ja" on 1.1 Lakk ok (first Ja button) → progress 1/27
    const jaButtons = screen.getAllByRole('button', { name: 'Ja' });
    await user.click(jaButtons[0]);
    expect(screen.getByText('1 / 27')).toBeInTheDocument();

    // Click "OK" on 1.2 Kontrollmålt (first OK button) → progress 2/27
    const okButtons = screen.getAllByRole('button', { name: 'OK' });
    await user.click(okButtons[0]);
    expect(screen.getByText('2 / 27')).toBeInTheDocument();
  });

  it('navigates to success screen when submit is clicked', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter
        initialEntries={[{
          pathname: '/ks-brannprodukter',
          state: { projectNumber: 'AF-2024-001', projectName: 'Elkjøp Hercules' },
        }]}
      >
        <Routes>
          <Route path="/ks-brannprodukter" element={<KSBrannprodukterScreen />} />
          <Route path="/success" element={<LocationStateView />} />
        </Routes>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: /send skjema/i }));

    expect(screen.getByTestId('pathname').textContent).toBe('/success');
    const navState = JSON.parse(screen.getByTestId('state').textContent ?? '{}');
    expect(navState.formTitle).toBe('KS Brannprodukter');
  });
});
