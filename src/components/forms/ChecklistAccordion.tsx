import { Check, ChevronDown, ChevronRight } from 'lucide-react';
import { UI_COLORS } from '../../styles/uiTokens';

export interface ChecklistStep {
	id: number;
	title: string;
	kontrolleresMot: string;
	testprosedyre: string;
}

interface ChecklistAccordionProps {
	steps: ChecklistStep[];
	resultOptions: string[];
	expandedSteps: number[];
	selectedResults: Record<number, string[]>;
	onToggleStep: (id: number) => void;
	onToggleResult: (stepId: number, option: string) => void;
}

const checklistStackStyle = { display: 'flex', flexDirection: 'column', gap: '0.85rem' } as const;
const stepHeaderStyle = { display: 'flex', alignItems: 'center', gap: '0.7rem' } as const;
const stepButtonStyle = {
	width: '100%',
	borderRadius: '1rem',
	border: `1.5px solid ${UI_COLORS.line300}`,
	background: UI_COLORS.surface0,
	padding: '0.95rem 1rem',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	gap: '0.8rem',
	cursor: 'pointer',
	boxShadow: '0 1px 0 rgba(148, 163, 184, 0.14)',
} as const;
const stepBadgeStyle = {
	width: '2.1rem',
	height: '2.1rem',
	borderRadius: '0.62rem',
	background: UI_COLORS.ink900,
	color: UI_COLORS.surface0,
	fontWeight: 900,
	fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
	display: 'inline-flex',
	alignItems: 'center',
	justifyContent: 'center',
} as const;
const stepTitleStyle = { fontSize: 'clamp(1rem, 3vw, 1.35rem)', fontWeight: 900, color: UI_COLORS.ink900, textAlign: 'left' } as const;
const expandedPanelStyle = { marginTop: '0.55rem', borderRadius: '1rem', border: `1.5px solid ${UI_COLORS.line250}`, background: UI_COLORS.surface0, padding: '1rem 1rem 1.05rem' } as const;
const detailTextStyle = { margin: '0 0 0.5rem', fontSize: 'clamp(0.95rem, 2.8vw, 1.05rem)', fontWeight: 700, color: UI_COLORS.ink900 } as const;
const detailTextLastStyle = { margin: '0 0 1rem', fontSize: 'clamp(0.95rem, 2.8vw, 1.05rem)', fontWeight: 700, color: UI_COLORS.ink900 } as const;
const detailLabelStyle = { fontWeight: 900 } as const;
const resultHeadingStyle = { margin: '0 0 0.65rem', fontSize: 'clamp(1.1rem, 3vw, 1.35rem)', fontWeight: 900, color: UI_COLORS.ink900 } as const;
const resultListStyle = { display: 'flex', flexDirection: 'column', gap: '0.65rem' } as const;
const resultButtonStyle = { display: 'inline-flex', alignItems: 'center', gap: '0.65rem', border: 'none', padding: 0, background: 'none', cursor: 'pointer', textAlign: 'left' } as const;
const resultIndicatorStyle = { width: '1.4rem', height: '1.4rem', borderRadius: '0.25rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' } as const;
const resultTextStyle = { fontSize: 'clamp(1rem, 2.8vw, 1.2rem)', fontWeight: 700, color: UI_COLORS.ink900 } as const;

export default function ChecklistAccordion({
	steps,
	resultOptions,
	expandedSteps,
	selectedResults,
	onToggleStep,
	onToggleResult,
}: ChecklistAccordionProps) {
	return (
		<div style={checklistStackStyle}>
			{steps.map((step) => {
				const isExpanded = expandedSteps.includes(step.id);
				const stepValues = selectedResults[step.id] ?? [];

				return (
					<div key={step.id}>
						<button type="button" onClick={() => onToggleStep(step.id)} style={stepButtonStyle}>
							<div style={stepHeaderStyle}>
								<span style={stepBadgeStyle}>{step.id}</span>
								<span style={stepTitleStyle}>{step.title}</span>
							</div>
							{isExpanded ? <ChevronDown width={24} height={24} color={UI_COLORS.ink900} strokeWidth={2.5} /> : <ChevronRight width={24} height={24} color={UI_COLORS.ink900} strokeWidth={2.5} />}
						</button>

						{isExpanded ? (
							<div style={expandedPanelStyle}>
								<p style={detailTextStyle}>
									<span style={detailLabelStyle}>Kontrolleres mot:</span> {step.kontrolleresMot}
								</p>
								<p style={detailTextLastStyle}>
									<span style={detailLabelStyle}>Testprosedyre:</span> {step.testprosedyre}
								</p>
								<h3 style={resultHeadingStyle}>Resultat</h3>
								<div style={resultListStyle}>
									{resultOptions.map((option) => {
										const checked = stepValues.includes(option);

										return (
											<button key={option} type="button" onClick={() => onToggleResult(step.id, option)} style={resultButtonStyle}>
											<span style={{ ...resultIndicatorStyle, border: checked ? `2px solid ${UI_COLORS.statusChecked}` : `2px solid ${UI_COLORS.line300}`, background: checked ? UI_COLORS.statusChecked : UI_COLORS.surface0 }}>
													{checked ? <Check width={12} height={12} color="#ffffff" strokeWidth={3.2} /> : null}
												</span>
												<span style={resultTextStyle}>{option}</span>
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
	);
}
