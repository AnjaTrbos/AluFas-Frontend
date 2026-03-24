import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import MontasjePlanScreen from './MontasjePlanScreen';

function LocationStateView() {
  const location = useLocation();
  return (
    <div>
      <div data-testid="pathname">{location.pathname}</div>
      <div data-testid="state">{JSON.stringify(location.state)}</div>
    </div>
  );
}

describe('MontasjePlanScreen', () => {
  it('allows selecting status and priority', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/montasje-plan']}>
        <Routes>
          <Route path="/montasje-plan" element={<MontasjePlanScreen />} />
        </Routes>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: /Glass mottatt/i }));
    await user.selectOptions(screen.getByRole('combobox'), 'Middels');

    expect(screen.getByRole('combobox')).toHaveValue('Middels');
  });

  it('navigates to success on submit', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/montasje-plan']}>
        <Routes>
          <Route path="/montasje-plan" element={<MontasjePlanScreen />} />
          <Route path="/success" element={<LocationStateView />} />
        </Routes>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: /Send skjema/i }));

    expect(screen.getByTestId('state')).toHaveTextContent('Montasje Plan');
  });
});
