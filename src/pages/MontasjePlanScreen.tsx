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

interface MontasjePlanLocationState {
	projectNumber?: string;
	projectName?: string;
}

const STATUS_OPTIONS = ['Glass mottatt', 'Profiler mottatt', 'Produksjon ferdig'];

export default function MontasjePlanScreen() {
	const navigate = useNavigate();
	const location = useLocation();
	const state = (location.state as MontasjePlanLocationState | null) ?? null;

	const projectNumber = state?.projectNumber ?? 'AF-2024-001';
	const projectName = state?.projectName ?? 'Elkjøp Hercules';
	const imageContextKey = createImageContextKey('montasje-plan', projectNumber);
	const imageCount = getImageDraftCount(imageContextKey);

	const [produksjonstimer, setProduksjonstimer] = useState('');
	const [montagetimer, setMontagetimer] = useState('');
	const [produksjonUnderlagDato, setProduksjonUnderlagDato] = useState('');
	const [produsertFerdigDato, setProdusertFerdigDato] = useState('');
	const [status, setStatus] = useState<string[]>([]);
	const [prioritet, setPrioritet] = useState('');
	const [ansvarligPerson, setAnsvarligPerson] = useState('');
	const [merknad, setMerknad] = useState('');

	const subtitle = useMemo(() => 'Plan for montering', []);

	const toggleStatus = (option: string) => {
		setStatus((current) => (current.includes(option) ? current.filter((item) => item !== option) : [...current, option]));
	};

	return (
		<FormPage title="Montasje Plan" subtitle={subtitle} onBack={() => navigate(-1)} projectNumber={projectNumber} projectName={projectName}>
			<FormSection title="Timeestimering">
				<FormField label="Produksjonstimer" htmlFor="mp-produksjonstimer">
					<input id="mp-produksjonstimer" type="text" value={produksjonstimer} onChange={(event) => setProduksjonstimer(event.target.value)} placeholder="Timer for produksjon" style={formInputStyle} />
				</FormField>
				<FormField label="Montagetimer" htmlFor="mp-montagetimer">
					<input id="mp-montagetimer" type="text" value={montagetimer} onChange={(event) => setMontagetimer(event.target.value)} placeholder="Timer for montasje" style={formInputStyle} />
				</FormField>
			</FormSection>

			<FormSection title="Produksjonsdatoer">
				<FormField label="Produksjon underlag dato" htmlFor="mp-underlag-dato">
					<input id="mp-underlag-dato" type="date" value={produksjonUnderlagDato} onChange={(event) => setProduksjonUnderlagDato(event.target.value)} style={formInputStyle} />
				</FormField>
				<FormField label="Produsert ferdig dato" htmlFor="mp-ferdig-dato">
					<input id="mp-ferdig-dato" type="date" value={produsertFerdigDato} onChange={(event) => setProdusertFerdigDato(event.target.value)} style={formInputStyle} />
				</FormField>
			</FormSection>

			<FormSection title="Status">
				<div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
					{STATUS_OPTIONS.map((option) => {
						const checked = status.includes(option);
						return (
							<button
								key={option}
								type="button"
								onClick={() => toggleStatus(option)}
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: '0.75rem',
									width: '100%',
									borderRadius: '0.95rem',
									border: '2px solid #d8e1ec',
									background: '#ffffff',
									padding: '0.85rem 0.95rem',
									cursor: 'pointer',
									textAlign: 'left',
								}}
							>
								<span
									style={{
										width: '1.45rem',
										height: '1.45rem',
										borderRadius: '0.25rem',
										border: checked ? '2px solid #1e3a8a' : '2px solid #b7c4d6',
										background: checked ? '#1e3a8a' : '#ffffff',
										display: 'inline-flex',
										alignItems: 'center',
										justifyContent: 'center',
										flexShrink: 0,
									}}
								>
									{checked ? <Check width={11} height={11} color="#ffffff" strokeWidth={3.1} /> : null}
								</span>
								<span style={{ fontSize: 'clamp(0.98rem, 2.8vw, 1.05rem)', fontWeight: 800, color: '#0f172a' }}>{option}</span>
							</button>
						);
					})}
				</div>
			</FormSection>

			<FormSection title="Prioritering og ansvar">
				<FormField label="Prioritet" htmlFor="mp-prioritet">
					<select id="mp-prioritet" value={prioritet} onChange={(event) => setPrioritet(event.target.value)} style={formInputStyle}>
						<option value="">Velg prioritet</option>
						<option value="Høy">Høy</option>
						<option value="Middels">Middels</option>
						<option value="Lav">Lav</option>
					</select>
				</FormField>

				<FormField label="Ansvarlig person" htmlFor="mp-ansvarlig">
					<input id="mp-ansvarlig" type="text" value={ansvarligPerson} onChange={(event) => setAnsvarligPerson(event.target.value)} placeholder="Navn på ansvarlig" style={formInputStyle} />
				</FormField>
			</FormSection>

			<FormSection title="Merknad">
				<textarea value={merknad} onChange={(event) => setMerknad(event.target.value)} placeholder="Legg til merknader eller notater..." style={formTextAreaStyle} />
			</FormSection>

			<FormActionButton
				onClick={() =>
					navigate('/image-capture', {
						state: {
							contextKey: imageContextKey,
							contextTitle: 'Montasje Plan',
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
							formTitle: 'Montasje Plan',
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
