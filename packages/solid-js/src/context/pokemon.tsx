import {
	createContext,
	createSignal,
	onCleanup,
	onMount,
	useContext,
	type Accessor,
	type JSXElement,
	type ParentProps,
} from "solid-js";

export type PokemonContextType = {
	state: Accessor<number>;
	increment: () => void;
	controller: AbortController;
	abort: () => void;
};

const Context = createContext<PokemonContextType>({
	state: null as never,
	increment: undefined as never,
	controller: null as never,
	abort: undefined as never,
});

export default function PokemonContext(props: ParentProps): JSXElement {
	const [count, setCount] = createSignal(1),
		globalContext: PokemonContextType = {
			state: count,
			increment() {
				setCount(count() + 1);
			},
			controller: null as never,
			abort() {
				this.controller?.abort?.("Changing pokémon");
				this.controller = new AbortController();
			},
		};

	onMount(() => {
		globalContext.controller = new AbortController();
	});

	onCleanup(() => {
		globalContext.controller?.abort?.();
	});

	return <Context.Provider value={globalContext}>{props.children}</Context.Provider>;
}

export function usePokemonContext() {
	return useContext(Context);
}
