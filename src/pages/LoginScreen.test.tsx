import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import LoginScreen from './LoginScreen';

describe('LoginScreen', () => {
  it('logs in with Microsoft and navigates to projects', async () => {
    const user = userEvent.setup();
    const onBack = vi.fn();
    const onLoginSuccess = vi.fn();

    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route
            path="/login"
            element={<LoginScreen onBack={onBack} onLoginSuccess={onLoginSuccess} />}
          />
          <Route path="/projects" element={<div>Projects route</div>} />
        </Routes>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: /Logg inn med Microsoft/i }));

    expect(onLoginSuccess).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Projects route')).toBeInTheDocument();
    expect(onBack).not.toHaveBeenCalled();
  });

  it('goes back to splash when the back button is clicked', async () => {
    const user = userEvent.setup();
    const onBack = vi.fn();
    const onLoginSuccess = vi.fn();

    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route
            path="/login"
            element={<LoginScreen onBack={onBack} onLoginSuccess={onLoginSuccess} />}
          />
          <Route path="/" element={<div>Splash route</div>} />
        </Routes>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: 'Tilbake' }));

    expect(onBack).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Splash route')).toBeInTheDocument();
  });
});
