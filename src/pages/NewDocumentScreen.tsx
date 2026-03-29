// Track local UI state for search and expanded groups
import { useState } from 'react';
// Read incoming route state and navigate to selected forms
import { useLocation, useNavigate } from 'react-router-dom';
// Icons used to make document choices easier to scan quickly
import {
	AppWindow,
	ArrowLeft,
	Box,
	ChevronDown,
	ChevronRight,
	ClipboardCheck,
	DoorOpen,
	LayoutGrid,
	Package,
	Search,
	Truck,
	TriangleAlert,
	Wind,
} from 'lucide-react';
import { APP_FONT_FAMILY, BODY_FONT_FAMILY, UI_COLORS } from '../styles/uiTokens';
import type { ProjectRouteState } from '../types/navigation';
import { getProjectContextFromState } from '../utils/navigation';

// Shared shape for document entries and nested sub-types
interface DocItem {
	id: string;
	label: string;
	iconName: string;
	iconBg: string;
	route?: string;
	children?: DocItem[];
}

// Available document flows shown to the user
const DOC_TYPES: DocItem[] = [
	{ id: 'avvik', label: 'Registrer avvik', iconName: 'avvik', iconBg: 'bg-red-600', route: '/avvik' },
	{ id: 'ks-verksted', label: 'KS Verksted', iconName: 'verksted', iconBg: 'bg-red-600', route: '/ks-verksted' },
	{
		id: 'ks-montasje',
		label: 'KS Montasje',
		iconName: 'montasje',
		iconBg: 'bg-red-600',
		children: [
			{ id: 'vindu-montasje', label: 'Vindu montasje', iconName: 'vindu', iconBg: 'bg-slate-200', route: '/ks-montasje' },
			{ id: 'dor-montasje', label: 'Dørmontasje', iconName: 'dor', iconBg: 'bg-slate-200', route: '/ks-montasje' },
			{ id: 'glass-montasje', label: 'Glass montasje', iconName: 'glass-small', iconBg: 'bg-slate-200', route: '/ks-montasje' },
		],
	},
	{ id: 'varer-mottak', label: 'Varer mottak', iconName: 'varer', iconBg: 'bg-slate-800', route: '/varer-mottak' },
	{ id: 'profiler-mottak', label: 'Profiler mottak', iconName: 'profiler', iconBg: 'bg-slate-800', route: '/profiler-mottak' },
	{ id: 'glass-mottak', label: 'Glass mottak', iconName: 'glass', iconBg: 'bg-slate-800', route: '/glass-mottak' },
	{ id: 'montasje-plan', label: 'Montasjeplan', iconName: 'plan', iconBg: 'bg-green-700', route: '/montasje-plan' },
];

