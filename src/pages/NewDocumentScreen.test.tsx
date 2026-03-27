import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import NewDocumentScreen from './NewDocumentScreen';

function LocationStateView() {
  const location = useLocation();
  return (
    <div>
      <div data-testid="pathname">{location.pathname}</div>
      <div data-testid="state">{JSON.stringify(location.state)}</div>
    </div>
  );
}

function renderScreen() {
  return render(
    <MemoryRouter initialEntries={['/new-document']}>
      <Routes>
        <Route path="/new-document" element={<NewDocumentScreen />} />
        <Route path="/avvik" element={<LocationStateView />} />
        <Route path="/ks-montasje" element={<LocationStateView />} />
        <Route path="/projects" element={<LocationStateView />} />
      </Routes>
    </MemoryRouter>,
  );
}

function renderScreenWithProjectState() {
  return render(
    <MemoryRouter
      initialEntries={[
        {
          pathname: '/new-document',
          state: { projectNumber: 'AF-2024-012', projectName: 'Bergen kontor vinduer', manualProjectEntry: false },
        },
      ]}
    >
      <Routes>
        <Route path="/new-document" element={<NewDocumentScreen />} />
        <Route path="/avvik" element={<LocationStateView />} />
        <Route path="/ks-montasje" element={<LocationStateView />} />
        <Route path="/projects" element={<LocationStateView />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('NewDocumentScreen', () => {
  it('filters document types based on search', async () => {
    const user = userEvent.setup();

    renderScreen();

    await user.type(screen.getByPlaceholderText(/S.k dokumenttype/i), 'Glass');

    expect(screen.getByRole('button', { name: /Glass mottak/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Varer mottak/i })).not.toBeInTheDocument();
  });

  it('expands montage options and navigates with child state', async () => {
    const user = userEvent.setup();

    renderScreen();

    await user.click(screen.getByRole('button', { name: /KS Montasje/i }));
    await user.click(screen.getByRole('button', { name: /Vindu montasje/i }));

    expect(screen.getByTestId('pathname')).toHaveTextContent('/ks-montasje');
    expect(screen.getByTestId('state')).toHaveTextContent('Vindu montasje');
  });

  it('navigates back to projects', async () => {
    const user = userEvent.setup();

    renderScreen();

    await user.click(screen.getByRole('button', { name: /Tilbake/i }));

    expect(screen.getByTestId('pathname')).toHaveTextContent('/projects');
  });

  it('shows the selected project from navigation state', () => {
    renderScreenWithProjectState();

    expect(screen.getByText('AF-2024-012')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Bergen kontor vinduer' })).toBeInTheDocument();
  });
});
