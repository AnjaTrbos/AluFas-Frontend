import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// Icons used for submit affordances
import { Save } from 'lucide-react';
// Shared form components/styles to keep screen layout consistent
import {
	FormActionButton,
	FormField,
	FormInput,
	FormPage,
	formFieldLabelStyle,
} from '../components/forms/FormLayout';
import ChecklistAccordion, { type ChecklistStep } from '../components/forms/ChecklistAccordion';
import type { ProjectRouteState } from '../types/navigation';
// Draft helpers keep image attachments tied to this form context
import { createImageContextKey, getImageDraftCount } from '../utils/imageDrafts';
import { createImageCaptureState, createSuccessState, getProjectContextFromState } from '../utils/navigation';

// Result categories checked per step to document received items
const RESULTAT_OPTIONS = ['Profilene', 'Beslag og tilbehør', 'Pakninger', 'T-forbindere', 'Glass og paneler'];

// Predefined control procedure used during incoming profile inspection
const KONTROLL_STEPS: ChecklistStep[] = [
	{ id: 1, title: 'Identifikasjon og sjekk av leveransen', kontrolleresMot: 'Følgeseddel', testprosedyre: 'Visuell sjekk' },
	{ id: 2, title: 'Evt. transportskade', kontrolleresMot: 'Riper, bulker, deformasjoner', testprosedyre: 'Visuell sjekk' },
	{ id: 3, title: 'Dimensjoner', kontrolleresMot: 'Tekniske tegninger, tegningskatalogen og ordremanualer', testprosedyre: 'Lengder og dimensjoner' },
	{ id: 4, title: 'Funksjonstesting', kontrolleresMot: 'Systembeskrivelse og funksjonsbeskrivelse', testprosedyre: 'Funksjonstester iht. sikringsplan' },
];

export default function ProfilerMottakScreen() {
	// Navigation utilities for returning and moving to follow-up screens
	const navigate = useNavigate();
	const location = useLocation();
	// Read optional route state safely
	const state = (location.state as ProjectRouteState | null) ?? null;

	// Use provided project context or fallback placeholders
	const { manualProjectEntry, projectNumber, projectName } = getProjectContextFromState(state);
	const returnTo = state?.returnTo;
	const returnState = state?.returnState;
	const returnNavigation = { returnTo: location.pathname, returnState: location.state };
	// Scope image drafts to this form + project so attachments do not mix
	const imageContextKey = createImageContextKey('profiler-mottak', projectNumber);
	// Show current attachment count on the image action button
	const imageCount = getImageDraftCount(imageContextKey);

	// Capture order and inspector details for traceability
	const [ordrenummer, setOrdrenummer] = useState('');
	const [kontrollertAv, setKontrollertAv] = useState('');
	// Track expanded checklist steps for accordion behavior
	const [expandedSteps, setExpandedSteps] = useState<number[]>([]);
	// Store checked result options per step id
	const [resultatChecked, setResultatChecked] = useState<Record<number, string[]>>({});

	const subtitle = 'S.02 Kontroll av innkommende materialer';
	const handleBack = () => (returnTo ? navigate(returnTo, { state: returnState }) : navigate(-1));

	// Toggle expanded state for a checklist step
	const toggleStep = (id: number) => {
		setExpandedSteps((current) => (current.includes(id) ? current.filter((value) => value !== id) : [...current, id]));
	};

	// Toggle selected result options for a given step
	const toggleResultat = (stepId: number, option: string) => {
		setResultatChecked((current) => {
			const existing = current[stepId] ?? [];
			const next = existing.includes(option) ? existing.filter((item) => item !== option) : [...existing, option];
			return { ...current, [stepId]: next };
		});
	};

	return (
		<FormPage
			title="Profiler mottak"
			subtitle={subtitle}
			onBack={handleBack}
			projectNumber={projectNumber}
			projectName={projectName}
		>
			{/* Collect order reference to match inspection against delivery docs */}
			<FormField label="Ordrenummer" htmlFor="pm-ordrenummer">
				<FormInput id="pm-ordrenummer" type="text" value={ordrenummer} onChange={(event) => setOrdrenummer(event.target.value)} placeholder="Oppgi ordrenummer" />
			</FormField>

			{/* Record who performed control for accountability */}
			<FormField label="Kontrollert av" htmlFor="pm-kontrollert-av">
				<FormInput id="pm-kontrollert-av" type="text" value={kontrollertAv} onChange={(event) => setKontrollertAv(event.target.value)} placeholder="Ditt navn" />
			</FormField>

			{/* Accordion checklist keeps each control step focused and readable */}
			<div>
				<p style={formFieldLabelStyle}>Kontrollsjekkliste</p>
				<ChecklistAccordion
					steps={KONTROLL_STEPS}
					resultOptions={RESULTAT_OPTIONS}
					expandedSteps={expandedSteps}
					selectedResults={resultatChecked}
					onToggleStep={toggleStep}
					onToggleResult={toggleResultat}
				/>
			</div>

			{/* Allow photo evidence to be attached to this inspection */}
			<FormActionButton
				onClick={() =>
					navigate('/image-capture', {
						state: createImageCaptureState({
							contextKey: imageContextKey,
							contextTitle: 'Profiler mottak',
							projectContext: { manualProjectEntry, projectNumber, projectName },
							returnNavigation,
						}),
					})
				}
			>
				{/* Show attachment count so users know drafts are retained */}
				{imageCount > 0 ? `+ Legg til bilde (${imageCount})` : '+ Legg til bilde'}
			</FormActionButton>

			{/* Submit inspection details and continue to success confirmation */}
			<FormActionButton
				variant="dark"
				onClick={() =>
					navigate('/success', {
						state: createSuccessState({
							formTitle: 'Profiler mottak',
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