const pageStyle = { minHeight: '100vh', background: UI_COLORS.surface50 } as const;
const topBarStyle = { background: UI_COLORS.surface0, borderBottom: `1px solid ${UI_COLORS.line250}`, boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)' } as const;
const maxContentStyle = { maxWidth: '42rem', margin: '0 auto', padding: '0 1rem' } as const;
const topBackWrapStyle = { paddingTop: '1.1rem', paddingBottom: '1.1rem' } as const;
const backButtonStyle = {
	display: 'inline-flex',
	alignItems: 'center',
	gap: '0.75rem',
	background: 'none',
	border: 'none',
	cursor: 'pointer',
	padding: 0,
	color: UI_COLORS.ink900,
} as const;
const backIconBadgeStyle = {
	width: '2.55rem',
	height: '2.55rem',
	borderRadius: '0.9rem',
	background: UI_COLORS.ink900,
	display: 'inline-flex',
	alignItems: 'center',
	justifyContent: 'center',
	flexShrink: 0,
} as const;
const backLabelStyle = { fontSize: 'clamp(1rem, 2.6vw, 1.35rem)', fontWeight: 800, color: UI_COLORS.ink900 } as const;
const projectHeaderStyle = { paddingBottom: '1.5rem' } as const;
const projectNumberStyle = { fontSize: '0.82rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', color: UI_COLORS.ink900, marginBottom: '0.45rem' } as const;
const projectTitleStyle = { fontSize: 'clamp(2rem, 6vw, 3rem)', fontWeight: 900, color: UI_COLORS.ink900, margin: 0, lineHeight: 1.05 } as const;
const bodyWrapStyle = { maxWidth: '42rem', margin: '0 auto', padding: '1.2rem 1rem 0' } as const;
const headingStyle = { fontSize: 'clamp(1.35rem, 4vw, 1.75rem)', fontWeight: 900, color: UI_COLORS.ink900, margin: '0 0 1rem' } as const;
const searchWrapStyle = { position: 'relative', marginBottom: '1.1rem' } as const;
const searchIconStyle = { position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: UI_COLORS.ink400 } as const;
const searchInputStyle = {
	width: '100%',
	height: 'clamp(3.3rem, 8vw, 3.9rem)',
	borderRadius: '1rem',
	border: `1.5px solid ${UI_COLORS.line300}`,
	background: UI_COLORS.surface0,
	paddingLeft: '3.15rem',
	paddingRight: '1rem',
	fontSize: 'clamp(1rem, 2.8vw, 1.2rem)',
	fontWeight: 700,
	color: UI_COLORS.ink800,
	outline: 'none',
	boxSizing: 'border-box',
	fontFamily: APP_FONT_FAMILY,
} as const;
const listStyle = { display: 'flex', flexDirection: 'column', gap: '0.75rem' } as const;
const parentButtonBaseStyle = {
	display: 'flex',
	width: '100%',
	alignItems: 'center',
	gap: '0.85rem',
	borderRadius: '1rem',
	background: UI_COLORS.surface0,
	padding: 'clamp(1rem, 3vw, 1.35rem) clamp(1rem, 3vw, 1.4rem)',
	textAlign: 'left',
	cursor: 'pointer',
	boxSizing: 'border-box',
	boxShadow: '0 1px 0 rgba(148, 163, 184, 0.12)',
} as const;
const parentIconStyle = { width: 'clamp(2.8rem, 8vw, 3.35rem)', height: 'clamp(2.8rem, 8vw, 3.35rem)', borderRadius: '0.75rem', display: 'grid', placeItems: 'center', flexShrink: 0 } as const;
const parentLabelStyle = { flex: 1, fontSize: 'clamp(1.05rem, 3.2vw, 1.35rem)', fontWeight: 900, color: UI_COLORS.ink800, fontFamily: BODY_FONT_FAMILY } as const;
const childListStyle = { marginLeft: 'clamp(0.75rem, 3vw, 1.5rem)', marginTop: '0.6rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' } as const;
const childButtonStyle = {
	display: 'flex',
	width: '100%',
	alignItems: 'center',
	gap: '0.85rem',
	borderRadius: '1rem',
	border: `1.5px solid ${UI_COLORS.line300}`,
	background: UI_COLORS.surface0,
	padding: 'clamp(0.95rem, 2.8vw, 1.15rem) clamp(0.95rem, 3vw, 1.3rem)',
	textAlign: 'left',
	cursor: 'pointer',
	boxSizing: 'border-box',
	boxShadow: '0 1px 0 rgba(148, 163, 184, 0.1)',
} as const;
const childIconStyle = { width: 'clamp(2.45rem, 7vw, 3rem)', height: 'clamp(2.45rem, 7vw, 3rem)', borderRadius: '0.625rem', display: 'grid', placeItems: 'center', flexShrink: 0, background: UI_COLORS.surface75 } as const;
const childLabelStyle = { flex: 1, fontSize: 'clamp(1rem, 3vw, 1.24rem)', fontWeight: 800, color: UI_COLORS.ink500, fontFamily: BODY_FONT_FAMILY } as const;
const bottomSpacerStyle = { height: '2rem' } as const;

function getDocIconBackground(iconBg: string) {
	if (iconBg === 'bg-red-600') return UI_COLORS.statusError;
	if (iconBg === 'bg-slate-800') return UI_COLORS.ink800;
	return UI_COLORS.successGreenDark;
}
// Map logical icon names to concrete icon components
function DocIcon({ name, small }: { name: string; small?: boolean }) {
	const size = small ? 22 : 26;
	const color = small ? UI_COLORS.ink500 : UI_COLORS.surface0;
	const props = { width: size, height: size, color, strokeWidth: 2.2 };

	switch (name) {
		case 'avvik':
			return <TriangleAlert {...props} />;
		case 'verksted':
			return <ClipboardCheck {...props} />;
		case 'montasje':
			return <LayoutGrid {...props} />;
		case 'vindu':
			return <Wind {...props} />;
		case 'dor':
			return <DoorOpen {...props} />;
		case 'glass-small':
		case 'glass':
			return <AppWindow {...props} />;
		case 'varer':
			return <Package {...props} />;
		case 'profiler':
			return <Truck {...props} />;
		case 'plan':
			return <Box {...props} />;
		default:
			return <Box {...props} />;
	}
}

