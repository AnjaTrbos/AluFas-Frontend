import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import KSFasadeScreen from './KSFasadeScreen';

function LocationStateView() {
  const location = useLocation();
  return (
    <div>
      <div data-testid="pathname">{location.pathname}</div>
      <div data-testid="state">{JSON.stringify(location.state)}</div>
    </div>
  );
}

describe('KSFasadeScreen', () => {
  it('renders the form and updates progress when checkboxes are toggled', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter
        initialEntries={[{
          pathname: '/ks-fasade',
          state: { projectNumber: 'AF-2024-001', projectName: 'Elkjøp Hercules' },
        }]}
      >
        <Routes>
          <Route path="/ks-fasade" element={<KSFasadeScreen />} />
        </Routes>
      </MemoryRouter>,
    );

    // Initially 0/10
    expect(screen.getByText('0 / 10')).toBeInTheDocument();

    // Select FWS50 system type → progress 1/10
    await user.click(screen.getByRole('button', { name: /FWS50/ }));
    expect(screen.getByText('1 / 10')).toBeInTheDocument();

    // Select "Ja" on Overflate/Lakk (first Ja button) → progress 3/10 (also element merket would be 2)
    const jaButtons = screen.getAllByRole('button', { name: /^Ja$/ });
    await user.click(jaButtons[0]);
    expect(screen.getByText('2 / 10')).toBeInTheDocument();
  });

  it('navigates to success screen when submit is clicked', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter
        initialEntries={[{
          pathname: '/ks-fasade',
          state: { projectNumber: 'AF-2024-001', projectName: 'Elkjøp Hercules' },
        }]}
      >
        <Routes>
          <Route path="/ks-fasade" element={<KSFasadeScreen />} />
          <Route path="/success" element={<LocationStateView />} />
        </Routes>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: /send skjema/i }));

    expect(screen.getByTestId('pathname').textContent).toBe('/success');
    const navState = JSON.parse(screen.getByTestId('state').textContent ?? '{}');
    expect(navState.formTitle).toBe('KS Fasade');
  });
});
