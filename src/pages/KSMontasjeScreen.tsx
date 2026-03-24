import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check, Save, X } from 'lucide-react';
import {
	FormActionButton,
	FormField,
	FormPage,
	FormSection,
	formInputStyle,
	formTextAreaStyle,
} from '../components/forms/FormLayout';
import { createImageContextKey, getImageDraftCount } from '../utils/imageDrafts';

interface KSMontasjeLocationState {
	manualProjectEntry?: boolean;
	projectNumber?: string;
	projectName?: string;
	montasjeType?: string;
	returnTo?: string;
	returnState?: unknown;
}

interface Kontrollpunkt {
	id: string;
	label: string;
}

const KONTROLLPUNKTER: Kontrollpunkt[] = [
	{ id: 'lakk-overflate', label: 'Lakk / overflate' },
	{ id: 'maal-utvendig', label: 'Mål kontroller (utvendig)' },
	{ id: 'gjeringer', label: 'Gjeringer' },
	{ id: 'sammenfoyninger', label: 'Sammenføyninger' },
	{ id: 'limt-pakking', label: 'Limt pakking' },
	{ id: 'drenert', label: 'Drenert' },
	{ id: 'glass-korrekt', label: 'Glass korrekt montert' },
	{ id: 'glass-overklosset', label: 'Glass litt overklosset' },
	{ id: 'laas-montert', label: 'Lås montert' },
	{ id: 'frest-laasebeslag', label: 'Frest korrekt for låsebeslag' },
	{ id: 'slageretning', label: 'Slageretning korrekt' },
	{ id: 'doer-testet', label: 'Dør testet / funksjon OK' },
	{ id: 'profiler-rengjort', label: 'Profiler/glass rengjort' },
	{ id: 'skummet', label: 'Skummet' },
	{ id: 'fuget', label: 'Fuget' },
	{ id: 'teipet', label: 'Teipet' },
];

type PunktState = 'ok' | 'not-ok' | null;

function RowToggle({
	selected,
	onSelect,
}: {
	selected: PunktState;
	onSelect: (value: PunktState) => void;
}) {
	const boxStyle = (variant: 'ok' | 'not-ok', isActive: boolean): React.CSSProperties => ({
		width: '2.45rem',
		height: '2.45rem',
		borderRadius: '0.62rem',
		border: `2px solid ${isActive ? (variant === 'ok' ? '#0f172a' : '#dc2626') : '#cbd5e1'}`,
		background: isActive ? (variant === 'ok' ? '#0f172a' : '#ef4444') : '#ffffff',
		cursor: 'pointer',
		padding: 0,
		flexShrink: 0,
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center',
	});

	return (
		<div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
			<button type="button" onClick={() => onSelect(selected === 'ok' ? null : 'ok')} style={boxStyle('ok', selected === 'ok')} aria-label="OK">
				{selected === 'ok' ? <Check width={18} height={18} color="#ffffff" strokeWidth={3} /> : null}
			</button>
			<button type="button" onClick={() => onSelect(selected === 'not-ok' ? null : 'not-ok')} style={boxStyle('not-ok', selected === 'not-ok')} aria-label="Ikke OK">
				{selected === 'not-ok' ? <X width={18} height={18} color="#ffffff" strokeWidth={3} /> : null}
			</button>
		</div>
	);
}

