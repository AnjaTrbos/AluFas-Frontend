// Router hook to navigate between screens
import { useNavigate } from 'react-router-dom';
// Brand logo component for visual identity
import BrandLogo from '../components/BrandLogo';
import { APP_FONT_FAMILY, UI_COLORS } from '../styles/uiTokens';
// Type definition for component props
import type { LoginScreenProps } from '../types/app';
// Authentication state management utility
import { setAuthenticated } from '../utils/auth';

const appFontStyle = { fontFamily: APP_FONT_FAMILY } as const;
const loginButtonTextStyle = { fontSize: 'clamp(1rem, 2vw, 1.25rem)' } as const;
const helperTextStyle = { color: UI_COLORS.ink400, fontFamily: APP_FONT_FAMILY } as const;
const iconTileColors = ['#f25022', '#7fba00', '#00a4ef', '#ffb900'] as const;

// Primary authentication screen for user login via Microsoft
export default function LoginScreen({ onBack, onLoginSuccess }: LoginScreenProps) {
	// Access router navigation for redirecting to other screens
	const navigate = useNavigate();

	// Localized UI text strings for login form
	const copy = {
		title: 'Innlogging',
		loginButton: 'Logg inn med Microsoft',
		helper: 'Logg inn med din @aluminiumfasader.no-konto for å fortsette.',
	};

	// Authenticate user and navigate to main projects screen
	const handleMicrosoftLogin = () => {
		setAuthenticated(true);
		onLoginSuccess();
		navigate('/projects');
	};

	// Return to splash screen and reset navigation
	const handleBack = () => {
		onBack();
		navigate('/');
	};

	return (
		<div className="app-font relative min-h-screen bg-white px-4 py-6 sm:px-6 sm:py-8" style={appFontStyle}>
			{/* Full-screen login form container */}
			<button
				onClick={handleBack}
				aria-label="Tilbake"
				className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white transition-colors hover:bg-slate-800 sm:left-6 sm:top-6"
			>
				{/* Left arrow icon */}
				<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
					<path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.56l3.97 3.97a.75.75 0 1 1-1.06 1.06l-5.25-5.25a.75.75 0 0 1 0-1.06l5.25-5.25a.75.75 0 0 1 1.06 1.06L5.56 9.25h10.69A.75.75 0 0 1 17 10Z" clipRule="evenodd" />
				</svg>
			</button>

			{/* Centered card container for login form */}
			<div className="flex min-h-[calc(100vh-3rem)] items-center justify-center">
				{/* Login form card with branding and authentication */}
				<div className="w-full max-w-[28rem] rounded-3xl border border-slate-300 bg-slate-50 px-5 py-7 shadow-xl sm:px-8 sm:py-10">
					{/* Display company logo for brand recognition */}
					<div className="flex justify-center">
						<BrandLogo size="card" />
					</div>

					{/* Login page heading */}
					<h1 className="mt-6 text-center text-2xl font-black text-slate-900 sm:mt-8 sm:text-3xl" style={appFontStyle}>
						{copy.title}
					</h1>

					{/* Microsoft authentication button with brand colors */}
					<button
						onClick={handleMicrosoftLogin}
						className="mt-12 flex w-full items-center justify-center gap-4 rounded-2xl bg-slate-950 px-5 py-4 font-black text-white transition-all hover:bg-slate-800 active:scale-95 sm:mt-20 sm:gap-5 sm:px-8 sm:py-6"
						style={loginButtonTextStyle}
					>
						{/* Microsoft logo using brand colors */}
						<span className="grid h-8 w-8 grid-cols-2 gap-0.5 sm:h-10 sm:w-10">
							<span style={{ background: iconTileColors[0] }} />
							<span style={{ background: iconTileColors[1] }} />
							<span style={{ background: iconTileColors[2] }} />
							<span style={{ background: iconTileColors[3] }} />
						</span>
						{/* Button text for login action */}
						<span>{copy.loginButton}</span>
					</button>

					{/* Helper text explaining login requirement */}
					<p className="mt-6 text-center text-sm leading-relaxed sm:mt-8 sm:text-base" style={{ ...helperTextStyle, color: UI_COLORS.ink500 }}>
						{copy.helper}
					</p>
				</div>
			</div>
		</div>
	);
}
