import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import SJAScreen from './SJAScreen';

function LocationStateView() {
  const location = useLocation();
  return (
    <div>
      <div data-testid="pathname">{location.pathname}</div>
      <div data-testid="state">{JSON.stringify(location.state)}</div>
    </div>
  );
}

describe('SJAScreen', () => {
  it('renders with project info and shows 0/8 progress', () => {
    render(
      <MemoryRouter
        initialEntries={[{
          pathname: '/sja',
          state: { projectNumber: 'AF-2024-001', projectName: 'Elkjøp Hercules' },
        }]}
      >
        <Routes>
          <Route path="/sja" element={<SJAScreen />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('SJA - Sikker Jobbanalyse')).toBeInTheDocument();
    expect(screen.getByText('0 / 8')).toBeInTheDocument();
  });

  it('updates progress when hendelse is toggled Utført', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter
        initialEntries={[{ pathname: '/sja', state: { projectNumber: 'AF-2024-001', projectName: 'Test' } }]}
      >
        <Routes>
          <Route path="/sja" element={<SJAScreen />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('0 / 8')).toBeInTheDocument();

    const utfortButtons = screen.getAllByRole('button', { name: /utført/i });
    await user.click(utfortButtons[0]);
    expect(screen.getByText('1 / 8')).toBeInTheDocument();
  });

  it('navigates to success with correct form title', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter
        initialEntries={[{ pathname: '/sja', state: { projectNumber: 'AF-2024-001', projectName: 'Test' } }]}
      >
        <Routes>
          <Route path="/sja" element={<SJAScreen />} />
          <Route path="/success" element={<LocationStateView />} />
        </Routes>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: /send skjema/i }));

    expect(screen.getByTestId('pathname').textContent).toBe('/success');
    const navState = JSON.parse(screen.getByTestId('state').textContent ?? '{}');
    expect(navState.formTitle).toBe('SJA - Sikker Jobbanalyse');
  });
});
