import { useState } from 'react';
import type { CSSProperties } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Save } from 'lucide-react';
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
	leftOption?: string;
	rightOption?: string;
}

const progressHeaderStyle = { display: 'flex', justifyContent: 'space-between', marginBottom: '0.45rem' } as const;
const progressLabelStyle = { fontSize: '0.85rem', fontWeight: 800, color: UI_COLORS.ink500, letterSpacing: '0.07em', textTransform: 'uppercase', fontFamily: BODY_FONT_FAMILY } as const;
const progressValueStyle = { fontSize: '0.85rem', fontWeight: 800, color: UI_COLORS.ink500 } as const;
const progressTrackStyle = { height: '0.55rem', borderRadius: '99px', background: UI_COLORS.line300, overflow: 'hidden' } as const;
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(14rem, 1fr))', gap: '1rem' } as const;
const commentSpacerStyle = { marginTop: '0.75rem' } as const;
const subLabelStyle: CSSProperties = { fontSize: '0.95rem', fontWeight: 600, color: UI_COLORS.ink900, margin: '0 0 0.5rem' };
const subItemSpacerStyle = { marginBottom: '1.5rem' } as const;
const checkListStyle = { display: 'flex', flexDirection: 'column', gap: '0.65rem' } as const;

const GENERAL_ITEMS: ChecklistItem[] = [
	{ id: '0.1', label: '0.1 Dør' },
	{ id: '0.2', label: '0.2 Vegg' },
	{ id: '0.3', label: '0.3 Posisjon' },
	{ id: '0.4', label: '0.4 Antall' },
	{ id: '0.5', label: '0.5 Profilsystem' },
	{ id: '0.6', label: '0.6 Akse' },
	{ id: '0.7', label: '0.7 Etg.' },
	{ id: '0.8', label: '0.8 Fasade' },
	{ id: '0.9', label: '0.9 Type' },
	{ id: '0.10', label: '0.10 Posisjonsnummer' },
];

const PRODUKSJON_ITEMS: ChecklistItem[] = [
	{ id: '1.1', label: '1.1 Lakk ok:', leftOption: 'Ja', rightOption: 'Nei, avvik sendt' },
	{ id: '1.2', label: '1.2 Kontrollmålt utvendig', leftOption: 'OK', rightOption: 'Nei, avvik sendt' },
	{ id: '1.3', label: '1.3 Sjekket sammenføyninger', leftOption: 'Ja', rightOption: 'Nei, avvik sendt på dårlige sammenføyninger' },
	{ id: '1.4', label: '1.4 Platefelt montert', leftOption: 'Ja', rightOption: 'Nei, avvik sendt' },
	{ id: '1.5', label: '1.5 Drenert OK', leftOption: 'Ja', rightOption: 'Nei, avvik sendt' },
	{ id: '1.6', label: '1.6 Lås montert, funksjon ok (Type lås beskrives!)', leftOption: 'Ja', rightOption: 'Nei, avvik sendt' },
	{ id: '1.7', label: '1.7 Sluttstykke montert', leftOption: 'Ja', rightOption: 'Nei, avvik sendt' },
	{ id: '1.8', label: '1.8 Fallkolbens inngrep', leftOption: 'EI30, 7mm', rightOption: 'EI60 11mm' },
	{ id: '1.9', label: '1.9 Beslag beskrives', leftOption: 'Ja', rightOption: 'Nei, avvik sendt' },
	{ id: '1.10', label: '1.10 Sprosse høyder og limt pakning', leftOption: 'Ja', rightOption: 'Nei, avvik sendt' },
	{ id: '1.11', label: '1.11 Alt innvendig i profil er sjekket mot tegning', leftOption: 'Ja', rightOption: 'Nei, avvik sendt' },
	{ id: '1.12', label: '1.12 Isolerstag, gjelder FR 30', leftOption: 'Ja', rightOption: 'Nei, avvik sendt' },
	{ id: '1.13', label: '1.13 Brannskilt merket Aluminium Fasader AS', leftOption: 'Ja', rightOption: 'Nei, avvik sendt' },
	{ id: '1.14', label: '1.14 Bakkantbeslag', leftOption: 'Ja', rightOption: 'Nei, avvik sendt' },
	{ id: '1.15', label: '1.15 Profiler og glass er skikkelig rengjort for silikon og annet smuss', leftOption: 'Ja', rightOption: 'Nei, avvik sendt' },
	{ id: '1.17', label: '1.17 Annet å bemerke:', leftOption: 'Ja', rightOption: 'Nei' },
];

const PAKKET_OPTIONS = ['PAKNING', 'BESLAG', 'PUMPE', 'HÅNDTAK', 'FUG og DYTT'] as const;

type TwoOpt = 'left' | 'right' | null;

