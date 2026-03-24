// Essential React hooks for state management and memoization
import { useMemo, useState } from 'react';
// Router hooks to read navigation context and move between screens
import { useLocation, useNavigate } from 'react-router-dom';
// Icons used to communicate selection and submission actions
import { Check, Save } from 'lucide-react';
// Reusable form components/styles to keep screen layout consistent
import {
	FormActionButton,
	FormField,
	FormPage,
	FormSection,
	formInputStyle,
	formTextAreaStyle,
} from '../components/forms/FormLayout';
// Image draft helpers so attachments persist per form context
import { createImageContextKey, getImageDraftCount } from '../utils/imageDrafts';

// Expected data passed when arriving from another screen
interface MontasjePlanLocationState {
	projectNumber?: string;
	projectName?: string;
	returnTo?: string;
	returnState?: unknown;
}

// Track progress milestones for installation planning
const STATUS_OPTIONS = ['Glass mottatt', 'Profiler mottatt', 'Produksjon ferdig'];

export default function MontasjePlanScreen() {
	// Navigation utilities for back/forward screen flow
	const navigate = useNavigate();
	const location = useLocation();
	// Read optional state with safe fallback
	const state = (location.state as MontasjePlanLocationState | null) ?? null;

	// Use incoming project data or sensible defaults for standalone access
	const projectNumber = state?.projectNumber ?? 'AF-2024-001';
	const projectName = state?.projectName ?? 'Elkjøp Hercules';
	// Preserve return target when leaving this screen
	const returnTo = state?.returnTo;
	const returnState = state?.returnState;
	// Build project-specific key so image drafts stay scoped correctly
	const imageContextKey = createImageContextKey('montasje-plan', projectNumber);
	// Show users how many images are already attached
	const imageCount = getImageDraftCount(imageContextKey);

	// Capture time estimates used for resource planning
	const [produksjonstimer, setProduksjonstimer] = useState('');
	const [montagetimer, setMontagetimer] = useState('');
	// Record target/actual production dates for scheduling
	const [produksjonUnderlagDato, setProduksjonUnderlagDato] = useState('');
	const [produsertFerdigDato, setProdusertFerdigDato] = useState('');
	// Track selected production status milestones
	const [status, setStatus] = useState<string[]>([]);
	// Store ownership and priority to guide execution order
	const [prioritet, setPrioritet] = useState('');
	const [ansvarligPerson, setAnsvarligPerson] = useState('');
	// Keep free-text notes for context not covered by fixed fields
	const [merknad, setMerknad] = useState('');

	// Stable subtitle keeps page context clear without recomputation
	const subtitle = useMemo(() => 'Plan for montering', []);

	// Toggle status values so users can mark/unmark milestones quickly
	const toggleStatus = (option: string) => {
		setStatus((current) => (current.includes(option) ? current.filter((item) => item !== option) : [...current, option]));
	};

	// Main planning form container
	return (
		<FormPage
			title="Montasje Plan"
			subtitle={subtitle}
			onBack={() => {
				// Prefer explicit return route when screen was opened as a sub-flow
				if (returnTo) {
					navigate(returnTo, { state: returnState });
					return;
				}

				// Fallback to browser history when no route is provided
				navigate(-1);
			}}
			projectNumber={projectNumber}
			projectName={projectName}
		>
			{/* Gather estimated effort for production and installation */}
			<FormSection title="Timeestimering">
				<FormField label="Produksjonstimer" htmlFor="mp-produksjonstimer">
					<input id="mp-produksjonstimer" type="text" value={produksjonstimer} onChange={(event) => setProduksjonstimer(event.target.value)} placeholder="Timer for produksjon" style={formInputStyle} />
				</FormField>
				<FormField label="Montagetimer" htmlFor="mp-montagetimer">
					<input id="mp-montagetimer" type="text" value={montagetimer} onChange={(event) => setMontagetimer(event.target.value)} placeholder="Timer for montasje" style={formInputStyle} />
				</FormField>
			</FormSection>

			{/* Capture key production dates for delivery planning */}
			<FormSection title="Produksjonsdatoer">
				<FormField label="Produksjon underlag dato" htmlFor="mp-underlag-dato">
					<input id="mp-underlag-dato" type="date" value={produksjonUnderlagDato} onChange={(event) => setProduksjonUnderlagDato(event.target.value)} style={formInputStyle} />
				</FormField>
				<FormField label="Produsert ferdig dato" htmlFor="mp-ferdig-dato">
					<input id="mp-ferdig-dato" type="date" value={produsertFerdigDato} onChange={(event) => setProdusertFerdigDato(event.target.value)} style={formInputStyle} />
				</FormField>
			</FormSection>

			{/* Let planner mark milestone completion status */}
			<FormSection title="Status">
				<div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
					{STATUS_OPTIONS.map((option) => {
						// Derive checked state so UI reflects current selection
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
								{/* Checkbox visual makes completion state obvious at a glance */}
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
								{/* Keep status label readable and consistent across options */}
								<span style={{ fontSize: 'clamp(0.98rem, 2.8vw, 1.05rem)', fontWeight: 800, color: '#0f172a' }}>{option}</span>
							</button>
						);
					})}
				</div>
			</FormSection>

			{/* Collect decision priority and ownership for execution */}
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

			{/* Preserve extra context that does not fit structured fields */}
			<FormSection title="Merknad">
				<textarea value={merknad} onChange={(event) => setMerknad(event.target.value)} placeholder="Legg til merknader eller notater..." style={formTextAreaStyle} />
			</FormSection>

			{/* Attach supporting photos for planning and handoff */}
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
				{/* Display count so users know existing attachments are retained */}
				{imageCount > 0 ? `+ Legg til bilde (${imageCount})` : '+ Legg til bilde'}
			</FormActionButton>

			{/* Submit planning data and continue to success confirmation */}
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
