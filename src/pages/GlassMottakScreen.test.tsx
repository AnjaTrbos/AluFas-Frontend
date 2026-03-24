import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import GlassMottakScreen from './GlassMottakScreen';

function LocationStateView() {
  const location = useLocation();
  return (
    <div>
      <div data-testid="pathname">{location.pathname}</div>
      <div data-testid="state">{JSON.stringify(location.state)}</div>
    </div>
  );
}

describe('GlassMottakScreen', () => {
  it('lets the user select inspection results', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/glass-mottak']}>
        <Routes>
          <Route path="/glass-mottak" element={<GlassMottakScreen />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getAllByRole('button', { name: 'Ja' })).toHaveLength(3);
    await user.click(screen.getAllByRole('button', { name: 'Ja' })[0]);

    expect(screen.getAllByPlaceholderText(/Legg til kommentar/i)).toHaveLength(3);
  });

  it('navigates to success on submit', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/glass-mottak']}>
        <Routes>
          <Route path="/glass-mottak" element={<GlassMottakScreen />} />
          <Route path="/success" element={<LocationStateView />} />
        </Routes>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: /Send skjema/i }));

    expect(screen.getByTestId('state')).toHaveTextContent('Glass mottak');
  });
});
