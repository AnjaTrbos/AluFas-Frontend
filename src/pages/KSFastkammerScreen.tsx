import { useState } from 'react';
import type { CSSProperties } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check, Save } from 'lucide-react';
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

const SYSTEM_OPTIONS = ['AWS/ADS 70 HI', 'AWS/ADS 75 SI', 'AWS90', 'Utedør AWS/ADS50 NI', 'Annet'];
const PLATEFELT_OPTIONS = ['Ja', 'Mangler', 'Ikke platefelt i element', 'Laget og sendt med'];
const GJORT_KLART_OPTIONS = ['Pakning til dyrk', 'Div'];

const progressHeaderStyle = { display: 'flex', justifyContent: 'space-between', marginBottom: '0.45rem' } as const;
const progressLabelStyle = { fontSize: '0.85rem', fontWeight: 800, color: UI_COLORS.ink500, letterSpacing: '0.07em', textTransform: 'uppercase', fontFamily: BODY_FONT_FAMILY } as const;
const progressValueStyle = { fontSize: '0.85rem', fontWeight: 800, color: UI_COLORS.ink500 } as const;
const progressTrackStyle = { height: '0.55rem', borderRadius: '99px', background: UI_COLORS.line300, overflow: 'hidden' } as const;
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(14rem, 1fr))', gap: '1rem' } as const;
const checkListStyle = { display: 'flex', flexDirection: 'column', gap: '0.65rem' } as const;
const commentSpacerStyle = { marginTop: '0.75rem' } as const;
const sectionHeadingStyle = { margin: '0.45rem 0 0.1rem', fontSize: 'clamp(1.45rem, 3.8vw, 1.95rem)', fontWeight: 900, color: UI_COLORS.ink900 } as const;

type JaNei = 'ja' | 'nei' | null;

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

function JaNeiGroup({ value, onChange }: { value: JaNei; onChange: (v: JaNei) => void }) {
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
		fontSize: 'clamp(1rem, 2.5vw, 1.12rem)',
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
			<button type="button" onClick={() => onChange(value === 'ja' ? null : 'ja')} style={btnStyle(value === 'ja')}>
				<span style={circleStyle(value === 'ja')} />
				Ja
			</button>
			<button type="button" onClick={() => onChange(value === 'nei' ? null : 'nei')} style={btnStyle(value === 'nei')}>
				<span style={circleStyle(value === 'nei')} />
				Nei
			</button>
		</div>
	);
}

