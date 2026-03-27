import {
	FALLBACK_PROJECT_CONTEXT,
	createImageCaptureState,
	createSuccessState,
	getProjectContextFromState,
} from './navigation';
import { describe, expect, it } from 'vitest';

describe('navigation helpers', () => {
	describe('getProjectContextFromState', () => {
		it('uses fallback project context when state is missing', () => {
			expect(getProjectContextFromState(null)).toEqual(FALLBACK_PROJECT_CONTEXT);
		});

		it('uses empty defaults when manualProjectEntry is true and project values are missing', () => {
			expect(getProjectContextFromState({ manualProjectEntry: true })).toEqual({
				projectNumber: '',
				projectName: '',
				manualProjectEntry: true,
			});
		});

		it('keeps explicit project values from route state', () => {
			expect(
				getProjectContextFromState({
					projectNumber: 'AF-999',
					projectName: 'Custom Project',
					projectAddress: 'Main Street 1',
					manualProjectEntry: false,
				}),
			).toEqual({
				projectNumber: 'AF-999',
				projectName: 'Custom Project',
				projectAddress: 'Main Street 1',
				manualProjectEntry: false,
			});
		});
	});

	describe('state builders', () => {
		const projectContext = {
			projectNumber: 'AF-123',
			projectName: 'Elkjop Test',
			projectAddress: 'Address 42',
			manualProjectEntry: false,
		};
		const returnNavigation = {
			returnTo: '/current-form',
			returnState: { x: true },
		};

		it('creates image capture state using unified contract', () => {
			expect(
				createImageCaptureState({
					contextKey: 'avvik:AF-123',
					contextTitle: 'Avvik',
					projectContext,
					returnNavigation,
				}),
			).toEqual({
				contextKey: 'avvik:AF-123',
				contextTitle: 'Avvik',
				projectNumber: 'AF-123',
				projectName: 'Elkjop Test',
				projectAddress: 'Address 42',
				returnTo: '/current-form',
				returnState: { x: true },
			});
		});

		it('creates success state using unified contract', () => {
			expect(
				createSuccessState({
					formTitle: 'KS Verksted',
					projectContext,
					returnNavigation,
				}),
			).toEqual({
				formTitle: 'KS Verksted',
				projectNumber: 'AF-123',
				projectName: 'Elkjop Test',
				projectAddress: 'Address 42',
				returnTo: '/current-form',
				returnState: { x: true },
			});
		});
	});
});
