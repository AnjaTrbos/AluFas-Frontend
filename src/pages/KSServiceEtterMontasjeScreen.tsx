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

const progressHeaderStyle = { display: 'flex', justifyContent: 'space-between', marginBottom: '0.45rem' } as const;
const progressLabelStyle = { fontSize: '0.85rem', fontWeight: 800, color: UI_COLORS.ink500, letterSpacing: '0.07em', textTransform: 'uppercase', fontFamily: BODY_FONT_FAMILY } as const;
const progressValueStyle = { fontSize: '0.85rem', fontWeight: 800, color: UI_COLORS.ink500 } as const;
const progressTrackStyle = { height: '0.55rem', borderRadius: '99px', background: UI_COLORS.line300, overflow: 'hidden' } as const;
const sectionHeadingStyle = { margin: '0.45rem 0 0.1rem', fontSize: 'clamp(1.45rem, 3.8vw, 1.95rem)', fontWeight: 900, color: UI_COLORS.ink900 } as const;
const commentSpacerStyle = { marginTop: '0.75rem' } as const;

type ServiceAvsluttet = 'ja' | 'nei' | null;

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

export default function KSServiceEtterMontasjeScreen() {
	const navigate = useNavigate();
	const location = useLocation();
	const state = (location.state as ProjectRouteState | null) ?? null;
	const { manualProjectEntry, projectNumber, projectName } = getProjectContextFromState(state);
	const returnTo = state?.returnTo;
	const returnState = state?.returnState;
	const returnNavigation = { returnTo: location.pathname, returnState: location.state };
	const imageContextKey = createImageContextKey('ks-service-etter-montasje', projectNumber);
	const imageCount = getImageDraftCount(imageContextKey);

	const [prosjekt, setProsjekt] = useState('');
	const [underprosjekt, setUnderprosjekt] = useState('');
	const [emne, setEmne] = useState('');

	const [beskrivelse, setBeskrivelse] = useState('');
	const [serviceUtfort, setServiceUtfort] = useState(false);
	const [serviceUtfortComment, setServiceUtfortComment] = useState('');
	const [serviceAvsluttet, setServiceAvsluttet] = useState<ServiceAvsluttet>(null);
	const [serviceAvsluttetComment, setServiceAvsluttetComment] = useState('');

	const [opprettetAv, setOpprettetAv] = useState('');
	const [godkjentDato, setGodkjentDato] = useState('');
	const [godkjentAv, setGodkjentAv] = useState('');

	const fremdrift = [
		prosjekt.trim() !== '',
		emne.trim() !== '',
		beskrivelse.trim() !== '',
		serviceUtfort,
		serviceAvsluttet !== null,
	].filter(Boolean).length;

	const total = 5;
	const progress = (fremdrift / total) * 100;

	const handleBack = () => (returnTo ? navigate(returnTo, { state: returnState }) : navigate(-1));

	return (
		<FormPage
			title="Service etter montasje"
			subtitle="Dok. nr.: T.1 - Service dokumentasjon"
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
				<FormField label="PROSJEKT *" htmlFor="ksservice-prosjekt">
					<FormInput id="ksservice-prosjekt" type="text" value={prosjekt} onChange={(e) => setProsjekt(e.target.value)} placeholder="Prosjektnavn..." />
				</FormField>
				<FormField label="UNDERPROSJEKT" htmlFor="ksservice-underprosjekt">
					<FormInput id="ksservice-underprosjekt" type="text" value={underprosjekt} onChange={(e) => setUnderprosjekt(e.target.value)} placeholder="Underprosjekt (valgfritt)..." />
				</FormField>
				<FormField label="EMNE *" htmlFor="ksservice-emne">
					<FormInput id="ksservice-emne" type="text" value={emne} onChange={(e) => setEmne(e.target.value)} placeholder="Emne..." />
				</FormField>
			</FormSection>

			<h2 style={sectionHeadingStyle}>Service Gjennomgang</h2>

			<FormSection title="Beskrivelse av service *">
				<FormTextArea value={beskrivelse} onChange={(e) => setBeskrivelse(e.target.value)} placeholder="Beskriv servicen som ble utført..." style={{ minHeight: '6rem' }} />
			</FormSection>

			<FormSection title="Service utført">
				<CheckOption label="Ja" checked={serviceUtfort} onToggle={() => setServiceUtfort((v) => !v)} />
				<div style={commentSpacerStyle}>
					<FormField label="KOMMENTAR" htmlFor="ksservice-utfort-kommentar">
						<FormTextArea id="ksservice-utfort-kommentar" value={serviceUtfortComment} onChange={(e) => setServiceUtfortComment(e.target.value)} placeholder="Tilleggskommentar..." style={{ minHeight: '4.5rem' }} />
					</FormField>
				</div>
			</FormSection>

			<FormSection title="Service avsluttet">
				<div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
					<CheckOption label="Ja" checked={serviceAvsluttet === 'ja'} onToggle={() => setServiceAvsluttet(serviceAvsluttet === 'ja' ? null : 'ja')} />
					<CheckOption
						label="Nei, må tilbake. Nytt skjema føres ved avslutning"
						checked={serviceAvsluttet === 'nei'}
						onToggle={() => setServiceAvsluttet(serviceAvsluttet === 'nei' ? null : 'nei')}
					/>
				</div>
				<div style={commentSpacerStyle}>
					<FormField label="KOMMENTAR" htmlFor="ksservice-avsluttet-kommentar">
						<FormTextArea id="ksservice-avsluttet-kommentar" value={serviceAvsluttetComment} onChange={(e) => setServiceAvsluttetComment(e.target.value)} placeholder="Tilleggskommentar..." style={{ minHeight: '4.5rem' }} />
					</FormField>
				</div>
			</FormSection>

			<FormSection title="Dokumentinformasjon *">
				<FormField label="OPPRETTET AV *" htmlFor="ksservice-opprettet-av">
					<FormInput id="ksservice-opprettet-av" type="text" value={opprettetAv} onChange={(e) => setOpprettetAv(e.target.value)} placeholder="Navn..." />
				</FormField>
				<FormField label="GODKJENT DATO *" htmlFor="ksservice-godkjent-dato">
					<FormInput id="ksservice-godkjent-dato" type="date" value={godkjentDato} onChange={(e) => setGodkjentDato(e.target.value)} />
				</FormField>
				<FormField label="GODKJENT AV *" htmlFor="ksservice-godkjent-av">
					<FormInput id="ksservice-godkjent-av" type="text" value={godkjentAv} onChange={(e) => setGodkjentAv(e.target.value)} placeholder="Navn..." />
				</FormField>
			</FormSection>

			<FormActionButton
				onClick={() =>
					navigate('/image-capture', {
						state: createImageCaptureState({
							contextKey: imageContextKey,
							contextTitle: 'Service etter montasje',
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
							formTitle: 'Service etter montasje',
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
