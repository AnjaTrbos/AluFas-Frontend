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
	{ id: '1', label: 'Mottatt avvik på foregående arbeider eller tilstående konstruksjon', options: ['Ja', 'Nei', 'Ikke varslet', 'Avviet'] },
	{ id: '2', label: 'Mottatt beskrivning om montasje av egne elementer tross avvik', options: ['Ja', 'Nei'] },
	{ id: '3', label: 'Riktig element på riktig sted', options: ['Ja', 'Avviet'] },
	{ id: '4', label: 'Element i vater og lodd. Må være sjekket', options: ['Ja', 'Avviet'] },
	{ id: '5', label: 'Innfesting utført iht beskrivelse og tegning', options: ['Ja', 'Avviet'] },
	{ id: '6', label: 'Festebraklett Schuco EN1090 benyttet', options: ['Ja', 'Avviet'] },
	{ id: '7', label: 'Drenering er montert og utført så det er tett', options: ['Ja', 'Avviet'] },
	{ id: '8', label: 'Dytt og utvendig fuge utført slik at det er 100% tett', options: ['Ja', 'Avviet'] },
	{ id: '9', label: 'Produktet er levert uten feil og skader', options: ['Ja', 'Avviet'] },
	{ id: '10', label: 'Glass er helt og uten skader', options: ['Ja', 'Avvik er sendt', 'Avviet'] },
	{ id: '11', label: 'Propper i montasje hull', options: ['Ja', 'Avviet'] },
	{ id: '12', label: 'Pakning er ilimt i alle hjørner', options: ['Ja', 'Avviet'] },
	{ id: '13', label: 'Dørr vindu i fasade er montert riktig og funksjonstest', options: ['Ja', 'Avvik er sendt', 'Avviet'] },
	{ id: '14', label: 'Tjenset blekkremerker på glass', options: ['Ja', 'Avvik er sendt', 'Avviet'] },
	{ id: '15', label: 'Drenskopper er montert', options: ['Ja', 'Avvik er sendt', 'Avviet'] },
	{ id: '16', label: 'Funksjons testet', options: ['Ja', 'Avviet'] },
	{ id: '17', label: 'Gjenstående arbeider', options: ['Ja', 'Nei', 'Fuging/ leising', 'Beslag under dørr/ vindu gjensiå'] },
	{ id: '18', label: 'Dekklodd sikret for å ikke slikt ned', options: ['Ja, propper', 'Ja, skrudd', 'Nei'] },
	{ id: '19', label: 'Bilder er tatt av element før og etter montering, samt detail bilder av drenering', options: ['JA'] },
	{ id: '20', label: 'Beslag og overganger montert i henhold til tegning', options: ['Ja', 'Avviet'] },
	{ id: '21', label: 'Sluttkontroll utført og registrert', options: ['Ja', 'Avviet'] },
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

export default function KSMontasjeFasadeTakScreen() {
	const navigate = useNavigate();
	const location = useLocation();
	const state = (location.state as ProjectRouteState | null) ?? null;
	const { manualProjectEntry, projectNumber, projectName } = getProjectContextFromState(state);
	const returnTo = state?.returnTo;
	const returnState = state?.returnState;
	const returnNavigation = { returnTo: location.pathname, returnState: location.state };
	const imageContextKey = createImageContextKey('ks-montasje-fasade-tak', projectNumber);
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
			title="KS Montasje Fasade/Tak"
			subtitle="Dok. nr.: S.12 - Kvalitetssikring av montasje"
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
				<FormField label="PROSJEKT *" htmlFor="ksmft-prosjekt">
					<FormInput id="ksmft-prosjekt" type="text" value={prosjekt} onChange={(e) => setProsjekt(e.target.value)} placeholder="Prosjektnavn..." />
				</FormField>
				<FormField label="EMNE *" htmlFor="ksmft-emne">
					<FormInput id="ksmft-emne" type="text" value={emne} onChange={(e) => setEmne(e.target.value)} placeholder="Emne..." />
				</FormField>
				<FormField label="POSISJONS NUMMER" htmlFor="ksmft-posisjonsnummer">
					<FormInput id="ksmft-posisjonsnummer" type="text" value={posisjonsnummer} onChange={(e) => setPosisjonsnummer(e.target.value)} placeholder="Posisjonsnummer (valgfritt)..." />
				</FormField>
			</FormSection>

			<h2 style={sectionHeadingStyle}>Gjennomgang</h2>

			{CHECKLIST_ITEMS.map((item, idx) => (
				<div key={item.id}>
					<FormSection title={item.label}>
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
								<FormField label="Beskrivelse av montasjeavvik egen konstruksjon" htmlFor="ksmft-avvik-beskrivelse">
									<FormTextArea id="ksmft-avvik-beskrivelse" value={montasjeAvvikBeskrivelse} onChange={(e) => setMontasjeAvvikBeskrivelse(e.target.value)} placeholder="Beskriv eventuelle avvik..." style={{ minHeight: '6rem' }} />
								</FormField>
							</div>
						) : null}
						<div style={commentSpacerStyle}>
							<FormField label="KOMMENTAR" htmlFor={`ksmft-kommentar-${item.id}`}>
								<FormTextArea
									id={`ksmft-kommentar-${item.id}`}
									value={comments[item.id] ?? ''}
									onChange={(e) => setComments((prev) => ({ ...prev, [item.id]: e.target.value }))}
									placeholder="Tilleggskommentar..."
									style={{ minHeight: '4.5rem' }}
								/>
							</FormField>
						</div>
					</FormSection>
					{idx === 18 ? null : null}
				</div>
			))}

			<FormSection title="Dokumentinformasjon *">
				<FormField label="OPPRETTET AV *" htmlFor="ksmft-opprettet-av">
					<FormInput id="ksmft-opprettet-av" type="text" value={opprettetAv} onChange={(e) => setOpprettetAv(e.target.value)} placeholder="Navn..." />
				</FormField>
				<FormField label="GODKJENT DATO *" htmlFor="ksmft-godkjent-dato">
					<FormInput id="ksmft-godkjent-dato" type="date" value={godkjentDato} onChange={(e) => setGodkjentDato(e.target.value)} />
				</FormField>
				<FormField label="GODKJENT AV *" htmlFor="ksmft-godkjent-av">
					<FormInput id="ksmft-godkjent-av" type="text" value={godkjentAv} onChange={(e) => setGodkjentAv(e.target.value)} placeholder="Navn..." />
				</FormField>
				<FormField label="VERSJON NR." htmlFor="ksmft-versjon">
					<FormInput id="ksmft-versjon" type="text" value={versjonNr} onChange={(e) => setVersjonNr(e.target.value)} placeholder="V1.0" />
				</FormField>
			</FormSection>

			<FormActionButton
				onClick={() =>
					navigate('/image-capture', {
						state: createImageCaptureState({
							contextKey: imageContextKey,
							contextTitle: 'KS Montasje Fasade/Tak',
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
							formTitle: 'KS Montasje Fasade/Tak',
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
