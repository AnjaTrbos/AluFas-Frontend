import { useState } from 'react';
import { Check, Save } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
	FormActionButton,
	FormField,
	FormInput,
	FormPage,
	FormSection,
	FormTextArea,
} from '../components/forms/FormLayout';
import { BODY_FONT_FAMILY, UI_COLORS } from '../styles/uiTokens';
import type { ProjectRouteState } from '../types/navigation';
import { createImageContextKey, getImageDraftCount } from '../utils/imageDrafts';
import { createImageCaptureState, createSuccessState, getProjectContextFromState } from '../utils/navigation';

interface ChecklistItem {
	id: string;
	label: string;
	options: string[];
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
	{ id: '1', label: 'Mottatt avvik på foregående arbeider eller tilstående konstruksjon', options: ['Ja', 'Nei', 'Avvik varslet', 'Annet'] },
	{ id: '2', label: 'Mottatt beordring om montasje av egne elementer tross avvik', options: ['Ja', 'Nei', 'Ikke relevant'] },
	{ id: '3', label: 'Riktig element på riktig sted', options: ['Ja', 'Annet'] },
	{ id: '4', label: 'Element i vater og lodd. Må være sjekket', options: ['Ja', 'Annet'] },
	{ id: '5', label: 'Åpningsvindo plassert riktig', options: ['Ja', 'Annet'] },
	{ id: '6', label: 'Kabal for magnetkontakt/ sluttlykker før inn i bygget', options: ['Ja', 'Annet'] },
	{ id: '7', label: 'Dytt og utvendig fuge utført slik at det er 100% tett', options: ['Ja', 'Annet'] },
	{ id: '8', label: 'Produktet er levert uten feil og skader', options: ['Ja', 'Annet'] },
	{ id: '9', label: 'Glass er helt og uten skader', options: ['Ja', 'Avvik er sendt', 'Annet'] },
	{ id: '10', label: 'Propper i montasje hull', options: ['Ja', 'Annet'] },
	{ id: '11', label: 'Paknings innrulling utført', options: ['Ja', 'Avvik er sendt', 'Annet'] },
	{ id: '12', label: 'Vindu-håndtak montert', options: ['Ja', 'Avvik er sendt', 'Annet'] },
	{ id: '13', label: 'Lås, pumpe, skilt og bøyle er montert', options: ['Ja', 'Låseenhed leverer dette', 'Annet'] },
	{ id: '14', label: 'Fjernet klistremerker på glass', options: ['Ja', 'Avvik er sendt', 'Annet'] },
	{ id: '15', label: 'Drenskopper er montert', options: ['Ja', 'Avvik er sendt', 'Annet'] },
	{ id: '16', label: 'Funksjons testet', options: ['Ja', 'Annet'] },
	{ id: '17', label: 'Gjenstående arbeider', options: ['Ja', 'Nei', 'Fuging/ leising', 'Beslag under dørr/ vindu gjenslå'] },
	{ id: '18', label: 'Dekklodd sikret for å ikke slikt ned', options: ['Ja, propper', 'Ja, skrudd', 'Nei'] },
	{ id: '19', label: 'Bilder er tatt av element før og etter montering, samt detail bilder av drenering', options: ['JA'] },
];

const progressHeaderStyle = { display: 'flex', justifyContent: 'space-between', marginBottom: '0.45rem' } as const;
const progressLabelStyle = { fontSize: '0.85rem', fontWeight: 800, color: UI_COLORS.ink500, letterSpacing: '0.07em', textTransform: 'uppercase', fontFamily: BODY_FONT_FAMILY } as const;
const progressValueStyle = { fontSize: '0.85rem', fontWeight: 800, color: UI_COLORS.ink500 } as const;
const progressTrackStyle = { height: '0.55rem', borderRadius: '99px', background: UI_COLORS.line300, overflow: 'hidden' } as const;
const sectionHeadingStyle = { margin: '0.45rem 0 0.1rem', fontSize: 'clamp(1.45rem, 3.8vw, 1.95rem)', fontWeight: 900, color: UI_COLORS.ink900 } as const;
const commentSpacerStyle = { marginTop: '0.75rem' } as const;

