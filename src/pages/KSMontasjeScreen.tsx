import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// Icons for visual feedback in UI elements
import { Check, Save, X } from 'lucide-react';
// Import reusable form components and styling for consistent layout
import {
	FormActionButton,
	FormField,
	FormInput,
	FormPage,
	FormSection,
	FormTextArea,
} from '../components/forms/FormLayout';import { UI_COLORS } from '../styles/uiTokens';import type { ProjectRouteState } from '../types/navigation';
// Utilities for managing image drafts associated with form submissions
import { createImageContextKey, getImageDraftCount } from '../utils/imageDrafts';
import { createImageCaptureState, createSuccessState, getProjectContextFromState } from '../utils/navigation';

// Type definition for inspection checkpoints
interface Kontrollpunkt {
	id: string;
	label: string;
}

// Assembly quality control checkpoints that require verification
const KONTROLLPUNKTER: Kontrollpunkt[] = [
	{ id: 'lakk-overflate', label: 'Lakk / overflate' },
	{ id: 'maal-utvendig', label: 'Mål kontroller (utvendig)' },
	{ id: 'gjeringer', label: 'Gjeringer' },
	{ id: 'sammenfoyninger', label: 'Sammenføyninger' },
	{ id: 'limt-pakking', label: 'Limt pakking' },
	{ id: 'drenert', label: 'Drenert' },
	{ id: 'glass-korrekt', label: 'Glass korrekt montert' },
	{ id: 'glass-overklosset', label: 'Glass litt overklosset' },
	{ id: 'laas-montert', label: 'Lås montert' },
	{ id: 'frest-laasebeslag', label: 'Frest korrekt for låsebeslag' },
	{ id: 'slageretning', label: 'Slageretning korrekt' },
	{ id: 'doer-testet', label: 'Dør testet / funksjon OK' },
	{ id: 'profiler-rengjort', label: 'Profiler/glass rengjort' },
	{ id: 'skummet', label: 'Skummet' },
	{ id: 'fuget', label: 'Fuget' },
	{ id: 'teipet', label: 'Teipet' },
];

// Track whether a checkpoint is approved, rejected, or not yet evaluated
type PunktState = 'ok' | 'not-ok' | null;

// Provide visual toggle buttons for OK/Not OK status selection
function RowToggle({
	selected,
	onSelect,
}: {
	selected: PunktState;
	onSelect: (value: PunktState) => void;
}) {
	// Generate button styles based on status (OK vs Not OK) and active state
	const boxStyle = (variant: 'ok' | 'not-ok', isActive: boolean): React.CSSProperties => ({
		width: '2.45rem',
		height: '2.45rem',
		borderRadius: '0.62rem',
		border: `2px solid ${isActive ? (variant === 'ok' ? UI_COLORS.ink900 : UI_COLORS.statusError) : UI_COLORS.line300}`,
		background: isActive ? (variant === 'ok' ? UI_COLORS.ink900 : UI_COLORS.statusError) : UI_COLORS.surface0,
		cursor: 'pointer',
		padding: 0,
		flexShrink: 0,
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center',
	});

	return (
		<div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
			{/* Toggle OK status with visual checkmark when selected */}
			<button type="button" onClick={() => onSelect(selected === 'ok' ? null : 'ok')} style={boxStyle('ok', selected === 'ok')} aria-label="OK">
				{selected === 'ok' ? <Check width={18} height={18} color="#ffffff" strokeWidth={3} /> : null}
			</button>
			{/* Toggle Not OK status with visual X mark when selected */}
			<button type="button" onClick={() => onSelect(selected === 'not-ok' ? null : 'not-ok')} style={boxStyle('not-ok', selected === 'not-ok')} aria-label="Ikke OK">
				{selected === 'not-ok' ? <X width={18} height={18} color="#ffffff" strokeWidth={3} /> : null}
			</button>
		</div>
	);
}