function TwoOptionGroup({
	left,
	right,
	value,
	onChange,
}: {
	left: string;
	right: string;
	value: TwoOpt;
	onChange: (v: TwoOpt) => void;
}) {
	const btnStyle = (active: boolean): CSSProperties => ({
		flex: 1,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: '0.6rem',
		padding: '1rem',
		borderRadius: '1rem',
		border: `2px solid ${active ? UI_COLORS.accentBlue : UI_COLORS.line300}`,
		background: active ? UI_COLORS.accentBlue : UI_COLORS.surface0,
		cursor: 'pointer',
		fontSize: 'clamp(0.875rem, 2.5vw, 1.05rem)',
		fontWeight: 800,
		color: active ? UI_COLORS.surface0 : UI_COLORS.ink900,
	});

	const circleStyle = (active: boolean): CSSProperties => ({
		width: '1rem',
		height: '1rem',
		borderRadius: '50%',
		border: `2px solid ${active ? UI_COLORS.surface0 : UI_COLORS.line300}`,
		background: 'transparent',
		flexShrink: 0,
	});

	return (
		<div style={{ display: 'flex', gap: '0.75rem' }}>
			<button type="button" onClick={() => onChange(value === 'left' ? null : 'left')} style={btnStyle(value === 'left')}>
				<span style={circleStyle(value === 'left')} />
				{left}
			</button>
			<button type="button" onClick={() => onChange(value === 'right' ? null : 'right')} style={btnStyle(value === 'right')}>
				<span style={circleStyle(value === 'right')} />
				{right}
			</button>
		</div>
	);
}

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
			/>
			<span style={{ fontSize: '1.05rem', fontWeight: 700, color: UI_COLORS.ink900 }}>{label}</span>
		</button>
	);
}

