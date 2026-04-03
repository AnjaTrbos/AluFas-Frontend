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

const SYSTEM_OPTIONS = ['FWS50', 'FWS60'];
const GJORT_KLART_OPTIONS = ['Sprosse skruer', 'Klem og dekklister', 'Skruer til klemlist', 'Glassklossere og klosser'];

const progressHeaderStyle = { display: 'flex', justifyContent: 'space-between', marginBottom: '0.45rem' } as const;
const progressLabelStyle = { fontSize: '0.85rem', fontWeight: 800, color: UI_COLORS.ink500, letterSpacing: '0.07em', textTransform: 'uppercase', fontFamily: BODY_FONT_FAMILY } as const;
const progressValueStyle = { fontSize: '0.85rem', fontWeight: 800, color: UI_COLORS.ink500 } as const;
const progressTrackStyle = { height: '0.55rem', borderRadius: '99px', background: UI_COLORS.line300, overflow: 'hidden' } as const;
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(14rem, 1fr))', gap: '1rem' } as const;
const checkListStyle = { display: 'flex', flexDirection: 'column', gap: '0.65rem' } as const;
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

function JaNeiGroup({ value, onChange }: { value: 'ja' | 'nei' | null; onChange: (v: 'ja' | 'nei' | null) => void }) {
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

export default function KSFasadeScreen() {
	const navigate = useNavigate();
	const location = useLocation();
	const state = (location.state as ProjectRouteState | null) ?? null;
	const { manualProjectEntry, projectNumber, projectName } = getProjectContextFromState(state);
	const returnTo = state?.returnTo;
	const returnState = state?.returnState;
	const returnNavigation = { returnTo: location.pathname, returnState: location.state };
	const imageContextKey = createImageContextKey('ks-fasade', projectNumber);
	const imageCount = getImageDraftCount(imageContextKey);

	// Prosjektinformasjon
	const [emne, setEmne] = useState('');
	const [posisjonsnummer, setPosisjonsnummer] = useState('');
	const [antall, setAntall] = useState('');

	// 10 tracked checkpoints
	const [systemType, setSystemType] = useState<string[]>([]);
	const [systemTypeComment, setSystemTypeComment] = useState('');
	const [elementMerket, setElementMerket] = useState(false);
	const [elementMerketComment, setElementMerketComment] = useState('');
	const [overflakeLakk, setOverflakeLakk] = useState<'ja' | 'nei' | null>(null);
	const [overflakeLakkComment, setOverflakeLakkComment] = useState('');
	const [kontrollMaltElement, setKontrollMaltElement] = useState(false);
	const [kontrollMaltElementComment, setKontrollMaltElementComment] = useState('');
	const [sprosseUtfresing, setSprosseUtfresing] = useState(false);
	const [sprosseUtfresingComment, setSprosseUtfresingComment] = useState('');
	const [kontrollMaltSprosse, setKontrollMaltSprosse] = useState(false);
	const [kontrollMaltSprosseComment, setKontrollMaltSprosseComment] = useState('');
	const [limtHjorner, setLimtHjorner] = useState(false);
	const [limtHjornerComment, setLimtHjornerComment] = useState('');
	const [sammenfoyninger, setSammenfoyninger] = useState(false);
	const [sammenfoyningerComment, setSammenfoyningerComment] = useState('');
	const [gjortKlart, setGjortKlart] = useState<string[]>([]);
	const [gjortKlartComment, setGjortKlartComment] = useState('');
	const [fugemasse, setFugemasse] = useState(false);

	// Non-tracked sections
	const [andreMerknader, setAndreMerknader] = useState('');
	const [andreMerknaderComment, setAndreMerknaderComment] = useState('');

	// Dokumentinformasjon
	const [opprettetAv, setOpprettetAv] = useState('');
	const [godkjentDato, setGodkjentDato] = useState('');
	const [godkjentAv, setGodkjentAv] = useState('');
	const [versjonNr, setVersjonNr] = useState('');

	const fremdrift = [
		systemType.length > 0,
		elementMerket,
		overflakeLakk !== null,
		kontrollMaltElement,
		sprosseUtfresing,
		kontrollMaltSprosse,
		limtHjorner,
		sammenfoyninger,
		gjortKlart.length > 0,
		fugemasse,
	].filter(Boolean).length;

	const total = 10;
	const progress = (fremdrift / total) * 100;

	const toggleMulti = (current: string[], value: string) =>
		current.includes(value) ? current.filter((v) => v !== value) : [...current, value];

	const handleBack = () => (returnTo ? navigate(returnTo, { state: returnState }) : navigate(-1));

	return (
		<FormPage
			title="KS Fasade"
			subtitle="Dok. nr.: S.03 - Kontrollskjema Verksted Fasade"
			onBack={handleBack}
			projectNumber={projectNumber}
			projectName={projectName}
		>
			{/* Progress indicator */}
			<div>
				<div style={progressHeaderStyle}>
					<span style={progressLabelStyle}>FREMDRIFT</span>
					<span style={progressValueStyle}>{fremdrift} / {total}</span>
				</div>
				<div style={progressTrackStyle}>
					<div style={{ height: '100%', width: `${progress}%`, background: UI_COLORS.accentBlue, borderRadius: '99px', transition: 'width 0.3s ease' }} />
				</div>
			</div>

			{/* Prosjektinformasjon */}
			<FormSection title="Prosjektinformasjon">
				<FormField label="EMNE *" htmlFor="ksf-emne">
					<FormInput id="ksf-emne" type="text" value={emne} onChange={(e) => setEmne(e.target.value)} placeholder="F.eks. Fasade element" />
				</FormField>
				<div style={gridStyle}>
					<FormField label="POSISJONS NUMMER *" htmlFor="ksf-posisjonsnummer">
						<FormInput id="ksf-posisjonsnummer" type="text" value={posisjonsnummer} onChange={(e) => setPosisjonsnummer(e.target.value)} placeholder="Pos. nr." />
					</FormField>
					<FormField label="ANTALL *" htmlFor="ksf-antall">
						<FormInput id="ksf-antall" type="text" value={antall} onChange={(e) => setAntall(e.target.value)} placeholder="Antall" />
					</FormField>
				</div>
			</FormSection>

			{/* 1. Produksjon av system */}
			<FormSection title="Produksjon av system *">
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
				<div style={commentSpacerStyle}>
					<FormTextArea value={systemTypeComment} onChange={(e) => setSystemTypeComment(e.target.value)} placeholder="Kommentar..." style={{ minHeight: '4.5rem' }} />
				</div>
			</FormSection>

			{/* 2. Element merket */}
			<FormSection title="Element merket med prosjektnavn og pos.nr.">
				<div style={checkListStyle}>
					<CheckOption label="Ja" checked={elementMerket} onToggle={() => setElementMerket((v) => !v)} />
				</div>
				<div style={commentSpacerStyle}>
					<FormTextArea value={elementMerketComment} onChange={(e) => setElementMerketComment(e.target.value)} placeholder="Kommentar..." style={{ minHeight: '4.5rem' }} />
				</div>
			</FormSection>

			{/* 3. Overflate / Lakk */}
			<FormSection title="Overflate / Lakk">
				<JaNeiGroup value={overflakeLakk} onChange={setOverflakeLakk} />
				<div style={commentSpacerStyle}>
					<FormTextArea value={overflakeLakkComment} onChange={(e) => setOverflakeLakkComment(e.target.value)} placeholder="Kommentar..." style={{ minHeight: '4.5rem' }} />
				</div>
			</FormSection>

			{/* 4. Kontroll målt i element */}
			<FormSection title="Kontroll målt i element">
				<div style={checkListStyle}>
					<CheckOption label="Ja" checked={kontrollMaltElement} onToggle={() => setKontrollMaltElement((v) => !v)} />
				</div>
				<div style={commentSpacerStyle}>
					<FormTextArea value={kontrollMaltElementComment} onChange={(e) => setKontrollMaltElementComment(e.target.value)} placeholder="Kommentar..." style={{ minHeight: '4.5rem' }} />
				</div>
			</FormSection>

			{/* 5. Kontrollert sprosse utfresing grad og dybde */}
			<FormSection title="Kontrollert sprosse utfresing grad og dybde">
				<div style={checkListStyle}>
					<CheckOption label="Ja" checked={sprosseUtfresing} onToggle={() => setSprosseUtfresing((v) => !v)} />
				</div>
				<div style={commentSpacerStyle}>
					<FormTextArea value={sprosseUtfresingComment} onChange={(e) => setSprosseUtfresingComment(e.target.value)} placeholder="Kommentar..." style={{ minHeight: '4.5rem' }} />
				</div>
			</FormSection>

			{/* 6. Kontroll målt sprosse høyde */}
			<FormSection title="Kontroll målt sprosse høyde">
				<div style={checkListStyle}>
					<CheckOption label="Ja" checked={kontrollMaltSprosse} onToggle={() => setKontrollMaltSprosse((v) => !v)} />
				</div>
				<div style={commentSpacerStyle}>
					<FormTextArea value={kontrollMaltSprosseComment} onChange={(e) => setKontrollMaltSprosseComment(e.target.value)} placeholder="Kommentar..." style={{ minHeight: '4.5rem' }} />
				</div>
			</FormSection>

			{/* 7. Limt hjørner og pakninger */}
			<FormSection title="Limt hjørner og pakninger">
				<div style={checkListStyle}>
					<CheckOption label="Ja" checked={limtHjorner} onToggle={() => setLimtHjorner((v) => !v)} />
				</div>
				<div style={commentSpacerStyle}>
					<FormTextArea value={limtHjornerComment} onChange={(e) => setLimtHjornerComment(e.target.value)} placeholder="Kommentar..." style={{ minHeight: '4.5rem' }} />
				</div>
			</FormSection>

			{/* 8. Sammenfoyninger / gjæringer sjekket */}
			<FormSection title="Sammenfoyninger / gjæringer sjekket">
				<div style={checkListStyle}>
					<CheckOption label="Ja" checked={sammenfoyninger} onToggle={() => setSammenfoyninger((v) => !v)} />
				</div>
				<div style={commentSpacerStyle}>
					<FormTextArea value={sammenfoyningerComment} onChange={(e) => setSammenfoyningerComment(e.target.value)} placeholder="Kommentar..." style={{ minHeight: '4.5rem' }} />
				</div>
			</FormSection>

			{/* 9. Gjort klart og pakket sammen med jobben */}
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

			{/* 10. Fugemasse til skjøtestykker */}
			<FormSection title="Fugemasse til skjøtestykker">
				<div style={checkListStyle}>
					<CheckOption label="Ja" checked={fugemasse} onToggle={() => setFugemasse((v) => !v)} />
				</div>
			</FormSection>

			{/* Andre merknader / kommentarer */}
			<FormSection title="Andre merknader / kommentarer:">
				<FormTextArea value={andreMerknader} onChange={(e) => setAndreMerknader(e.target.value)} placeholder="Skriv andre merknader her..." style={{ minHeight: '6rem' }} />
				<div style={commentSpacerStyle}>
					<FormTextArea value={andreMerknaderComment} onChange={(e) => setAndreMerknaderComment(e.target.value)} placeholder="Kommentar..." style={{ minHeight: '4.5rem' }} />
				</div>
			</FormSection>

			{/* Dokumentinformasjon */}
			<FormSection title="Dokumentinformasjon *">
				<FormField label="OPPRETTET AV (TEAM) *" htmlFor="ksf-opprettet-av">
					<FormInput id="ksf-opprettet-av" type="text" value={opprettetAv} onChange={(e) => setOpprettetAv(e.target.value)} placeholder="Team navn..." />
				</FormField>
				<div style={gridStyle}>
					<FormField label="GODKJENT DATO *" htmlFor="ksf-godkjent-dato">
						<FormInput id="ksf-godkjent-dato" type="date" value={godkjentDato} onChange={(e) => setGodkjentDato(e.target.value)} />
					</FormField>
					<FormField label="GODKJENT AV *" htmlFor="ksf-godkjent-av">
						<FormInput id="ksf-godkjent-av" type="text" value={godkjentAv} onChange={(e) => setGodkjentAv(e.target.value)} placeholder="Navn..." />
					</FormField>
				</div>
				<FormField label="VERSJON NR" htmlFor="ksf-versjon">
					<FormInput id="ksf-versjon" type="text" value={versjonNr} onChange={(e) => setVersjonNr(e.target.value)} placeholder="V1.0" />
				</FormField>
			</FormSection>

			{/* Add images */}
			<FormActionButton
				onClick={() =>
					navigate('/image-capture', {
						state: createImageCaptureState({
							contextKey: imageContextKey,
							contextTitle: 'KS Fasade',
							projectContext: { manualProjectEntry, projectNumber, projectName },
							returnNavigation,
						}),
					})
				}
			>
				{imageCount > 0 ? `+ Legg til bilde (${imageCount})` : '+ Legg til bilde'}
			</FormActionButton>

			{/* Submit */}
			<FormActionButton
				variant="dark"
				onClick={() =>
					navigate('/success', {
						state: createSuccessState({
							formTitle: 'KS Fasade',
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
