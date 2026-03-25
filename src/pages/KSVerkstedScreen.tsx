// Essential React hooks for state management and memoization
import { useMemo, useState } from 'react';
// Router hooks to access navigation state and navigate between screens
import { useLocation, useNavigate } from 'react-router-dom';
// Icons for visual feedback in UI elements
import { Check, Save } from 'lucide-react';
// Import reusable form components and styling for consistent layout
import {
	FormActionButton,
	FormField,
	FormPage,
	FormSection,
	formInputStyle,
	formTextAreaStyle,
} from '../components/forms/FormLayout';
import type { ProjectRouteState } from '../types/navigation';
// Utilities for managing image drafts associated with form submissions
import { createImageContextKey, getImageDraftCount } from '../utils/imageDrafts';
import { createImageCaptureState, createReturnNavigation, createSuccessState, getProjectContextFromState, getReturnNavigation } from '../utils/navigation';

// Workshop quality control checkpoints that require verification
const KONTROLLPUNKTER = [
	'Mål kontrollert i henhold til tegning',
	'Overflatebehandling OK',
	'Boring / fresing kontrollert',
	'Montering utført korrekt',
	'Emballasje tilfredsstillende',
	'Merking / etiketter på plass',
	'Samsvar med produksjonstegninger',
	'Skruer og beslag pakket',
];

