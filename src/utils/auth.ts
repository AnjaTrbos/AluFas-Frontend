const AUTH_STORAGE_KEY = 'app-authenticated';

export function isAuthenticated() {
	return localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
}

export function setAuthenticated(value: boolean) {
	localStorage.setItem(AUTH_STORAGE_KEY, value ? 'true' : 'false');
}

