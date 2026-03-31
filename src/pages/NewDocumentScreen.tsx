// Track local UI state for search and expanded groups
import { useState } from 'react';
// Read incoming route state and navigate to selected forms
import { useLocation, useNavigate } from 'react-router-dom';
// Icons used to make document choices easier to scan quickly
import {
	AppWindow,
	ArrowLeft,
	ArrowLeftRight,
	Box,
	Boxes,
	Building2,
	ChevronDown,
	ChevronRight,
	ClipboardCheck,
	Flame,
	LayoutGrid,
	Lock,
	Package,
	ShieldCheck,
	TriangleAlert,
	Truck,
	Warehouse,
	Wind,
	Wrench,
} from 'lucide-react';
import { BODY_FONT_FAMILY, UI_COLORS } from '../styles/uiTokens';
import { SearchBar } from '../components/ui/AFComponents';
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

// Available document flows — structured per the employer's hierarchy
const DOC_TYPES: DocItem[] = [
	{ id: 'avvik', label: 'Registrer avvik', iconName: 'avvik', iconBg: 'red', route: '/avvik' },
	{
		id: 'ks-verksted',
		label: 'KS Verksted',
		iconName: 'verksted',
		iconBg: 'blue',
		children: [
			{ id: 'ks-fasade-v', label: 'KS Fasade', iconName: 'fasade', iconBg: '' },
			{ id: 'ks-fastkammer', label: 'KS Fastkammer', iconName: 'fastkammer', iconBg: '' },
			{ id: 'ks-vindu-dor-v', label: 'KS Vindu/dør', iconName: 'vindu', iconBg: '', route: '/ks-verksted' },
			{ id: 'ks-skyv-folde-v', label: 'KS Skyv/folde', iconName: 'skyv', iconBg: '' },
			{ id: 'ks-brann-v', label: 'KS Brann produkter', iconName: 'brann', iconBg: '' },
		],
	},
	{
		id: 'ks-montasje',
		label: 'KS Montasje',
		iconName: 'montasje',
		iconBg: 'navy',
		children: [
			{ id: 'sja', label: 'SJA (Sikker jobb analyse)', iconName: 'sja', iconBg: '' },
			{ id: 'ks-fasade-tak', label: 'KS Fasade/tak', iconName: 'fasade', iconBg: '' },
			{ id: 'ks-vindu-dor-m', label: 'KS Vindu/dør', iconName: 'vindu', iconBg: '', route: '/ks-montasje' },
			{ id: 'ks-skyv-folde-m', label: 'KS Skyv/folde', iconName: 'skyv', iconBg: '' },
			{ id: 'ks-brann-m', label: 'KS Brann produkter', iconName: 'brann', iconBg: '' },
			{ id: 'ks-sma', label: 'KS Små produkter', iconName: 'sma', iconBg: '' },
			{ id: 'service-jobb', label: 'Service jobb', iconName: 'service', iconBg: '' },
		],
	},
	{
		id: 'mottak',
		label: 'Mottak',
		iconName: 'mottak',
		iconBg: 'green',
		children: [
			{ id: 'varer-mottak', label: 'Varemottak', iconName: 'varer', iconBg: '', route: '/varer-mottak' },
			{ id: 'profiler-mottak', label: 'Profilmottak', iconName: 'profiler', iconBg: '', route: '/profiler-mottak' },
			{ id: 'glass-mottak', label: 'Glassmottak', iconName: 'glass', iconBg: '', route: '/glass-mottak' },
		],
	},
	{ id: 'montasje-plan', label: 'Montasjeplan', iconName: 'plan', iconBg: 'orange', route: '/montasje-plan' },
];

const pageStyle = { minHeight: '100vh', background: UI_COLORS.surface50 } as const;
const topBarStyle = { background: UI_COLORS.surface0, borderBottom: `1px solid ${UI_COLORS.line250}`, boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)' } as const;
const maxContentStyle = { maxWidth: '48rem', margin: '0 auto', padding: '0 1rem' } as const;
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
const bodyWrapStyle = { maxWidth: '48rem', margin: '0 auto', padding: '1.2rem 1rem 0' } as const;
const headingStyle = { fontSize: 'clamp(1.35rem, 4vw, 1.75rem)', fontWeight: 900, color: UI_COLORS.ink900, margin: '0 0 1rem' } as const;
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
const childIconStyle = { width: 'clamp(2.45rem, 7vw, 3rem)', height: 'clamp(2.45rem, 7vw, 3rem)', borderRadius: '0.625rem', display: 'grid', placeItems: 'center', flexShrink: 0 } as const;
const childLabelStyle = { flex: 1, fontSize: 'clamp(1rem, 3vw, 1.24rem)', fontWeight: 800, color: UI_COLORS.ink500, fontFamily: BODY_FONT_FAMILY } as const;
const bottomSpacerStyle = { height: '2rem' } as const;

function getDocIconBackground(iconBg: string) {
	switch (iconBg) {
		case 'red': return '#993333';
		case 'blue': return '#333399';
		case 'navy': return '#0f172a';
		case 'green': return '#3b9933';
		case 'orange': return '#993333';
		default: return UI_COLORS.ink800;
	}
}
// Map logical icon names to concrete icon components
function DocIcon({ name, small }: { name: string; small?: boolean }) {
	const size = small ? 22 : 26;
	const color = UI_COLORS.surface0;
	const props = { width: size, height: size, color, strokeWidth: 2.2 };

	switch (name) {
		case 'avvik': return <TriangleAlert {...props} />;
		case 'verksted': return <ClipboardCheck {...props} />;
		case 'montasje': return <LayoutGrid {...props} />;
		case 'mottak': return <Warehouse {...props} />;
		case 'vindu': return <Wind {...props} />;
		case 'glass': return <AppWindow {...props} />;
		case 'varer': return <Package {...props} />;
		case 'profiler': return <Truck {...props} />;
		case 'plan': return <Box {...props} />;
		case 'fasade': return <Building2 {...props} />;
		case 'fastkammer': return <Lock {...props} />;
		case 'skyv': return <ArrowLeftRight {...props} />;
		case 'brann': return <Flame {...props} />;
		case 'sja': return <ShieldCheck {...props} />;
		case 'sma': return <Boxes {...props} />;
		case 'service': return <Wrench {...props} />;
		default: return <Box {...props} />;
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
				<div style={{ marginBottom: '1.1rem' }}>
					<SearchBar
						value={search}
						onChange={setSearch}
						placeholder="Søk dokumenttype..."
						aria-label="Søk dokumenttyper"
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
										{doc.children!.map((child) => {
											const isAvailable = !!child.route;
											return (
												<button
													key={child.id}
													type="button"
													disabled={!isAvailable}
													onClick={() => isAvailable && navigate(child.route!, { state: { ...projectState, montasjeType: child.label } })}
													style={{ ...childButtonStyle, opacity: isAvailable ? 1 : 0.45, cursor: isAvailable ? 'pointer' : 'default' }}
												>
													<div style={{ ...childIconStyle, background: getDocIconBackground(doc.iconBg) }}>
														<DocIcon name={child.iconName} small />
													</div>
													<span style={childLabelStyle}>{child.label}</span>
													{isAvailable
														? <ChevronRight width={20} height={20} color={UI_COLORS.ink400} strokeWidth={2.5} />
														: <span style={{ fontSize: '0.72rem', fontWeight: 700, color: UI_COLORS.ink400, fontFamily: BODY_FONT_FAMILY, whiteSpace: 'nowrap' }}>Kommer snart</span>
													}
												</button>
											);
										})}
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
