// Imports
import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Save } from 'lucide-react';
import {
	FormActionButton,
	FormField,
	FormPage,
	FormSection,
	formInputStyle,
	formTextAreaStyle,
} from '../components/forms/FormLayout';
import type { ProjectRouteState } from '../types/navigation';
// Image utilities
import { createImageContextKey, getImageDraftCount } from '../utils/imageDrafts';
import { createImageCaptureState, createReturnNavigation, createSuccessState, getProjectContextFromState, getReturnNavigation } from '../utils/navigation';
import { UI_COLORS } from '../styles/uiTokens';

// Props for reusable checkbox section
interface CheckBlockProps {
	title: string;
	options: string[];
	selectedValue: string;
	onSelect: (value: string) => void;
	comment: string;
	onCommentChange: (value: string) => void;
}

// Reusable component for checklist sections
function CheckBlock({ title, options, selectedValue, onSelect, comment, onCommentChange }: CheckBlockProps) {
	const commentId = `glass-comment-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

	return (
		<FormSection title={title}>
			{/* Radio button options */}
			<div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
				{options.map((option) => {
					const checked = selectedValue === option;
					const isNegativeChoice = option.toLowerCase().includes('avvik') || option.toLowerCase().includes('annet');
					const activeBackground = isNegativeChoice ? UI_COLORS.statusError : UI_COLORS.ink900;

					return (
						<button
							key={option}
							type="button"
							onClick={() => onSelect(option)}
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: '0.8rem',
								width: '100%',
								borderRadius: '0.95rem',
						border: checked ? `2px solid ${UI_COLORS.surface0}` : `2px solid ${UI_COLORS.line250}`,
						background: checked ? activeBackground : UI_COLORS.surface0,
								padding: '0.85rem 0.9rem',
								cursor: 'pointer',
								textAlign: 'left',
							}}
						>
							{/* Radio circle */}
							<span
								style={{
									width: '1.45rem',
									height: '1.45rem',
									borderRadius: '50%',
							border: checked ? `3px solid ${UI_COLORS.surface0}` : `2px solid ${UI_COLORS.line300}`,
							background: checked ? activeBackground : UI_COLORS.surface0,
									display: 'inline-flex',
									alignItems: 'center',
									justifyContent: 'center',
									flexShrink: 0,
								}}
							>
								{checked ? <span style={{ width: '0.45rem', height: '0.45rem', borderRadius: '50%', background: UI_COLORS.surface0 }} /> : null}
							</span>
							{/* Option text */}
							<span style={{ fontSize: 'clamp(0.95rem, 2.8vw, 1.05rem)', fontWeight: 800, color: checked ? UI_COLORS.surface0 : UI_COLORS.ink900 }}>{option}</span>
						</button>
					);
				})}
			</div>

			{/* Comment field */}
			<FormField label="Kommentar" htmlFor={commentId}>
				<textarea id={commentId} value={comment} onChange={(event) => onCommentChange(event.target.value)} placeholder="Legg til kommentar..." style={{ ...formTextAreaStyle, minHeight: '4.8rem' }} />
			</FormField>
		</FormSection>
	);
}

// Glass receiving inspection form
export default function GlassMottakScreen() {
	// Get navigation state
	const navigate = useNavigate();
	const location = useLocation();
	const state = (location.state as ProjectRouteState | null) ?? null;

	// Extract project info
	const { manualProjectEntry, projectNumber, projectName } = getProjectContextFromState(state);
	const { returnTo, returnState } = getReturnNavigation(state);
	const returnNavigation = createReturnNavigation(location.pathname, location.state);
	// Image drafts
	const imageContextKey = createImageContextKey('glass-mottak', projectNumber);
	const imageCount = getImageDraftCount(imageContextKey);

	// Form states
	const [underprosjekt, setUnderprosjekt] = useState('');
	const [emne, setEmne] = useState('');
	const [sprekkerResultat, setSprekkerResultat] = useState('');
	const [sprekkerKommentar, setSprekkerKommentar] = useState('');
	const [hjornerResultat, setHjornerResultat] = useState('');
	const [hjornerKommentar, setHjornerKommentar] = useState('');
	const [stativBildeResultat, setStativBildeResultat] = useState('');
	const [stativBildeKommentar, setStativBildeKommentar] = useState('');

	// Fixed subtitle
	const subtitle = useMemo(() => 'Visuell sjekk av glass', []);

	return (
		<FormPage
			title="Glass mottak"
			subtitle={subtitle}
			onBack={() => {
				if (returnTo) {
					navigate(returnTo, { state: returnState });
					return;
				}

				navigate(-1);
			}}
			projectNumber={projectNumber}
			projectName={projectName}
		>
			<FormField label="Underprosjekt" htmlFor="glass-underprosjekt">
				<input id="glass-underprosjekt" type="text" value={underprosjekt} onChange={(event) => setUnderprosjekt(event.target.value)} placeholder="Skriv inn underprosjekt" style={formInputStyle} />
			</FormField>

			<FormField label="Emne" htmlFor="glass-emne">
				<input id="glass-emne" type="text" value={emne} onChange={(event) => setEmne(event.target.value)} placeholder="Legg inn emnetekst" style={formInputStyle} />
			</FormField>

			{/* Crack inspection */}
			<CheckBlock
				title="Glass er visuelt sjekket for sprekker"
				options={['Ja', 'Avvik, send eget avvik og informer prosjektleder']}
				selectedValue={sprekkerResultat}
				onSelect={setSprekkerResultat}
				comment={sprekkerKommentar}
				onCommentChange={setSprekkerKommentar}
			/>

			{/* Corner inspection */}
			<CheckBlock
				title="Hjørner på glass er sjekket"
				options={['Ja', 'Avvik, send eget avvik og informer prosjektleder']}
				selectedValue={hjornerResultat}
				onSelect={setHjornerResultat}
				comment={hjornerKommentar}
				onCommentChange={setHjornerKommentar}
			/>

			{/* Racks photo inspection */}
			<CheckBlock
				title="Bilde av glassstativ er tatt med ordre synlig"
				options={['Ja', 'Annet']}
				selectedValue={stativBildeResultat}
				onSelect={setStativBildeResultat}
				comment={stativBildeKommentar}
				onCommentChange={setStativBildeKommentar}
			/>

			{/* Add images button */}
			<FormActionButton
				onClick={() =>
					navigate('/image-capture', {
						state: createImageCaptureState({
							contextKey: imageContextKey,
							contextTitle: 'Glass mottak',
							projectContext: { manualProjectEntry, projectNumber, projectName },
							returnNavigation,
						}),
					})
				}
			>
				{imageCount > 0 ? `+ Legg til bilde (${imageCount})` : '+ Legg til bilde'}
			</FormActionButton>

			{/* Submit button */}
			<FormActionButton
				variant="dark"
				icon={<Save width={22} height={22} color="#ffffff" strokeWidth={2.5} />}
				onClick={() =>
					navigate('/success', {
						state: createSuccessState({
							formTitle: 'Glass mottak',
							projectContext: { manualProjectEntry, projectNumber, projectName },
							returnNavigation,
						}),
					})
				}
			>
				Send skjema
			</FormActionButton>

			{/* BACKEND: Replace navigation with a real submit call when the API is ready. */}
		</FormPage>
	);
}
