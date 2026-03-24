/* eslint-disable react-refresh/only-export-components */
import { ArrowLeft } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';

interface FormPageProps {
	title: string;
	subtitle?: string;
	onBack: () => void;
	projectNumber?: string;
	projectName?: string;
	projectLabel?: string;
	children: ReactNode;
}

interface FormSectionProps {
	title: string;
	children: ReactNode;
}

interface FormFieldProps {
	label: string;
	htmlFor?: string;
	children: ReactNode;
}

interface ActionButtonProps {
	children: ReactNode;
	onClick: () => void;
	variant?: 'primary' | 'dark';
	icon?: ReactNode;
}

// Shared page shell for the checklist-style form screens.
export const formPageStyle: CSSProperties = {
	minHeight: '100vh',
	background: '#f1f5f9',
	fontFamily: 'Arial, sans-serif',
};

const formHeaderShellStyle: CSSProperties = {
	background: '#ffffff',
	borderBottom: '1px solid #dbe4ee',
	boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)',
};

const formContainerStyle: CSSProperties = {
	maxWidth: '76rem',
	margin: '0 auto',
	padding: '0 1rem',
};

const formHeaderInnerStyle: CSSProperties = {
	padding: '1.25rem 0 1.3rem',
};

const formTitleRowStyle: CSSProperties = {
	display: 'flex',
	alignItems: 'center',
	gap: '0.95rem',
};

const backButtonStyle: CSSProperties = {
	width: '3.1rem',
	height: '3.1rem',
	borderRadius: '0.95rem',
	border: 'none',
	background: '#0f172a',
	display: 'inline-flex',
	alignItems: 'center',
	justifyContent: 'center',
	cursor: 'pointer',
	flexShrink: 0,
};

const projectCardStyle: CSSProperties = {
	marginTop: '1rem',
	borderRadius: '1rem',
	border: '2px solid #d8e1ec',
	background: '#e8eef7',
	padding: '1rem 1rem 1.05rem',
};

export const formContentStyle: CSSProperties = {
	maxWidth: '76rem',
	margin: '0 auto',
	padding: '1.4rem 1rem 2.25rem',
	display: 'flex',
	flexDirection: 'column',
	gap: '1rem',
};

export const formSectionStyle: CSSProperties = {
	border: '2px solid #1e293b',
	borderRadius: '1.1rem',
	background: '#ffffff',
	padding: '1.25rem 1rem 1.05rem',
};

export const formSectionTitleStyle: CSSProperties = {
	margin: '0 0 1rem',
	fontSize: 'clamp(1.1rem, 3vw, 1.35rem)',
	fontWeight: 900,
	color: '#0f172a',
};

export const formFieldLabelStyle: CSSProperties = {
	display: 'block',
	marginBottom: '0.65rem',
	fontSize: 'clamp(1rem, 2.8vw, 1.15rem)',
	fontWeight: 800,
	color: '#0f172a',
};

export const formFieldStyle: CSSProperties = {
	marginBottom: '1.15rem',
};

export const formInputStyle: CSSProperties = {
	width: '100%',
	minHeight: '3.35rem',
	borderRadius: '1rem',
	border: '2px solid #d8e1ec',
	padding: '0 1.1rem',
	fontSize: 'clamp(1rem, 2.5vw, 1.12rem)',
	fontWeight: 700,
	color: '#0f172a',
	background: '#ffffff',
	boxSizing: 'border-box',
	fontFamily: 'Arial, sans-serif',
};

export const formTextAreaStyle: CSSProperties = {
	...formInputStyle,
	minHeight: '7rem',
	padding: '1rem 1.1rem',
	resize: 'vertical',
};

// Keeps the main action buttons visually consistent across forms.
export function getActionButtonStyle(variant: 'primary' | 'dark' = 'primary'): CSSProperties {
	return {
		width: '100%',
		minHeight: '4rem',
		borderRadius: '1rem',
		border: 'none',
		background: variant === 'primary' ? '#1e3a8a' : '#111827',
		color: '#ffffff',
		fontSize: 'clamp(1.05rem, 3vw, 1.3rem)',
		fontWeight: 900,
		cursor: 'pointer',
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: '0.6rem',
	};
}

export function FormPage({ title, subtitle, onBack, projectNumber, projectName, projectLabel = 'Prosjekt', children }: FormPageProps) {
	return (
		<div style={formPageStyle}>
			<div style={formHeaderShellStyle}>
				<div style={formContainerStyle}>
					<div style={formHeaderInnerStyle}>
						<div style={formTitleRowStyle}>
							<button type="button" onClick={onBack} style={backButtonStyle}>
								<ArrowLeft width={24} height={24} color="#ffffff" strokeWidth={2.6} />
							</button>
							<div>
								<h1 style={{ margin: 0, fontSize: 'clamp(1.6rem, 4vw, 2rem)', fontWeight: 900, color: '#0f172a', lineHeight: 1.05 }}>
									{title}
								</h1>
								{subtitle ? (
									<p style={{ margin: '0.2rem 0 0', fontSize: 'clamp(0.95rem, 2.8vw, 1.05rem)', fontWeight: 700, color: '#64748b' }}>
										{subtitle}
									</p>
								) : null}
							</div>
						</div>

						{projectNumber || projectName ? (
							<div style={projectCardStyle}>
								<p style={{ margin: '0 0 0.25rem', fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>{projectLabel}</p>
								{projectNumber ? (
									<p style={{ margin: '0 0 0.45rem', fontSize: 'clamp(1.2rem, 3.5vw, 1.6rem)', fontWeight: 900, color: '#0f172a' }}>
										{projectNumber}
									</p>
								) : null}
								{projectName ? (
									<p style={{ margin: 0, fontSize: 'clamp(1.05rem, 3vw, 1.3rem)', fontWeight: 700, color: '#0f172a' }}>{projectName}</p>
								) : null}
							</div>
						) : null}
					</div>
				</div>
			</div>

			<div style={formContentStyle}>{children}</div>
		</div>
	);
}

export function FormSection({ title, children }: FormSectionProps) {
	return (
		<section style={formSectionStyle}>
			<h2 style={formSectionTitleStyle}>{title}</h2>
			{children}
		</section>
	);
}

// Wraps a label and its control so forms stay accessible and consistent.
export function FormField({ label, htmlFor, children }: FormFieldProps) {
	return (
		<div style={formFieldStyle}>
			<label htmlFor={htmlFor} style={formFieldLabelStyle}>
				{label}
			</label>
			{children}
		</div>
	);
}

export function FormActionButton({ children, onClick, variant = 'primary', icon }: ActionButtonProps) {
	return (
		<button type="button" onClick={onClick} style={getActionButtonStyle(variant)}>
			{icon}
			{children}
		</button>
	);
}
