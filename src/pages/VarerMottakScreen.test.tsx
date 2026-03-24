import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import VarerMottakScreen from './VarerMottakScreen';

function LocationStateView() {
  const location = useLocation();
  return (
    <div>
      <div data-testid="pathname">{location.pathname}</div>
      <div data-testid="state">{JSON.stringify(location.state)}</div>
    </div>
  );
}

describe('VarerMottakScreen', () => {
  it('expands a checklist step', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/varer-mottak']}>
        <Routes>
          <Route path="/varer-mottak" element={<VarerMottakScreen />} />
        </Routes>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: /Evt. transportskade/i }));

    expect(screen.getByText(/Riper, bulker, deformasjoner/i)).toBeInTheDocument();
  });

  it('navigates to success on submit', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/varer-mottak']}>
        <Routes>
          <Route path="/varer-mottak" element={<VarerMottakScreen />} />
          <Route path="/success" element={<LocationStateView />} />
        </Routes>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: /Send skjema/i }));

    expect(screen.getByTestId('state')).toHaveTextContent('Varer mottak');
  });
});
