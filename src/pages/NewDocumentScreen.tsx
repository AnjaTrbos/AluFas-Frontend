import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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

interface DocItem {
	id: string;
	label: string;
	iconName: string;
	iconBg: string;
	route?: string;
	children?: DocItem[];
}

interface NewDocumentLocationState {
	projectNumber?: string;
	projectName?: string;
	manualProjectEntry?: boolean;
}

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

// Fallback project until the picker is fully driven by backend data.
const DEFAULT_PROJECT = { projectNumber: 'AF-2024-001', name: 'Elkjøp Hercules' };

function DocIcon({ name, small }: { name: string; small?: boolean }) {
	const size = small ? 22 : 26;
	const color = small ? '#475569' : '#ffffff';
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
			return <AppWindow {...props} />;
		case 'varer':
			return <Package {...props} />;
		case 'profiler':
			return <Truck {...props} />;
		case 'glass':
			return <AppWindow {...props} />;
		case 'plan':
			return <Box {...props} />;
		default:
			return <Box {...props} />;
	}
}

export default function NewDocumentScreen() {
	const navigate = useNavigate();
	const location = useLocation();
	const state = (location.state as NewDocumentLocationState | null) ?? null;
	const [expandedId, setExpandedId] = useState<string | null>(null);
	const [search, setSearch] = useState('');

	const projectNumber = state?.projectNumber ?? DEFAULT_PROJECT.projectNumber;
	const projectName = state?.projectName ?? DEFAULT_PROJECT.name;
	const projectState = {
		projectNumber,
		projectName,
		manualProjectEntry: state?.manualProjectEntry ?? false,
	};

	const filtered = DOC_TYPES.filter(
		(doc) =>
			doc.label.toLowerCase().includes(search.toLowerCase()) ||
			doc.children?.some((child) => child.label.toLowerCase().includes(search.toLowerCase())),
	);

	return (
		<div style={{ minHeight: '100vh', background: '#f1f5f9', fontFamily: 'Arial, sans-serif' }}>
			<div
				style={{
					background: '#ffffff',
					borderBottom: '1px solid #dbe4ee',
					boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)',
				}}
			>
				<div style={{ maxWidth: '42rem', margin: '0 auto', padding: '0 1rem' }}>
					<div style={{ paddingTop: '1.1rem', paddingBottom: '1.1rem' }}>
						<button
							type="button"
							onClick={() => navigate('/projects')}
							style={{
								display: 'inline-flex',
								alignItems: 'center',
								gap: '0.75rem',
								background: 'none',
								border: 'none',
								cursor: 'pointer',
								padding: 0,
								color: '#0f172a',
							}}
						>
							<span
								style={{
									width: '2.55rem',
									height: '2.55rem',
									borderRadius: '0.9rem',
									background: '#0f172a',
									display: 'inline-flex',
									alignItems: 'center',
									justifyContent: 'center',
									flexShrink: 0,
								}}
							>
								<ArrowLeft width={22} height={22} color="#ffffff" strokeWidth={2.6} />
							</span>
							<span style={{ fontSize: 'clamp(1rem, 2.6vw, 1.35rem)', fontWeight: 800, color: '#0f172a' }}>Tilbake</span>
						</button>
					</div>

					<div style={{ paddingBottom: '1.5rem' }}>
						<p style={{ fontSize: '0.82rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#1d4ed8', marginBottom: '0.45rem' }}>
							{projectNumber}
						</p>
						<h1 style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', fontWeight: 900, color: '#0f172a', margin: 0, lineHeight: 1.05 }}>
							{projectName}
						</h1>
					</div>
				</div>
			</div>

			<div style={{ maxWidth: '42rem', margin: '0 auto', padding: '1.2rem 1rem 0' }}>
				<h2 style={{ fontSize: 'clamp(1.35rem, 4vw, 1.75rem)', fontWeight: 900, color: '#0f172a', margin: '0 0 1rem' }}>
					Hva vil du dokumentere?
				</h2>

				<div style={{ position: 'relative', marginBottom: '1.1rem' }}>
					<Search
						style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#94a3b8' }}
						width={22}
						height={22}
					/>
					<input
						type="text"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Søk dokumenttype..."
						style={{
							width: '100%',
							height: 'clamp(3.3rem, 8vw, 3.9rem)',
							borderRadius: '1rem',
							border: '1.5px solid #cbd5e1',
							background: '#ffffff',
							paddingLeft: '3.15rem',
							paddingRight: '1rem',
							fontSize: 'clamp(1rem, 2.8vw, 1.2rem)',
							fontWeight: 700,
							color: '#1e293b',
							outline: 'none',
							boxSizing: 'border-box',
							fontFamily: 'Arial, sans-serif',
						}}
					/>
				</div>

				<div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
					{filtered.map((doc) => {
						const isExpanded = expandedId === doc.id;
						const hasChildren = !!doc.children?.length;

						return (
							<div key={doc.id}>
								<button
									type="button"
									onClick={() => {
										if (hasChildren) setExpandedId(isExpanded ? null : doc.id);
										else if (doc.route) navigate(doc.route, { state: projectState });
									}}
									style={{
										display: 'flex',
										width: '100%',
										alignItems: 'center',
										gap: '0.85rem',
										borderRadius: '1rem',
										border: isExpanded ? '2.5px solid #0f172a' : '1.5px solid #cbd5e1',
										background: '#ffffff',
										padding: 'clamp(1rem, 3vw, 1.35rem) clamp(1rem, 3vw, 1.4rem)',
										textAlign: 'left',
										cursor: 'pointer',
										boxSizing: 'border-box',
										boxShadow: '0 1px 0 rgba(148, 163, 184, 0.12)',
									}}
								>
									<div
										style={{
											width: 'clamp(2.8rem, 8vw, 3.35rem)',
											height: 'clamp(2.8rem, 8vw, 3.35rem)',
											borderRadius: '0.75rem',
											display: 'grid',
											placeItems: 'center',
											flexShrink: 0,
											background:
												doc.iconBg === 'bg-red-600'
													? '#dc2626'
													: doc.iconBg === 'bg-slate-800'
														? '#1e293b'
														: '#16a34a',
										}}
									>
										<DocIcon name={doc.iconName} />
									</div>
									<span style={{ flex: 1, fontSize: 'clamp(1.05rem, 3.2vw, 1.35rem)', fontWeight: 900, color: '#1e293b', fontFamily: 'Arial, sans-serif' }}>
										{doc.label}
									</span>
									{isExpanded && hasChildren ? <ChevronDown width={22} height={22} color="#94a3b8" strokeWidth={2.5} /> : <ChevronRight width={22} height={22} color="#94a3b8" strokeWidth={2.5} />}
								</button>

								{hasChildren && isExpanded ? (
									<div style={{ marginLeft: 'clamp(0.75rem, 3vw, 1.5rem)', marginTop: '0.6rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
										{doc.children!.map((child) => (
											<button
												key={child.id}
												type="button"
												onClick={() => child.route && navigate(child.route, { state: { ...projectState, montasjeType: child.label } })}
												style={{
													display: 'flex',
													width: '100%',
													alignItems: 'center',
													gap: '0.85rem',
													borderRadius: '1rem',
													border: '1.5px solid #cbd5e1',
													background: '#ffffff',
													padding: 'clamp(0.95rem, 2.8vw, 1.15rem) clamp(0.95rem, 3vw, 1.3rem)',
													textAlign: 'left',
													cursor: 'pointer',
													boxSizing: 'border-box',
													boxShadow: '0 1px 0 rgba(148, 163, 184, 0.1)',
												}}
											>
												<div
													style={{
														width: 'clamp(2.45rem, 7vw, 3rem)',
														height: 'clamp(2.45rem, 7vw, 3rem)',
														borderRadius: '0.625rem',
														display: 'grid',
														placeItems: 'center',
														flexShrink: 0,
														background: '#e2e8f0',
													}}
												>
													<DocIcon name={child.iconName} small />
												</div>
												<span style={{ flex: 1, fontSize: 'clamp(1rem, 3vw, 1.24rem)', fontWeight: 800, color: '#334155', fontFamily: 'Arial, sans-serif' }}>
													{child.label}
												</span>
												<ChevronRight width={20} height={20} color="#94a3b8" strokeWidth={2.5} />
											</button>
										))}
									</div>
								) : null}
							</div>
						);
					})}
				</div>

				<div style={{ height: '2rem' }} />
			</div>
		</div>
	);
}
