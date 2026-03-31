// Core React hooks for state, effects, memoized lists, and DOM refs
import { useEffect, useMemo, useRef, useState } from 'react';
// Navigation hook to move into project-specific flows
import { useNavigate } from 'react-router-dom';
// Icons improve scannability and visual hierarchy across controls
import {
	CalendarDays,
	ChevronDown,
	ChevronRight,
	ChevronUp,
	FileText,
	Link2,
	MapPin,
	SlidersHorizontal,
	TriangleAlert,
	Zap,
} from 'lucide-react';
import { BODY_FONT_FAMILY } from '../styles/uiTokens';
import { SearchBar } from '../components/ui/AFComponents';
// Shared project type used by the app
import type { Project } from '../types/app';

// Extended project model for UI-only metadata
type ProjectListItem = Project & {
	recentlyUpdated?: boolean;
	year?: number;
};

type ProjectTab = 'active' | 'closed';

// Filter values driving sort/type filtering behavior
type FilterOption = 'all' | 'a-z' | 'z-a' | 'newest' | 'oldest' | 'window' | 'door' | 'facade' | 'general';

interface FilterConfig {
	value: FilterOption;
	label: string;
	group?: string;
}

// Available filter actions grouped for easier discovery in the dropdown
const FILTER_OPTIONS: FilterConfig[] = [
	{ value: 'all', label: 'Alle prosjekter' },
	{ value: 'a-z', label: 'A -> Å', group: 'Alfabetisk' },
	{ value: 'z-a', label: 'Å -> A', group: 'Alfabetisk' },
	{ value: 'newest', label: 'Nyeste først', group: 'År' },
	{ value: 'oldest', label: 'Eldste først', group: 'År' },
	{ value: 'window', label: 'Vinduer', group: 'Type' },
	{ value: 'door', label: 'Dører', group: 'Type' },
	{ value: 'facade', label: 'Fasader', group: 'Type' },
	{ value: 'general', label: 'Generell', group: 'Type' },
];

const FILTER_GROUPS = ['', 'Alfabetisk', 'År', 'Type'];

// Temporary local dataset until backend integration is wired
const DUMMY_PROJECTS: ProjectListItem[] = [
	{
		id: '1',
		projectNumber: 'AF-2024-001',
		name: 'Elkjøp Hercules',
		location: 'Oslo',
		lastUpdated: 'Sist oppdatert 2 timer siden',
		status: 'active',
		type: 'general',
		recentlyUpdated: true,
		year: 2024,
	},
	{
		id: '2',
		projectNumber: 'AF-2024-012',
		name: 'Bergen kontor vinduer',
		location: 'Bergen',
		lastUpdated: 'Sist oppdatert i går',
		status: 'active',
		type: 'window',
		year: 2024,
	},
	{
		id: '3',
		projectNumber: 'AF-2024-018',
		name: 'Stavanger Boligprosjekt',
		location: 'Stavanger',
		lastUpdated: 'Sist oppdatert 3 dager siden',
		status: 'active',
		type: 'facade',
		year: 2024,
	},
	{
		id: '4',
		projectNumber: 'AF-2023-120',
		name: 'Tromsø Terminal Fasade',
		location: 'Tromsø',
		lastUpdated: 'Lukket i november',
		status: 'closed',
		type: 'facade',
		year: 2023,
	},
];