export default function KSFastkammerScreen() {
	const navigate = useNavigate();
	const location = useLocation();
	const state = (location.state as ProjectRouteState | null) ?? null;
	const { manualProjectEntry, projectNumber, projectName } = getProjectContextFromState(state);
	const returnTo = state?.returnTo;
	const returnState = state?.returnState;
	const returnNavigation = { returnTo: location.pathname, returnState: location.state };
	const imageContextKey = createImageContextKey('ks-fastkammer', projectNumber);
	const imageCount = getImageDraftCount(imageContextKey);

	const [emne, setEmne] = useState('');
	const [posisjonsnummer, setPosisjonsnummer] = useState('');
	const [antall, setAntall] = useState('');

	const [systemType, setSystemType] = useState<string[]>([]);
	const [elementMerket, setElementMerket] = useState<JaNei>(null);
	const [elementMerketComment, setElementMerketComment] = useState('');
	const [overflateLakk, setOverflateLakk] = useState<JaNei>(null);
	const [overflateLakkComment, setOverflateLakkComment] = useState('');
	const [kontrollMalElement, setKontrollMalElement] = useState('');
	const [kontrollMalElementComment, setKontrollMalElementComment] = useState('');
	const [kontrollMaltSprosse, setKontrollMaltSprosse] = useState(false);
	const [kontrollMaltSprosseComment, setKontrollMaltSprosseComment] = useState('');
	const [limtHjorterPakninger, setLimtHjorterPakninger] = useState(false);
	const [limtHjorterPakningerComment, setLimtHjorterPakningerComment] = useState('');
	const [limtFlaterGjaering, setLimtFlaterGjaering] = useState(false);
	const [limtFlaterGjaeringComment, setLimtFlaterGjaeringComment] = useState('');
	const [sammenfoyninger, setSammenfoyninger] = useState(false);
	const [sammenfoyningerComment, setSammenfoyningerComment] = useState('');
	const [drenert, setDrenert] = useState<JaNei>(null);
	const [drenertComment, setDrenertComment] = useState('');
	const [platefeltMontert, setPlatefeltMontert] = useState<string[]>([]);
	const [platefeltMontertComment, setPlatefeltMontertComment] = useState('');
	const [gjortKlart, setGjortKlart] = useState<string[]>([]);
	const [gjortKlartComment, setGjortKlartComment] = useState('');
	const [andreMerknader, setAndreMerknader] = useState('');
	const [andreMerknaderComment, setAndreMerknaderComment] = useState('');

	const [skjemaAv, setSkjemaAv] = useState('');
	const [dato, setDato] = useState('');
	const [godkjentAv, setGodkjentAv] = useState('');
	const [versjon, setVersjon] = useState('V1.0');

	const fremdrift = [
		systemType.length > 0,
		elementMerket !== null,
		overflateLakk !== null,
		kontrollMalElement.trim() !== '',
		kontrollMaltSprosse,
		limtHjorterPakninger,
		limtFlaterGjaering,
		sammenfoyninger,
		drenert !== null,
		platefeltMontert.length > 0,
		gjortKlart.length > 0,
		andreMerknader.trim() !== '',
	].filter(Boolean).length;

	const total = 12;
	const progress = (fremdrift / total) * 100;

	const toggleMulti = (current: string[], value: string) =>
		current.includes(value) ? current.filter((v) => v !== value) : [...current, value];

	const handleBack = () => (returnTo ? navigate(returnTo, { state: returnState }) : navigate(-1));

	return (
		<FormPage
			title="KS Fastkammer"
			subtitle="Dok. nr.: S.03 - Kvalitetssikring av produksjon"
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
				<FormField label="EMNE *" htmlFor="ksfk-emne">
					<FormInput id="ksfk-emne" type="text" value={emne} onChange={(e) => setEmne(e.target.value)} placeholder="F.eks. Fastkammer" />
				</FormField>
				<FormField label="POSISJONS NUMMER *" htmlFor="ksfk-posisjonsnummer">
					<FormInput id="ksfk-posisjonsnummer" type="text" value={posisjonsnummer} onChange={(e) => setPosisjonsnummer(e.target.value)} placeholder="Posisjonsnummer..." />
				</FormField>
				<FormField label="ANTALL *" htmlFor="ksfk-antall">
					<FormInput id="ksfk-antall" type="text" value={antall} onChange={(e) => setAntall(e.target.value)} placeholder="Antall..." />
				</FormField>
			</FormSection>

			<h2 style={sectionHeadingStyle}>Gjennomgang</h2>

			<FormSection title="Produksjon av system">
				<div style={checkListStyle}>
					{SYSTEM_OPTIONS.map((option) => (
						<CheckOption
							key={option}
							label={option}
							checked={systemType.includes(option)}
							onToggle={() => setSystemType(toggleMulti(systemType, option))}
						/>
					))}
				</div>
			</FormSection>

			<FormSection title="Element merket med prosjektnavn og pos.nr.">
				<JaNeiGroup value={elementMerket} onChange={setElementMerket} />
				<div style={commentSpacerStyle}>
					<FormTextArea value={elementMerketComment} onChange={(e) => setElementMerketComment(e.target.value)} placeholder="Kommentar..." style={{ minHeight: '4.5rem' }} />
				</div>
			</FormSection>

			<FormSection title="Overflate / Lakk">
				<JaNeiGroup value={overflateLakk} onChange={setOverflateLakk} />
				<div style={commentSpacerStyle}>
					<FormTextArea value={overflateLakkComment} onChange={(e) => setOverflateLakkComment(e.target.value)} placeholder="Kommentar..." style={{ minHeight: '4.5rem' }} />
				</div>
			</FormSection>

			<FormSection title="Kontroll mål i element">
				<FormTextArea value={kontrollMalElement} onChange={(e) => setKontrollMalElement(e.target.value)} placeholder="Beskriv kontrollmål..." style={{ minHeight: '6rem' }} />
				<div style={commentSpacerStyle}>
					<FormTextArea value={kontrollMalElementComment} onChange={(e) => setKontrollMalElementComment(e.target.value)} placeholder="Kommentar..." style={{ minHeight: '4.5rem' }} />
				</div>
			</FormSection>

			<FormSection title="Kontroll målt sprosse høyde">
				<div style={checkListStyle}>
					<CheckOption label="Ja" checked={kontrollMaltSprosse} onToggle={() => setKontrollMaltSprosse((v) => !v)} />
				</div>
				<div style={commentSpacerStyle}>
					<FormTextArea value={kontrollMaltSprosseComment} onChange={(e) => setKontrollMaltSprosseComment(e.target.value)} placeholder="Kommentar..." style={{ minHeight: '4.5rem' }} />
				</div>
			</FormSection>

			<FormSection title="Limt hjerter og pakninger">
				<div style={checkListStyle}>
					<CheckOption label="Ja" checked={limtHjorterPakninger} onToggle={() => setLimtHjorterPakninger((v) => !v)} />
				</div>
				<div style={commentSpacerStyle}>
					<FormTextArea value={limtHjorterPakningerComment} onChange={(e) => setLimtHjorterPakningerComment(e.target.value)} placeholder="Kommentar..." style={{ minHeight: '4.5rem' }} />
				</div>
			</FormSection>

			<FormSection title="Limt flater / gjæring">
				<div style={checkListStyle}>
					<CheckOption label="Ja" checked={limtFlaterGjaering} onToggle={() => setLimtFlaterGjaering((v) => !v)} />
				</div>
				<div style={commentSpacerStyle}>
					<FormTextArea value={limtFlaterGjaeringComment} onChange={(e) => setLimtFlaterGjaeringComment(e.target.value)} placeholder="Kommentar..." style={{ minHeight: '4.5rem' }} />
				</div>
			</FormSection>

			<FormSection title="Sammenføyninger / gjeringer sjekket">
				<div style={checkListStyle}>
					<CheckOption label="Ja" checked={sammenfoyninger} onToggle={() => setSammenfoyninger((v) => !v)} />
				</div>
				<div style={commentSpacerStyle}>
					<FormTextArea value={sammenfoyningerComment} onChange={(e) => setSammenfoyningerComment(e.target.value)} placeholder="Kommentar..." style={{ minHeight: '4.5rem' }} />
				</div>
			</FormSection>

			<FormSection title="Drenert og satt på drenskopper">
				<JaNeiGroup value={drenert} onChange={setDrenert} />
				<div style={commentSpacerStyle}>
					<FormTextArea value={drenertComment} onChange={(e) => setDrenertComment(e.target.value)} placeholder="Kommentar..." style={{ minHeight: '4.5rem' }} />
				</div>
			</FormSection>

			<FormSection title="Platefelt montert">
				<div style={checkListStyle}>
					{PLATEFELT_OPTIONS.map((option) => (
						<CheckOption
							key={option}
							label={option}
							checked={platefeltMontert.includes(option)}
							onToggle={() => setPlatefeltMontert(toggleMulti(platefeltMontert, option))}
						/>
					))}
				</div>
				<div style={commentSpacerStyle}>
					<FormTextArea value={platefeltMontertComment} onChange={(e) => setPlatefeltMontertComment(e.target.value)} placeholder="Kommentar..." style={{ minHeight: '4.5rem' }} />
				</div>
			</FormSection>

			<FormSection title="Gjort klart og pakket sammen med jobben">
				<div style={checkListStyle}>
					{GJORT_KLART_OPTIONS.map((option) => (
						<CheckOption
							key={option}
							label={option}
							checked={gjortKlart.includes(option)}
							onToggle={() => setGjortKlart(toggleMulti(gjortKlart, option))}
						/>
					))}
				</div>
				<div style={commentSpacerStyle}>
					<FormTextArea value={gjortKlartComment} onChange={(e) => setGjortKlartComment(e.target.value)} placeholder="Kommentar..." style={{ minHeight: '4.5rem' }} />
				</div>
			</FormSection>

			<FormSection title="Andre merknader eller kommentarer">
				<FormTextArea value={andreMerknader} onChange={(e) => setAndreMerknader(e.target.value)} placeholder="Andre merknader..." style={{ minHeight: '6rem' }} />
				<div style={commentSpacerStyle}>
					<FormTextArea value={andreMerknaderComment} onChange={(e) => setAndreMerknaderComment(e.target.value)} placeholder="Kommentar..." style={{ minHeight: '4.5rem' }} />
				</div>
			</FormSection>

			<FormSection title="Dokumentinformasjon *">
				<FormField label="SKJEMA AV *" htmlFor="ksfk-skjema-av">
					<FormInput id="ksfk-skjema-av" type="text" value={skjemaAv} onChange={(e) => setSkjemaAv(e.target.value)} placeholder="Navn..." />
				</FormField>
				<div style={gridStyle}>
					<FormField label="DATO *" htmlFor="ksfk-dato">
						<FormInput id="ksfk-dato" type="date" value={dato} onChange={(e) => setDato(e.target.value)} />
					</FormField>
					<FormField label="GODKJENT AV *" htmlFor="ksfk-godkjent-av">
						<FormInput id="ksfk-godkjent-av" type="text" value={godkjentAv} onChange={(e) => setGodkjentAv(e.target.value)} placeholder="Navn..." />
					</FormField>
				</div>
				<FormField label="VERSJON" htmlFor="ksfk-versjon">
					<FormInput id="ksfk-versjon" type="text" value={versjon} onChange={(e) => setVersjon(e.target.value)} placeholder="V1.0" />
				</FormField>
			</FormSection>

			<FormActionButton
				onClick={() =>
					navigate('/image-capture', {
						state: createImageCaptureState({
							contextKey: imageContextKey,
							contextTitle: 'KS Fastkammer',
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
							formTitle: 'KS Fastkammer',
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
