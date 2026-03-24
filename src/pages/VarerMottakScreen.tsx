import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check, ChevronDown, ChevronRight, Save } from 'lucide-react';
import {
	FormActionButton,
	FormField,
	FormPage,
	FormSection,
	formInputStyle,
} from '../components/forms/FormLayout';
import { createImageContextKey, getImageDraftCount } from '../utils/imageDrafts';

interface VarerMottakLocationState {
	projectNumber?: string;
	projectName?: string;
}

interface KontrollStep {
	id: number;
	title: string;
	kontrolleresMot: string;
	testprosedyre: string;
}

const RESULTAT_OPTIONS = ['Profilene', 'Beslag og tilbehør', 'Pakninger', 'T-forbindere', 'Glass og paneler'];

const KONTROLL_STEPS: KontrollStep[] = [
	{ id: 1, title: 'Identifikasjon og sjekk av leveransen', kontrolleresMot: 'Følgeseddel', testprosedyre: 'Visuell sjekk' },
	{ id: 2, title: 'Evt. transportskade', kontrolleresMot: 'Riper, bulker, deformasjoner', testprosedyre: 'Visuell sjekk' },
	{ id: 3, title: 'Dimensjoner', kontrolleresMot: 'Tekniske tegninger, tegningskatalogen og ordremanualer', testprosedyre: 'Lengder og dimensjoner' },
	{ id: 4, title: 'Funksjonstesting', kontrolleresMot: 'Systembeskrivelse og funksjonsbeskrivelse', testprosedyre: 'Funksjonstester iht. sikringsplan' },
];

export default function VarerMottakScreen() {
	const navigate = useNavigate();
	const location = useLocation();
	const state = (location.state as VarerMottakLocationState | null) ?? null;

	const projectNumber = state?.projectNumber ?? 'AF-2024-001';
	const projectName = state?.projectName ?? 'Elkjøp Hercules';
	const imageContextKey = createImageContextKey('varer-mottak', projectNumber);
	const imageCount = getImageDraftCount(imageContextKey);

	const [ordrenummer, setOrdrenummer] = useState('');
	const [kontrollertAv, setKontrollertAv] = useState('');
	const [expandedSteps, setExpandedSteps] = useState<number[]>([]);
	const [resultatChecked, setResultatChecked] = useState<Record<number, string[]>>({});

	const subtitle = useMemo(() => 'S.02 Kontroll av innkommende materialer', []);

	const toggleStep = (id: number) => {
		setExpandedSteps((current) => (current.includes(id) ? current.filter((value) => value !== id) : [...current, id]));
	};

	// Each checklist card can store several checked result tags.
	const toggleResultat = (stepId: number, option: string) => {
		setResultatChecked((current) => {
			const existing = current[stepId] ?? [];
			const next = existing.includes(option) ? existing.filter((item) => item !== option) : [...existing, option];
			return { ...current, [stepId]: next };
		});
	};

	return (
		<FormPage title="Varer mottak" subtitle={subtitle} onBack={() => navigate(-1)} projectNumber={projectNumber} projectName={projectName}>
			<FormField label="Ordrenummer" htmlFor="vm-ordrenummer">
				<input id="vm-ordrenummer" type="text" value={ordrenummer} onChange={(event) => setOrdrenummer(event.target.value)} placeholder="Oppgi ordrenummer" style={formInputStyle} />
			</FormField>

			<FormField label="Kontrollert av" htmlFor="vm-kontrollert-av">
				<input id="vm-kontrollert-av" type="text" value={kontrollertAv} onChange={(event) => setKontrollertAv(event.target.value)} placeholder="Ditt navn" style={formInputStyle} />
			</FormField>

			<FormSection title="Kontrollsjekkliste">
				<div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
					{KONTROLL_STEPS.map((step) => {
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
										<span style={{ fontSize: 'clamp(1rem, 3vw, 1.35rem)', fontWeight: 900, color: '#0f172a', textAlign: 'left' }}>{step.title}</span>
									</div>
									{isExpanded ? <ChevronDown width={24} height={24} color="#0f172a" strokeWidth={2.5} /> : <ChevronRight width={24} height={24} color="#0f172a" strokeWidth={2.5} />}
								</button>

								{isExpanded ? (
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
												const checked = stepValues.includes(option);

												return (
													<button
														key={option}
														type="button"
														onClick={() => toggleResultat(step.id, option)}
														style={{
															display: 'inline-flex',
															alignItems: 'center',
															gap: '0.65rem',
															border: 'none',
															padding: 0,
															background: 'none',
															cursor: 'pointer',
															textAlign: 'left',
														}}
													>
														<span
															style={{
																width: '1.4rem',
																height: '1.4rem',
																borderRadius: '0.25rem',
																border: checked ? '2px solid #1e3a8a' : '2px solid #b7c4d6',
																background: checked ? '#1e3a8a' : '#ffffff',
																display: 'inline-flex',
																alignItems: 'center',
																justifyContent: 'center',
															}}
														>
															{checked ? <Check width={12} height={12} color="#ffffff" strokeWidth={3.2} /> : null}
														</span>
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
			</FormSection>

			<FormActionButton
				onClick={() =>
					navigate('/image-capture', {
						state: {
							contextKey: imageContextKey,
							contextTitle: 'Varer mottak',
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
				icon={<Save width={22} height={22} color="#ffffff" strokeWidth={2.5} />}
				onClick={() =>
					navigate('/success', {
						state: {
							projectNumber,
							projectName,
							formTitle: 'Varer mottak',
							returnTo: location.pathname,
							returnState: location.state,
						},
					})
				}
			>
				Send skjema
			</FormActionButton>

			{/* BACKEND: Replace navigation with a real submit call when the API is ready. */}
		</FormPage>
	);
}
