import { useNavigate } from 'react-router-dom';
import BrandLogo from '../components/BrandLogo';
import type { LoginScreenProps } from '../types/app';

export default function LoginScreen({ onBack, onLoginSuccess }: LoginScreenProps) {
	const navigate = useNavigate();

	const copy = {
		title: 'Innlogging',
		loginButton: 'Logg inn med Microsoft',
		helper: 'Logg inn med din @aluminiumfasader.no-konto for å fortsette.',
	};

	const handleMicrosoftLogin = () => {
		onLoginSuccess();
		navigate('/projects');
	};

	const handleBack = () => {
		onBack();
		navigate('/');
	};

	return (
		<div className="relative min-h-screen bg-white px-4 py-6 sm:px-6 sm:py-8" style={{ fontFamily: 'Arial, sans-serif' }}>
			<button
				onClick={handleBack}
				aria-label="Tilbake"
				className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white transition-colors hover:bg-slate-800 sm:left-6 sm:top-6"
			>
				<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
					<path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.56l3.97 3.97a.75.75 0 1 1-1.06 1.06l-5.25-5.25a.75.75 0 0 1 0-1.06l5.25-5.25a.75.75 0 0 1 1.06 1.06L5.56 9.25h10.69A.75.75 0 0 1 17 10Z" clipRule="evenodd" />
				</svg>
			</button>

			<div className="flex min-h-[calc(100vh-3rem)] items-center justify-center">
				<div className="w-full max-w-[28rem] rounded-3xl border border-slate-300 bg-slate-50 px-5 py-7 shadow-xl sm:px-8 sm:py-10">
					<div className="flex justify-center">
						<BrandLogo size="card" />
					</div>

					<h1 className="mt-6 text-center text-2xl font-black text-slate-900 sm:mt-8 sm:text-3xl" style={{ fontFamily: 'Arial, sans-serif' }}>
						{copy.title}
					</h1>

					<button
						onClick={handleMicrosoftLogin}
						className="mt-12 flex w-full items-center justify-center gap-4 rounded-2xl bg-slate-950 px-5 py-4 font-black text-white transition-all hover:bg-slate-800 active:scale-95 sm:mt-20 sm:gap-5 sm:px-8 sm:py-6"
						style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}
					>
						<span className="grid h-8 w-8 grid-cols-2 gap-0.5 sm:h-10 sm:w-10">
							<span className="bg-[#f25022]" />
							<span className="bg-[#7fba00]" />
							<span className="bg-[#00a4ef]" />
							<span className="bg-[#ffb900]" />
						</span>
						<span>{copy.loginButton}</span>
					</button>

					<p className="mt-6 text-center text-sm leading-relaxed sm:mt-8 sm:text-base" style={{ color: '#a1a5ab', fontFamily: 'Arial, sans-serif' }}>
						{copy.helper}
					</p>
				</div>
			</div>
		</div>
	);
}
