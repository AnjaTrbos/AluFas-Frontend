import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import ProfilerMottakScreen from './ProfilerMottakScreen';

function LocationStateView() {
  const location = useLocation();
  return (
    <div>
      <div data-testid="pathname">{location.pathname}</div>
      <div data-testid="state">{JSON.stringify(location.state)}</div>
    </div>
  );
}

describe('ProfilerMottakScreen', () => {
  it('expands a checklist step and allows selecting a result', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/profiler-mottak']}>
        <Routes>
          <Route path="/profiler-mottak" element={<ProfilerMottakScreen />} />
        </Routes>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: /Identifikasjon og sjekk av leveransen/i }));

    expect(screen.getByText(/Kontrolleres mot:/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Profilen/i }));

    expect(screen.getByRole('button', { name: /Profilen/i })).toBeInTheDocument();
  });

  it('navigates to success on submit', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/profiler-mottak']}>
        <Routes>
          <Route path="/profiler-mottak" element={<ProfilerMottakScreen />} />
          <Route path="/success" element={<LocationStateView />} />
        </Routes>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: /Send skjema/i }));

    expect(screen.getByTestId('pathname')).toHaveTextContent('/success');
    expect(screen.getByTestId('state')).toHaveTextContent('Profiler mottak');
  });
});
