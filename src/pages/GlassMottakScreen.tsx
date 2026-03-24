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
import { createImageContextKey, getImageDraftCount } from '../utils/imageDrafts';

interface GlassMottakLocationState {
	projectNumber?: string;
	projectName?: string;
}

interface CheckBlockProps {
	title: string;
	options: string[];
	selectedValue: string;
	onSelect: (value: string) => void;
	comment: string;
	onCommentChange: (value: string) => void;
}

function CheckBlock({ title, options, selectedValue, onSelect, comment, onCommentChange }: CheckBlockProps) {
	const commentId = `glass-comment-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

	return (
		<FormSection title={title}>
			<div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
				{options.map((option) => {
					const checked = selectedValue === option;
					const isNegativeChoice = option.toLowerCase().includes('avvik') || option.toLowerCase().includes('annet');
					const activeBackground = isNegativeChoice ? '#ef4444' : '#0b1737';

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
								border: checked ? '2px solid #ffffff' : '2px solid #d8e1ec',
								background: checked ? activeBackground : '#ffffff',
								padding: '0.85rem 0.9rem',
								cursor: 'pointer',
								textAlign: 'left',
							}}
						>
							<span
								style={{
									width: '1.45rem',
									height: '1.45rem',
									borderRadius: '50%',
									border: checked ? '3px solid #ffffff' : '2px solid #b7c4d6',
									background: checked ? activeBackground : '#ffffff',
									display: 'inline-flex',
									alignItems: 'center',
									justifyContent: 'center',
									flexShrink: 0,
								}}
							>
								{checked ? <span style={{ width: '0.45rem', height: '0.45rem', borderRadius: '50%', background: '#ffffff' }} /> : null}
							</span>
							<span style={{ fontSize: 'clamp(0.95rem, 2.8vw, 1.05rem)', fontWeight: 800, color: checked ? '#ffffff' : '#0f172a' }}>{option}</span>
						</button>
					);
				})}
			</div>

			<FormField label="Kommentar" htmlFor={commentId}>
				<textarea id={commentId} value={comment} onChange={(event) => onCommentChange(event.target.value)} placeholder="Legg til kommentar..." style={{ ...formTextAreaStyle, minHeight: '4.8rem' }} />
			</FormField>
		</FormSection>
	);
}

export default function GlassMottakScreen() {
	const navigate = useNavigate();
	const location = useLocation();
	const state = (location.state as GlassMottakLocationState | null) ?? null;

	const projectNumber = state?.projectNumber ?? 'AF-2024-001';
	const projectName = state?.projectName ?? 'Elkjøp Hercules';
	const imageContextKey = createImageContextKey('glass-mottak', projectNumber);
	const imageCount = getImageDraftCount(imageContextKey);

	const [underprosjekt, setUnderprosjekt] = useState('');
	const [emne, setEmne] = useState('');
	const [sprekkerResultat, setSprekkerResultat] = useState('');
	const [sprekkerKommentar, setSprekkerKommentar] = useState('');
	const [hjornerResultat, setHjornerResultat] = useState('');
	const [hjornerKommentar, setHjornerKommentar] = useState('');
	const [stativBildeResultat, setStativBildeResultat] = useState('');
	const [stativBildeKommentar, setStativBildeKommentar] = useState('');

	const subtitle = useMemo(() => 'Visuell sjekk av glass', []);

	return (
		<FormPage title="Glass mottak" subtitle={subtitle} onBack={() => navigate(-1)} projectNumber={projectNumber} projectName={projectName}>
			<FormField label="Underprosjekt" htmlFor="glass-underprosjekt">
				<input id="glass-underprosjekt" type="text" value={underprosjekt} onChange={(event) => setUnderprosjekt(event.target.value)} placeholder="Skriv inn underprosjekt" style={formInputStyle} />
			</FormField>

			<FormField label="Emne" htmlFor="glass-emne">
				<input id="glass-emne" type="text" value={emne} onChange={(event) => setEmne(event.target.value)} placeholder="Legg inn emnetekst" style={formInputStyle} />
			</FormField>

			<CheckBlock
				title="Glass er visuelt sjekket for sprekker"
				options={['Ja', 'Avvik, send eget avvik og informer prosjektleder']}
				selectedValue={sprekkerResultat}
				onSelect={setSprekkerResultat}
				comment={sprekkerKommentar}
				onCommentChange={setSprekkerKommentar}
			/>

			<CheckBlock
				title="Hjørner på glass er sjekket"
				options={['Ja', 'Avvik, send eget avvik og informer prosjektleder']}
				selectedValue={hjornerResultat}
				onSelect={setHjornerResultat}
				comment={hjornerKommentar}
				onCommentChange={setHjornerKommentar}
			/>

			<CheckBlock
				title="Bilde av glassstativ er tatt med ordre synlig"
				options={['Ja', 'Annet']}
				selectedValue={stativBildeResultat}
				onSelect={setStativBildeResultat}
				comment={stativBildeKommentar}
				onCommentChange={setStativBildeKommentar}
			/>

			<FormActionButton
				onClick={() =>
					navigate('/image-capture', {
						state: {
							contextKey: imageContextKey,
							contextTitle: 'Glass mottak',
							returnTo: location.pathname,
							returnState: location.state,
							projectNumber,
							projectName,
						},
					})
				}
			>
				{imageCount > 0 ? `+ Legg til bilde (${imageCount})` : '+ Legg til bilde'}
			</FormActionButton>

			<FormActionButton
				variant="dark"
				icon={<Save width={22} height={22} color="#ffffff" strokeWidth={2.5} />}
				onClick={() =>
					navigate('/success', {
						state: {
							projectNumber,
							projectName,
							formTitle: 'Glass mottak',
							returnTo: location.pathname,
							returnState: location.state,
						},
					})
				}
			>
				Send skjema
			</FormActionButton>

			{/* BACKEND: Replace navigation with a real submit call when the API is ready. */}
		</FormPage>
	);
}
