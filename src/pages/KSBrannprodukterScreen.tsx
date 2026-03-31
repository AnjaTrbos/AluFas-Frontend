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

const progressHeaderStyle = { display: 'flex', justifyContent: 'space-between', marginBottom: '0.45rem' } as const;
const progressLabelStyle = { fontSize: '0.85rem', fontWeight: 800, color: UI_COLORS.ink500, letterSpacing: '0.07em', textTransform: 'uppercase', fontFamily: BODY_FONT_FAMILY } as const;
const progressValueStyle = { fontSize: '0.85rem', fontWeight: 800, color: UI_COLORS.ink500 } as const;
const progressTrackStyle = { height: '0.55rem', borderRadius: '99px', background: UI_COLORS.line300, overflow: 'hidden' } as const;
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(14rem, 1fr))', gap: '1rem' } as const;
const commentSpacerStyle = { marginTop: '0.75rem' } as const;
const subLabelStyle: CSSProperties = { fontSize: '0.95rem', fontWeight: 600, color: UI_COLORS.ink900, margin: '0 0 0.5rem' };
const subItemSpacerStyle = { marginBottom: '1.5rem' } as const;

// Generell informasjon sub-items tracked by whether the text field is filled.
const GEN_LABELS = [
	'0.1 Der',
	'0.2 Vegg',
	'0.3 Posisjon',
	'0.4 Antall',
	'0.5 Profilsystem',
	'0.6 Akse',
	'0.7 Etg.',
	'0.8 Fasade',
	'0.9 Type',
	'0.9X Posisjonsnummer',
] as const;

type TwoOpt = 'left' | 'right' | null;

