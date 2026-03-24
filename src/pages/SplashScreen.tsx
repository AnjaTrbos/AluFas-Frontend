import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BrandLogo from '../components/BrandLogo';
import { isAuthenticated } from '../utils/auth';

const THEME_STORAGE_KEY = 'app-theme';
const LANGUAGE_STORAGE_KEY = 'app-language';

type Language = 'no' | 'en';

function getInitialTheme() {
	const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
	const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ?? false;
	return storedTheme ? storedTheme === 'dark' : prefersDark;
}

function getInitialLanguage(): Language {
	const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
	return storedLanguage === 'en' ? 'en' : 'no';
}

export default function SplashScreen() {
	const navigate = useNavigate();
	const [isDarkMode, setIsDarkMode] = useState(getInitialTheme);
	const [language, setLanguage] = useState<Language>(getInitialLanguage);

	useEffect(() => {
		document.documentElement.classList.toggle('dark', isDarkMode);
	}, [isDarkMode]);

	const toggleLanguage = () => {
		setLanguage((previous) => {
			const next: Language = previous === 'no' ? 'en' : 'no';
			localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
			return next;
		});
	};

	const toggleDarkMode = () => {
		setIsDarkMode((previous) => {
			const next = !previous;
			localStorage.setItem(THEME_STORAGE_KEY, next ? 'dark' : 'light');
			return next;
		});
	};

	const isNorwegian = language === 'no';

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

	const handleStartDocumentation = () => {
		if (!isAuthenticated()) {
			window.alert(copy.loginRequiredMessage);
			return;
		}

		navigate('/projects');
	};

	const pageClassName = `min-h-screen flex flex-col items-center justify-between px-4 py-8 transition-colors font-bold sm:px-6 sm:py-12 md:py-16 ${
		isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900'
	}`;
	const topButtonClassName = `flex h-12 w-12 flex-col items-center justify-center gap-0.5 rounded-full border-2 transition-colors sm:h-16 sm:w-16 ${
		isDarkMode
			? 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500 hover:text-white'
			: 'border-slate-200 bg-white text-slate-600 hover:border-slate-400 hover:text-slate-900'
	}`;
	const titleClassName = `text-2xl font-black sm:text-3xl ${isDarkMode ? 'text-white' : 'text-slate-900'}`;
	const subtitleClassName = `mt-1 max-w-xs text-sm sm:max-w-md sm:text-base ${isDarkMode ? 'text-slate-300' : 'text-slate-500'}`;
	const startButtonClassName = `w-full rounded-2xl border-2 py-4 text-lg font-black transition-all active:scale-95 sm:py-6 sm:text-2xl ${
		isDarkMode
			? 'border-slate-300 bg-slate-900 text-white hover:bg-slate-800'
			: 'border-slate-900 bg-white text-slate-900 hover:bg-slate-50'
	}`;
	const loginButtonClassName = `w-full rounded-2xl py-4 text-lg font-black transition-all active:scale-95 sm:py-6 sm:text-2xl ${
		isDarkMode ? 'bg-white text-slate-950 hover:bg-slate-100' : 'bg-slate-950 text-white hover:bg-slate-800'
	}`;

	return (
		<div className={pageClassName} style={{ fontFamily: 'Arial, sans-serif' }}>
			<div className="flex w-full justify-end gap-3">
				<button onClick={toggleLanguage} className={topButtonClassName}>
					<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
						<circle cx="12" cy="12" r="10" />
						<path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
					</svg>
					<span className="text-[9px] font-bold uppercase tracking-widest sm:text-[10px]">{language.toUpperCase()}</span>
				</button>
				<button onClick={toggleDarkMode} className={topButtonClassName}>
					<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
						<path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
					</svg>
					<span className="text-[9px] font-bold uppercase tracking-widest sm:text-[10px]">{copy.themeLabel}</span>
				</button>
			</div>

			<div className="flex flex-col items-center gap-5 sm:gap-6">
				<div className="flex items-center justify-center">
					<BrandLogo size="hero" />
				</div>

				<div className="text-center">
					<h1 className={titleClassName}>{copy.title}</h1>
					<p className={subtitleClassName}>{copy.subtitle}</p>
				</div>
			</div>

			<div className="flex w-full max-w-sm flex-col gap-3 sm:max-w-md">
				<button onClick={() => navigate('/login')} className={loginButtonClassName}>
					{copy.loginButton}
				</button>
				<button onClick={handleStartDocumentation} className={startButtonClassName}>
					{copy.startButton}
				</button>
			</div>
		</div>
	);
}
