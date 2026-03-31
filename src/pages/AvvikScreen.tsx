import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import {
	FormActionButton,
	FormField,
	FormInput,
	FormPage,
	FormSection,
	FormTextArea,
} from '../components/forms/FormLayout';
// Image utilities
import { createImageContextKey, getImageDraftCount } from '../utils/imageDrafts';
import type { ProjectRouteState } from '../types/navigation';
import { UI_COLORS } from '../styles/uiTokens';

import { createImageCaptureState, createSuccessState, getProjectContextFromState } from '../utils/navigation';
// Area options
const AREA_OPTIONS = ['Verksted', 'Kontor', 'Montasje'];

// Deviation report form
export default function AvvikScreen() {
	// Get navigation state
	const navigate = useNavigate();
	const location = useLocation();
	const state = (location.state as ProjectRouteState | null) ?? null;
	const { manualProjectEntry, projectNumber, projectName } = getProjectContextFromState(state);
	const returnTo = state?.returnTo;
	const returnState = state?.returnState;
	const returnNavigation = { returnTo: location.pathname, returnState: location.state };
	// Form states
	const [projectInput, setProjectInput] = useState(manualProjectEntry ? '' : [projectNumber, projectName].filter(Boolean).join(' / '));
	const [areas, setAreas] = useState<string[]>([]);
	const [typeAvvik, setTypeAvvik] = useState('');
	const [immediateAction, setImmediateAction] = useState('');
	const [discoveredBy, setDiscoveredBy] = useState('');
	const [reportedTo, setReportedTo] = useState('');
	const [measureType, setMeasureType] = useState('');
	const [responsible, setResponsible] = useState('');
	const [monitoringResult, setMonitoringResult] = useState('');
	const [prevention, setPrevention] = useState('');
	const [date, setDate] = useState('');
	const [createdBy, setCreatedBy] = useState('');
	// Image drafts
	const imageContextKey = createImageContextKey('avvik', projectNumber);
	const imageCount = getImageDraftCount(imageContextKey);

	const subtitle = manualProjectEntry ? 'Registrer avvik på prosjekt' : 'Inkludert HMS avvik';

	// Toggle area
	const toggleArea = (option: string) => {
		setAreas((current) => (current.includes(option) ? current.filter((value) => value !== option) : [...current, option]));
	};

	const handleBack = () => (returnTo ? navigate(returnTo, { state: returnState }) : navigate(-1));

	return (
		<FormPage
			title="Avviksrapport"
			subtitle={subtitle}
			onBack={handleBack}
			projectNumber={manualProjectEntry ? undefined : projectNumber}
			projectName={manualProjectEntry ? undefined : projectName}
		>
			{manualProjectEntry && (
				<FormSection title="Prosjekt">
					<FormField label="Prosjektnavn / Prosjektnummer:" htmlFor="avvik-project-input">
					<FormInput
						id="avvik-project-input"
						type="text"
						value={projectInput}
						onChange={(e) => setProjectInput(e.target.value)}
						placeholder="Skriv inn prosjektnavn..."
						/>
					</FormField>
				</FormSection>
			)}

			<FormSection title="Område">
			{/* Area buttons */}
			<div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
				{AREA_OPTIONS.map((option) => {
					const checked = areas.includes(option);
						return (
							<button
								key={option}
								type="button"
								onClick={() => toggleArea(option)}
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: '0.7rem',
									width: '100%',
									padding: '1rem 1rem',
									borderRadius: '1rem',
								border: `2px solid ${UI_COLORS.line300}`,
								background: UI_COLORS.surface0,
									cursor: 'pointer',
									textAlign: 'left',
								}}
							>
								{/* Checkbox */}
								<span
									style={{
										width: '1.4rem',
										height: '1.4rem',
										borderRadius: '0.3rem',
									border: checked ? `2px solid ${UI_COLORS.accentBlue}` : `2px solid ${UI_COLORS.line300}`,
									background: checked ? UI_COLORS.accentBlue : UI_COLORS.surface0,
										display: 'inline-flex',
										alignItems: 'center',
										justifyContent: 'center',
										flexShrink: 0,
									}}
								>
								{/* Checkmark when selected */}
								{checked ? <Check width={13} height={13} color="#ffffff" strokeWidth={3} /> : null}
							</span>
							{/* Area label */}
							<span style={{ fontSize: '1.18rem', fontWeight: 800, color: UI_COLORS.ink900 }}>{option}</span>
							</button>
						);
					})}
				</div>
			</FormSection>

			{/* Description section */}
			<FormSection title="BESKRIVELSE OG EVALUERING AV AVVIK">
				<FormField label="Type avvik:" htmlFor="avvik-type">
					<FormTextArea id="avvik-type" value={typeAvvik} onChange={(e) => setTypeAvvik(e.target.value)} placeholder="Beskriv avviket..." />
				</FormField>
				<FormField label="Tiltak som settes i gang umiddelbart:" htmlFor="avvik-immediate-action">
					<FormTextArea
						id="avvik-immediate-action"
						value={immediateAction}
						onChange={(e) => setImmediateAction(e.target.value)}
						placeholder="Beskriv umiddelbare tiltak..."
					/>
				</FormField>
				<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(14rem, 1fr))', gap: '1rem' }}>
					<FormField label="Oppdaget av:" htmlFor="avvik-discovered-by">
						<FormInput id="avvik-discovered-by" type="text" value={discoveredBy} onChange={(e) => setDiscoveredBy(e.target.value)} placeholder="Navn" />
					</FormField>
					<FormField label="Rapportert til:" htmlFor="avvik-reported-to">
						<FormInput id="avvik-reported-to" type="text" value={reportedTo} onChange={(e) => setReportedTo(e.target.value)} placeholder="Navn" />
					</FormField>
				</div>
			</FormSection>

			{/* Measures section */}
			<FormSection title="TILTAK">
				<FormField label="Type tiltak:" htmlFor="avvik-measure-type">
					<FormTextArea id="avvik-measure-type" value={measureType} onChange={(e) => setMeasureType(e.target.value)} placeholder="Beskriv tiltak som skal iverksettes..." />
				</FormField>
				<FormField label="Ansvarlig:" htmlFor="avvik-responsible">
					<FormInput id="avvik-responsible" type="text" value={responsible} onChange={(e) => setResponsible(e.target.value)} placeholder="Ansvarlig person" />
				</FormField>
			</FormSection>

			{/* Monitoring section */}
			<FormSection title="OVERVÅKNING AV TILTAK">
				<FormField label="Resultat av overvåkning:">
					<FormTextArea value={monitoringResult} onChange={(e) => setMonitoringResult(e.target.value)} placeholder="Beskriv resultatet av overvåkning..." />
				</FormField>
				<FormField label="Det gjøres for å hindre gjentagelse:">
					<FormTextArea value={prevention} onChange={(e) => setPrevention(e.target.value)} placeholder="Beskriv forebyggende tiltak..." />
				</FormField>
				<FormField label="Dato:" htmlFor="avvik-date">
					<FormInput id="avvik-date" type="text" value={date} onChange={(e) => setDate(e.target.value)} placeholder="mm/dd/yyyy" />
				</FormField>
				<FormField label="Opprettet av:" htmlFor="avvik-created-by">
					<FormInput id="avvik-created-by" type="text" value={createdBy} onChange={(e) => setCreatedBy(e.target.value)} placeholder="TEP / Navn" />
				</FormField>
			</FormSection>

			{/* Add images button */}
			<FormActionButton
				onClick={() =>
					navigate('/image-capture', {
						state: createImageCaptureState({
							contextKey: imageContextKey,
							contextTitle: 'Avvik',
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
				onClick={() =>
					navigate('/success', {
						state: createSuccessState({
							formTitle: 'Avvik',
							projectContext: { manualProjectEntry, projectNumber, projectName },
							returnNavigation,
						}),
					})
				}
			>
				Send skjema
			</FormActionButton>
		</FormPage>
	);
}
