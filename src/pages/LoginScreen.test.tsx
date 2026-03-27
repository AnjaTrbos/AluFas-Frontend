import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';
import LoginScreen from './LoginScreen';

afterEach(() => {
	localStorage.clear();
});

describe('LoginScreen', () => {
	it('logs in with Microsoft, stores the session, and navigates to projects', async () => {
		const user = userEvent.setup();

		render(
			<MemoryRouter initialEntries={['/login']}>
				<Routes>
					<Route path="/login" element={<LoginScreen />} />
					<Route path="/projects" element={<div>Projects route</div>} />
				</Routes>
			</MemoryRouter>,
		);

		await user.click(screen.getByRole('button', { name: /Logg inn med Microsoft/i }));

		expect(localStorage.getItem('app-authenticated')).toBe('true');
		expect(screen.getByText('Projects route')).toBeInTheDocument();
	});

	it('goes back to splash when the back button is clicked', async () => {
		const user = userEvent.setup();

		render(
			<MemoryRouter initialEntries={['/login']}>
				<Routes>
					<Route path="/login" element={<LoginScreen />} />
					<Route path="/" element={<div>Splash route</div>} />
				</Routes>
			</MemoryRouter>,
		);

		await user.click(screen.getByRole('button', { name: 'Tilbake' }));

		expect(screen.getByText('Splash route')).toBeInTheDocument();
	});
});
