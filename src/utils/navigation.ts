import type { ImageCaptureRouteState, ProjectContext, ProjectRouteState, ReturnNavigationState, SuccessRouteState } from '../types/navigation';

export const FALLBACK_PROJECT_CONTEXT: ProjectContext = {
	projectNumber: 'AF-2024-001',
	projectName: 'Elkjøp Hercules',
	manualProjectEntry: false,
};

export function getProjectContextFromState(state?: ProjectRouteState | null): ProjectContext {
	const manualProjectEntry = state?.manualProjectEntry ?? FALLBACK_PROJECT_CONTEXT.manualProjectEntry;
	const defaultProjectNumber = manualProjectEntry ? '' : FALLBACK_PROJECT_CONTEXT.projectNumber;
	const defaultProjectName = manualProjectEntry ? '' : FALLBACK_PROJECT_CONTEXT.projectName;

	return {
		projectNumber: state?.projectNumber ?? defaultProjectNumber,
		projectName: state?.projectName ?? defaultProjectName,
		projectAddress: state?.projectAddress,
		manualProjectEntry,
	};
}

export function getReturnNavigation(state?: ReturnNavigationState | null): ReturnNavigationState {
	return {
		returnTo: state?.returnTo,
		returnState: state?.returnState,
	};
}

export function createReturnNavigation(pathname: string, routeState: unknown): ReturnNavigationState {
	return {
		returnTo: pathname,
		returnState: routeState,
	};
}

export function createImageCaptureState(params: {
	contextKey: string;
	contextTitle: string;
	projectContext: ProjectContext;
	returnNavigation: ReturnNavigationState;
}): ImageCaptureRouteState {
	const { contextKey, contextTitle, projectContext, returnNavigation } = params;
	return {
		contextKey,
		contextTitle,
		projectNumber: projectContext.projectNumber,
		projectName: projectContext.projectName,
		projectAddress: projectContext.projectAddress,
		returnTo: returnNavigation.returnTo,
		returnState: returnNavigation.returnState,
	};
}

export function createSuccessState(params: {
	formTitle: string;
	projectContext: ProjectContext;
	returnNavigation: ReturnNavigationState;
}): SuccessRouteState {
	const { formTitle, projectContext, returnNavigation } = params;
	return {
		formTitle,
		projectNumber: projectContext.projectNumber,
		projectName: projectContext.projectName,
		projectAddress: projectContext.projectAddress,
		returnTo: returnNavigation.returnTo,
		returnState: returnNavigation.returnState,
	};
}
