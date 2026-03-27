// Imports
import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import {
	FormActionButton,
	FormField,
	FormPage,
	FormSection,
	formInputStyle,
	formTextAreaStyle,
} from '../components/forms/FormLayout';
// Image utilities
import { createImageContextKey, getImageDraftCount } from '../utils/imageDrafts';
import type { ProjectRouteState } from '../types/navigation';
import { UI_COLORS } from '../styles/uiTokens';

import { createImageCaptureState, createReturnNavigation, createSuccessState, getProjectContextFromState, getReturnNavigation } from '../utils/navigation';
// Area options
const AREA_OPTIONS = ['Verksted', 'Kontor', 'Montasje'];

// Deviation report form
export default function AvvikScreen() {
	// Get navigation state
	const navigate = useNavigate();
	const location = useLocation();
	const state = (location.state as ProjectRouteState | null) ?? null;
	const { manualProjectEntry, projectNumber, projectName } = getProjectContextFromState(state);
	const { returnTo, returnState } = getReturnNavigation(state);
	const returnNavigation = createReturnNavigation(location.pathname, location.state);
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

	// Dynamic subtitle
	const subtitle = useMemo(
		() => (manualProjectEntry ? 'Registrer avvik på prosjekt' : 'Inkludert HMS avvik'),
		[manualProjectEntry],
	);

	// Toggle area
	const toggleArea = (option: string) => {
		setAreas((current) => (current.includes(option) ? current.filter((value) => value !== option) : [...current, option]));
	};

	return (
		<FormPage
			title="Avviksrapport"
			subtitle={subtitle}
			onBack={() => {
				if (returnTo) {
					navigate(returnTo, { state: returnState });
					return;
				}

				navigate(-1);
			}}
			projectNumber={manualProjectEntry ? undefined : projectNumber}
			projectName={manualProjectEntry ? undefined : projectName}
		>
			{manualProjectEntry && (
				<FormSection title="Prosjekt">
					<FormField label="Prosjektnavn / Prosjektnummer:" htmlFor="avvik-project-input">
						<input
							id="avvik-project-input"
							type="text"
							value={projectInput}
							onChange={(e) => setProjectInput(e.target.value)}
							placeholder="Skriv inn prosjektnavn..."
							style={formInputStyle}
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
								border: `2px solid ${UI_COLORS.line250}`,
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
									border: checked ? `2px solid ${UI_COLORS.statusChecked}` : `2px solid ${UI_COLORS.line300}`,
									background: checked ? UI_COLORS.statusChecked : UI_COLORS.surface0,
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
					<textarea id="avvik-type" value={typeAvvik} onChange={(e) => setTypeAvvik(e.target.value)} placeholder="Beskriv avviket..." style={formTextAreaStyle} />
				</FormField>
				<FormField label="Tiltak som settes i gang umiddelbart:" htmlFor="avvik-immediate-action">
					<textarea
						id="avvik-immediate-action"
						value={immediateAction}
						onChange={(e) => setImmediateAction(e.target.value)}
						placeholder="Beskriv umiddelbare tiltak..."
						style={formTextAreaStyle}
					/>
				</FormField>
				<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(14rem, 1fr))', gap: '1rem' }}>
					<FormField label="Oppdaget av:" htmlFor="avvik-discovered-by">
						<input id="avvik-discovered-by" type="text" value={discoveredBy} onChange={(e) => setDiscoveredBy(e.target.value)} placeholder="Navn" style={formInputStyle} />
					</FormField>
					<FormField label="Rapportert til:" htmlFor="avvik-reported-to">
						<input id="avvik-reported-to" type="text" value={reportedTo} onChange={(e) => setReportedTo(e.target.value)} placeholder="Navn" style={formInputStyle} />
					</FormField>
				</div>
			</FormSection>

			{/* Measures section */}
			<FormSection title="TILTAK">
				<FormField label="Type tiltak:" htmlFor="avvik-measure-type">
					<textarea id="avvik-measure-type" value={measureType} onChange={(e) => setMeasureType(e.target.value)} placeholder="Beskriv tiltak som skal iverksettes..." style={formTextAreaStyle} />
				</FormField>
				<FormField label="Ansvarlig:" htmlFor="avvik-responsible">
					<input id="avvik-responsible" type="text" value={responsible} onChange={(e) => setResponsible(e.target.value)} placeholder="Ansvarlig person" style={formInputStyle} />
				</FormField>
			</FormSection>

			{/* Monitoring section */}
			<FormSection title="OVERVÅKNING AV TILTAK">
				<FormField label="Resultat av overvåkning:">
					<textarea value={monitoringResult} onChange={(e) => setMonitoringResult(e.target.value)} placeholder="Beskriv resultatet av overvåkning..." style={formTextAreaStyle} />
				</FormField>
				<FormField label="Det gjøres for å hindre gjentagelse:">
					<textarea value={prevention} onChange={(e) => setPrevention(e.target.value)} placeholder="Beskriv forebyggende tiltak..." style={formTextAreaStyle} />
				</FormField>
				<FormField label="Dato:" htmlFor="avvik-date">
					<input id="avvik-date" type="text" value={date} onChange={(e) => setDate(e.target.value)} placeholder="mm/dd/yyyy" style={formInputStyle} />
				</FormField>
				<FormField label="Opprettet av:" htmlFor="avvik-created-by">
					<input id="avvik-created-by" type="text" value={createdBy} onChange={(e) => setCreatedBy(e.target.value)} placeholder="TEP / Navn" style={formInputStyle} />
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
