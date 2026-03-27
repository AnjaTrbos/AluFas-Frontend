export const MAX_IMAGE_UPLOADS = 10;

export interface ImageDraft {
	id: string;
	name: string;
	dataUrl: string;
	source: 'camera' | 'gallery';
	createdAt: string;
}

const STORAGE_PREFIX = 'alufas:image-drafts:';

function getStorageKey(contextKey: string) {
	return `${STORAGE_PREFIX}${contextKey}`;
}

export function loadImageDrafts(contextKey: string): ImageDraft[] {
	if (typeof window === 'undefined') {
		return [];
	}

	try {
		// BACKEND: Replace sessionStorage reads with API call for draft attachments
		// (e.g. GET /forms/{draftId}/attachments) when backend draft persistence is available.
		const raw = window.sessionStorage.getItem(getStorageKey(contextKey));
		if (!raw) {
			return [];
		}

		const parsed = JSON.parse(raw) as ImageDraft[];
		if (!Array.isArray(parsed)) {
			return [];
		}

		return parsed.filter((item) => item && typeof item.id === 'string' && typeof item.dataUrl === 'string');
	} catch {
		return [];
	}
}

export function saveImageDrafts(contextKey: string, drafts: ImageDraft[]) {
	if (typeof window === 'undefined') {
		return;
	}

	// BACKEND: Replace sessionStorage writes with API call that stores image metadata/ids
	// returned from upload endpoints, so drafts survive refresh and multi-device usage.
	window.sessionStorage.setItem(getStorageKey(contextKey), JSON.stringify(drafts));
}

export function getImageDraftCount(contextKey: string) {
	return loadImageDrafts(contextKey).length;
}

export function createImageContextKey(baseKey: string, projectNumber?: string) {
	return projectNumber ? `${baseKey}:${projectNumber}` : baseKey;
}

export function fileToDataUrl(file: File) {
	return new Promise<string>((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
		reader.onerror = () => reject(reader.error ?? new Error('Kunne ikke lese bildefilen.'));
		reader.readAsDataURL(file);
	});
}
