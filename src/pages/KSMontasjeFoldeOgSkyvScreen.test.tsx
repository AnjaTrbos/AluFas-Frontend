import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import KSMontasjeFoldeOgSkyvScreen from './KSMontasjeFoldeOgSkyvScreen';

function LocationStateView() {
  const location = useLocation();
  return (
    <div>
      <div data-testid="pathname">{location.pathname}</div>
      <div data-testid="state">{JSON.stringify(location.state)}</div>
    </div>
  );
}

describe('KSMontasjeFoldeOgSkyvScreen', () => {
  it('renders and updates progress when selecting checklist option', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter
        initialEntries={[{
          pathname: '/ks-montasje-folde-skyv',
          state: { projectNumber: 'AF-2024-001', projectName: 'Elkjop Hercules' },
        }]}
      >
        <Routes>
          <Route path="/ks-montasje-folde-skyv" element={<KSMontasjeFoldeOgSkyvScreen />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('0 / 19')).toBeInTheDocument();

    await user.click(screen.getAllByRole('button', { name: 'Ja' })[0]);
    expect(screen.getByText('1 / 19')).toBeInTheDocument();
  });

  it('navigates to success with montasje folde og skyv title', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter
        initialEntries={[{
          pathname: '/ks-montasje-folde-skyv',
          state: { projectNumber: 'AF-2024-001', projectName: 'Elkjop Hercules' },
        }]}
      >
        <Routes>
          <Route path="/ks-montasje-folde-skyv" element={<KSMontasjeFoldeOgSkyvScreen />} />
          <Route path="/success" element={<LocationStateView />} />
        </Routes>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: /send skjema/i }));

    expect(screen.getByTestId('pathname').textContent).toBe('/success');
    const navState = JSON.parse(screen.getByTestId('state').textContent ?? '{}');
    expect(navState.formTitle).toBe('KS Montasje Folde og Skyv');
  });
});
