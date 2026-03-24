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
import { createImageContextKey, getImageDraftCount } from '../utils/imageDrafts';

interface AvvikLocationState {
	manualProjectEntry?: boolean;
	projectNumber?: string;
	projectName?: string;
}

const AREA_OPTIONS = ['Verksted', 'Kontor', 'Montasje'];

export default function AvvikScreen() {
	const navigate = useNavigate();
	const location = useLocation();
	const state = (location.state as AvvikLocationState | null) ?? null;
	const manualProjectEntry = state?.manualProjectEntry ?? true;
	const projectNumber = state?.projectNumber ?? '';
	const projectName = state?.projectName ?? '';

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
	const imageContextKey = createImageContextKey('avvik', projectNumber);
	const imageCount = getImageDraftCount(imageContextKey);

	const subtitle = useMemo(
		() => (manualProjectEntry ? 'Registrer avvik på prosjekt' : 'Inkludert HMS avvik'),
		[manualProjectEntry],
	);

	const toggleArea = (option: string) => {
		setAreas((current) => (current.includes(option) ? current.filter((value) => value !== option) : [...current, option]));
	};

	return (
		<FormPage
			title="Avviksrapport"
			subtitle={subtitle}
			onBack={() => navigate(-1)}
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
									border: '2px solid #d8e1ec',
									background: '#ffffff',
									cursor: 'pointer',
									textAlign: 'left',
								}}
							>
								<span
									style={{
										width: '1.4rem',
										height: '1.4rem',
										borderRadius: '0.3rem',
										border: checked ? '2px solid #1e3a8a' : '2px solid #cbd5e1',
										background: checked ? '#1e3a8a' : '#ffffff',
										display: 'inline-flex',
										alignItems: 'center',
										justifyContent: 'center',
										flexShrink: 0,
									}}
								>
									{checked ? <Check width={13} height={13} color="#ffffff" strokeWidth={3} /> : null}
								</span>
								<span style={{ fontSize: '1.18rem', fontWeight: 800, color: '#0f172a' }}>{option}</span>
							</button>
						);
					})}
				</div>
			</FormSection>

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

			<FormSection title="TILTAK">
				<FormField label="Type tiltak:" htmlFor="avvik-measure-type">
					<textarea id="avvik-measure-type" value={measureType} onChange={(e) => setMeasureType(e.target.value)} placeholder="Beskriv tiltak som skal iverksettes..." style={formTextAreaStyle} />
				</FormField>
				<FormField label="Ansvarlig:" htmlFor="avvik-responsible">
					<input id="avvik-responsible" type="text" value={responsible} onChange={(e) => setResponsible(e.target.value)} placeholder="Ansvarlig person" style={formInputStyle} />
				</FormField>
			</FormSection>

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

			<FormActionButton
				onClick={() =>
					navigate('/image-capture', {
						state: {
							contextKey: imageContextKey,
							contextTitle: 'Avvik',
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
				onClick={() =>
					navigate('/success', {
						state: {
							projectNumber,
							projectName,
							formTitle: 'Avvik',
							returnTo: location.pathname,
							returnState: location.state,
						},
					})
				}
			>
				Send skjema
			</FormActionButton>
		</FormPage>
	);
}
