import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check, Save } from 'lucide-react';
import {
	FormActionButton,
	FormField,
	FormPage,
	FormSection,
	formInputStyle,
	formTextAreaStyle,
} from '../components/forms/FormLayout';
import { createImageContextKey, getImageDraftCount } from '../utils/imageDrafts';

interface KSVerkstedLocationState {
	manualProjectEntry?: boolean;
	projectNumber?: string;
	projectName?: string;
}

const KONTROLLPUNKTER = [
	'Mål kontrollert i henhold til tegning',
	'Overflatebehandling OK',
	'Boring / fresing kontrollert',
	'Montering utført korrekt',
	'Emballasje tilfredsstillende',
	'Merking / etiketter på plass',
	'Samsvar med produksjonstegninger',
	'Skruer og beslag pakket',
];

export default function KSVerkstedScreen() {
	const navigate = useNavigate();
	const location = useLocation();
	const state = (location.state as KSVerkstedLocationState | null) ?? null;
	const manualProjectEntry = state?.manualProjectEntry ?? false;
	const projectNumber = state?.projectNumber ?? 'AF-2024-001';
	const projectName = state?.projectName ?? 'Elkjøp Hercules';
	const imageContextKey = createImageContextKey('ks-verksted', projectNumber);
	const imageCount = getImageDraftCount(imageContextKey);

	const [ordrenummer, setOrdrenummer] = useState(manualProjectEntry ? '' : projectNumber);
	const [prosjektnavn, setProsjektnavn] = useState(manualProjectEntry ? '' : projectName);
	const [kontrollertAv, setKontrollertAv] = useState('');
	const [dato, setDato] = useState('03/17/2026');
	const [checked, setChecked] = useState<string[]>([]);
	const [avvikKommentarer, setAvvikKommentarer] = useState('');
	const [generelleNotater, setGenerelleNotater] = useState('');

	const subtitle = useMemo(() => 'Kvalitetsskjema for verkstedproduksjon', []);
	const fremdrift = checked.length;
	const total = KONTROLLPUNKTER.length;
	const progress = (fremdrift / total) * 100;

	const toggleCheck = (item: string) => {
		setChecked((prev) => (prev.includes(item) ? prev.filter((value) => value !== item) : [...prev, item]));
	};

	return (
		<FormPage title="KS Verksted" subtitle={subtitle} onBack={() => navigate(-1)} projectNumber={projectNumber} projectName={projectName}>
			<div>
				<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
					<span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.07em', textTransform: 'uppercase' }}>FREMDRIFT</span>
					<span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#64748b' }}>{fremdrift} / {total}</span>
				</div>
				<div style={{ height: '0.55rem', borderRadius: '99px', background: '#e2e8f0', overflow: 'hidden' }}>
					<div style={{ height: '100%', width: `${progress}%`, background: '#1e3a8a', borderRadius: '99px', transition: 'width 0.3s ease' }} />
				</div>
			</div>

			<FormSection title="Prosjektinformasjon">
				<FormField label="ORDRENUMMER *" htmlFor="ksv-ordrenummer">
					<input id="ksv-ordrenummer" type="text" value={ordrenummer} onChange={(e) => setOrdrenummer(e.target.value)} placeholder="F.eks. AF-2024-001" style={formInputStyle} />
				</FormField>
				<FormField label="PROSJEKTNAVN *" htmlFor="ksv-prosjektnavn">
					<input id="ksv-prosjektnavn" type="text" value={prosjektnavn} onChange={(e) => setProsjektnavn(e.target.value)} placeholder="Prosjektnavn" style={formInputStyle} />
				</FormField>
				<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(14rem, 1fr))', gap: '1rem' }}>
					<FormField label="KONTROLLERT AV *" htmlFor="ksv-kontrollert-av">
						<input id="ksv-kontrollert-av" type="text" value={kontrollertAv} onChange={(e) => setKontrollertAv(e.target.value)} placeholder="Navn" style={formInputStyle} />
					</FormField>
					<FormField label="DATO" htmlFor="ksv-dato">
						<input id="ksv-dato" type="text" value={dato} onChange={(e) => setDato(e.target.value)} placeholder="mm/dd/yyyy" style={formInputStyle} />
					</FormField>
				</div>
			</FormSection>

			<FormSection title="Kontrollpunkter *">
				<div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
					{KONTROLLPUNKTER.map((item) => {
						const isChecked = checked.includes(item);
						return (
							<button
								key={item}
								type="button"
								onClick={() => toggleCheck(item)}
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: '0.8rem',
									width: '100%',
									padding: '1rem 1rem',
									borderRadius: '1rem',
									border: `2px solid ${isChecked ? '#1e3a8a' : '#d8e1ec'}`,
									background: isChecked ? '#eff4ff' : '#ffffff',
									cursor: 'pointer',
									textAlign: 'left',
									transition: 'all 0.15s ease',
								}}
							>
								<span
									style={{
										width: '1.5rem',
										height: '1.5rem',
										borderRadius: '50%',
										border: isChecked ? '2px solid #1e3a8a' : '2px solid #cbd5e1',
										background: isChecked ? '#1e3a8a' : '#ffffff',
										display: 'inline-flex',
										alignItems: 'center',
										justifyContent: 'center',
										flexShrink: 0,
									}}
								>
									{isChecked ? <Check width={12} height={12} color="#ffffff" strokeWidth={3.5} /> : null}
								</span>
								<span style={{ fontSize: 'clamp(1rem, 2.6vw, 1.12rem)', fontWeight: 700, color: isChecked ? '#1e3a8a' : '#0f172a' }}>{item}</span>
							</button>
						);
					})}
				</div>
			</FormSection>

			<FormSection title="Merknader">
				<FormField label="AVVIK / KOMMENTARER" htmlFor="ksv-avvik-kommentarer">
					<textarea id="ksv-avvik-kommentarer" value={avvikKommentarer} onChange={(e) => setAvvikKommentarer(e.target.value)} placeholder="Beskriv eventuelle avvik..." style={formTextAreaStyle} />
				</FormField>
				<FormField label="GENERELLE NOTATER" htmlFor="ksv-generelle-notater">
					<textarea id="ksv-generelle-notater" value={generelleNotater} onChange={(e) => setGenerelleNotater(e.target.value)} placeholder="Andre merknader eller tilleggsinformasjon..." style={formTextAreaStyle} />
				</FormField>
			</FormSection>

			<FormActionButton
				onClick={() =>
					navigate('/image-capture', {
						state: {
							contextKey: imageContextKey,
							contextTitle: 'KS Verksted',
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
							formTitle: 'KS Verksted',
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
