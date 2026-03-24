interface BrandLogoProps {
	size?: 'hero' | 'card';
}

export default function BrandLogo({ size = 'hero' }: BrandLogoProps) {
	const logoImagePath = `${import.meta.env.BASE_URL}logo.png`;
	const isHero = size === 'hero';

	return (
		<div
			className={`relative overflow-hidden rounded-[1.5rem] border border-slate-800/80 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.28),_transparent_55%),linear-gradient(135deg,_#0f172a,_#111827_55%,_#1e293b)] shadow-[0_24px_60px_-24px_rgba(15,23,42,0.75)] sm:rounded-[2rem] ${
				isHero ? 'px-4 py-3 sm:px-7 sm:py-5' : 'px-4 py-3 sm:px-5 sm:py-4'
			}`}
		>
			<div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.14)_42%,transparent_70%)] opacity-60" />
			<div className="relative rounded-[1.1rem] border border-white/10 bg-white/5 px-3 py-2.5 backdrop-blur-sm sm:rounded-[1.4rem] sm:px-4 sm:py-3">
				<img
					src={logoImagePath}
					alt="Aluminium Fasader AS"
					className={`${isHero ? 'h-14 max-w-[15rem] md:h-20 md:max-w-[20rem]' : 'h-11 max-w-[13rem] md:h-12 md:max-w-[15rem]'} w-auto object-contain`}
				/>
			</div>
		</div>
	);
}
