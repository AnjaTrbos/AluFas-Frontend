import { useState } from 'react';
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
import type { ProjectRouteState } from '../types/navigation';
// Image draft helpers so attachments persist per form context
import { createImageContextKey, getImageDraftCount } from '../utils/imageDrafts';
import { createImageCaptureState, createSuccessState, getProjectContextFromState } from '../utils/navigation';
import { UI_COLORS } from '../styles/uiTokens';

// Track progress milestones for installation planning
const STATUS_OPTIONS = ['Glass mottatt', 'Profiler mottatt', 'Produksjon ferdig'];

export default function MontasjePlanScreen() {
	// Navigation utilities for back/forward screen flow
	const navigate = useNavigate();
	const location = useLocation();
	// Read optional state with safe fallback
	const state = (location.state as ProjectRouteState | null) ?? null;

	// Use incoming project data or sensible defaults for standalone access
	const { manualProjectEntry, projectNumber, projectName } = getProjectContextFromState(state);
	const returnTo = state?.returnTo;
	const returnState = state?.returnState;
	const returnNavigation = { returnTo: location.pathname, returnState: location.state };
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

	const subtitle = 'Plan for montering';
	const handleBack = () => (returnTo ? navigate(returnTo, { state: returnState }) : navigate(-1));

	const toggleStatus = (option: string) => {
		setStatus((current) => (current.includes(option) ? current.filter((item) => item !== option) : [...current, option]));
	};

	return (
		<FormPage
			title="Montasje Plan"
			subtitle={subtitle}
			onBack={handleBack}
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
									border: `2px solid ${UI_COLORS.line250}`,
									background: UI_COLORS.surface0,
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
										border: checked ? `2px solid ${UI_COLORS.statusChecked}` : `2px solid ${UI_COLORS.line300}`,
										background: checked ? UI_COLORS.statusChecked : UI_COLORS.surface0,
										display: 'inline-flex',
										alignItems: 'center',
										justifyContent: 'center',
										flexShrink: 0,
									}}
								>
									{checked ? <Check width={11} height={11} color="#ffffff" strokeWidth={3.1} /> : null}
								</span>
								{/* Keep status label readable and consistent across options */}
								<span style={{ fontSize: 'clamp(0.98rem, 2.8vw, 1.05rem)', fontWeight: 800, color: UI_COLORS.ink900 }}>{option}</span>
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
						state: createImageCaptureState({
							contextKey: imageContextKey,
							contextTitle: 'Montasje Plan',
							projectContext: { manualProjectEntry, projectNumber, projectName },
							returnNavigation,
						}),
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
						state: createSuccessState({
							formTitle: 'Montasje Plan',
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