export default function KSBrannprodukterScreen() {
	const navigate = useNavigate();
	const location = useLocation();
	const state = (location.state as ProjectRouteState | null) ?? null;
	const { manualProjectEntry, projectNumber, projectName } = getProjectContextFromState(state);
	const returnTo = state?.returnTo;
	const returnState = state?.returnState;
	const returnNavigation = { returnTo: location.pathname, returnState: location.state };
	const imageContextKey = createImageContextKey('ks-brann', projectNumber);
	const imageCount = getImageDraftCount(imageContextKey);

	const [emne, setEmne] = useState('');
	const [elementNavn, setElementNavn] = useState('');

	const [genValues, setGenValues] = useState<Record<string, string>>(
		() => Object.fromEntries(GENERAL_ITEMS.map((k) => [k.id, ''])),
	);
	const [genComments, setGenComments] = useState<Record<string, string>>(
		() => Object.fromEntries(GENERAL_ITEMS.map((k) => [k.id, ''])),
	);

	const [produksjonValues, setProduksjonValues] = useState<Record<string, TwoOpt>>(
		() => Object.fromEntries(PRODUKSJON_ITEMS.map((k) => [k.id, null])) as Record<string, TwoOpt>,
	);
	const [produksjonComments, setProduksjonComments] = useState<Record<string, string>>(
		() => Object.fromEntries(PRODUKSJON_ITEMS.map((k) => [k.id, ''])),
	);
	const [pakketOgSendt, setPakketOgSendt] = useState<string[]>([]);
	const [pakketOgSendtComment, setPakketOgSendtComment] = useState('');

	const [feil21, setFeil21] = useState('');
	const [feil21Comment, setFeil21Comment] = useState('');
	const [feil22, setFeil22] = useState('');
	const [feil22Comment, setFeil22Comment] = useState('');

	const [kontrollAnsvarlig, setKontrollAnsvarlig] = useState('');
	const [dato, setDato] = useState('');

	const fremdrift = [
		...GENERAL_ITEMS.map((k) => genValues[k.id].trim() !== ''),
		...PRODUKSJON_ITEMS.map((k) => produksjonValues[k.id] !== null),
		pakketOgSendt.length > 0,
	].filter(Boolean).length;

	const total = 27;
	const progress = (fremdrift / total) * 100;

	const toggleMulti = (current: string[], value: string) =>
		current.includes(value) ? current.filter((v) => v !== value) : [...current, value];

	const handleBack = () => (returnTo ? navigate(returnTo, { state: returnState }) : navigate(-1));

	return (
		<FormPage
			title="KS Brannprodukter"
			subtitle="Dok. nr.: S.03 - Sjekkliste montasje av brannprodukter"
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
				<FormField label="EMNE *" htmlFor="ksbp-emne">
					<FormInput id="ksbp-emne" type="text" value={emne} onChange={(e) => setEmne(e.target.value)} placeholder="F.eks. Brannprodukter" />
				</FormField>
				<FormField label="ELEMENT NAVN/NR. PÅ MONTERT PRODUKT *" htmlFor="ksbp-element">
					<FormInput id="ksbp-element" type="text" value={elementNavn} onChange={(e) => setElementNavn(e.target.value)} placeholder="Element navn eller nummer" />
				</FormField>
			</FormSection>

			<FormSection title="0.0 Generell informasjon">
				{GENERAL_ITEMS.map((item, idx) => (
					<div key={item.id} style={idx < GENERAL_ITEMS.length - 1 ? subItemSpacerStyle : undefined}>
						<p style={subLabelStyle}>{item.label}</p>
						<FormInput
							type="text"
							value={genValues[item.id]}
							onChange={(e) => setGenValues((prev) => ({ ...prev, [item.id]: e.target.value }))}
							placeholder="..."
						/>
						<div style={commentSpacerStyle}>
							<FormTextArea
								value={genComments[item.id]}
								onChange={(e) => setGenComments((prev) => ({ ...prev, [item.id]: e.target.value }))}
								placeholder="Kommentar..."
								style={{ minHeight: '4rem' }}
							/>
						</div>
					</div>
				))}
			</FormSection>

			<FormSection title="1.0 Produksjon">
				{PRODUKSJON_ITEMS.map((item, idx) => (
					<div key={item.id} style={idx < PRODUKSJON_ITEMS.length - 1 ? subItemSpacerStyle : undefined}>
						<p style={subLabelStyle}>{item.label}</p>
						{item.leftOption && item.rightOption ? (
							<TwoOptionGroup
								left={item.leftOption}
								right={item.rightOption}
								value={produksjonValues[item.id]}
								onChange={(next) => setProduksjonValues((prev) => ({ ...prev, [item.id]: next }))}
							/>
						) : null}
						<div style={commentSpacerStyle}>
							<FormTextArea
								value={produksjonComments[item.id]}
								onChange={(e) => setProduksjonComments((prev) => ({ ...prev, [item.id]: e.target.value }))}
								placeholder="Kommentar..."
								style={{ minHeight: '4rem' }}
							/>
						</div>
					</div>
				))}

				<div style={subItemSpacerStyle}>
					<p style={subLabelStyle}>1.16 Pakket og sendt med montører:</p>
					<div style={checkListStyle}>
						{PAKKET_OPTIONS.map((option) => (
							<CheckOption
								key={option}
								label={option}
								checked={pakketOgSendt.includes(option)}
								onToggle={() => setPakketOgSendt(toggleMulti(pakketOgSendt, option))}
							/>
						))}
					</div>
					<div style={commentSpacerStyle}>
						<FormTextArea
							value={pakketOgSendtComment}
							onChange={(e) => setPakketOgSendtComment(e.target.value)}
							placeholder="Kommentar..."
							style={{ minHeight: '4rem' }}
						/>
					</div>
				</div>
			</FormSection>

			<FormSection title="2.0 Feil / Skader">
				<div style={subItemSpacerStyle}>
					<p style={subLabelStyle}>2.1 Hva er feil / skadet?</p>
					<FormTextArea value={feil21} onChange={(e) => setFeil21(e.target.value)} placeholder="Beskriv feil eller skader..." style={{ minHeight: '6rem' }} />
					<div style={commentSpacerStyle}>
						<FormTextArea value={feil21Comment} onChange={(e) => setFeil21Comment(e.target.value)} placeholder="Kommentar..." style={{ minHeight: '4rem' }} />
					</div>
				</div>
				<div>
					<p style={subLabelStyle}>2.2 Feil eller skader som er utbedret:</p>
					<FormTextArea value={feil22} onChange={(e) => setFeil22(e.target.value)} placeholder="Beskriv utbedringer..." style={{ minHeight: '6rem' }} />
					<div style={commentSpacerStyle}>
						<FormTextArea value={feil22Comment} onChange={(e) => setFeil22Comment(e.target.value)} placeholder="Kommentar..." style={{ minHeight: '4rem' }} />
					</div>
				</div>
			</FormSection>

			<FormSection title="Kontrollansvarlig">
				<FormField label="KONTROLLANSVARLIG / SKJEMA BLE LAGET AV" htmlFor="ksbp-kontrollansvarlig">
					<FormInput id="ksbp-kontrollansvarlig" type="text" value={kontrollAnsvarlig} onChange={(e) => setKontrollAnsvarlig(e.target.value)} placeholder="Navn" />
				</FormField>
				<div style={gridStyle}>
					<FormField label="DATO" htmlFor="ksbp-dato">
						<FormInput id="ksbp-dato" type="date" value={dato} onChange={(e) => setDato(e.target.value)} />
					</FormField>
				</div>
			</FormSection>

			<FormActionButton
				onClick={() =>
					navigate('/image-capture', {
						state: createImageCaptureState({
							contextKey: imageContextKey,
							contextTitle: 'KS Brannprodukter',
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
							formTitle: 'KS Brannprodukter',
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
