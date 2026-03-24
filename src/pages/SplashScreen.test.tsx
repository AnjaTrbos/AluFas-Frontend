import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import SplashScreen from './SplashScreen';

function renderSplashScreen() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<div>Login route</div>} />
        <Route path="/new-document" element={<div>New document route</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('SplashScreen', () => {
  it('switches language and navigates to login', async () => {
    const user = userEvent.setup();

    renderSplashScreen();

    expect(screen.getByRole('heading', { name: 'Full Kontroll' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /NO/i }));

    expect(screen.getByRole('heading', { name: 'Full Control' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Log in' }));

    expect(screen.getByText('Login route')).toBeInTheDocument();
  });

  it('toggles dark mode and persists it', async () => {
    const user = userEvent.setup();

    renderSplashScreen();

    const buttons = screen.getAllByRole('button');

    await user.click(buttons[1]);

    expect(document.documentElement).toHaveClass('dark');
    expect(localStorage.getItem('app-theme')).toBe('dark');
  });
});