export default function NewDocumentScreen() {
	// Router helpers for reading project context and opening target forms
	const navigate = useNavigate();
	const location = useLocation();
	// Resolve optional incoming route state safely
	const state = (location.state as ProjectRouteState | null) ?? null;
	// Keep track of currently expanded parent group
	const [expandedId, setExpandedId] = useState<string | null>(null);
	// Keep search query local for instant filtering
	const [search, setSearch] = useState('');

	const { manualProjectEntry, projectNumber, projectName } = getProjectContextFromState(state);
	const returnNavigation = { returnTo: location.pathname, returnState: location.state };
	// Reuse a shared payload so downstream forms retain project context
	const projectState = {
		projectNumber,
		projectName,
		manualProjectEntry,
		...returnNavigation,
	};

	// Filter parent and child entries to match user search input
	const filtered = DOC_TYPES.filter(
		(doc) =>
			doc.label.toLowerCase().includes(search.toLowerCase()) ||
			doc.children?.some((child) => child.label.toLowerCase().includes(search.toLowerCase())),
	);

	// Main document-type picker screen
	return (
		<div className="app-font" style={pageStyle}>
			{/* Sticky-feel top area with back action and project identity */}
			<div style={topBarStyle}>
				<div style={maxContentStyle}>
					<div style={topBackWrapStyle}>
						{/* Return to projects list */}
						<button
							type="button"
							onClick={() => navigate('/projects')}
							style={backButtonStyle}
						>
							{/* Keep back icon highly visible on touch devices */}
							<span style={backIconBadgeStyle}>
								<ArrowLeft width={22} height={22} color="#ffffff" strokeWidth={2.6} />
							</span>
							{/* Explicit text label improves discoverability of back action */}
							<span style={backLabelStyle}>Tilbake</span>
						</button>
					</div>

					{/* Show active project so users create docs in the right context */}
					<div style={projectHeaderStyle}>
						<p style={projectNumberStyle}>
							{projectNumber}
						</p>
						<h1 style={projectTitleStyle}>
							{projectName}
						</h1>
					</div>
				</div>
			</div>

			{/* Search + document options list */}
			<div style={bodyWrapStyle}>
				<h2 style={headingStyle}>
					Hva vil du dokumentere?
				</h2>

				{/* Quick filter to find target form faster */}
				<div style={searchWrapStyle}>
					<Search style={searchIconStyle} width={22} height={22} />
					<input
						type="text"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Søk dokumenttype..."
						style={searchInputStyle}
					/>
				</div>

				{/* Render each document card and optional child choices */}
				<div style={listStyle}>
					{filtered.map((doc) => {
						// Derived flags keep click behavior and UI state easy to follow
						const isExpanded = expandedId === doc.id;
						const hasChildren = !!doc.children?.length;

						return (
							<div key={doc.id}>
								{/* Parent row: either expands children or navigates directly */}
								<button
									type="button"
									onClick={() => {
										if (hasChildren) setExpandedId(isExpanded ? null : doc.id);
										else if (doc.route) navigate(doc.route, { state: projectState });
									}}
									style={{
										...parentButtonBaseStyle,
										border: isExpanded ? `2.5px solid ${UI_COLORS.ink900}` : `1.5px solid ${UI_COLORS.line300}`,
									}}
								>
									{/* Color-coded icon background helps category recognition */}
									<div style={{ ...parentIconStyle, background: getDocIconBackground(doc.iconBg) }}>
										<DocIcon name={doc.iconName} />
									</div>
									{/* Primary doc label takes remaining space for readability */}
									<span style={parentLabelStyle}>
										{doc.label}
									</span>
									{/* Chevron communicates whether children are expanded */}
									{isExpanded && hasChildren ? <ChevronDown width={22} height={22} color={UI_COLORS.ink400} strokeWidth={2.5} /> : <ChevronRight width={22} height={22} color={UI_COLORS.ink400} strokeWidth={2.5} />}
								</button>

								{hasChildren && isExpanded ? (
									/* Child list appears only when parent row is expanded */
									<div style={childListStyle}>
										{doc.children!.map((child) => (
											/* Child row passes selected montasje type into next screen */
											<button
												key={child.id}
												type="button"
												onClick={() => child.route && navigate(child.route, { state: { ...projectState, montasjeType: child.label } })}
												style={childButtonStyle}
											>
													{/* Lighter icon style differentiates child from parent rows */}
												<div style={childIconStyle}>
													<DocIcon name={child.iconName} small />
												</div>
													{/* Child label and chevron keep interaction pattern consistent */}
												<span style={childLabelStyle}>
													{child.label}
												</span>
												<ChevronRight width={20} height={20} color={UI_COLORS.ink400} strokeWidth={2.5} />
											</button>
										))}
									</div>
								) : null}
							</div>
						);
					})}
				</div>

				<div style={bottomSpacerStyle} />
			</div>
		</div>
	);
}
