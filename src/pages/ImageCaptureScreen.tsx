// Essential React and routing dependencies
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, ImagePlus, Trash2 } from 'lucide-react';
import type { ImageCaptureRouteState } from '../types/navigation';
import {
	MAX_IMAGE_UPLOADS,
	type ImageDraft,
	fileToDataUrl,
	loadImageDrafts,
	saveImageDrafts,
} from '../utils/imageDrafts';
import { APP_FONT_FAMILY, BODY_FONT_FAMILY, UI_COLORS } from '../styles/uiTokens';

// Fallback state if user navigates directly without context
const defaultState: ImageCaptureRouteState = {
	contextKey: 'generic',
	contextTitle: 'Skjema',
	returnTo: '/projects',
};

type ResolvedImageCaptureState = ImageCaptureRouteState & {
	contextKey: string;
	contextTitle: string;
	returnTo: string;
};

const pageStyle = { minHeight: '100vh', background: UI_COLORS.surface0, fontFamily: APP_FONT_FAMILY } as const;
const topBarStyle = { background: UI_COLORS.surface0, borderBottom: `1px solid ${UI_COLORS.line300}`, boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)' } as const;
const topContentStyle = { maxWidth: '76rem', margin: '0 auto', padding: '1rem 1rem 1.25rem' } as const;
const backButtonStyle = {
	display: 'inline-flex',
	alignItems: 'center',
	gap: '0.75rem',
	border: 'none',
	background: 'transparent',
	padding: 0,
	cursor: 'pointer',
	color: UI_COLORS.ink900,
	fontSize: 'clamp(1rem, 2.6vw, 1.35rem)',
	fontWeight: 800,
} as const;
const backBadgeStyle = {
	width: '2.55rem',
	height: '2.55rem',
	borderRadius: '0.9rem',
	background: UI_COLORS.ink900,
	display: 'inline-flex',
	alignItems: 'center',
	justifyContent: 'center',
	flexShrink: 0,
} as const;
const topTextWrapStyle = { marginTop: '1.2rem' } as const;
const titleStyle = { margin: 0, fontSize: 'clamp(1.6rem, 4vw, 2rem)', fontWeight: 900, color: UI_COLORS.ink900, lineHeight: 1.05 } as const;
const contextStyle = { margin: '0.4rem 0 0', fontSize: 'clamp(0.95rem, 2.8vw, 1rem)', fontWeight: 700, color: UI_COLORS.ink900 } as const;
const subtitleStyle = { margin: '0.7rem 0 0', fontSize: 'clamp(0.95rem, 2.8vw, 1rem)', fontWeight: 700, color: UI_COLORS.ink500 } as const;
const bodyStyle = { maxWidth: '76rem', margin: '0 auto', padding: '1.35rem 1rem 2rem' } as const;
const hiddenInputStyle = { display: 'none' } as const;
const actionStackStyle = { display: 'flex', flexDirection: 'column', gap: '0.9rem' } as const;
const actionButtonBaseStyle = {
	width: '100%',
	minHeight: '4rem',
	borderRadius: '1rem',
	fontSize: 'clamp(1rem, 3vw, 1.15rem)',
	fontWeight: 900,
	display: 'inline-flex',
	alignItems: 'center',
	justifyContent: 'center',
	gap: '0.65rem',
} as const;
const errorBoxStyle = {
	marginTop: '1rem',
	borderRadius: '1rem',
	border: `2px solid ${UI_COLORS.statusError}`,
	background: UI_COLORS.surface0,
	padding: '0.9rem 1rem',
	fontSize: 'clamp(0.9rem, 2.6vw, 0.98rem)',
	fontWeight: 700,
	color: UI_COLORS.statusError,
} as const;
const galleryBoxStyle = {
	marginTop: '1.2rem',
	borderRadius: '1.2rem',
	background: UI_COLORS.surface0,
	minHeight: '20rem',
	padding: 'clamp(1rem, 3vw, 1.5rem)',
	border: `1px solid ${UI_COLORS.line300}`,
	display: 'flex',
	flexDirection: 'column',
} as const;
const emptyStateWrapStyle = { textAlign: 'center', color: UI_COLORS.ink500 } as const;
const emptyIconBubbleStyle = {
	width: 'clamp(4rem, 16vw, 5.25rem)',
	height: 'clamp(4rem, 16vw, 5.25rem)',
	borderRadius: '999px',
	background: UI_COLORS.surface0,
	margin: '0 auto 1rem',
	display: 'inline-flex',
	alignItems: 'center',
	justifyContent: 'center',
} as const;
const emptyTitleStyle = { margin: '0 0 0.45rem', fontSize: 'clamp(1rem, 3vw, 1.15rem)', fontWeight: 800, color: UI_COLORS.ink900 } as const;
const emptyDescriptionStyle = { margin: 0, fontSize: 'clamp(0.95rem, 2.8vw, 1rem)', fontWeight: 600 } as const;
const imageGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' } as const;
const cardStyle = { borderRadius: '1rem', border: `1px solid ${UI_COLORS.line300}`, background: UI_COLORS.surface0, overflow: 'hidden', boxShadow: '0 8px 18px rgba(15, 23, 42, 0.05)' } as const;
const imagePreviewStyle = { display: 'block', width: '100%', height: '10rem', objectFit: 'cover', background: UI_COLORS.surface0 } as const;
const cardBodyStyle = { padding: '0.9rem' } as const;
const imageTitleStyle = { margin: '0 0 0.25rem', fontSize: 'clamp(0.9rem, 2.6vw, 0.98rem)', fontWeight: 800, color: UI_COLORS.ink900 } as const;
const imageNameStyle = { margin: '0 0 0.75rem', fontSize: 'clamp(0.82rem, 2.4vw, 0.9rem)', fontWeight: 600, color: UI_COLORS.ink500, wordBreak: 'break-word' } as const;
const imageMetaRowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' } as const;
const sourceLabelStyle = { fontSize: 'clamp(0.78rem, 2.3vw, 0.85rem)', fontWeight: 700, color: UI_COLORS.ink500, fontFamily: BODY_FONT_FAMILY } as const;
const deleteButtonStyle = {
	border: 'none',
	background: UI_COLORS.surface0,
	color: UI_COLORS.statusError,
	borderRadius: '0.8rem',
	padding: '0.55rem',
	cursor: 'pointer',
	display: 'inline-flex',
	alignItems: 'center',
	justifyContent: 'center',
} as const;
const tipStyle = { margin: '1rem 0 0', textAlign: 'center', fontSize: 'clamp(0.82rem, 2.5vw, 0.92rem)', fontWeight: 700, color: UI_COLORS.accentBlue } as const;

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
	const incomingState = (location.state as ImageCaptureRouteState | null) ?? null;
	const state: ResolvedImageCaptureState = {
		...defaultState,
		...incomingState,
		returnTo: incomingState?.returnTo ?? defaultState.returnTo ?? '/projects',
		contextKey: incomingState?.contextKey ?? defaultState.contextKey,
		contextTitle: incomingState?.contextTitle ?? defaultState.contextTitle,
	};
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
	const subtitle = `${images.length} av ${MAX_IMAGE_UPLOADS} bilder`;

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
		<div className="app-font" style={pageStyle}>
			{/* Display title, context, and navigation */}
			<div style={topBarStyle}>
				<div style={topContentStyle}>
				{/* Return to previous screen with state */}
					<button
						type="button"
						onClick={() => navigate(state.returnTo, { state: state.returnState })}
						style={backButtonStyle}
					>
						<span style={backBadgeStyle}>
							<ArrowLeft width={22} height={22} color="#ffffff" strokeWidth={2.6} />
						</span>
						Tilbake
					</button>

					<div style={topTextWrapStyle}>
						<h1 style={titleStyle}>Legg til bilder</h1>
						<p style={contextStyle}>{state.contextTitle}</p>
						<p style={subtitleStyle}>{subtitle}</p>
					</div>
				</div>
			</div>

		{/* Organize upload controls and image gallery */}
		<div style={bodyStyle}>
			{/* Trigger file dialogs from buttons instead of appearing directly */}
			<input
					ref={cameraInputRef}
					type="file"
					accept="image/*"
					capture="environment"
					style={hiddenInputStyle}
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
					style={hiddenInputStyle}
					onChange={(event) => {
						void handleFilesSelected(event.target.files, 'gallery');
						event.currentTarget.value = '';
					}}
				/>

			{/* Allow users to choose between camera and gallery */}
			<div style={actionStackStyle}>
				<button
						type="button"
						onClick={() => cameraInputRef.current?.click()}
						disabled={remainingSlots === 0 || isProcessing}
						style={{
							...actionButtonBaseStyle,
							border: 'none',
							background: remainingSlots === 0 ? UI_COLORS.ink400 : UI_COLORS.ink900,
							color: '#ffffff',
							cursor: remainingSlots === 0 ? 'not-allowed' : 'pointer',
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
							...actionButtonBaseStyle,
							border: `2px solid ${UI_COLORS.ink800}`,
							background: UI_COLORS.surface0,
							color: UI_COLORS.ink900,
							cursor: remainingSlots === 0 ? 'not-allowed' : 'pointer',
						}}
					>
						{/* Visual indicator for gallery action */}
						<ImagePlus width={24} height={24} color="#335299" strokeWidth={2.5} />
						Velg fra galleri
					</button>
				</div>

			{/* Show validation feedback when issues occur */}
			{errorMessage ? (
					<div style={errorBoxStyle}>
						{errorMessage}
					</div>
				) : null}

				{/* Display uploaded images or guide user to upload first */}
				<div
					style={{
						...galleryBoxStyle,
						justifyContent: images.length === 0 ? 'center' : 'flex-start',
					}}
				>
					{images.length === 0 ? (
						<div style={emptyStateWrapStyle}>
							<div style={emptyIconBubbleStyle}>
								<Camera width={34} height={34} color={UI_COLORS.ink400} strokeWidth={2.2} />
							</div>
							<h2 style={emptyTitleStyle}>Ingen bilder ennå</h2>
							<p style={emptyDescriptionStyle}>Ta et bilde eller velg fra galleriet</p>
						</div>
					) : (
						<div style={imageGridStyle}>
							{images.map((image, index) => (
								<div key={image.id} style={cardStyle}>
									<img src={image.dataUrl} alt={image.name} style={imagePreviewStyle} />
									<div style={cardBodyStyle}>
										<p style={imageTitleStyle}>Bilde {index + 1}</p>
										<p style={imageNameStyle}>{image.name}</p>
										<div style={imageMetaRowStyle}>
											<span style={sourceLabelStyle}>{image.source === 'camera' ? 'Tatt med kamera' : 'Valgt fra galleri'}</span>
											<button
												type="button"
												onClick={() => handleRemoveImage(image.id)}
												style={deleteButtonStyle}
											>
												{/* Allow quick removal of specific images */}
												<Trash2 width={18} height={18} strokeWidth={2.3} />
											</button>
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>

				<p style={tipStyle}>Hold kameraet horisontalt for best resultat</p>
			</div>
		</div>
	);
}
