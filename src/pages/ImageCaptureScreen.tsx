// Essential React and routing dependencies
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, ImagePlus, Trash2 } from 'lucide-react';
import {
	MAX_IMAGE_UPLOADS,
	type ImageCaptureLocationState,
	type ImageDraft,
	fileToDataUrl,
	loadImageDrafts,
	saveImageDrafts,
} from '../utils/imageDrafts';

// Fallback state if user navigates directly without context
const defaultState: ImageCaptureLocationState = {
	contextKey: 'generic',
	contextTitle: 'Skjema',
	returnTo: '/projects',
};

// Generate unique identifiable records for each image
function createDraft(file: File, dataUrl: string, source: 'camera' | 'gallery'): ImageDraft {
	return {
		id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
		name: file.name || `${source}-image.jpg`,
		dataUrl,
		source,
		createdAt: new Date().toISOString(),
	};
}

// Allow users to upload photos from camera or gallery
export default function ImageCaptureScreen() {
	const navigate = useNavigate();
	const location = useLocation();
	const state = (location.state as ImageCaptureLocationState | null) ?? defaultState;
	// Trigger file dialogs from button clicks
	const cameraInputRef = useRef<HTMLInputElement | null>(null);
	const galleryInputRef = useRef<HTMLInputElement | null>(null);
	// Track uploaded images during user session
	const [images, setImages] = useState<ImageDraft[]>([]);
	// Communicate validation results to user
	const [errorMessage, setErrorMessage] = useState('');
	const [isProcessing, setIsProcessing] = useState(false);

	// Restore previously saved drafts
	useEffect(() => {
		setImages(loadImageDrafts(state.contextKey));
	}, [state.contextKey]);

	// Show progress on max upload limit
	const remainingSlots = MAX_IMAGE_UPLOADS - images.length;
	const subtitle = useMemo(() => `${images.length} av ${MAX_IMAGE_UPLOADS} bilder`, [images.length]);

	// Ensure drafts persist across navigation
	const persistImages = (nextImages: ImageDraft[]) => {
		setImages(nextImages);
		saveImageDrafts(state.contextKey, nextImages);
	};

	// Validate and process user selections
	const handleFilesSelected = async (fileList: FileList | null, source: 'camera' | 'gallery') => {
		if (!fileList || fileList.length === 0) {
			return;
		}

		setErrorMessage('');
		const files = Array.from(fileList).filter((file) => file.type.startsWith('image/'));

		if (files.length === 0) {
			setErrorMessage('Velg minst én bildefil.');
			return;
		}

		if (files.length > remainingSlots) {
			setErrorMessage(`Du kan legge til maks ${MAX_IMAGE_UPLOADS} bilder.`);
			return;
		}

		setIsProcessing(true);
		try {
			const drafts = await Promise.all(
				files.map(async (file) => {
					const dataUrl = await fileToDataUrl(file);
					return createDraft(file, dataUrl, source);
				}),
			);

			persistImages([...images, ...drafts]);
		} catch {
			setErrorMessage('Kunne ikke laste inn bildene. Prøv igjen.');
		} finally {
			setIsProcessing(false);
		}
	};

	// Allow deletion and update storage
	const handleRemoveImage = (id: string) => {
		persistImages(images.filter((image) => image.id !== id));
	};

	return (
		<div style={{ minHeight: '100vh', background: '#eff4fb', fontFamily: 'Arial, sans-serif' }}>
			{/* Display title, context, and navigation */}
			<div style={{ background: '#ffffff', borderBottom: '1px solid #dbe4ee', boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)' }}>
				<div style={{ maxWidth: '76rem', margin: '0 auto', padding: '1rem 1rem 1.25rem' }}>
				{/* Return to previous screen with state */}
					<button
						type="button"
						onClick={() => navigate(state.returnTo, { state: state.returnState })}
						style={{
							display: 'inline-flex',
							alignItems: 'center',
							gap: '0.75rem',
							border: 'none',
							background: 'transparent',
							padding: 0,
							cursor: 'pointer',
							color: '#0f172a',
							fontSize: 'clamp(1rem, 2.6vw, 1.35rem)',
							fontWeight: 800,
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
						Tilbake
					</button>

					<div style={{ marginTop: '1.2rem' }}>
						<h1 style={{ margin: 0, fontSize: 'clamp(1.6rem, 4vw, 2rem)', fontWeight: 900, color: '#0f172a', lineHeight: 1.05 }}>Legg til bilder</h1>
						<p style={{ margin: '0.4rem 0 0', fontSize: 'clamp(0.95rem, 2.8vw, 1rem)', fontWeight: 700, color: '#0f172a' }}>{state.contextTitle}</p>
						<p style={{ margin: '0.7rem 0 0', fontSize: 'clamp(0.95rem, 2.8vw, 1rem)', fontWeight: 700, color: '#64748b' }}>{subtitle}</p>
					</div>
				</div>
			</div>

		{/* Organize upload controls and image gallery */}
		<div style={{ maxWidth: '76rem', margin: '0 auto', padding: '1.35rem 1rem 2rem' }}>
			{/* Trigger file dialogs from buttons instead of appearing directly */}
			<input
					ref={cameraInputRef}
					type="file"
					accept="image/*"
					capture="environment"
					style={{ display: 'none' }}
					onChange={(event) => {
						void handleFilesSelected(event.target.files, 'camera');
						event.currentTarget.value = '';
					}}
				/>

				<input
					ref={galleryInputRef}
					type="file"
					accept="image/*"
					multiple
					style={{ display: 'none' }}
					onChange={(event) => {
						void handleFilesSelected(event.target.files, 'gallery');
						event.currentTarget.value = '';
					}}
				/>

			{/* Allow users to choose between camera and gallery */}
			<div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
				<button
						type="button"
						onClick={() => cameraInputRef.current?.click()}
						disabled={remainingSlots === 0 || isProcessing}
						style={{
							width: '100%',
							minHeight: '4rem',
							borderRadius: '1rem',
							border: 'none',
							background: remainingSlots === 0 ? '#94a3b8' : '#0f172a',
							color: '#ffffff',
							fontSize: 'clamp(1rem, 3vw, 1.15rem)',
							fontWeight: 900,
							cursor: remainingSlots === 0 ? 'not-allowed' : 'pointer',
							display: 'inline-flex',
							alignItems: 'center',
							justifyContent: 'center',
							gap: '0.65rem',
							boxShadow: '0 10px 18px rgba(15, 23, 42, 0.08)',
						}}
					>
						{/* Visual indicator for camera action */}
						<Camera width={24} height={24} color="#ffffff" strokeWidth={2.5} />
						Ta bilde
					</button>

					<button
						type="button"
						onClick={() => galleryInputRef.current?.click()}
						disabled={remainingSlots === 0 || isProcessing}
						style={{
							width: '100%',
							minHeight: '4rem',
							borderRadius: '1rem',
							border: '2px solid #1e293b',
							background: '#ffffff',
							color: '#0f172a',
							fontSize: 'clamp(1rem, 3vw, 1.15rem)',
							fontWeight: 900,
							cursor: remainingSlots === 0 ? 'not-allowed' : 'pointer',
							display: 'inline-flex',
							alignItems: 'center',
							justifyContent: 'center',
							gap: '0.65rem',
						}}
					>
						{/* Visual indicator for gallery action */}
						<ImagePlus width={24} height={24} color="#0f172a" strokeWidth={2.5} />
						Velg fra galleri
					</button>
				</div>

			{/* Show validation feedback when issues occur */}
			{errorMessage ? (
					<div
						style={{
							marginTop: '1rem',
							borderRadius: '1rem',
							border: '2px solid #fecaca',
							background: '#fef2f2',
							padding: '0.9rem 1rem',
							fontSize: 'clamp(0.9rem, 2.6vw, 0.98rem)',
							fontWeight: 700,
							color: '#991b1b',
						}}
					>
						{errorMessage}
					</div>
				) : null}

				{/* Display uploaded images or guide user to upload first */}
				<div
					style={{
						marginTop: '1.2rem',
						borderRadius: '1.2rem',
						background: '#f8fbff',
						minHeight: '20rem',
						padding: 'clamp(1rem, 3vw, 1.5rem)',
						border: '1px solid #dbe4ee',
						display: 'flex',
						flexDirection: 'column',
						justifyContent: images.length === 0 ? 'center' : 'flex-start',
					}}
				>
					{images.length === 0 ? (
						<div style={{ textAlign: 'center', color: '#64748b' }}>
							<div
								style={{
									width: 'clamp(4rem, 16vw, 5.25rem)',
									height: 'clamp(4rem, 16vw, 5.25rem)',
									borderRadius: '999px',
									background: '#e2e8f0',
									margin: '0 auto 1rem',
									display: 'inline-flex',
									alignItems: 'center',
									justifyContent: 'center',
								}}
							>
								<Camera width={34} height={34} color="#94a3b8" strokeWidth={2.2} />
							</div>
							<h2 style={{ margin: '0 0 0.45rem', fontSize: 'clamp(1rem, 3vw, 1.15rem)', fontWeight: 800, color: '#0f172a' }}>Ingen bilder ennå</h2>
							<p style={{ margin: 0, fontSize: 'clamp(0.95rem, 2.8vw, 1rem)', fontWeight: 600 }}>Ta et bilde eller velg fra galleriet</p>
						</div>
					) : (
						<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
							{images.map((image, index) => (
								<div
									key={image.id}
									style={{
										borderRadius: '1rem',
										border: '1px solid #d8e1ec',
										background: '#ffffff',
										overflow: 'hidden',
										boxShadow: '0 8px 18px rgba(15, 23, 42, 0.05)',
									}}
								>
									<img src={image.dataUrl} alt={image.name} style={{ display: 'block', width: '100%', height: '10rem', objectFit: 'cover', background: '#e2e8f0' }} />
									<div style={{ padding: '0.9rem' }}>
										<p style={{ margin: '0 0 0.25rem', fontSize: 'clamp(0.9rem, 2.6vw, 0.98rem)', fontWeight: 800, color: '#0f172a' }}>Bilde {index + 1}</p>
										<p style={{ margin: '0 0 0.75rem', fontSize: 'clamp(0.82rem, 2.4vw, 0.9rem)', fontWeight: 600, color: '#64748b', wordBreak: 'break-word' }}>{image.name}</p>
										<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
											<span style={{ fontSize: 'clamp(0.78rem, 2.3vw, 0.85rem)', fontWeight: 700, color: '#64748b' }}>{image.source === 'camera' ? 'Tatt med kamera' : 'Valgt fra galleri'}</span>
											<button
												type="button"
												onClick={() => handleRemoveImage(image.id)}
												style={{
													border: 'none',
													background: '#fee2e2',
													color: '#b91c1c',
													borderRadius: '0.8rem',
													padding: '0.55rem',
													cursor: 'pointer',
													display: 'inline-flex',
													alignItems: 'center',
													justifyContent: 'center',
												}}
											>											{/* Allow quick removal of specific images */}												<Trash2 width={18} height={18} strokeWidth={2.3} />
											</button>
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>

				<p style={{ margin: '1rem 0 0', textAlign: 'center', fontSize: 'clamp(0.82rem, 2.5vw, 0.92rem)', fontWeight: 700, color: '#2563eb' }}>Hold kameraet horisontalt for best resultat</p>
			</div>
		</div>
	);
}
