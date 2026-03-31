import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import KSSkyvOgFoldeScreen from './KSSkyvOgFoldeScreen';

function LocationStateView() {
  const location = useLocation();
  return (
    <div>
      <div data-testid="pathname">{location.pathname}</div>
      <div data-testid="state">{JSON.stringify(location.state)}</div>
    </div>
  );
}

describe('KSSkyvOgFoldeScreen', () => {
  it('renders the form and updates progress when checkboxes are toggled', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter
        initialEntries={[{
          pathname: '/ks-skyv-folde',
          state: { projectNumber: 'AF-2024-001', projectName: 'Elkjøp Hercules' },
        }]}
      >
        <Routes>
          <Route path="/ks-skyv-folde" element={<KSSkyvOgFoldeScreen />} />
        </Routes>
      </MemoryRouter>,
    );

    // Initially 0/12
    expect(screen.getByText('0 / 12')).toBeInTheDocument();

    // Check one system-type option → increments progress to 1
    await user.click(screen.getByRole('button', { name: /ASS50/ }));
    expect(screen.getByText('1 / 12')).toBeInTheDocument();

    // Check "Element merket" Ja → increments to 2
    const jaButtons = screen.getAllByRole('button', { name: /^Ja$/ });
    await user.click(jaButtons[0]);
    expect(screen.getByText('2 / 12')).toBeInTheDocument();
  });

  it('navigates to success screen when submit is clicked', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter
        initialEntries={[{
          pathname: '/ks-skyv-folde',
          state: { projectNumber: 'AF-2024-001', projectName: 'Elkjøp Hercules' },
        }]}
      >
        <Routes>
          <Route path="/ks-skyv-folde" element={<KSSkyvOgFoldeScreen />} />
          <Route path="/success" element={<LocationStateView />} />
        </Routes>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: /Send skjema/ }));
    expect(screen.getByTestId('pathname').textContent).toBe('/success');
    expect(screen.getByTestId('state').textContent).toContain('KS Skyv og Folde');
  });
});
