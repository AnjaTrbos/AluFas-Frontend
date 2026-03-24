import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import SuccessScreen from './SuccessScreen';

describe('SuccessScreen', () => {
  it('renders supplied success details', () => {
    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: '/success',
            state: { projectNumber: 'AF-42', projectName: 'Testprosjekt', formTitle: 'Avvik' },
          },
        ]}
      >
        <Routes>
          <Route path="/success" element={<SuccessScreen />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText(/AF-42/i)).toBeInTheDocument();
    expect(screen.getByText(/Testprosjekt/i)).toBeInTheDocument();
    expect(screen.getByText(/^Avvik$/i)).toBeInTheDocument();
  });

  it('navigates to the expected routes from action buttons', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/success']}>
        <Routes>
          <Route path="/success" element={<SuccessScreen />} />
          <Route path="/new-document" element={<div>New document route</div>} />
          <Route path="/projects" element={<div>Projects route</div>} />
        </Routes>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: /Tilbake til prosjektet/i }));
    expect(screen.getByText('New document route')).toBeInTheDocument();
  });
});