export default function KSMontasjeScreen() {
	const navigate = useNavigate();
	const location = useLocation();
	const state = (location.state as KSMontasjeLocationState | null) ?? null;

	const projectNumber = state?.projectNumber ?? 'AF-2024-001';
	const projectName = state?.projectName ?? 'Elkjøp Hercules';
	const montasjeType = state?.montasjeType ?? 'Vindu montasje';
	const returnTo = state?.returnTo;
	const returnState = state?.returnState;
	const imageContextKey = createImageContextKey(`ks-montasje:${montasjeType}`, projectNumber);
	const imageCount = getImageDraftCount(imageContextKey);

	const [posisjonsnummer, setPosisjonsnummer] = useState('');
	const [feilskaderUtbedret, setFeilskaderUtbedret] = useState('');
	const [andreMerknader, setAndreMerknader] = useState('');
	const [signaturNavn, setSignaturNavn] = useState('');
	const [signaturDato, setSignaturDato] = useState('');
	const [punktVerdier, setPunktVerdier] = useState<Record<string, PunktState>>({});
	const [punktMerknader, setPunktMerknader] = useState<Record<string, string>>({});

	const subtitle = useMemo(() => `${montasjeType} kontroll`, [montasjeType]);

	const setPunkt = (punktId: string, value: PunktState) => {
		setPunktVerdier((current) => ({ ...current, [punktId]: value }));
	};

	const setPunktMerknad = (punktId: string, value: string) => {
		setPunktMerknader((current) => ({ ...current, [punktId]: value }));
	};

	const merknadInputStyle: React.CSSProperties = {
		...formInputStyle,
		minHeight: '3rem',
		fontSize: 'clamp(0.95rem, 2.4vw, 1.02rem)',
	};

	return (
		<FormPage
			title={`KS ${montasjeType}`}
			subtitle={subtitle}
			onBack={() => {
				if (returnTo) {
					navigate(returnTo, { state: returnState });
					return;
				}

				navigate(-1);
			}}
			projectNumber={projectNumber}
			projectName={projectName}
		>
			<FormSection title="Posnr.">
				<FormField label="Posisjonsnummer" htmlFor="ksm-posisjonsnummer">
					<input id="ksm-posisjonsnummer" type="text" value={posisjonsnummer} onChange={(event) => setPosisjonsnummer(event.target.value)} placeholder="Posisjonsnummer" style={formInputStyle} />
				</FormField>
			</FormSection>

			<FormSection title="KONTROLLPUNKTER">
				<p style={{ margin: '0 0 1rem', fontSize: '1.05rem', fontWeight: 700, color: '#64748b' }}>Kryss av OK / Ikke OK / og før evt. merknad</p>
				<div style={{ border: '2px solid #1e293b', borderRadius: '1rem', overflow: 'hidden', background: '#ffffff' }}>
					{KONTROLLPUNKTER.map((punkt, index) => {
						const selected = punktVerdier[punkt.id] ?? null;
						const showMerknad = selected === 'not-ok';

						return (
							<div
								key={punkt.id}
								style={{
									padding: '0.95rem 0.9rem',
									borderBottom: index === KONTROLLPUNKTER.length - 1 ? 'none' : '1.5px solid #d2dae6',
								}}
							>
								<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
									<span style={{ fontSize: 'clamp(0.98rem, 2.7vw, 1.1rem)', fontWeight: 800, color: '#0f172a' }}>{punkt.label}</span>
									<RowToggle selected={selected} onSelect={(value) => setPunkt(punkt.id, value)} />
								</div>

								{showMerknad ? (
									<div style={{ marginTop: '0.85rem' }}>
										<input
											type="text"
											value={punktMerknader[punkt.id] ?? ''}
											onChange={(event) => setPunktMerknad(punkt.id, event.target.value)}
											placeholder="Merknad..."
											aria-label={`Merknad for ${punkt.label}`}
											style={merknadInputStyle}
										/>
									</div>
								) : null}
							</div>
						);
					})}
				</div>
			</FormSection>

			<FormSection title="Feilskader utbedret:">
				<FormField label="Feilskader utbedret" htmlFor="ksm-feilskader-utbedret">
					<textarea id="ksm-feilskader-utbedret" value={feilskaderUtbedret} onChange={(event) => setFeilskaderUtbedret(event.target.value)} placeholder="Beskriv utbedrede feilskader..." style={formTextAreaStyle} />
				</FormField>
			</FormSection>

			<FormSection title="Andre mangler / merknader:">
				<FormField label="Andre mangler / merknader" htmlFor="ksm-andre-merknader">
					<textarea id="ksm-andre-merknader" value={andreMerknader} onChange={(event) => setAndreMerknader(event.target.value)} placeholder="Andre merknader..." style={formTextAreaStyle} />
				</FormField>
			</FormSection>

			<FormSection title="SIGNATUR">
				<FormField label="Montør signatur:" htmlFor="ksm-signatur-navn">
					<input id="ksm-signatur-navn" type="text" value={signaturNavn} onChange={(event) => setSignaturNavn(event.target.value)} placeholder="Navn" style={formInputStyle} />
				</FormField>
				<FormField label="Dato:" htmlFor="ksm-signatur-dato">
					<input id="ksm-signatur-dato" type="text" value={signaturDato} onChange={(event) => setSignaturDato(event.target.value)} placeholder="mm/dd/yyyy" style={formInputStyle} />
				</FormField>
			</FormSection>

			<FormActionButton
				onClick={() =>
					navigate('/image-capture', {
						state: {
							contextKey: imageContextKey,
							contextTitle: montasjeType,
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
							formTitle: montasjeType,
							returnTo: location.pathname,
							returnState: location.state,
						},
					})
				}
				icon={<Save width={22} height={22} color="#ffffff" strokeWidth={2.5} />}
			>
				Send skjema
			</FormActionButton>
		</FormPage>
	);
}
