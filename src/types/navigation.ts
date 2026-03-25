export interface ReturnNavigationState {
	returnTo?: string;
	returnState?: unknown;
}

export interface ProjectContext {
	projectNumber: string;
	projectName: string;
	projectAddress?: string;
	manualProjectEntry: boolean;
}

export interface ProjectRouteState extends ReturnNavigationState {
	projectNumber?: string;
	projectName?: string;
	projectAddress?: string;
	manualProjectEntry?: boolean;
}

export interface ImageCaptureRouteState extends ReturnNavigationState {
	contextKey: string;
	contextTitle: string;
	projectNumber?: string;
	projectName?: string;
	projectAddress?: string;
}

export interface SuccessRouteState extends ReturnNavigationState {
	formTitle?: string;
	projectNumber?: string;
	projectName?: string;
	projectAddress?: string;
}
