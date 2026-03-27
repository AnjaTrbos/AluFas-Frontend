// Icons reinforce completion and navigation actions
import { Check, FileText, Home } from 'lucide-react';
// Router hooks used to read submission context and navigate onward
import { useLocation, useNavigate } from 'react-router-dom';
import { APP_FONT_FAMILY, UI_COLORS } from '../styles/uiTokens';
import type { SuccessRouteState } from '../types/navigation';

const pageStyle = {
	minHeight: '100vh',
	background: UI_COLORS.surface75,
	fontFamily: APP_FONT_FAMILY,
	display: 'flex',
	justifyContent: 'center',
	padding: 'clamp(1.25rem, 4vw, 2rem) 1rem',
} as const;

const contentStyle = { width: '100%', maxWidth: '28rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' } as const;
const headlineWrapStyle = { marginTop: 'clamp(2.5rem, 10vw, 4.6rem)', animation: 'success-fade-up 0.45s ease-out 0.18s both' } as const;
const actionGroupStyle = {
	marginTop: 'clamp(2.25rem, 9vw, 4rem)',
	width: '100%',
	display: 'flex',
	flexDirection: 'column',
	gap: '1rem',
	animation: 'success-fade-up 0.45s ease-out 0.28s both',
} as const;
const actionButtonBaseStyle = {
	width: '100%',
	minHeight: 'clamp(4rem, 12vw, 5rem)',
	borderRadius: '0.9rem',
	fontSize: 'clamp(1rem, 3.5vw, 1.25rem)',
	fontWeight: 900,
	display: 'inline-flex',
	alignItems: 'center',
	justifyContent: 'center',
	gap: '0.75rem',
	cursor: 'pointer',
} as const;

export default function SuccessScreen() {
	// Navigation and route context for post-submit actions
	const navigate = useNavigate();
	const location = useLocation();
	// Safely resolve optional route state
	const state = (location.state as SuccessRouteState | null) ?? null;

	const projectNumber = state?.projectNumber ?? '';
	const projectName = state?.projectName ?? '';
	const formTitle = state?.formTitle ?? 'Skjema';

	// Full-screen success confirmation with clear next actions
	return (
		<div className="app-font" style={pageStyle}>
			{/* Inline keyframes avoid global stylesheet coupling for this one-off animation */}
			<style>
				{`\
				@keyframes success-fade-up {
					0% { opacity: 0; transform: translateY(16px); }
					100% { opacity: 1; transform: translateY(0); }
				}
				@keyframes success-pop {
					0% { transform: scale(0.72); opacity: 0; }
					70% { transform: scale(1.05); opacity: 1; }
					100% { transform: scale(1); opacity: 1; }
				}
				@keyframes success-pulse {
					0% { transform: scale(1); opacity: 0.5; }
					100% { transform: scale(1.25); opacity: 0; }
				}
				@keyframes success-float {
					0%, 100% { transform: translateY(0); }
					50% { transform: translateY(-5px); }
				}
				`}
			</style>

			{/* Centered content keeps focus on successful submission state */}
			<div style={contentStyle}>
				{/* Animated badge gives immediate visual confirmation */}
				<div
					style={{
						position: 'relative',
						width: 'clamp(6rem, 22vw, 8rem)',
						height: 'clamp(6rem, 22vw, 8rem)',
						animation: 'success-pop 0.55s ease-out both, success-float 3s ease-in-out 0.8s infinite',
					}}
				>
					{/* Soft pulse behind badge adds depth and motion cue */}
					<div
						style={{
							position: 'absolute',
							inset: 0,
							borderRadius: '999px',
							background: UI_COLORS.successGreen,
							filter: 'blur(24px)',
							opacity: 0.28,
							animation: 'success-pulse 1.8s ease-out infinite',
						}}
					/>
					{/* Main success circle anchors the checkmark icon */}
					<div
						style={{
							position: 'absolute',
							inset: 0,
							borderRadius: '999px',
							background: UI_COLORS.successGreenDark,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							boxShadow: '0 25px 50px rgba(0,0,0,0.22)',
						}}
					>
						{/* Inner ring improves contrast and draws focus to completion icon */}
						<div
							style={{
								width: 'clamp(4rem, 15vw, 5.2rem)',
								height: 'clamp(4rem, 15vw, 5.2rem)',
								borderRadius: '999px',
								border: `clamp(7px, 1.8vw, 10px) solid ${UI_COLORS.surface0}`,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<Check width={36} height={36} strokeWidth={3.8} color="#ffffff" />
						</div>
					</div>
				</div>

					{/* Confirmation copy reiterates what was submitted and where */}
				<div style={headlineWrapStyle}>
					<h1 style={{ margin: 0, fontSize: 'clamp(1.75rem, 6vw, 2.15rem)', lineHeight: 1.1, fontWeight: 900, color: UI_COLORS.ink900 }}>Sendt inn!</h1>
					<p style={{ margin: '0.75rem 0 0', fontSize: 'clamp(1.15rem, 4.5vw, 1.55rem)', fontWeight: 600, color: UI_COLORS.ink500 }}>Skjemaet er lagret</p>
					<p style={{ margin: '0.8rem 0 0', fontSize: 'clamp(0.95rem, 3vw, 1rem)', fontWeight: 700, color: UI_COLORS.accentBlue }}>
						{projectNumber} - {projectName}
					</p>
					<p style={{ margin: '0.4rem 0 0', fontSize: 'clamp(0.82rem, 2.6vw, 0.9rem)', fontWeight: 700, color: UI_COLORS.ink500 }}>{formTitle}</p>
				</div>

				{/* Primary and secondary actions guide the next user step */}
				<div style={actionGroupStyle}>
					{/* Return users directly to document selection in current project flow */}
					<button
						type="button"
						onClick={() => navigate('/new-document')}
						style={{
							...actionButtonBaseStyle,
							border: 'none',
							background: UI_COLORS.ink900,
							color: UI_COLORS.surface0,
							boxShadow: '0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.1)',
						}}
					>
						<FileText width={22} height={22} strokeWidth={2.5} />
						Tilbake til prosjektet
					</button>

					{/* Alternate action routes back to full projects overview */}
					<button
						type="button"
						onClick={() => navigate('/projects')}
						style={{
							...actionButtonBaseStyle,
							border: `2px solid ${UI_COLORS.ink900}`,
							background: UI_COLORS.surface0,
							color: UI_COLORS.ink900,
						}}
					>
						<Home width={22} height={22} strokeWidth={2.5} />
						Til prosjektoversikt
					</button>
				</div>

				{/* Footer reassurance confirms where submitted data can be found */}
				<p style={{ marginTop: 'clamp(2rem, 7vw, 3rem)', fontSize: 'clamp(0.82rem, 2.5vw, 0.92rem)', color: UI_COLORS.ink400, animation: 'success-fade-up 0.45s ease-out 0.36s both' }}>
					Skjemaet er tilgjengelig i prosjektmappen
				</p>
			</div>
		</div>
	);
}
