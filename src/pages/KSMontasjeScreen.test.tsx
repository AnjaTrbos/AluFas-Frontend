import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import KSMontasjeScreen from './KSMontasjeScreen';

function LocationStateView() {
  const location = useLocation();
  return (
    <div>
      <div data-testid="pathname">{location.pathname}</div>
      <div data-testid="state">{JSON.stringify(location.state)}</div>
    </div>
  );
}

describe('KSMontasjeScreen', () => {
  it('shows a remark field when a checkpoint is marked not ok', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={[{ pathname: '/ks-montasje', state: { montasjeType: 'Vindu montasje' } }]}>
        <Routes>
          <Route path="/ks-montasje" element={<KSMontasjeScreen />} />
        </Routes>
      </MemoryRouter>,
    );

    await user.click(screen.getAllByRole('button', { name: 'Ikke OK' })[0]);

    expect(screen.getAllByPlaceholderText(/Merknad/i).length).toBeGreaterThan(0);
  });

  it('navigates to image capture with the montage context', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={[{ pathname: '/ks-montasje', state: { montasjeType: 'Vindu montasje', projectNumber: 'AF-42', projectName: 'Testprosjekt' } }]}>
        <Routes>
          <Route path="/ks-montasje" element={<KSMontasjeScreen />} />
          <Route path="/image-capture" element={<LocationStateView />} />
        </Routes>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: /\+ Legg til bilde/i }));

    expect(screen.getByTestId('pathname')).toHaveTextContent('/image-capture');
    expect(screen.getByTestId('state')).toHaveTextContent('ks-montasje:Vindu montasje:AF-42');
  });
});
