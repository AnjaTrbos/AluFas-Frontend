import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import ProjectsScreen from './ProjectsScreen';

function LocationStateView() {
  const location = useLocation();
  return (
    <div>
      <div data-testid="pathname">{location.pathname}</div>
      <div data-testid="state">{JSON.stringify(location.state)}</div>
    </div>
  );
}

function renderProjectsScreen() {
  return render(
    <MemoryRouter initialEntries={['/projects']}>
      <Routes>
        <Route path="/projects" element={<ProjectsScreen />} />
        <Route path="/new-document" element={<LocationStateView />} />
        <Route path="/avvik" element={<div>Avvik route</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('ProjectsScreen', () => {
  it('filters projects by search query', async () => {
    const user = userEvent.setup();

    renderProjectsScreen();

    expect(await screen.findByText(/Elkj.p Hercules/i)).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText(/S.k prosjekter/i), 'Bergen');

    await waitFor(() => {
      expect(screen.getByText('Bergen kontor vinduer')).toBeInTheDocument();
    });

    expect(screen.queryByText(/Elkj.p Hercules/i)).not.toBeInTheDocument();
  });

  it('switches to archived projects', async () => {
    const user = userEvent.setup();

    renderProjectsScreen();

    await screen.findByText(/Elkj.p Hercules/i);
    await user.click(screen.getByRole('button', { name: 'Arkiverte prosjekter' }));

    expect(await screen.findByText(/Troms. Terminal Fasade/i)).toBeInTheDocument();
    expect(screen.queryByText(/Elkj.p Hercules/i)).not.toBeInTheDocument();
  });

  it('passes the selected project to the next screen', async () => {
    const user = userEvent.setup();

    renderProjectsScreen();

    await screen.findByText('Bergen kontor vinduer');
    await user.click(screen.getByRole('button', { name: /Bergen kontor vinduer/i }));

    expect(screen.getByTestId('pathname')).toHaveTextContent('/new-document');
    expect(screen.getByTestId('state')).toHaveTextContent('AF-2024-012');
    expect(screen.getByTestId('state')).toHaveTextContent('Bergen kontor vinduer');
  });
});
