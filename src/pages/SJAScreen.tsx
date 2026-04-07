import { useState } from 'react';
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

const NUM_HENDELSER = 8;

// Criteria for when a SJA is required — at least one must apply
const SJA_KRITERIER = [
	'Arbeidet defineres som risikabelt og annen risikoanalyse er ikke utført og etablert',
	'Arbeidet defineres som risikabelt og arbeidsbeskrivelsen avviker fra fast prosedyre',
	'Arbeidet defineres som risikabelt og arbeidet utføres sjelden/første gang',
];

interface Hendelse {
	hendelse: string;
	tiltak: string;
	utfort: boolean;
}

function makeHendelser(): Hendelse[] {
	return Array.from({ length: NUM_HENDELSER }, () => ({ hendelse: '', tiltak: '', utfort: false }));
}

// ---------- small sub-components ----------

// Circular radio-style toggle used for SJA criteria
function KriteriumRow({
	label,
	checked,
	onToggle,
}: {
	label: string;
	checked: boolean;
	onToggle: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onToggle}
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: '1rem',
				width: '100%',
				background: checked ? `${UI_COLORS.accentBlue}12` : UI_COLORS.surface0,
				border: `1.5px solid ${checked ? UI_COLORS.accentBlue : UI_COLORS.line300}`,
				borderRadius: '0.9rem',
				padding: '0.95rem 1rem',
				cursor: 'pointer',
				textAlign: 'left',
				marginBottom: '0.6rem',
			}}
			aria-pressed={checked}
		>
			{/* Circular indicator */}
			<span
				style={{
					flexShrink: 0,
					width: '1.5rem',
					height: '1.5rem',
					borderRadius: '50%',
					border: `2px solid ${checked ? UI_COLORS.accentBlue : UI_COLORS.line300}`,
					background: checked ? UI_COLORS.accentBlue : UI_COLORS.surface0,
					display: 'inline-flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				{checked ? <Check width={10} height={10} color="#ffffff" strokeWidth={3.5} /> : null}
			</span>
			<span
				style={{
					fontSize: 'clamp(0.98rem, 2.6vw, 1.08rem)',
					fontWeight: 700,
					color: UI_COLORS.ink900,
					fontFamily: BODY_FONT_FAMILY,
					lineHeight: 1.4,
				}}
			>
				{label}
			</span>
		</button>
	);
}

// Confirmation checkbox row (Bekreftelse)
function BekreftelsesRow({
	label,
	checked,
	onToggle,
}: {
	label: string;
	checked: boolean;
	onToggle: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onToggle}
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: '1rem',
				width: '100%',
				background: checked ? `${UI_COLORS.successGreen}12` : UI_COLORS.surface0,
				border: `1.5px solid ${checked ? UI_COLORS.successGreen : UI_COLORS.line300}`,
				borderRadius: '0.9rem',
				padding: '0.95rem 1rem',
				cursor: 'pointer',
				textAlign: 'left',
				marginBottom: '0.6rem',
			}}
			aria-pressed={checked}
		>
			<span
				style={{
					flexShrink: 0,
					width: '1.5rem',
					height: '1.5rem',
					borderRadius: '50%',
					border: `2px solid ${checked ? UI_COLORS.successGreen : UI_COLORS.line300}`,
					background: checked ? UI_COLORS.successGreen : UI_COLORS.surface0,
					display: 'inline-flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				{checked ? <Check width={10} height={10} color="#ffffff" strokeWidth={3.5} /> : null}
			</span>
			<span
				style={{
					fontSize: 'clamp(0.98rem, 2.6vw, 1.08rem)',
					fontWeight: 700,
					color: UI_COLORS.ink900,
					fontFamily: BODY_FONT_FAMILY,
				}}
			>
				{label}
			</span>
		</button>
	);
}

