import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import KSMontasjeFasadeTakScreen from './KSMontasjeFasadeTakScreen';

function LocationStateView() {
  const location = useLocation();
  return (
    <div>
      <div data-testid="pathname">{location.pathname}</div>
      <div data-testid="state">{JSON.stringify(location.state)}</div>
    </div>
  );
}

describe('KSMontasjeFasadeTakScreen', () => {
  it('renders and updates progress when selecting checklist option', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter
        initialEntries={[{
          pathname: '/ks-montasje-fasade-tak',
          state: { projectNumber: 'AF-2024-001', projectName: 'Elkjop Hercules' },
        }]}
      >
        <Routes>
          <Route path="/ks-montasje-fasade-tak" element={<KSMontasjeFasadeTakScreen />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('0 / 21')).toBeInTheDocument();

    await user.click(screen.getAllByRole('button', { name: 'Ja' })[0]);
    expect(screen.getByText('1 / 21')).toBeInTheDocument();
  });

  it('navigates to success with montasje fasade/tak title', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter
        initialEntries={[{
          pathname: '/ks-montasje-fasade-tak',
          state: { projectNumber: 'AF-2024-001', projectName: 'Elkjop Hercules' },
        }]}
      >
        <Routes>
          <Route path="/ks-montasje-fasade-tak" element={<KSMontasjeFasadeTakScreen />} />
          <Route path="/success" element={<LocationStateView />} />
        </Routes>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: /send skjema/i }));

    expect(screen.getByTestId('pathname').textContent).toBe('/success');
    const navState = JSON.parse(screen.getByTestId('state').textContent ?? '{}');
    expect(navState.formTitle).toBe('KS Montasje Fasade/Tak');
  });
});
