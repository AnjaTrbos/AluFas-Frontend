import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import SplashScreen from './SplashScreen';

function renderSplashScreen() {
	return render(
		<MemoryRouter initialEntries={['/']}>
			<Routes>
				<Route path="/" element={<SplashScreen />} />
				<Route path="/login" element={<div>Login route</div>} />
				<Route path="/projects" element={<div>Projects route</div>} />
			</Routes>
		</MemoryRouter>,
	);
}

afterEach(() => {
	localStorage.clear();
	vi.restoreAllMocks();
});

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

	it('shows an alert when start documentation is used without login', async () => {
		const user = userEvent.setup();
		const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

		renderSplashScreen();

		await user.click(screen.getByRole('button', { name: /Start dokumentasjon/i }));

		expect(alertSpy).toHaveBeenCalledWith('Du må være logget inn for å starte dokumentasjon.');
		expect(screen.queryByText('Projects route')).not.toBeInTheDocument();
	});

	it('opens the projects screen when a remembered login exists', async () => {
		const user = userEvent.setup();
		localStorage.setItem('app-authenticated', 'true');

		renderSplashScreen();

		await user.click(screen.getByRole('button', { name: /Start dokumentasjon/i }));

		expect(screen.getByText('Projects route')).toBeInTheDocument();
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