export default function ProjectsScreen() {
	// Router navigation used by project cards and actions
	const navigate = useNavigate();
	// Keep tab, search, and filtering state local for responsive UX
	const [activeTab, setActiveTab] = useState<ProjectTab>('active');
	const [searchQuery, setSearchQuery] = useState('');
	const projects = DUMMY_PROJECTS;
	const [activeFilter, setActiveFilter] = useState<FilterOption>('all');
	const [filterOpen, setFilterOpen] = useState(false);
	// Ref allows outside-click detection for closing the dropdown
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		// Close filter menu when user clicks outside of it
		const handleClickOutside = (e: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
				setFilterOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	// Derive visible list from tab, search, type filter, and sort option
	const visibleProjects = useMemo(() => {
		const q = searchQuery.trim().toLowerCase();

		let list = projects
			.filter((project) => project.status === activeTab)
			.filter((project) => (!q ? true : [project.projectNumber, project.name, project.location].some((value) => value.toLowerCase().includes(q))));

		if (['window', 'door', 'facade', 'general'].includes(activeFilter)) list = list.filter((p) => p.type === activeFilter);

		if (activeFilter === 'a-z') list = [...list].sort((a, b) => a.name.localeCompare(b.name, 'no'));
		else if (activeFilter === 'z-a') list = [...list].sort((a, b) => b.name.localeCompare(a.name, 'no'));
		else if (activeFilter === 'newest') list = [...list].sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
		else if (activeFilter === 'oldest') list = [...list].sort((a, b) => (a.year ?? 0) - (b.year ?? 0));

		return list;
	}, [activeFilter, activeTab, projects, searchQuery]);

	// Human-readable label for currently selected filter
	const activeFilterLabel = FILTER_OPTIONS.find((filter) => filter.value === activeFilter)?.label ?? 'Filtrer';

	return (
		// Main container for project selection and quick actions
		<div className="min-h-screen bg-[#ffffff] px-4 pb-5 pt-6 font-[Arial,sans-serif] sm:pb-6 sm:pt-10">
			<div className="mx-auto max-w-3xl">
				{/* BACKEND: Replace the hardcoded name with the signed-in user's display name. */}
				<h1 className="text-3xl font-black text-[#0f172a] sm:text-4xl md:text-5xl">Velkommen, Ola Nordmann</h1>

				<div className="mt-5 rounded-xl border border-[#bfbfbf] bg-[#bfbfbf] p-1">
					{/* Tab switch keeps active and archived contexts separated */}
					<div className="grid grid-cols-2 gap-1">
						{(['active', 'closed'] as const).map((tab) => (
							<button
								key={tab}
								type="button"
								onClick={() => setActiveTab(tab)}
								style={{ fontSize: 'clamp(0.95rem, 2vw, 1.25rem)', fontWeight: 900 }}
								className={`rounded-lg px-3 py-3 transition-colors sm:px-6 ${activeTab === tab ? 'bg-white text-[#0f172a] shadow-sm' : 'text-[#0f172a]/90 hover:bg-white/50'}`}
							>
								{tab === 'active' ? 'Aktive prosjekter' : 'Arkiverte prosjekter'}
							</button>
						))}
					</div>
				</div>

				{/* Search + filter controls for narrowing large project lists */}
				<div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
					<SearchBar
						value={searchQuery}
						onChange={setSearchQuery}
						placeholder="Søk prosjekter..."
						aria-label="Søk prosjekter"
					/>

					<div className="relative w-full sm:w-auto" ref={dropdownRef}>
						{/* Filter trigger doubles as current-filter indicator */}
						<button
							type="button"
							onClick={() => setFilterOpen((prev) => !prev)}
							style={{ fontSize: 'clamp(1rem, 2vw, 1.1rem)', fontWeight: 700 }}
							className={`inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border-[3px] border-[#333399] px-5 transition-colors sm:h-14 sm:w-auto ${
								activeFilter !== 'all' ? 'bg-[#0f172a] text-white' : 'bg-white text-[#333399] hover:bg-[#ffffff]'
							}`}
						>
							<SlidersHorizontal className="h-5 w-5 sm:h-6 sm:w-6" />
							{activeFilter === 'all' ? 'Filtrer' : activeFilterLabel}
							{filterOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
						</button>

						{filterOpen && (
							/* Grouped filter menu improves discoverability of sort/type options */
							<div className="absolute right-0 top-full z-50 mt-2 min-w-full overflow-hidden rounded-2xl border border-[#bfbfbf] bg-white shadow-2xl sm:min-w-56">
								{FILTER_GROUPS.map((group) => {
									const items = FILTER_OPTIONS.filter((filter) => (filter.group ?? '') === group);
									if (items.length === 0) return null;

									return (
										<div key={group || 'top'}>
											{group ? <p className="px-4 pb-1 pt-3 text-xs font-black uppercase tracking-widest text-[#808080]">{group}</p> : null}
											{items.map((option) => {
												const isActive = activeFilter === option.value;

												return (
													<button
														key={option.value}
														type="button"
														onClick={() => {
															setActiveFilter(option.value);
															setFilterOpen(false);
														}}
													className={`flex w-full items-center gap-3 px-4 py-3 text-left text-base font-bold transition-colors hover:bg-[#ffffff] sm:text-lg ${
														isActive ? 'bg-[#0f172a] text-white hover:bg-[#404040]' : 'text-[#404040]'
														}`}
													>
														{option.label}
													</button>
												);
											})}
										</div>
									);
								})}

								{activeFilter !== 'all' ? (
									/* Fast reset avoids reopening and unselecting manually */
									<div className="border-t border-[#bfbfbf] p-3">
										<button
											type="button"
											onClick={() => {
												setActiveFilter('all');
												setFilterOpen(false);
											}}
											className="w-full rounded-lg py-2 text-sm font-black text-[#808080] hover:bg-[#ffffff]"
										>
											Tilbakestill filter
										</button>
									</div>
								) : null}
							</div>
						)}
					</div>
				</div>

				<div className="mt-6 h-px bg-[#bfbfbf]" />

				{/* Quick entry path for deviation registration outside project context */}
				<button
					type="button"
					onClick={() =>
						navigate('/avvik', {
							state: {
								manualProjectEntry: true,
								returnTo: '/projects',
								returnState: null,
							},
						})
					}
					className="mt-4 flex h-16 w-full items-center justify-center gap-2 rounded-xl bg-[#993333] text-xl font-black tracking-wide text-white hover:bg-[#993333]/80 sm:h-20 sm:gap-3 sm:text-3xl"
				>
					<TriangleAlert className="h-7 w-7 sm:h-9 sm:w-9" />
					Registrer avvik
				</button>

				{/* Project cards lead into document creation scoped to a project */}
				<div className="mt-4 space-y-3 pb-4">
					{visibleProjects.map((project) => {
						// Type icon helps distinguish project categories at a glance
						const Icon = project.type === 'window' ? Link2 : FileText;

						return (
							<button
								key={project.id}
								type="button"
								onClick={() =>
									navigate('/new-document', {
										state: {
											projectNumber: project.projectNumber,
											projectName: project.name,
											manualProjectEntry: false,
										},
									})
								}
							className={`relative w-full rounded-2xl bg-white px-4 py-4 text-left shadow-sm transition hover:bg-[#ffffff] ${
								project.recentlyUpdated ? 'border-[3px] border-[#0f172a]' : 'border border-[#bfbfbf]'
								}`}
							>
								{project.recentlyUpdated ? (
									/* Surface freshness so users prioritize recently changed projects */
									<span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-[#0f172a] px-3 py-1 text-sm font-black text-white sm:px-4 sm:py-1.5 sm:text-base">
										<Zap className="h-4 w-4 text-white/30" /> Nylig
									</span>
								) : null}

								<div className="flex items-start gap-3 sm:items-center sm:gap-4">
									<div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#0f172a] text-white sm:h-16 sm:w-16">
										<Icon className="h-7 w-7 sm:h-9 sm:w-9" />
									</div>

									<div className="flex-1">
										<p className="text-sm font-black uppercase tracking-wide text-[#0f172a] sm:text-xl" style={{ fontFamily: BODY_FONT_FAMILY }}>{project.projectNumber}</p>
										<h2 className="mt-1 text-xl font-black leading-tight text-[#0f172a] sm:text-3xl md:text-4xl">{project.name}</h2>
										<div className="mt-2 flex items-center gap-2 text-base font-bold text-[#404040] sm:text-2xl">
											<MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
											<span>{project.location}</span>
										</div>
										<div className="mt-1 flex items-center gap-2 text-sm font-bold text-[#808080] sm:text-xl" style={{ fontFamily: BODY_FONT_FAMILY }}>
											<CalendarDays className="h-4 w-4 sm:h-5 sm:w-5" />
											<span>{project.lastUpdated}</span>
										</div>
									</div>

									<ChevronRight className="ml-1 h-6 w-6 shrink-0 self-center text-[#808080] sm:ml-3 sm:h-8 sm:w-8" />
								</div>
							</button>
						);
					})}

					{visibleProjects.length === 0 ? (
						/* Empty state confirms filter/search currently hides all projects */
						<div className="rounded-2xl border border-[#bfbfbf] bg-white px-6 py-10 text-center text-[#808080]">Ingen prosjekter matcher søket.</div>
					) : null}
				</div>
			</div>
		</div>
	);
}
