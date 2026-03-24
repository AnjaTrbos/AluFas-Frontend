import { describe, expect, it, vi } from 'vitest';
import {
  createImageContextKey,
  fileToDataUrl,
  getImageDraftCount,
  loadImageDrafts,
  saveImageDrafts,
} from './imageDrafts';

describe('imageDrafts utilities', () => {
  it('creates scoped context keys', () => {
    expect(createImageContextKey('avvik', 'AF-42')).toBe('avvik:AF-42');
    expect(createImageContextKey('avvik')).toBe('avvik');
  });

  it('saves and loads drafts from session storage', () => {
    const drafts = [
      { id: '1', name: 'proof.jpg', dataUrl: 'data:image/jpg;base64,abc', source: 'gallery', createdAt: '2025-01-01' as const },
    ];

    saveImageDrafts('ctx', drafts);

    expect(loadImageDrafts('ctx')).toEqual(drafts);
    expect(getImageDraftCount('ctx')).toBe(1);
  });

  it('returns an empty list for invalid storage data', () => {
    sessionStorage.setItem('alufas:image-drafts:bad', '{invalid json');

    expect(loadImageDrafts('bad')).toEqual([]);
  });

  it('converts files to data URLs', async () => {
    const readAsDataURL = vi.fn(function (this: FileReader) {
      Object.defineProperty(this, 'result', {
        configurable: true,
        value: 'data:image/png;base64,abc123',
      });
      this.onload?.(new ProgressEvent('load'));
    });

    vi.stubGlobal(
      'FileReader',
      class {
        result: string | ArrayBuffer | null = null;
        error: DOMException | null = null;
        onload: ((event: ProgressEvent<FileReader>) => void) | null = null;
        onerror: ((event: ProgressEvent<FileReader>) => void) | null = null;
        readAsDataURL = readAsDataURL;
      } as unknown as typeof FileReader,
    );

    const file = new File(['hello'], 'test.png', { type: 'image/png' });

    await expect(fileToDataUrl(file)).resolves.toBe('data:image/png;base64,abc123');
  });
});