// Single "Utført" pill-toggle for a hendelse card header
function UtfortToggle({ active, onToggle }: { active: boolean; onToggle: () => void }) {
	return (
		<button
			type="button"
			onClick={onToggle}
			aria-pressed={active}
			style={{
				display: 'inline-flex',
				alignItems: 'center',
				gap: '0.45rem',
				padding: '0.35rem 0.85rem',
				borderRadius: '99px',
				border: `1.5px solid ${active ? UI_COLORS.successGreen : UI_COLORS.line300}`,
				background: active ? `${UI_COLORS.successGreen}18` : UI_COLORS.surface0,
				cursor: 'pointer',
				flexShrink: 0,
			}}
		>
			{/* Indicator dot */}
			<span
				style={{
					width: '0.7rem',
					height: '0.7rem',
					borderRadius: '50%',
					background: active ? UI_COLORS.successGreen : UI_COLORS.line300,
					display: 'inline-block',
				}}
			/>
			<span
				style={{
					fontSize: '0.9rem',
					fontWeight: 800,
					color: active ? UI_COLORS.successGreen : UI_COLORS.ink400,
					fontFamily: BODY_FONT_FAMILY,
				}}
			>
				Utført
			</span>
		</button>
	);
}

// ---------- main screen ----------

export default function SJAScreen() {
	const navigate = useNavigate();
	const location = useLocation();
	const state = (location.state as ProjectRouteState | null) ?? null;
	const { manualProjectEntry, projectNumber, projectName } = getProjectContextFromState(state);
	const returnTo = state?.returnTo;
	const returnState = state?.returnState;
	const returnNavigation = { returnTo: location.pathname, returnState: location.state };
	const imageContextKey = createImageContextKey('sja', projectNumber);
	const imageCount = getImageDraftCount(imageContextKey);

	// Grunnleggende informasjon
	const [emne, setEmne] = useState('');

	// SJA gjennomgang — multi-select criteria
	const [kriterierChecked, setKriterierChecked] = useState<boolean[]>(SJA_KRITERIER.map(() => false));
	const [gjennomgangKommentar, setGjennomgangKommentar] = useState('');

	// Bekreftelse
	const [bekreftet, setBekreftet] = useState(false);
	const [bekreftelseKommentar, setBekreftelseKommentar] = useState('');

	// Operasjon og ansvarlige
	const [operasjon, setOperasjon] = useState('');
	const [utfortAv, setUtfortAv] = useState('');

	// Uønskede hendelser og tiltak
	const [hendelser, setHendelser] = useState<Hendelse[]>(makeHendelser);

	// Dokumentinformasjon
	const [opprettetAv, setOpprettetAv] = useState('');
	const [godkjentDato, setGodkjentDato] = useState('');
	const [godkjentAv, setGodkjentAv] = useState('');

	// Progress: count hendelser marked as Utført
	const utfortCount = hendelser.filter((h) => h.utfort).length;
	const progress = (utfortCount / NUM_HENDELSER) * 100;

	const toggleKriterium = (index: number) => {
		setKriterierChecked((prev) => prev.map((v, i) => (i === index ? !v : v)));
	};

	const updateHendelse = (index: number, field: keyof Hendelse, value: string | boolean) => {
		setHendelser((prev) =>
			prev.map((h, i) => (i === index ? { ...h, [field]: value } : h)),
		);
	};

	const handleBack = () => (returnTo ? navigate(returnTo, { state: returnState }) : navigate(-1));

	const progressHeaderStyle = { display: 'flex', justifyContent: 'space-between', marginBottom: '0.45rem' } as const;
	const progressLabelStyle = { fontSize: '0.85rem', fontWeight: 800, color: UI_COLORS.ink500, letterSpacing: '0.07em', textTransform: 'uppercase' as const, fontFamily: BODY_FONT_FAMILY } as const;
	const progressValueStyle = { fontSize: '0.85rem', fontWeight: 800, color: UI_COLORS.ink500 } as const;
	const progressTrackStyle = { height: '0.55rem', borderRadius: '99px', background: `${UI_COLORS.line300}55`, overflow: 'hidden' } as const;

	return (
		<FormPage
			title="SJA - Sikker Jobbanalyse"
			subtitle="Risikovurdering for arbeidsoppgave"
			onBack={handleBack}
			projectNumber={projectNumber}
			projectName={projectName}
		>
			{/* Progress bar — tracks hendelse completion */}
			<div>
				<div style={progressHeaderStyle}>
					<span style={progressLabelStyle}>RISIKO ANALYSE FREMDRIFT</span>
					<span style={progressValueStyle}>{utfortCount} / {NUM_HENDELSER}</span>
				</div>
				<div style={progressTrackStyle}>
					<div style={{ height: '100%', width: `${progress}%`, background: UI_COLORS.accentBlue, borderRadius: '99px', transition: 'width 0.3s ease' }} />
				</div>
			</div>

			{/* Intro description card */}
			<div
				style={{
					borderRadius: '1rem',
					border: `1.5px solid ${UI_COLORS.line300}`,
					background: UI_COLORS.surface0,
					padding: '1rem 1.1rem',
				}}
			>
				<p style={{ margin: 0, fontSize: 'clamp(0.98rem, 2.6vw, 1.08rem)', fontWeight: 600, color: UI_COLORS.ink800, lineHeight: 1.55 }}>
					Sikker jobbanalyse (SJA) er en enkel risikovurdering knyttet til en spesifikk arbeidsoppgave eller aktivitet.
				</p>
			</div>

			{/* Grunnleggende informasjon */}
			<FormSection title="Grunnleggende informasjon">
				<FormField label="EMNE / ARBEIDSOPPGAVE *" htmlFor="sja-emne">
					<FormTextArea
						id="sja-emne"
						value={emne}
						onChange={(e) => setEmne(e.target.value)}
						placeholder="Beskriv emne/oppgave..."
						aria-label="EMNE / ARBEIDSOPPGAVE"
					/>
				</FormField>
			</FormSection>

			{/* SJA Gjennomgang */}
			<FormSection title="SJA Gjennomgang *">
				<p style={{ margin: '0 0 1rem', fontSize: 'clamp(0.95rem, 2.5vw, 1.05rem)', fontWeight: 600, color: UI_COLORS.ink800, lineHeight: 1.5 }}>
					Sikker Jobbanalyse benyttes når arbeidet oppfyller{' '}
					<strong>minst ett</strong> av kriteriene under:
				</p>
				{SJA_KRITERIER.map((kriterium, index) => (
					<KriteriumRow
						key={kriterium}
						label={kriterium}
						checked={kriterierChecked[index]}
						onToggle={() => toggleKriterium(index)}
					/>
				))}
				<div style={{ marginTop: '0.4rem' }}>
					<FormField label="KOMMENTAR" htmlFor="sja-gjennomgang-kommentar">
						<FormTextArea
							id="sja-gjennomgang-kommentar"
							value={gjennomgangKommentar}
							onChange={(e) => setGjennomgangKommentar(e.target.value)}
							placeholder="Kommentar..."
						/>
					</FormField>
				</div>
			</FormSection>

			{/* Bekreftelse */}
			<FormSection title="Bekreftelse *">
				<p style={{ margin: '0 0 1rem', fontSize: 'clamp(0.95rem, 2.5vw, 1.05rem)', fontWeight: 600, color: UI_COLORS.ink800, lineHeight: 1.5 }}>
					Risikovurderingen Sikker Jobbanalyse har blitt gjennomgått av alle involvert før arbeidet starter.
				</p>
				<BekreftelsesRow
					label="Ja, gjennomgått med alle involvert"
					checked={bekreftet}
					onToggle={() => setBekreftet((v) => !v)}
				/>
				<div style={{ marginTop: '0.4rem' }}>
					<FormField label="KOMMENTAR" htmlFor="sja-bekreftelse-kommentar">
						<FormTextArea
							id="sja-bekreftelse-kommentar"
							value={bekreftelseKommentar}
							onChange={(e) => setBekreftelseKommentar(e.target.value)}
							placeholder="Kommentar..."
						/>
					</FormField>
				</div>
			</FormSection>

			{/* Operasjon og ansvarlige */}
			<FormSection title="Operasjon og ansvarlige">
				<FormField label="OPERASJON / ARBEIDSOMRÅDE *" htmlFor="sja-operasjon">
					<p style={{ margin: '0 0 0.6rem', fontSize: '0.95rem', fontWeight: 600, color: UI_COLORS.ink500 }}>
						Risikovurderingen gjelder for følgende operasjon:
					</p>
					<FormTextArea
						id="sja-operasjon"
						value={operasjon}
						onChange={(e) => setOperasjon(e.target.value)}
						placeholder="Beskriv operasjon..."
					/>
				</FormField>
				<FormField label="UTFØRT AV (PERSONER) *" htmlFor="sja-utfort-av">
					<p style={{ margin: '0 0 0.6rem', fontSize: '0.95rem', fontWeight: 600, color: UI_COLORS.ink500 }}>
						Risikovurderingen er utført av følgende personer:
					</p>
					<FormTextArea
						id="sja-utfort-av"
						value={utfortAv}
						onChange={(e) => setUtfortAv(e.target.value)}
						placeholder="Liste personer..."
					/>
				</FormField>
			</FormSection>

			{/* Uønskede hendelser og tiltak */}
			<FormSection title="Uønskede hendelser og tiltak">
				<p style={{ margin: '0 0 1rem', fontSize: 'clamp(0.95rem, 2.5vw, 1.05rem)', fontWeight: 600, color: UI_COLORS.ink800, lineHeight: 1.5 }}>
					Fyll inn uønskede hendelser, tiltak/kontrollpunkt for å hindre at disse oppstår, og kvitter for at tiltaket er iverksatt.
				</p>
				<div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
					{hendelser.map((h, index) => (
						<div
							key={index}
							style={{
								border: `1.5px solid ${h.utfort ? UI_COLORS.successGreen : UI_COLORS.line300}`,
								borderRadius: '1rem',
								background: h.utfort ? `${UI_COLORS.successGreen}08` : UI_COLORS.surface0,
								padding: '1rem 1rem 0.5rem',
								transition: 'border-color 0.2s, background 0.2s',
							}}
						>
							{/* Card header */}
							<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
								<span style={{ fontSize: 'clamp(1rem, 2.8vw, 1.15rem)', fontWeight: 900, color: UI_COLORS.ink900, fontFamily: BODY_FONT_FAMILY }}>
									Hendelse #{index + 1}
								</span>
								<UtfortToggle
									active={h.utfort}
									onToggle={() => updateHendelse(index, 'utfort', !h.utfort)}
								/>
							</div>
							<FormField label="UØNSKET HENDELSE" htmlFor={`sja-hendelse-${index}`}>
								<FormTextArea
									id={`sja-hendelse-${index}`}
									value={h.hendelse}
									onChange={(e) => updateHendelse(index, 'hendelse', e.target.value)}
									placeholder="Beskriv hendelse..."
								/>
							</FormField>
							<FormField label="TILTAK / KONTROLLPUNKT" htmlFor={`sja-tiltak-${index}`}>
								<FormTextArea
									id={`sja-tiltak-${index}`}
									value={h.tiltak}
									onChange={(e) => updateHendelse(index, 'tiltak', e.target.value)}
									placeholder="Beskriv tiltak..."
								/>
							</FormField>
						</div>
					))}
				</div>
			</FormSection>

			{/* Dokumentinformasjon */}
			<FormSection title="Dokumentinformasjon *">
				<FormField label="OPPRETTET AV (TEAM) *" htmlFor="sja-opprettet-av">
					<FormInput
						id="sja-opprettet-av"
						type="text"
						value={opprettetAv}
						onChange={(e) => setOpprettetAv(e.target.value)}
						placeholder="Team navn..."
					/>
				</FormField>
				<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(12rem, 1fr))', gap: '1rem' }}>
					<FormField label="GODKJENT DATO *" htmlFor="sja-godkjent-dato">
						<FormInput
							id="sja-godkjent-dato"
							type="date"
							value={godkjentDato}
							onChange={(e) => setGodkjentDato(e.target.value)}
						/>
					</FormField>
					<FormField label="GODKJENT AV *" htmlFor="sja-godkjent-av">
						<FormInput
							id="sja-godkjent-av"
							type="text"
							value={godkjentAv}
							onChange={(e) => setGodkjentAv(e.target.value)}
							placeholder="Navn..."
						/>
					</FormField>
				</div>
			</FormSection>

			{/* Add image */}
			<FormActionButton
				onClick={() =>
					navigate('/image-capture', {
						state: createImageCaptureState({
							contextKey: imageContextKey,
							contextTitle: 'SJA - Sikker Jobbanalyse',
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
							formTitle: 'SJA - Sikker Jobbanalyse',
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
