import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import KSVerkstedScreen from './KSVerkstedScreen';

function LocationStateView() {
  const location = useLocation();
  return (
    <div>
      <div data-testid="pathname">{location.pathname}</div>
      <div data-testid="state">{JSON.stringify(location.state)}</div>
    </div>
  );
}

describe('KSVerkstedScreen', () => {
  it('updates progress when a checkpoint is selected', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/ks-verksted']}>
        <Routes>
          <Route path="/ks-verksted" element={<KSVerkstedScreen />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText(/0 \/ 8/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /M.l kontrollert i henhold til tegning/i }));

    expect(screen.getByText(/1 \/ 8/i)).toBeInTheDocument();
  });

  it('navigates to success when the form is submitted', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/ks-verksted']}>
        <Routes>
          <Route path="/ks-verksted" element={<KSVerkstedScreen />} />
          <Route path="/success" element={<LocationStateView />} />
        </Routes>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: /Send skjema/i }));

    expect(screen.getByTestId('pathname')).toHaveTextContent('/success');
    expect(screen.getByTestId('state')).toHaveTextContent('KS Verksted');
  });
});
