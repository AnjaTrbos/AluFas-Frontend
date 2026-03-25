// Essential React hooks for local form state and stable derived text
import { useMemo, useState } from 'react';
// Router hooks to keep navigation context across flows
import { useLocation, useNavigate } from 'react-router-dom';
// Icons used for submit action
import { Save } from 'lucide-react';
// Shared form components/styles to keep UI consistent across screens
import {
	FormActionButton,
	FormField,
	FormPage,
	FormSection,
	formInputStyle,
} from '../components/forms/FormLayout';
import ChecklistAccordion, { type ChecklistStep } from '../components/forms/ChecklistAccordion';
import type { ProjectRouteState } from '../types/navigation';
// Draft helpers keep image attachments scoped to this form context
import { createImageContextKey, getImageDraftCount } from '../utils/imageDrafts';
import { createImageCaptureState, createReturnNavigation, createSuccessState, getProjectContextFromState, getReturnNavigation } from '../utils/navigation';

// Reusable result tags recorded per checklist step
const RESULTAT_OPTIONS = ['Profilene', 'Beslag og tilbehør', 'Pakninger', 'T-forbindere', 'Glass og paneler'];

// Standard inspection steps for incoming goods control
const KONTROLL_STEPS: ChecklistStep[] = [
	{ id: 1, title: 'Identifikasjon og sjekk av leveransen', kontrolleresMot: 'Følgeseddel', testprosedyre: 'Visuell sjekk' },
	{ id: 2, title: 'Evt. transportskade', kontrolleresMot: 'Riper, bulker, deformasjoner', testprosedyre: 'Visuell sjekk' },
	{ id: 3, title: 'Dimensjoner', kontrolleresMot: 'Tekniske tegninger, tegningskatalogen og ordremanualer', testprosedyre: 'Lengder og dimensjoner' },
	{ id: 4, title: 'Funksjonstesting', kontrolleresMot: 'Systembeskrivelse og funksjonsbeskrivelse', testprosedyre: 'Funksjonstester iht. sikringsplan' },
];

export default function VarerMottakScreen() {
	// Router helpers for returning and moving into next screens
	const navigate = useNavigate();
	const location = useLocation();
	// Resolve optional route state safely
	const state = (location.state as ProjectRouteState | null) ?? null;

	// Use incoming project context or safe fallback placeholders
	const { manualProjectEntry, projectNumber, projectName } = getProjectContextFromState(state);
	// Preserve explicit return path when this screen is nested in another flow
	const { returnTo, returnState } = getReturnNavigation(state);
	const returnNavigation = createReturnNavigation(location.pathname, location.state);
	// Scope draft image storage to this form and project
	const imageContextKey = createImageContextKey('varer-mottak', projectNumber);
	// Show count of currently attached image drafts
	const imageCount = getImageDraftCount(imageContextKey);

	// Capture reference details for traceable quality control
	const [ordrenummer, setOrdrenummer] = useState('');
	const [kontrollertAv, setKontrollertAv] = useState('');
	// Track which checklist cards are expanded
	const [expandedSteps, setExpandedSteps] = useState<number[]>([]);
	// Store selected result options per checklist step
	const [resultatChecked, setResultatChecked] = useState<Record<number, string[]>>({});

	// Stable subtitle communicates inspection procedure context
	const subtitle = useMemo(() => 'S.02 Kontroll av innkommende materialer', []);

	// Toggle accordion expansion for a step
	const toggleStep = (id: number) => {
		setExpandedSteps((current) => (current.includes(id) ? current.filter((value) => value !== id) : [...current, id]));
	};

	// Each checklist step supports multiple selected result tags
	const toggleResultat = (stepId: number, option: string) => {
		setResultatChecked((current) => {
			const existing = current[stepId] ?? [];
			const next = existing.includes(option) ? existing.filter((item) => item !== option) : [...existing, option];
			return { ...current, [stepId]: next };
		});
	};

	// Main incoming-goods control form
	return (
		<FormPage
			title="Varer mottak"
			subtitle={subtitle}
			onBack={() => {
				// Prefer explicit return route when available
				if (returnTo) {
					navigate(returnTo, { state: returnState });
					return;
				}

				// Fallback to browser history when no route was provided
				navigate(-1);
			}}
			projectNumber={projectNumber}
			projectName={projectName}
		>
			{/* Collect order reference for delivery verification */}
			<FormField label="Ordrenummer" htmlFor="vm-ordrenummer">
				<input id="vm-ordrenummer" type="text" value={ordrenummer} onChange={(event) => setOrdrenummer(event.target.value)} placeholder="Oppgi ordrenummer" style={formInputStyle} />
			</FormField>

			{/* Record responsible inspector for accountability */}
			<FormField label="Kontrollert av" htmlFor="vm-kontrollert-av">
				<input id="vm-kontrollert-av" type="text" value={kontrollertAv} onChange={(event) => setKontrollertAv(event.target.value)} placeholder="Ditt navn" style={formInputStyle} />
			</FormField>

			{/* Accordion checklist keeps each inspection step focused and readable */}
			<FormSection title="Kontrollsjekkliste">
				<ChecklistAccordion
					steps={KONTROLL_STEPS}
					resultOptions={RESULTAT_OPTIONS}
					expandedSteps={expandedSteps}
					selectedResults={resultatChecked}
					onToggleStep={toggleStep}
					onToggleResult={toggleResultat}
				/>
			</FormSection>

			{/* Route to image capture so users can attach inspection evidence */}
			<FormActionButton
				onClick={() =>
					navigate('/image-capture', {
						state: createImageCaptureState({
							contextKey: imageContextKey,
							contextTitle: 'Varer mottak',
							projectContext: { manualProjectEntry, projectNumber, projectName },
							returnNavigation,
						}),
					})
				}
			>
				{/* Count confirms existing attachments are preserved */}
				{imageCount > 0 ? `+ Legg til bilde (${imageCount})` : '+ Legg til bilde'}
			</FormActionButton>

			{/* Submit action forwards user to success confirmation screen */}
			<FormActionButton
				variant="dark"
				icon={<Save width={22} height={22} color="#ffffff" strokeWidth={2.5} />}
				onClick={() =>
					navigate('/success', {
						state: createSuccessState({
							formTitle: 'Varer mottak',
							projectContext: { manualProjectEntry, projectNumber, projectName },
							returnNavigation,
						}),
					})
				}
			>
				Send skjema
			</FormActionButton>

			{/* BACKEND: Replace navigation with a real submit call when the API is ready. */}
		</FormPage>
	);
}