export default function KSVerkstedScreen() {
	// Access router navigation for redirecting to other screens
	const navigate = useNavigate();
	// Retrieve navigation state from previous screen
	const location = useLocation();
	// Extract navigation state with fallback to null
	const state = (location.state as ProjectRouteState | null) ?? null;
	const { manualProjectEntry, projectNumber, projectName } = getProjectContextFromState(state);
	// Store navigation destination for returning to previous screen
	const { returnTo, returnState } = getReturnNavigation(state);
	const returnNavigation = createReturnNavigation(location.pathname, location.state);
	// Generate unique key for image storage tied to this workshop form and project
	const imageContextKey = createImageContextKey('ks-verksted', projectNumber);
	// Count existing images to show in upload button
	const imageCount = getImageDraftCount(imageContextKey);

	// Track order/project number (allow manual entry or use passed value)
	const [ordrenummer, setOrdrenummer] = useState(manualProjectEntry ? '' : projectNumber);
	// Track project name (allow manual entry or use passed value)
	const [prosjektnavn, setProsjektnavn] = useState(manualProjectEntry ? '' : projectName);
	// Record technician responsible for quality control
	const [kontrollertAv, setKontrollertAv] = useState('');
	// Record when inspection was completed
	const [dato, setDato] = useState('03/17/2026');
	// Track which checkpoints have been verified
	const [checked, setChecked] = useState<string[]>([]);
	// Capture any quality issues or deviations found
	const [avvikKommentarer, setAvvikKommentarer] = useState('');
	// Store additional observations and remarks
	const [generelleNotater, setGenerelleNotater] = useState('');

	// Generate dynamic page subtitle
	const subtitle = useMemo(() => 'Kvalitetsskjema for verkstedproduksjon', []);
	// Count how many checkpoints have been verified
	const fremdrift = checked.length;
	// Total number of checkpoints to complete
	const total = KONTROLLPUNKTER.length;
	// Calculate percentage progress for visual bar
	const progress = (fremdrift / total) * 100;

	// Toggle checkpoint verification state
	const toggleCheck = (item: string) => {
		setChecked((prev) => (prev.includes(item) ? prev.filter((value) => value !== item) : [...prev, item]));
	};

	return (
		<FormPage
			title="KS Verksted"
			subtitle={subtitle}
			onBack={() => {
				// Return to previous screen using stored navigation path
				if (returnTo) {
					navigate(returnTo, { state: returnState });
					return;
				}

				navigate(-1);
			}}
			projectNumber={projectNumber}
			projectName={projectName}
		>
			{/* Visual progress indicator for checkpoint completion */}
			<div>
				<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
				{/* Display checkpoint count and completion percentage */}
				<span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.07em', textTransform: 'uppercase' }}>FREMDRIFT</span>
				<span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#64748b' }}>{fremdrift} / {total}</span>
			</div>
			{/* Animated progress bar showing completion status */}
				<div style={{ height: '0.55rem', borderRadius: '99px', background: '#e2e8f0', overflow: 'hidden' }}>
					<div style={{ height: '100%', width: `${progress}%`, background: '#1e3a8a', borderRadius: '99px', transition: 'width 0.3s ease' }} />
				</div>
			</div>

			{/* Project identification details */}
			<FormSection title="Prosjektinformasjon">
				{/* Order/project identifier for traceability */}
				<FormField label="ORDRENUMMER *" htmlFor="ksv-ordrenummer">
					<input id="ksv-ordrenummer" type="text" value={ordrenummer} onChange={(e) => setOrdrenummer(e.target.value)} placeholder="F.eks. AF-2024-001" style={formInputStyle} />
			</FormField>
			{/* Project name for context and communication */}
			<FormField label="PROSJEKTNAVN *" htmlFor="ksv-prosjektnavn">
					<input id="ksv-prosjektnavn" type="text" value={prosjektnavn} onChange={(e) => setProsjektnavn(e.target.value)} placeholder="Prosjektnavn" style={formInputStyle} />
				</FormField>
			{/* Technician info and inspection date side-by-side */}
			<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(14rem, 1fr))', gap: '1rem' }}>
				{/* Record who performed the quality inspection */}
			<FormField label="KONTROLLERT AV *" htmlFor="ksv-kontrollert-av">
				<input id="ksv-kontrollert-av" type="text" value={kontrollertAv} onChange={(e) => setKontrollertAv(e.target.value)} placeholder="Navn" style={formInputStyle} />
			</FormField>
			{/* Record when inspection was performed */}
			<FormField label="DATO" htmlFor="ksv-dato">
				<input id="ksv-dato" type="text" value={dato} onChange={(e) => setDato(e.target.value)} placeholder="mm/dd/yyyy" style={formInputStyle} />
					</FormField>
				</div>
			</FormSection>

			{/* Quality checkpoint verification section */}
			<FormSection title="Kontrollpunkter *">
				{/* Render all quality checkpoints as toggleable list items */}
				<div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
					{KONTROLLPUNKTER.map((item) => {
						// Track whether this checkpoint has been verified
						const isChecked = checked.includes(item);
						return (
							<button
								key={item}
								type="button"
								onClick={() => toggleCheck(item)}
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: '0.8rem',
									width: '100%',
									padding: '1rem 1rem',
									borderRadius: '1rem',
									border: `2px solid ${isChecked ? '#1e3a8a' : '#d8e1ec'}`,
									background: isChecked ? '#eff4ff' : '#ffffff',
									cursor: 'pointer',
									textAlign: 'left',
									transition: 'all 0.15s ease',
								}}
							>
								{/* Visual indicator circle showing checkpoint status */}
								<span
									style={{
										width: '1.5rem',
										height: '1.5rem',
										borderRadius: '50%',
										border: isChecked ? '2px solid #1e3a8a' : '2px solid #cbd5e1',
										background: isChecked ? '#1e3a8a' : '#ffffff',
										display: 'inline-flex',
									alignItems: 'center',
									justifyContent: 'center',
									flexShrink: 0,
								}}
								>
									{/* Show checkmark when verified */}
									{isChecked ? <Check width={12} height={12} color="#ffffff" strokeWidth={3.5} /> : null}
								</span>							{/* Checkpoint description text */}								<span style={{ fontSize: 'clamp(1rem, 2.6vw, 1.12rem)', fontWeight: 700, color: isChecked ? '#1e3a8a' : '#0f172a' }}>{item}</span>
							</button>
						);
					})}
				</div>
			</FormSection>

			{/* Document quality issues and general observations */}
			<FormSection title="Merknader">
				{/* Record any deviations found during quality inspection */}
				<FormField label="AVVIK / KOMMENTARER" htmlFor="ksv-avvik-kommentarer">
					<textarea id="ksv-avvik-kommentarer" value={avvikKommentarer} onChange={(e) => setAvvikKommentarer(e.target.value)} placeholder="Beskriv eventuelle avvik..." style={formTextAreaStyle} />
			</FormField>
			{/* Capture additional remarks and supplementary information */}
			<FormField label="GENERELLE NOTATER" htmlFor="ksv-generelle-notater">
					<textarea id="ksv-generelle-notater" value={generelleNotater} onChange={(e) => setGenerelleNotater(e.target.value)} placeholder="Andre merknader eller tilleggsinformasjon..." style={formTextAreaStyle} />
				</FormField>
			</FormSection>

			{/* Navigate to image capture screen to document workshop work */}
			<FormActionButton
				onClick={() =>
					navigate('/image-capture', {
						state: createImageCaptureState({
							contextKey: imageContextKey,
							contextTitle: 'KS Verksted',
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
							formTitle: 'KS Verksted',
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