// Generic two-option radio group used for all binary questions in this form.
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

	// Prosjektinformasjon
	const [emne, setEmne] = useState('');
	const [elementNavn, setElementNavn] = useState('');

	// Generell informasjon (0.1–0.9X) — tracked when text field is filled
	const [genValues, setGenValues] = useState<Record<string, string>>(
		() => Object.fromEntries(GEN_LABELS.map((k) => [k, ''])),
	);
	const [genComments, setGenComments] = useState<Record<string, string>>(
		() => Object.fromEntries(GEN_LABELS.map((k) => [k, ''])),
	);

	// Før montering (1.1–1.3)
	const [fm11, setFm11] = useState<TwoOpt>(null);
	const [fm12, setFm12] = useState<TwoOpt>(null);
	const [fm13, setFm13] = useState<TwoOpt>(null);

	// Montasje (2.1–2.14 tracked; 2.15 text only)
	const [m21, setM21] = useState<TwoOpt>(null);
	const [m22, setM22] = useState<TwoOpt>(null);
	const [m23, setM23] = useState<TwoOpt>(null);
	const [m23Comment, setM23Comment] = useState('');
	const [m24, setM24] = useState<TwoOpt>(null);
	const [m25, setM25] = useState<TwoOpt>(null);
	const [m25Comment, setM25Comment] = useState('');
	const [m26, setM26] = useState<TwoOpt>(null);
	const [m27, setM27] = useState<TwoOpt>(null);
	const [m28, setM28] = useState<TwoOpt>(null);
	const [m29, setM29] = useState<TwoOpt>(null);
	const [m210, setM210] = useState<TwoOpt>(null);
	const [m211, setM211] = useState<TwoOpt>(null);
	const [m211Comment, setM211Comment] = useState('');
	const [m212, setM212] = useState<TwoOpt>(null);
	const [m212Comment, setM212Comment] = useState('');
	const [m213, setM213] = useState<TwoOpt>(null);
	const [m213Comment, setM213Comment] = useState('');
	const [m214, setM214] = useState<TwoOpt>(null);
	const [m214Comment, setM214Comment] = useState('');
	const [m215, setM215] = useState('');

	// Feil / Skader (not tracked)
	const [feil31, setFeil31] = useState('');
	const [feil31Comment, setFeil31Comment] = useState('');
	const [feil32, setFeil32] = useState('');
	const [feil32Comment, setFeil32Comment] = useState('');

	// Dokumentinformasjon
	const [opprettetAv, setOpprettetAv] = useState('');
	const [godkjentDato, setGodkjentDato] = useState('');
	const [godkjentAv, setGodkjentAv] = useState('');
	const [versjonNr, setVersjonNr] = useState('');

	// Progress: 10 gen fields + 3 fm + 14 montasje = 27
	const fremdrift = [
		...GEN_LABELS.map((k) => genValues[k].trim() !== ''),
		fm11 !== null, fm12 !== null, fm13 !== null,
		m21 !== null, m22 !== null, m23 !== null, m24 !== null, m25 !== null,
		m26 !== null, m27 !== null, m28 !== null, m29 !== null, m210 !== null,
		m211 !== null, m212 !== null, m213 !== null, m214 !== null,
	].filter(Boolean).length;

	const total = 27;
	const progress = (fremdrift / total) * 100;

	const handleBack = () => (returnTo ? navigate(returnTo, { state: returnState }) : navigate(-1));

	return (
		<FormPage
			title="KS Brannprodukter"
			subtitle="Dok. nr.: S.03 - Sjekkliste montasje av brannprodukter"
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
				<FormField label="EMNE *" htmlFor="ksbp-emne">
					<FormInput id="ksbp-emne" type="text" value={emne} onChange={(e) => setEmne(e.target.value)} placeholder="F.eks. Branndør" />
				</FormField>
				<FormField label="ELEMENT NAVN/NR. PÅ MONTERT PRODUKT *" htmlFor="ksbp-element">
					<FormInput id="ksbp-element" type="text" value={elementNavn} onChange={(e) => setElementNavn(e.target.value)} placeholder="Element navn eller nummer" />
				</FormField>
			</FormSection>

			{/* Generell informasjon */}
			<FormSection title="Generell informasjon">
				{GEN_LABELS.map((label, idx) => (
					<div key={label} style={idx < GEN_LABELS.length - 1 ? subItemSpacerStyle : undefined}>
						<p style={subLabelStyle}>{label}</p>
						<FormInput
							type="text"
							value={genValues[label]}
							onChange={(e) => setGenValues((prev) => ({ ...prev, [label]: e.target.value }))}
							placeholder="..."
						/>
						<div style={commentSpacerStyle}>
							<FormTextArea
								value={genComments[label]}
								onChange={(e) => setGenComments((prev) => ({ ...prev, [label]: e.target.value }))}
								placeholder="Kommentar..."
								style={{ minHeight: '4rem' }}
							/>
						</div>
					</div>
				))}
			</FormSection>

			{/* Før montering */}
			<FormSection title="Før montering">
				<div style={subItemSpacerStyle}>
					<p style={subLabelStyle}>1.1 Lakk ok:</p>
					<TwoOptionGroup left="Ja" right="Nei, avvik sendt" value={fm11} onChange={setFm11} />
				</div>
				<div style={subItemSpacerStyle}>
					<p style={subLabelStyle}>1.2 Kontrollmålt utvendig, Åpningsmål OK, +/-20mm</p>
					<TwoOptionGroup left="OK" right="Nei, avvik sendt" value={fm12} onChange={setFm12} />
				</div>
				<div>
					<p style={subLabelStyle}>1.3 Sjekket sammenfoyninger</p>
					<TwoOptionGroup left="Ja" right="Nei, avvik sendt på dårlige sammenføyninger" value={fm13} onChange={setFm13} />
				</div>
			</FormSection>

			{/* Montasje */}
			<FormSection title="Montasje">
				<div style={subItemSpacerStyle}>
					<p style={subLabelStyle}>2.1 Riktig antall innfestings skruer brukt</p>
					<TwoOptionGroup left="Ja" right="Nei, avvik sendt" value={m21} onChange={setM21} />
				</div>
				<div style={subItemSpacerStyle}>
					<p style={subLabelStyle}>2.2 Drenert</p>
					<TwoOptionGroup left="OK" right="Nei, avvik sendt" value={m22} onChange={setM22} />
				</div>
				<div style={subItemSpacerStyle}>
					<p style={subLabelStyle}>2.3 Lås montert, funksjon ok? Type lås beskrives!</p>
					<TwoOptionGroup left="Ja" right="Nei, avvik sendt" value={m23} onChange={setM23} />
					<div style={commentSpacerStyle}>
						<FormTextArea value={m23Comment} onChange={(e) => setM23Comment(e.target.value)} placeholder="Kommentar..." style={{ minHeight: '4rem' }} />
					</div>
				</div>
				<div style={subItemSpacerStyle}>
					<p style={subLabelStyle}>2.4 Sluttstykke montert?</p>
					<TwoOptionGroup left="Ja" right="Nei, avvik sendt" value={m24} onChange={setM24} />
				</div>
				<div style={subItemSpacerStyle}>
					<p style={subLabelStyle}>2.5 Fallkolbens inngrep</p>
					<TwoOptionGroup left="EI30, 7mm" right="EI60 11mm" value={m25} onChange={setM25} />
					<div style={commentSpacerStyle}>
						<FormTextArea value={m25Comment} onChange={(e) => setM25Comment(e.target.value)} placeholder="Kommentar..." style={{ minHeight: '4rem' }} />
					</div>
				</div>
				<div style={subItemSpacerStyle}>
					<p style={subLabelStyle}>2.6 Slagreming sjekket</p>
					<TwoOptionGroup left="Ja" right="Nei, avvik sendt" value={m26} onChange={setM26} />
				</div>
				<div style={subItemSpacerStyle}>
					<p style={subLabelStyle}>2.7 Pumpe montert og innstilt riktig</p>
					<TwoOptionGroup left="Ja" right="Nei, avvik sendt" value={m27} onChange={setM27} />
				</div>
				<div style={subItemSpacerStyle}>
					<p style={subLabelStyle}>2.8 Godkjent glass og beskrivelse av glass</p>
					<TwoOptionGroup left="Ja" right="Nei, avvik sendt" value={m28} onChange={setM28} />
				</div>
				<div style={subItemSpacerStyle}>
					<p style={subLabelStyle}>2.9 Klosser under glass som er 2-3mm bredere enn glasset. Sentrert midt under glasset.</p>
					<TwoOptionGroup left="Ja" right="Nei, avvik sendt" value={m29} onChange={setM29} />
				</div>
				<div style={subItemSpacerStyle}>
					<p style={subLabelStyle}>2.10 Dyttet med Steinull</p>
					<TwoOptionGroup left="Ja" right="Nei, avvik sendt" value={m210} onChange={setM210} />
				</div>
				<div style={subItemSpacerStyle}>
					<p style={subLabelStyle}>2.11 Fuges 2-sider</p>
					<TwoOptionGroup left="OK" right="Nei, avvik sendt" value={m211} onChange={setM211} />
					<div style={commentSpacerStyle}>
						<FormTextArea value={m211Comment} onChange={(e) => setM211Comment(e.target.value)} placeholder="Kommentar..." style={{ minHeight: '4rem' }} />
					</div>
				</div>
				<div style={subItemSpacerStyle}>
					<p style={subLabelStyle}>2.12 Brannskilt merket Aluminium Fasader As</p>
					<TwoOptionGroup left="Ja" right="Nei, avvik sendt" value={m212} onChange={setM212} />
					<div style={commentSpacerStyle}>
						<FormTextArea value={m212Comment} onChange={(e) => setM212Comment(e.target.value)} placeholder="Kommentar..." style={{ minHeight: '4rem' }} />
					</div>
				</div>
				<div style={subItemSpacerStyle}>
					<p style={subLabelStyle}>2.13 Profiler og glass er skikkelig rengjort for silikon og smuss</p>
					<TwoOptionGroup left="Ja" right="Nei, avvik sendt" value={m213} onChange={setM213} />
					<div style={commentSpacerStyle}>
						<FormTextArea value={m213Comment} onChange={(e) => setM213Comment(e.target.value)} placeholder="Kommentar..." style={{ minHeight: '4rem' }} />
					</div>
				</div>
				<div style={subItemSpacerStyle}>
					<p style={subLabelStyle}>2.14 Rengjort på stedet</p>
					<TwoOptionGroup left="Ja" right="Nei, avvik sendt" value={m214} onChange={setM214} />
					<div style={commentSpacerStyle}>
						<FormTextArea value={m214Comment} onChange={(e) => setM214Comment(e.target.value)} placeholder="Kommentar..." style={{ minHeight: '4rem' }} />
					</div>
				</div>
				<div>
					<p style={subLabelStyle}>2.15 Annet å bemerke</p>
					<FormTextArea value={m215} onChange={(e) => setM215(e.target.value)} placeholder="Skriv andre merknader her..." style={{ minHeight: '6rem' }} />
				</div>
			</FormSection>

			{/* Feil / Skader */}
			<FormSection title="Feil / Skader">
				<div style={subItemSpacerStyle}>
					<p style={subLabelStyle}>3.1 Hva er feil / skadet?</p>
					<FormTextArea value={feil31} onChange={(e) => setFeil31(e.target.value)} placeholder="Beskriv feil eller skader..." style={{ minHeight: '6rem' }} />
					<div style={commentSpacerStyle}>
						<FormTextArea value={feil31Comment} onChange={(e) => setFeil31Comment(e.target.value)} placeholder="Kommentar..." style={{ minHeight: '4rem' }} />
					</div>
				</div>
				<div>
					<p style={subLabelStyle}>3.2 Feil eller skader som er utbedret:</p>
					<FormTextArea value={feil32} onChange={(e) => setFeil32(e.target.value)} placeholder="Beskriv utbedringer..." style={{ minHeight: '6rem' }} />
					<div style={commentSpacerStyle}>
						<FormTextArea value={feil32Comment} onChange={(e) => setFeil32Comment(e.target.value)} placeholder="Kommentar..." style={{ minHeight: '4rem' }} />
					</div>
				</div>
			</FormSection>

			{/* Dokumentinformasjon */}
			<FormSection title="Dokumentinformasjon *">
				<FormField label="OPPRETTET AV (TEAM) *" htmlFor="ksbp-opprettet-av">
					<FormInput id="ksbp-opprettet-av" type="text" value={opprettetAv} onChange={(e) => setOpprettetAv(e.target.value)} placeholder="Team navn..." />
				</FormField>
				<div style={gridStyle}>
					<FormField label="GODKJENT DATO *" htmlFor="ksbp-godkjent-dato">
						<FormInput id="ksbp-godkjent-dato" type="date" value={godkjentDato} onChange={(e) => setGodkjentDato(e.target.value)} />
					</FormField>
					<FormField label="GODKJENT AV *" htmlFor="ksbp-godkjent-av">
						<FormInput id="ksbp-godkjent-av" type="text" value={godkjentAv} onChange={(e) => setGodkjentAv(e.target.value)} placeholder="Navn..." />
					</FormField>
				</div>
				<FormField label="VERSJON NR" htmlFor="ksbp-versjon">
					<FormInput id="ksbp-versjon" type="text" value={versjonNr} onChange={(e) => setVersjonNr(e.target.value)} placeholder="V1.0" />
				</FormField>
			</FormSection>

			{/* Add images */}
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

			{/* Submit */}
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
