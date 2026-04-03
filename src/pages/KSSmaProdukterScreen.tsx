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

const FUNKSJON_OPTIONS = ['Ingen funksjon, bilde tatt', 'Funksjon, bilde tatt og beskrives i kommentarfelt'];

const progressHeaderStyle = { display: 'flex', justifyContent: 'space-between', marginBottom: '0.45rem' } as const;
const progressLabelStyle = { fontSize: '0.85rem', fontWeight: 800, color: UI_COLORS.ink500, letterSpacing: '0.07em', textTransform: 'uppercase', fontFamily: BODY_FONT_FAMILY } as const;
const progressValueStyle = { fontSize: '0.85rem', fontWeight: 800, color: UI_COLORS.ink500 } as const;
const progressTrackStyle = { height: '0.55rem', borderRadius: '99px', background: UI_COLORS.line300, overflow: 'hidden' } as const;
const commentSpacerStyle = { marginTop: '0.75rem' } as const;
const sectionHeadingStyle = { margin: '0.45rem 0 0.1rem', fontSize: 'clamp(1.45rem, 3.8vw, 1.95rem)', fontWeight: 900, color: UI_COLORS.ink900 } as const;

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

export default function KSSmaProdukterScreen() {
	const navigate = useNavigate();
	const location = useLocation();
	const state = (location.state as ProjectRouteState | null) ?? null;
	const { manualProjectEntry, projectNumber, projectName } = getProjectContextFromState(state);
	const returnTo = state?.returnTo;
	const returnState = state?.returnState;
	const returnNavigation = { returnTo: location.pathname, returnState: location.state };
	const imageContextKey = createImageContextKey('ks-sma-produkter', projectNumber);
	const imageCount = getImageDraftCount(imageContextKey);

	const [emne, setEmne] = useState('');
	const [posisjonsnummer, setPosisjonsnummer] = useState('');

	const [hvaMontert, setHvaMontert] = useState('');
	const [hvaMontertComment, setHvaMontertComment] = useState('');
	const [modellType, setModellType] = useState('');
	const [modellTypeComment, setModellTypeComment] = useState('');
	const [funksjon, setFunksjon] = useState<string[]>([]);
	const [funksjonComment, setFunksjonComment] = useState('');

	const [opprettetAv, setOpprettetAv] = useState('');
	const [godkjentDato, setGodkjentDato] = useState('');
	const [godkjentAv, setGodkjentAv] = useState('');
	const [versjonNr, setVersjonNr] = useState('V1.0');

	const fremdrift = [
		emne.trim() !== '',
		posisjonsnummer.trim() !== '',
		hvaMontert.trim() !== '',
		modellType.trim() !== '',
		funksjon.length > 0,
	].filter(Boolean).length;

	const total = 5;
	const progress = (fremdrift / total) * 100;

	const toggleMulti = (current: string[], value: string) =>
		current.includes(value) ? current.filter((v) => v !== value) : [...current, value];

	const handleBack = () => (returnTo ? navigate(returnTo, { state: returnState }) : navigate(-1));

	return (
		<FormPage
			title="KS Små produkter"
			subtitle="Dok. nr.: S.40 - Montasje av ting som ikke har eget KS Skjema"
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
				<FormField label="EMNE *" htmlFor="kssp-emne">
					<FormInput id="kssp-emne" type="text" value={emne} onChange={(e) => setEmne(e.target.value)} placeholder="F.eks. Små produkter" />
				</FormField>
				<FormField label="POSISJONS NUMMER *" htmlFor="kssp-posisjonsnummer">
					<FormInput id="kssp-posisjonsnummer" type="text" value={posisjonsnummer} onChange={(e) => setPosisjonsnummer(e.target.value)} placeholder="Posisjonsnummer..." />
				</FormField>
			</FormSection>

			<h2 style={sectionHeadingStyle}>Små-montasje gjennomgang</h2>

			<FormSection title="Hva ble montert: *">
				<FormTextArea value={hvaMontert} onChange={(e) => setHvaMontert(e.target.value)} placeholder="Beskriv hva som ble montert..." style={{ minHeight: '6rem' }} />
				<div style={commentSpacerStyle}>
					<FormField label="KOMMENTAR" htmlFor="kssp-hva-kommentar">
						<FormTextArea id="kssp-hva-kommentar" value={hvaMontertComment} onChange={(e) => setHvaMontertComment(e.target.value)} placeholder="Tilleggskommentar..." style={{ minHeight: '4.5rem' }} />
					</FormField>
				</div>
			</FormSection>

			<FormSection title="Modell / type / etc: *">
				<FormTextArea value={modellType} onChange={(e) => setModellType(e.target.value)} placeholder="Beskriv modell, type, osv..." style={{ minHeight: '6rem' }} />
				<div style={commentSpacerStyle}>
					<FormField label="KOMMENTAR" htmlFor="kssp-modell-kommentar">
						<FormTextArea id="kssp-modell-kommentar" value={modellTypeComment} onChange={(e) => setModellTypeComment(e.target.value)} placeholder="Tilleggskommentar..." style={{ minHeight: '4.5rem' }} />
					</FormField>
				</div>
			</FormSection>

			<FormSection title="Funksjon:">
				<div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
					{FUNKSJON_OPTIONS.map((option) => (
						<CheckOption key={option} label={option} checked={funksjon.includes(option)} onToggle={() => setFunksjon(toggleMulti(funksjon, option))} />
					))}
				</div>
				<div style={commentSpacerStyle}>
					<FormField label="KOMMENTAR" htmlFor="kssp-funksjon-kommentar">
						<FormTextArea id="kssp-funksjon-kommentar" value={funksjonComment} onChange={(e) => setFunksjonComment(e.target.value)} placeholder="Beskriv funksjon..." style={{ minHeight: '4.5rem' }} />
					</FormField>
				</div>
			</FormSection>

			<FormSection title="Dokumentinformasjon *">
				<FormField label="OPPRETTET AV *" htmlFor="kssp-opprettet-av">
					<FormInput id="kssp-opprettet-av" type="text" value={opprettetAv} onChange={(e) => setOpprettetAv(e.target.value)} placeholder="Navn..." />
				</FormField>
				<FormField label="GODKJENT DATO *" htmlFor="kssp-godkjent-dato">
					<FormInput id="kssp-godkjent-dato" type="date" value={godkjentDato} onChange={(e) => setGodkjentDato(e.target.value)} />
				</FormField>
				<FormField label="GODKJENT AV *" htmlFor="kssp-godkjent-av">
					<FormInput id="kssp-godkjent-av" type="text" value={godkjentAv} onChange={(e) => setGodkjentAv(e.target.value)} placeholder="Navn..." />
				</FormField>
				<FormField label="VERSJON NR." htmlFor="kssp-versjon">
					<FormInput id="kssp-versjon" type="text" value={versjonNr} onChange={(e) => setVersjonNr(e.target.value)} placeholder="V1.0" />
				</FormField>
			</FormSection>

			<FormActionButton
				onClick={() =>
					navigate('/image-capture', {
						state: createImageCaptureState({
							contextKey: imageContextKey,
							contextTitle: 'KS Små produkter',
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
							formTitle: 'KS Små produkter',
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
