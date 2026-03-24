import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import ProjectsScreen from './ProjectsScreen';

function renderProjectsScreen() {
  return render(
    <MemoryRouter initialEntries={['/projects']}>
      <Routes>
        <Route path="/projects" element={<ProjectsScreen />} />
        <Route path="/new-document" element={<div>New document route</div>} />
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
});