export default function KSMontasjeScreen() {
	// Access router navigation for redirecting to other screens
	const navigate = useNavigate();
	// Retrieve navigation state from previous screen
	const location = useLocation();
	// Extract navigation state with fallback to null
	const state = (location.state as (ProjectRouteState & { montasjeType?: string }) | null) ?? null;

	// Use passed project details or fallback to defaults
	const { manualProjectEntry, projectNumber, projectName } = getProjectContextFromState(state);
	const montasjeType = state?.montasjeType ?? 'Vindu montasje';
	const returnTo = state?.returnTo;
	const returnState = state?.returnState;
	const returnNavigation = { returnTo: location.pathname, returnState: location.state };
	// Generate unique key for image storage tied to this assembly type and project
	const imageContextKey = createImageContextKey(`ks-montasje:${montasjeType}`, projectNumber);
	// Count existing images to show in upload button
	const imageCount = getImageDraftCount(imageContextKey);

	// Track position number on assembly
	const [posisjonsnummer, setPosisjonsnummer] = useState('');
	// Record defects that were corrected during assembly
	const [feilskaderUtbedret, setFeilskaderUtbedret] = useState('');
	// Capture any additional notes or observations
	const [andreMerknader, setAndreMerknader] = useState('');
	// Store inspector name for signature
	const [signaturNavn, setSignaturNavn] = useState('');
	// Record inspection completion date
	const [signaturDato, setSignaturDato] = useState('');
	// Map checkpoint IDs to approval status (ok, not-ok, or pending)
	const [punktVerdier, setPunktVerdier] = useState<Record<string, PunktState>>({});
	// Store notes for failed checkpoints
	const [punktMerknader, setPunktMerknader] = useState<Record<string, string>>({});

	const subtitle = `${montasjeType} kontroll`;

	// Update checkpoint status and clear notes when changing selection
	const setPunkt = (punktId: string, value: PunktState) => {
		setPunktVerdier((current) => ({ ...current, [punktId]: value }));
	};

	// Update notes for a specific checkpoint when reported as not-ok
	const setPunktMerknad = (punktId: string, value: string) => {
		setPunktMerknader((current) => ({ ...current, [punktId]: value }));
	};

	const handleBack = () => (returnTo ? navigate(returnTo, { state: returnState }) : navigate(-1));

	return (
		<FormPage
			title={`KS ${montasjeType}`}
			subtitle={subtitle}
			onBack={handleBack}
			projectNumber={projectNumber}
			projectName={projectName}
		>
			{/* Assembly position identifier */}
			<FormSection title="Posnr.">
				<FormField label="Posisjonsnummer" htmlFor="ksm-posisjonsnummer">
				<FormInput id="ksm-posisjonsnummer" type="text" value={posisjonsnummer} onChange={(event) => setPosisjonsnummer(event.target.value)} placeholder="Posisjonsnummer" />
				</FormField>
			</FormSection>

			{/* Quality control checkpoint verification section */}
			<FormSection title="KONTROLLPUNKTER">
				{/* Guide user through checkpoint evaluation process */}
				<p style={{ margin: '0 0 1rem', fontSize: '1.05rem', fontWeight: 700, color: UI_COLORS.ink500 }}>Kryss av OK / Ikke OK / og før evt. merknad</p>
				{/* Render all quality checkpoints as toggleable list items */}
				<div style={{ border: `2px solid ${UI_COLORS.ink800}`, borderRadius: '1rem', overflow: 'hidden', background: UI_COLORS.surface0 }}>
					{KONTROLLPUNKTER.map((punkt, index) => {
						// Retrieve saved status for this checkpoint
						const selected = punktVerdier[punkt.id] ?? null;
						// Show note input only when checkpoint is marked as not-ok
						const showMerknad = selected === 'not-ok';

						return (
							<div
								key={punkt.id}
								style={{
									padding: '0.95rem 0.9rem',
										borderBottom: index === KONTROLLPUNKTER.length - 1 ? 'none' : `1.5px solid ${UI_COLORS.line300}`,
								}}
							>
								<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
									<span style={{ fontSize: 'clamp(0.98rem, 2.7vw, 1.1rem)', fontWeight: 800, color: UI_COLORS.ink900 }}>{punkt.label}</span>
									<RowToggle selected={selected} onSelect={(value) => setPunkt(punkt.id, value)} />
								</div>

								{showMerknad ? (
									<div style={{ marginTop: '0.85rem' }}>
										<FormInput
											type="text"
											value={punktMerknader[punkt.id] ?? ''}
											onChange={(event) => setPunktMerknad(punkt.id, event.target.value)}
											placeholder="Merknad..."
											aria-label={`Merknad for ${punkt.label}`}
											style={{ minHeight: '3rem', fontSize: 'clamp(0.95rem, 2.4vw, 1.02rem)' }}
										/>
									</div>
								) : null}
							</div>
						);
					})}
				</div>
			</FormSection>

			{/* Document any defects that were corrected during assembly */}
			<FormSection title="Feilskader utbedret:">
				<FormField label="Feilskader utbedret" htmlFor="ksm-feilskader-utbedret">
				<FormTextArea id="ksm-feilskader-utbedret" value={feilskaderUtbedret} onChange={(event) => setFeilskaderUtbedret(event.target.value)} placeholder="Beskriv utbedrede feilskader..." />
				</FormField>
			</FormSection>

			{/* Capture additional observations and general feedback */}
			<FormSection title="Andre mangler / merknader:">
				<FormField label="Andre mangler / merknader" htmlFor="ksm-andre-merknader">
				<FormTextArea id="ksm-andre-merknader" value={andreMerknader} onChange={(event) => setAndreMerknader(event.target.value)} placeholder="Andre merknader..." />
				</FormField>
			</FormSection>

			{/* Collect inspector identification and completion timestamp */}
			<FormSection title="SIGNATUR">
				{/* Record technician responsible for assembly inspection */}
				<FormField label="Montør signatur:" htmlFor="ksm-signatur-navn">
				<FormInput id="ksm-signatur-navn" type="text" value={signaturNavn} onChange={(event) => setSignaturNavn(event.target.value)} placeholder="Navn" />
			</FormField>
			{/* Record when inspection was completed */}
			<FormField label="Dato:" htmlFor="ksm-signatur-dato">
					<FormInput id="ksm-signatur-dato" type="text" value={signaturDato} onChange={(event) => setSignaturDato(event.target.value)} placeholder="mm/dd/yyyy" />
				</FormField>
			</FormSection>

			{/* Navigate to image capture screen to document assembly work */}
			<FormActionButton
				onClick={() =>
					navigate('/image-capture', {
						state: createImageCaptureState({
							contextKey: imageContextKey,
							contextTitle: montasjeType,
							projectContext: { manualProjectEntry, projectNumber, projectName },
							returnNavigation,
						}),
					})
				}
			>
				{/* Display count to show user they have images attached */}
				{imageCount > 0 ? `+ Legg til bilde (${imageCount})` : '+ Legg til bilde'}
			</FormActionButton>

			{/* Submit form and navigate to success screen */}
			<FormActionButton
				variant="dark"
				onClick={() =>
					navigate('/success', {
						state: createSuccessState({
							formTitle: montasjeType,
							projectContext: { manualProjectEntry, projectNumber, projectName },
							returnNavigation,
						}),
					})
				}
				icon={<Save width={22} height={22} color="#ffffff" strokeWidth={2.5} />}
			>
				Send skjema
			</FormActionButton>
		</FormPage>
	);
}
