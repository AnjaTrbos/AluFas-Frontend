import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import AvvikScreen from './AvvikScreen';

function LocationStateView() {
  const location = useLocation();
  return (
    <div>
      <div data-testid="pathname">{location.pathname}</div>
      <div data-testid="state">{JSON.stringify(location.state)}</div>
    </div>
  );
}

function renderAvvik(initialState?: unknown) {
  return render(
    <MemoryRouter initialEntries={[{ pathname: '/avvik', state: initialState }]}>
      <Routes>
        <Route path="/avvik" element={<AvvikScreen />} />
        <Route path="/image-capture" element={<LocationStateView />} />
        <Route path="/success" element={<LocationStateView />} />
        <Route path="/new-document" element={<LocationStateView />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('AvvikScreen', () => {
  it('shows project input when using manual project entry', () => {
    renderAvvik({ manualProjectEntry: true });

    expect(screen.getByLabelText(/Prosjektnavn \/ Prosjektnummer/i)).toBeInTheDocument();
  });

  it('shows selected project details when arriving from a project', () => {
    renderAvvik({
      manualProjectEntry: false,
      projectNumber: 'AF-42',
      projectName: 'Testprosjekt',
    });

    expect(screen.getByText('AF-42')).toBeInTheDocument();
    expect(screen.getByText('Testprosjekt')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText(/Skriv inn prosjektnavn/i)).not.toBeInTheDocument();
  });

  it('allows selecting areas and navigating to image capture with draft state', async () => {
    const user = userEvent.setup();
    sessionStorage.setItem(
      'alufas:image-drafts:avvik:AF-42',
      JSON.stringify([{ id: '1', name: 'test.jpg', dataUrl: 'data:image/png;base64,a', source: 'gallery', createdAt: '2025-01-01' }]),
    );

    renderAvvik({
      manualProjectEntry: false,
      projectNumber: 'AF-42',
      projectName: 'Testprosjekt',
    });

    await user.click(screen.getByRole('button', { name: /Verksted/i }));
    expect(screen.getByRole('button', { name: /\+ Legg til bilde \(1\)/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /\+ Legg til bilde \(1\)/i }));

    expect(screen.getByTestId('pathname')).toHaveTextContent('/image-capture');
    expect(screen.getByTestId('state')).toHaveTextContent('avvik:AF-42');
  });

  it('navigates to success when the form is submitted', async () => {
    const user = userEvent.setup();

    renderAvvik({
      manualProjectEntry: false,
      projectNumber: 'AF-42',
      projectName: 'Testprosjekt',
    });

    await user.click(screen.getByRole('button', { name: /Send skjema/i }));

    expect(screen.getByTestId('pathname')).toHaveTextContent('/success');
    expect(screen.getByTestId('state')).toHaveTextContent('"formTitle":"Avvik"');
  });

  it('returns to the original screen instead of browser history when going back', async () => {
    const user = userEvent.setup();

    renderAvvik({
      manualProjectEntry: false,
      projectNumber: 'AF-42',
      projectName: 'Testprosjekt',
      returnTo: '/new-document',
      returnState: { projectNumber: 'AF-42', projectName: 'Testprosjekt' },
    });

    await user.click(screen.getByRole('button', { name: 'Tilbake' }));

    expect(screen.getByTestId('pathname')).toHaveTextContent('/new-document');
    expect(screen.getByTestId('state')).toHaveTextContent('AF-42');
  });
});