function CheckOption({ label, checked, onToggle }: { label: string; checked: boolean; onToggle: () => void }) {
	return (
		<button
			type="button"
			onClick={onToggle}
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: '0.7rem',
				width: '100%',
				padding: '1rem',
				borderRadius: '1rem',
				border: `2px solid ${UI_COLORS.line300}`,
				background: UI_COLORS.surface0,
				cursor: 'pointer',
				textAlign: 'left',
			}}
		>
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
				{checked ? <Check width={13} height={13} color="#ffffff" strokeWidth={3} /> : null}
			</span>
			<span style={{ fontSize: '1.05rem', fontWeight: 700, color: UI_COLORS.ink900 }}>{label}</span>
		</button>
	);
}

export default function KSMontasjeFoldeOgSkyvScreen() {
	const navigate = useNavigate();
	const location = useLocation();
	const state = (location.state as ProjectRouteState | null) ?? null;
	const { manualProjectEntry, projectNumber, projectName } = getProjectContextFromState(state);
	const returnTo = state?.returnTo;
	const returnState = state?.returnState;
	const returnNavigation = { returnTo: location.pathname, returnState: location.state };
	const imageContextKey = createImageContextKey('ks-montasje-folde-skyv', projectNumber);
	const imageCount = getImageDraftCount(imageContextKey);

	const [prosjekt, setProsjekt] = useState('');
	const [emne, setEmne] = useState('');
	const [posisjonsnummer, setPosisjonsnummer] = useState('');
	const [montasjeAvvikBeskrivelse, setMontasjeAvvikBeskrivelse] = useState('');

	const [values, setValues] = useState<Record<string, string[]>>(
		() => Object.fromEntries(CHECKLIST_ITEMS.map((item) => [item.id, []])),
	);
	const [comments, setComments] = useState<Record<string, string>>(
		() => Object.fromEntries(CHECKLIST_ITEMS.map((item) => [item.id, ''])),
	);

	const [opprettetAv, setOpprettetAv] = useState('');
	const [godkjentDato, setGodkjentDato] = useState('');
	const [godkjentAv, setGodkjentAv] = useState('');
	const [versjonNr, setVersjonNr] = useState('V1.0');

	const fremdrift = CHECKLIST_ITEMS.filter((item) => (values[item.id] ?? []).length > 0).length;
	const total = CHECKLIST_ITEMS.length;
	const progress = (fremdrift / total) * 100;

	const toggleMulti = (current: string[], value: string) =>
		current.includes(value) ? current.filter((v) => v !== value) : [...current, value];

	const handleBack = () => (returnTo ? navigate(returnTo, { state: returnState }) : navigate(-1));

	return (
		<FormPage
			title="KS Montasje Folde og Skyv"
			subtitle="Dok. nr.: S.11 - Kvalitetssikring av montasje"
			onBack={handleBack}
			projectNumber={projectNumber}
			projectName={projectName}
		>
			<div>
				<div style={progressHeaderStyle}>
					<span style={progressLabelStyle}>FREMDRIFT</span>
					<span style={progressValueStyle}>{fremdrift} / {total}</span>
				</div>
				<div style={progressTrackStyle}>
					<div style={{ height: '100%', width: `${progress}%`, background: UI_COLORS.accentBlue, borderRadius: '99px', transition: 'width 0.3s ease' }} />
				</div>
			</div>

			<FormSection title="Prosjektinformasjon">
				<FormField label="PROSJEKT *" htmlFor="ksmfs-prosjekt">
					<FormInput id="ksmfs-prosjekt" type="text" value={prosjekt} onChange={(e) => setProsjekt(e.target.value)} placeholder="Prosjektnavn..." />
				</FormField>
				<FormField label="EMNE *" htmlFor="ksmfs-emne">
					<FormInput id="ksmfs-emne" type="text" value={emne} onChange={(e) => setEmne(e.target.value)} placeholder="Emne..." />
				</FormField>
				<FormField label="POSISJONS NUMMER" htmlFor="ksmfs-posisjonsnummer">
					<FormInput id="ksmfs-posisjonsnummer" type="text" value={posisjonsnummer} onChange={(e) => setPosisjonsnummer(e.target.value)} placeholder="Posisjonsnummer (valgfritt)..." />
				</FormField>
			</FormSection>

			<h2 style={sectionHeadingStyle}>Gjennomgang</h2>

			{CHECKLIST_ITEMS.map((item) => (
				<FormSection key={item.id} title={item.label}>
					<div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
						{item.options.map((option) => (
							<CheckOption
								key={option}
								label={option}
								checked={(values[item.id] ?? []).includes(option)}
								onToggle={() =>
									setValues((prev) => ({ ...prev, [item.id]: toggleMulti(prev[item.id] ?? [], option) }))
								}
							/>
						))}
					</div>
					{item.id === '2' ? (
						<div style={commentSpacerStyle}>
							<FormField label="Beskrivelse av montasjeavvik egen konstruksjon" htmlFor="ksmfs-avvik-beskrivelse">
								<FormTextArea id="ksmfs-avvik-beskrivelse" value={montasjeAvvikBeskrivelse} onChange={(e) => setMontasjeAvvikBeskrivelse(e.target.value)} placeholder="Beskriv eventuelle avvik..." style={{ minHeight: '6rem' }} />
							</FormField>
						</div>
					) : null}
					<div style={commentSpacerStyle}>
						<FormField label="KOMMENTAR" htmlFor={`ksmfs-kommentar-${item.id}`}>
							<FormTextArea
								id={`ksmfs-kommentar-${item.id}`}
								value={comments[item.id] ?? ''}
								onChange={(e) => setComments((prev) => ({ ...prev, [item.id]: e.target.value }))}
								placeholder="Tilleggskommentar..."
								style={{ minHeight: '4.5rem' }}
							/>
						</FormField>
					</div>
				</FormSection>
			))}

			<FormSection title="Dokumentinformasjon *">
				<FormField label="OPPRETTET AV *" htmlFor="ksmfs-opprettet-av">
					<FormInput id="ksmfs-opprettet-av" type="text" value={opprettetAv} onChange={(e) => setOpprettetAv(e.target.value)} placeholder="Navn..." />
				</FormField>
				<FormField label="GODKJENT DATO *" htmlFor="ksmfs-godkjent-dato">
					<FormInput id="ksmfs-godkjent-dato" type="date" value={godkjentDato} onChange={(e) => setGodkjentDato(e.target.value)} />
				</FormField>
				<FormField label="GODKJENT AV *" htmlFor="ksmfs-godkjent-av">
					<FormInput id="ksmfs-godkjent-av" type="text" value={godkjentAv} onChange={(e) => setGodkjentAv(e.target.value)} placeholder="Navn..." />
				</FormField>
				<FormField label="VERSJON NR." htmlFor="ksmfs-versjon">
					<FormInput id="ksmfs-versjon" type="text" value={versjonNr} onChange={(e) => setVersjonNr(e.target.value)} placeholder="V1.0" />
				</FormField>
			</FormSection>

			<FormActionButton
				onClick={() =>
					navigate('/image-capture', {
						state: createImageCaptureState({
							contextKey: imageContextKey,
							contextTitle: 'KS Montasje Folde og Skyv',
							projectContext: { manualProjectEntry, projectNumber, projectName },
							returnNavigation,
						}),
					})
				}
			>
				{imageCount > 0 ? `+ Legg til bilde (${imageCount})` : '+ Legg til bilde'}
			</FormActionButton>

			<FormActionButton
				variant="dark"
				onClick={() =>
					navigate('/success', {
						state: createSuccessState({
							formTitle: 'KS Montasje Folde og Skyv',
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
