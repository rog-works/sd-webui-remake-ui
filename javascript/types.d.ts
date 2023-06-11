interface GradioApp {
	getElementById(id: string): HTMLElement | null;
	querySelector(selector: string): HTMLElement | null;
	querySelectorAll(selector: string): NodeListOf<HTMLElement>;
};

declare function onUiLoaded(callback: () => Promise<void>): void;
declare function gradioApp(): GradioApp;
declare function updateInput(HTMLInputElement: input): void;
