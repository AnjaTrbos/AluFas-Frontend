import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import KSServiceEtterMontasjeScreen from './KSServiceEtterMontasjeScreen';

function LocationStateView() {
  const location = useLocation();
  return (
    <div>
      <div data-testid="pathname">{location.pathname}</div>
      <div data-testid="state">{JSON.stringify(location.state)}</div>
    </div>
  );
}

describe('KSServiceEtterMontasjeScreen', () => {
  it('renders and updates progress when filling a tracked field', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter
        initialEntries={[{
          pathname: '/ks-service-etter-montasje',
          state: { projectNumber: 'AF-2024-001', projectName: 'Elkjop Hercules' },
        }]}
      >
        <Routes>
          <Route path="/ks-service-etter-montasje" element={<KSServiceEtterMontasjeScreen />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('0 / 5')).toBeInTheDocument();

    await user.type(screen.getByLabelText('PROSJEKT *'), 'Serviceprosjekt');
    expect(screen.getByText('1 / 5')).toBeInTheDocument();
  });

  it('navigates to success with service form title', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter
        initialEntries={[{
          pathname: '/ks-service-etter-montasje',
          state: { projectNumber: 'AF-2024-001', projectName: 'Elkjop Hercules' },
        }]}
      >
        <Routes>
          <Route path="/ks-service-etter-montasje" element={<KSServiceEtterMontasjeScreen />} />
          <Route path="/success" element={<LocationStateView />} />
        </Routes>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: /send skjema/i }));

    expect(screen.getByTestId('pathname').textContent).toBe('/success');
    const navState = JSON.parse(screen.getByTestId('state').textContent ?? '{}');
    expect(navState.formTitle).toBe('Service etter montasje');
  });
});
