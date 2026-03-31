// Core hooks for persisted UI preferences and lifecycle syncing
import { useEffect, useState } from 'react';
// Navigation hook for moving to login and project flows
import { useNavigate } from 'react-router-dom';
// Shared brand asset for consistent entry-screen identity
import BrandLogo from '../components/BrandLogo';
import { APP_FONT_FAMILY } from '../styles/uiTokens';
// Auth utility used to guard direct access to documentation flow
import { isAuthenticated } from '../utils/auth';
import type { Language } from '../types/app';

// Persistent storage keys for theme and language preferences
const THEME_STORAGE_KEY = 'app-theme';
const LANGUAGE_STORAGE_KEY = 'app-language';
const pageFontStyle = { fontFamily: APP_FONT_FAMILY } as const;

// Initialize theme from saved preference, with system fallback for first visit
function getInitialTheme() {
	const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
	const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ?? false;
	return storedTheme ? storedTheme === 'dark' : prefersDark;
}

// Initialize language from storage with Norwegian as default
function getInitialLanguage(): Language {
	const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
	return storedLanguage === 'en' ? 'en' : 'no';
}

export default function SplashScreen() {
	// Router navigation for login and project list entry points
	const navigate = useNavigate();
	// Keep preferences local while hydrating initial values from storage
	const [isDarkMode, setIsDarkMode] = useState(getInitialTheme);
	const [language, setLanguage] = useState<Language>(getInitialLanguage);

	useEffect(() => {
		// Keep root dark class in sync so global styles follow selected theme
		document.documentElement.classList.toggle('dark', isDarkMode);
	}, [isDarkMode]);

	// Toggle language and persist choice for next app launch
	const toggleLanguage = () => {
		setLanguage((previous) => {
			const next: Language = previous === 'no' ? 'en' : 'no';
			localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
			return next;
		});
	};

	// Toggle theme and persist mode preference
	const toggleDarkMode = () => {
		setIsDarkMode((previous) => {
			const next = !previous;
			localStorage.setItem(THEME_STORAGE_KEY, next ? 'dark' : 'light');
			return next;
		});
	};

	// Boolean helper keeps copy selection readable
	const isNorwegian = language === 'no';

	// Centralized localized copy keeps UI text decisions in one place
	const copy = {
		title: isNorwegian ? 'Full Kontroll' : 'Full Control',
		subtitle: isNorwegian ? 'Enkel og rask innsending av feltrapporter' : 'Easy and fast submission of field reports',
		loginButton: isNorwegian ? 'Logg inn' : 'Log in',
		startButton: isNorwegian ? 'Start dokumentasjon' : 'Start documentation',
		themeLabel: isDarkMode ? (isNorwegian ? 'MØRK' : 'DARK') : isNorwegian ? 'LYS' : 'LIGHT',
		loginRequiredMessage: isNorwegian
			? 'Du må være logget inn for å starte dokumentasjon.'
			: 'You must be logged in to start documentation.',
	};

	// Guard project entry so users authenticate before creating documentation
	const handleStartDocumentation = () => {
		if (!isAuthenticated()) {
			window.alert(copy.loginRequiredMessage);
			return;
		}

		navigate('/projects');
	};

	// Theme-aware class bundles keep JSX concise and consistent
	const pageClassName = `min-h-screen flex flex-col items-center justify-between px-4 py-8 transition-colors font-bold sm:px-6 sm:py-12 md:py-16 ${
		isDarkMode ? 'bg-[#0f172a] text-white' : 'bg-white text-[#0f172a]'
	}`;
	const topButtonClassName = `flex h-12 w-12 flex-col items-center justify-center gap-0.5 rounded-full border-2 transition-colors sm:h-16 sm:w-16 ${
		isDarkMode
			? 'border-[#404040] bg-[#0f172a] text-[#bfbfbf] hover:border-[#808080] hover:text-white'
			: 'border-[#bfbfbf] bg-white text-[#808080] hover:border-[#808080] hover:text-[#0f172a]'
	}`;
	const titleClassName = `text-2xl font-black sm:text-3xl ${isDarkMode ? 'text-white' : 'text-[#0f172a]'}`;
	const subtitleClassName = `mt-1 max-w-xs text-sm sm:max-w-md sm:text-base ${isDarkMode ? 'text-[#bfbfbf]' : 'text-[#808080]'}`;
	const startButtonClassName = `w-full rounded-2xl border-2 py-4 text-lg font-black transition-all active:scale-95 sm:py-6 sm:text-2xl ${
		isDarkMode
			? 'border-[#bfbfbf] bg-[#0f172a] text-white hover:bg-[#404040]'
			: 'border-[#0f172a] bg-white text-[#0f172a] hover:bg-[#ffffff]'
	}`;
	const loginButtonClassName = `w-full rounded-2xl py-4 text-lg font-black transition-all active:scale-95 sm:py-6 sm:text-2xl ${
		isDarkMode ? 'bg-white text-[#0f172a] hover:bg-[#ffffff]' : 'bg-[#0f172a] text-white hover:bg-[#404040]'
	}`;

	return (
		// Splash layout with top controls, brand block, and primary actions
		<div className={`app-font ${pageClassName}`} style={pageFontStyle}>
			{/* Preference controls for language and color mode */}
			<div className="flex w-full justify-end gap-3">
				{/* Language toggle improves accessibility for bilingual users */}
				<button onClick={toggleLanguage} className={topButtonClassName}>
					<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
						<circle cx="12" cy="12" r="10" />
						<path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
					</svg>
					<span className="text-[9px] font-bold uppercase tracking-widest sm:text-[10px]">{language.toUpperCase()}</span>
				</button>
				{/* Theme toggle supports comfort in different lighting conditions */}
				<button onClick={toggleDarkMode} className={topButtonClassName}>
					<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
						<path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
					</svg>
					<span className="text-[9px] font-bold uppercase tracking-widest sm:text-[10px]">{copy.themeLabel}</span>
				</button>
			</div>

			{/* Brand + value proposition area for first-screen orientation */}
			<div className="flex flex-col items-center gap-5 sm:gap-6">
				{/* Logo anchors brand recognition before action selection */}
				<div className="flex items-center justify-center">
					<BrandLogo size="hero" />
				</div>

				{/* Headline and subtitle explain product purpose quickly */}
				<div className="text-center">
					<h1 className={titleClassName}>{copy.title}</h1>
					<p className={subtitleClassName}>{copy.subtitle}</p>
				</div>
			</div>

			{/* Primary call-to-actions for authentication and documentation flow */}
			<div className="flex w-full max-w-sm flex-col gap-3 sm:max-w-md">
				{/* Login action establishes authenticated session */}
				<button onClick={() => navigate('/login')} className={loginButtonClassName}>
					{copy.loginButton}
				</button>
				{/* Start action routes directly to projects when auth is valid */}
				<button onClick={handleStartDocumentation} className={startButtonClassName}>
					{copy.startButton}
				</button>
			</div>
		</div>
	);
}
