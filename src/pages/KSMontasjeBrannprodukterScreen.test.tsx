import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import KSMontasjeBrannprodukterScreen from './KSMontasjeBrannprodukterScreen';

function LocationStateView() {
  const location = useLocation();
  return (
    <div>
      <div data-testid="pathname">{location.pathname}</div>
      <div data-testid="state">{JSON.stringify(location.state)}</div>
    </div>
  );
}

describe('KSMontasjeBrannprodukterScreen', () => {
  it('renders and updates progress when selecting options', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter
        initialEntries={[{
          pathname: '/ks-montasje-brannprodukter',
          state: { projectNumber: 'AF-2024-001', projectName: 'Elkjop Hercules' },
        }]}
      >
        <Routes>
          <Route path="/ks-montasje-brannprodukter" element={<KSMontasjeBrannprodukterScreen />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('0 / 27')).toBeInTheDocument();

    const jaButtons = screen.getAllByRole('button', { name: 'Ja' });
    await user.click(jaButtons[0]);
    expect(screen.getByText('1 / 27')).toBeInTheDocument();
  });

  it('navigates to success with montasje brannprodukter title', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter
        initialEntries={[{
          pathname: '/ks-montasje-brannprodukter',
          state: { projectNumber: 'AF-2024-001', projectName: 'Elkjop Hercules' },
        }]}
      >
        <Routes>
          <Route path="/ks-montasje-brannprodukter" element={<KSMontasjeBrannprodukterScreen />} />
          <Route path="/success" element={<LocationStateView />} />
        </Routes>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: /send skjema/i }));

    expect(screen.getByTestId('pathname').textContent).toBe('/success');
    const navState = JSON.parse(screen.getByTestId('state').textContent ?? '{}');
    expect(navState.formTitle).toBe('KS Montasje Brannprodukter');
  });
});
