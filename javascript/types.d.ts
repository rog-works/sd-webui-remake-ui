interface GradioApp {
	getElementById(id: string): HTMLElement | null;
	querySelector(selector: string): HTMLElement | null;
	querySelectorAll(selector: string): NodeListOf<HTMLElement>;
};

declare function onUiLoaded(callback: () => Promise<void>): void;
declare function gradioApp(): GradioApp;
declare function updateInput(HTMLInputElement: input): void;

// via Civitai Helper
declare function open_model_url(event: Event, model_type: 'lora', search_term: string);
declare function add_trigger_words(event: Event, model_type: 'lora', search_term: string);
declare function use_preview_prompt(event: Event, model_type: 'lora', search_term: string);
