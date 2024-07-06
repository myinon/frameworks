import { createRenderEffect, onCleanup, type Accessor, type Setter } from "solid-js";

declare module "solid-js" {
	namespace JSX {
		interface Directives {
			model: [Accessor<string>, Setter<string>];
		}
	}
}

export default function model(el: HTMLInputElement, field: Accessor<[Accessor<string>, Setter<string>]>) {
	const [value, setValue] = field?.(),
		handler = (e: Event) => {
			setValue((e.target as HTMLInputElement).value);
		},
		options = { passive: true } as EventListenerOptions;

	el.addEventListener("input", handler, options);

	createRenderEffect(() => (el.value = value()));
	onCleanup(() => {
		el.removeEventListener("input", handler, options);
	});
}
