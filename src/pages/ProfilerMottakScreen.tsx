// Essential React hooks for local form state and stable derived text
import { useMemo, useState } from 'react';
// Router hooks to retain flow context and navigate between screens
import { useLocation, useNavigate } from 'react-router-dom';
// Icons used for status, expand/collapse, and submit affordances
import { Check, ChevronDown, ChevronRight, Save } from 'lucide-react';
// Shared form components/styles to keep screen layout consistent
import {
	FormActionButton,
	FormField,
	FormPage,
	formFieldLabelStyle,
	formInputStyle,
} from '../components/forms/FormLayout';
import type { ProjectRouteState } from '../types/navigation';
// Draft helpers keep image attachments tied to this form context
import { createImageContextKey, getImageDraftCount } from '../utils/imageDrafts';
import { createImageCaptureState, createReturnNavigation, createSuccessState, getProjectContextFromState, getReturnNavigation } from '../utils/navigation';

// Shape for each checklist accordion step
interface KontrollStep {
	id: number;
	title: string;
	kontrolleresMot: string;
	testprosedyre: string;
}

// Result categories checked per step to document received items
const RESULTAT_OPTIONS = ['Profilene', 'Beslag og tilbehør', 'Pakninger', 'T-forbindere', 'Glass og paneler'];

// Predefined control procedure used during incoming profile inspection
const KONTROLL_STEPS: KontrollStep[] = [
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
	// Preserve route target for clean back navigation
	const { returnTo, returnState } = getReturnNavigation(state);
	const returnNavigation = createReturnNavigation(location.pathname, location.state);
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

	// Stable subtitle clarifies which control procedure this screen follows
	const subtitle = useMemo(() => 'S.02 Kontroll av innkommende materialer', []);

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

	// Main profiler mottak form container
	return (
		<FormPage
			title="Profiler mottak"
			subtitle={subtitle}
			onBack={() => {
				// Prefer explicit return route when the screen is opened from a sub-flow
				if (returnTo) {
					navigate(returnTo, { state: returnState });
					return;
				}

				// Fallback to history navigation when no return route was passed
				navigate(-1);
			}}
			projectNumber={projectNumber}
			projectName={projectName}
		>
			{/* Collect order reference to match inspection against delivery docs */}
			<FormField label="Ordrenummer" htmlFor="pm-ordrenummer">
				<input id="pm-ordrenummer" type="text" value={ordrenummer} onChange={(event) => setOrdrenummer(event.target.value)} placeholder="Oppgi ordrenummer" style={formInputStyle} />
			</FormField>

			{/* Record who performed control for accountability */}
			<FormField label="Kontrollert av" htmlFor="pm-kontrollert-av">
				<input id="pm-kontrollert-av" type="text" value={kontrollertAv} onChange={(event) => setKontrollertAv(event.target.value)} placeholder="Ditt navn" style={formInputStyle} />
			</FormField>

			{/* Accordion checklist keeps each control step focused and readable */}
			<div>
				<p style={formFieldLabelStyle}>Kontrollsjekkliste</p>
				<div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
					{KONTROLL_STEPS.map((step) => {
						// Derived UI flags for step expansion and selected result values
						const isExpanded = expandedSteps.includes(step.id);
						const stepValues = resultatChecked[step.id] ?? [];

						return (
							<div key={step.id}>
								<button
									type="button"
									onClick={() => toggleStep(step.id)}
									style={{
										width: '100%',
										borderRadius: '1rem',
										border: '1.5px solid #c8d3df',
										background: '#ffffff',
										padding: '0.95rem 1rem',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'space-between',
										gap: '0.8rem',
										cursor: 'pointer',
										boxShadow: '0 1px 0 rgba(148, 163, 184, 0.14)',
									}}
								>
									{/* Step number makes sequence and execution order clear */}
									<div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
										<span
											style={{
												width: '2.1rem',
												height: '2.1rem',
												borderRadius: '0.62rem',
												background: '#0f172a',
												color: '#ffffff',
												fontWeight: 900,
												fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
												display: 'inline-flex',
												alignItems: 'center',
												justifyContent: 'center',
											}}
										>
											{step.id}
										</span>
										{/* Step title describes the control objective */}
										<span style={{ fontSize: 'clamp(1rem, 3vw, 1.35rem)', fontWeight: 900, color: '#0f172a', textAlign: 'left' }}>{step.title}</span>
									</div>
									{/* Chevron indicates expandable details and current state */}
									{isExpanded ? <ChevronDown width={24} height={24} color="#0f172a" strokeWidth={2.5} /> : <ChevronRight width={24} height={24} color="#0f172a" strokeWidth={2.5} />}
								</button>

								{isExpanded ? (
									/* Expanded area shows criteria, procedure, and result capture */
									<div style={{ marginTop: '0.55rem', borderRadius: '1rem', border: '1.5px solid #d8e1ec', background: '#ffffff', padding: '1rem 1rem 1.05rem' }}>
										<p style={{ margin: '0 0 0.5rem', fontSize: 'clamp(0.95rem, 2.8vw, 1.05rem)', fontWeight: 700, color: '#0f172a' }}>
											<span style={{ fontWeight: 900 }}>Kontrolleres mot:</span> {step.kontrolleresMot}
										</p>
										<p style={{ margin: '0 0 1rem', fontSize: 'clamp(0.95rem, 2.8vw, 1.05rem)', fontWeight: 700, color: '#0f172a' }}>
											<span style={{ fontWeight: 900 }}>Testprosedyre:</span> {step.testprosedyre}
										</p>
										<h3 style={{ margin: '0 0 0.65rem', fontSize: 'clamp(1.1rem, 3vw, 1.35rem)', fontWeight: 900, color: '#0f172a' }}>Resultat</h3>
										<div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
											{RESULTAT_OPTIONS.map((option) => {
												// Reflect whether this option is selected for current step
												const checked = stepValues.includes(option);

												return (
													<button
														key={option}
														type="button"
														onClick={() => toggleResultat(step.id, option)}
														style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem', border: 'none', padding: 0, background: 'none', cursor: 'pointer', textAlign: 'left' }}
													>
														{/* Checkbox-like indicator keeps multi-select state obvious */}
														<span style={{ width: '1.4rem', height: '1.4rem', borderRadius: '0.25rem', border: checked ? '2px solid #1e3a8a' : '2px solid #b7c4d6', background: checked ? '#1e3a8a' : '#ffffff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
															{checked ? <Check width={12} height={12} color="#ffffff" strokeWidth={3.2} /> : null}
														</span>
														{/* Keep option text readable for quick scanning */}
														<span style={{ fontSize: 'clamp(1rem, 2.8vw, 1.2rem)', fontWeight: 700, color: '#0f172a' }}>{option}</span>
													</button>
												);
											})}
										</div>
									</div>
								) : null}
							</div>
						);
					})}
				</div>
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
