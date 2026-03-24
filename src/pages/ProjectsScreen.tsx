import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	CalendarDays,
	ChevronDown,
	ChevronRight,
	ChevronUp,
	FileText,
	Link2,
	MapPin,
	Search,
	SlidersHorizontal,
	TriangleAlert,
	Zap,
} from 'lucide-react';
import type { Project } from '../types/app';

type ProjectListItem = Project & {
	recentlyUpdated?: boolean;
	year?: number;
};

type ProjectTab = 'active' | 'closed';

type FilterOption = 'all' | 'a-z' | 'z-a' | 'newest' | 'oldest' | 'window' | 'door' | 'facade' | 'general';

interface FilterConfig {
	value: FilterOption;
	label: string;
	group?: string;
}

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

async function getProjectsData(): Promise<ProjectListItem[]> {
	return DUMMY_PROJECTS;
}

export default function ProjectsScreen() {
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState<ProjectTab>('active');
	const [searchQuery, setSearchQuery] = useState('');
	const [projects, setProjects] = useState<ProjectListItem[]>([]);
	const [activeFilter, setActiveFilter] = useState<FilterOption>('all');
	const [filterOpen, setFilterOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		void getProjectsData().then(setProjects);
	}, []);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
				setFilterOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const visibleProjects = useMemo(() => {
		const q = searchQuery.trim().toLowerCase();

		let list = projects
			.filter((project) => project.status === activeTab)
			.filter((project) =>
				!q
					? true
					: [project.projectNumber, project.name, project.location].some((value) =>
							value.toLowerCase().includes(q),
					  ),
			);

		if (activeFilter === 'window') list = list.filter((project) => project.type === 'window');
		else if (activeFilter === 'door') list = list.filter((project) => project.type === 'door');
		else if (activeFilter === 'facade') list = list.filter((project) => project.type === 'facade');
		else if (activeFilter === 'general') list = list.filter((project) => project.type === 'general');

		if (activeFilter === 'a-z') list = [...list].sort((a, b) => a.name.localeCompare(b.name, 'no'));
		else if (activeFilter === 'z-a') list = [...list].sort((a, b) => b.name.localeCompare(a.name, 'no'));
		else if (activeFilter === 'newest') list = [...list].sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
		else if (activeFilter === 'oldest') list = [...list].sort((a, b) => (a.year ?? 0) - (b.year ?? 0));

		return list;
	}, [activeFilter, activeTab, projects, searchQuery]);

	const activeFilterLabel = FILTER_OPTIONS.find((filter) => filter.value === activeFilter)?.label ?? 'Filtrer';

	return (
		<div className="min-h-screen bg-slate-100 px-4 pb-5 pt-6 font-[Arial,sans-serif] sm:pb-6 sm:pt-10">
			<div className="mx-auto max-w-3xl">
				<h1 className="text-3xl font-black text-slate-900 sm:text-4xl md:text-5xl">Velkommen, Ola Nordmann</h1>

				<div className="mt-5 rounded-xl border border-slate-300 bg-[#c6d5ea] p-1">
					<div className="grid grid-cols-2 gap-1">
						{(['active', 'closed'] as const).map((tab) => (
							<button
								key={tab}
								type="button"
								onClick={() => setActiveTab(tab)}
								style={{ fontSize: 'clamp(0.95rem, 2vw, 1.25rem)', fontWeight: 900 }}
								className={`rounded-lg px-3 py-3 transition-colors sm:px-6 ${
									activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-800/90 hover:bg-white/50'
								}`}
							>
								{tab === 'active' ? 'Aktive prosjekter' : 'Arkiverte prosjekter'}
							</button>
						))}
					</div>
				</div>

				<div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
					<div className="relative flex-1">
						<Search className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-400 sm:h-6 sm:w-6" />
						<input
							type="text"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="Søk prosjekter..."
							aria-label="Søk prosjekter"
							className="h-12 w-full rounded-2xl border border-slate-300 bg-white pr-4 text-lg font-bold text-slate-800 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-slate-300 sm:h-14 sm:text-2xl"
							style={{ paddingLeft: '3.25rem' }}
						/>
					</div>

					<div className="relative w-full sm:w-auto" ref={dropdownRef}>
						<button
							type="button"
							onClick={() => setFilterOpen((prev) => !prev)}
							style={{ fontSize: 'clamp(1rem, 2vw, 1.1rem)', fontWeight: 700 }}
							className={`inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border-[3px] border-[#1e3a5f] px-5 transition-colors sm:h-14 sm:w-auto ${
								activeFilter !== 'all' ? 'bg-slate-900 text-white' : 'bg-white text-[#1e3a5f] hover:bg-slate-50'
							}`}
						>
							<SlidersHorizontal className="h-5 w-5 sm:h-6 sm:w-6" />
							{activeFilter === 'all' ? 'Filtrer' : activeFilterLabel}
							{filterOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
						</button>

						{filterOpen && (
							<div className="absolute right-0 top-full z-50 mt-2 min-w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:min-w-56">
								{FILTER_GROUPS.map((group) => {
									const items = FILTER_OPTIONS.filter((filter) => (filter.group ?? '') === group);
									if (items.length === 0) return null;

									return (
										<div key={group || 'top'}>
											{group && (
												<p className="px-4 pb-1 pt-3 text-xs font-black uppercase tracking-widest text-slate-400">
													{group}
												</p>
											)}
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
														className={`flex w-full items-center gap-3 px-4 py-3 text-left text-base font-bold transition-colors hover:bg-slate-100 sm:text-lg ${
															isActive ? 'bg-slate-900 text-white hover:bg-slate-800' : 'text-slate-700'
														}`}
													>
														{option.label}
													</button>
												);
											})}
										</div>
									);
								})}

								{activeFilter !== 'all' && (
									<div className="border-t border-slate-200 p-3">
										<button
											type="button"
											onClick={() => {
												setActiveFilter('all');
												setFilterOpen(false);
											}}
											className="w-full rounded-lg py-2 text-sm font-black text-slate-500 hover:bg-slate-100"
										>
											Tilbakestill filter
										</button>
									</div>
								)}
							</div>
						)}
					</div>
				</div>

				<div className="mt-6 h-px bg-slate-300" />

				<button
					type="button"
					onClick={() => navigate('/avvik', { state: { manualProjectEntry: true } })}
					className="mt-4 flex h-16 w-full items-center justify-center gap-2 rounded-xl bg-[#b91d2a] text-xl font-black tracking-wide text-white hover:bg-[#a61a27] sm:h-20 sm:gap-3 sm:text-3xl"
				>
					<TriangleAlert className="h-7 w-7 sm:h-9 sm:w-9" />
					Registrer avvik
				</button>

				<div className="mt-4 space-y-3 pb-4">
					{visibleProjects.map((project) => {
						const Icon = project.type === 'window' ? Link2 : FileText;

						return (
							<button
								key={project.id}
								type="button"
								onClick={() => navigate('/new-document')}
								className={`relative w-full rounded-2xl bg-white px-4 py-4 text-left shadow-sm transition hover:bg-slate-50 ${
									project.recentlyUpdated ? 'border-[3px] border-slate-900' : 'border border-slate-300'
								}`}
							>
								{project.recentlyUpdated && (
									<span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1 text-sm font-black text-white sm:px-4 sm:py-1.5 sm:text-base">
										<Zap className="h-4 w-4 text-white/30" /> Nylig
									</span>
								)}

								<div className="flex items-start gap-3 sm:items-center sm:gap-4">
									<div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-slate-900 text-white sm:h-16 sm:w-16">
										<Icon className="h-7 w-7 sm:h-9 sm:w-9" />
									</div>

									<div className="flex-1">
										<p className="text-sm font-black uppercase tracking-wide text-blue-700 sm:text-xl">
											{project.projectNumber}
										</p>
										<h2 className="mt-1 text-xl font-black leading-tight text-slate-900 sm:text-3xl md:text-4xl">
											{project.name}
										</h2>
										<div className="mt-2 flex items-center gap-2 text-base font-bold text-slate-700 sm:text-2xl">
											<MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
											<span>{project.location}</span>
										</div>
										<div className="mt-1 flex items-center gap-2 text-sm font-bold text-slate-500 sm:text-xl">
											<CalendarDays className="h-4 w-4 sm:h-5 sm:w-5" />
											<span>{project.lastUpdated}</span>
										</div>
									</div>

									<ChevronRight className="ml-1 h-6 w-6 shrink-0 self-center text-slate-400 sm:ml-3 sm:h-8 sm:w-8" />
								</div>
							</button>
						);
					})}

					{visibleProjects.length === 0 && (
						<div className="rounded-2xl border border-slate-300 bg-white px-6 py-10 text-center text-slate-500">
							Ingen prosjekter matcher søket.
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
