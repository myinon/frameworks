import { createSignal, useTransition, ErrorBoundary, Suspense, type JSXElement } from "solid-js";
import Pokemon from "@solid/components/suspense/pokemon";
import { usePokemonContext, type PokemonContextType } from "@solid/context/pokemon";

export default function Counter(): JSXElement {
	const ctx: PokemonContextType = usePokemonContext(),
		[pokemon, setPokemon] = createSignal("ditto"),
		[pending, start] = useTransition();

	function updateState() {
		ctx.increment();
		start(() => setPokemon((ctx.state() & 1) === 0 ? "pikachu" : "ditto"));
	}

	return (
		<>
			<ErrorBoundary fallback={(err: Error) => <p>Error happened: {err.toString()}</p>}>
				<Suspense fallback={<p>Loading&hellip;</p>}>
					<div style={{ opacity: pending() ? "50%" : "100%", transition: "opacity 0.8s" }} class="pokemon">
						<div>
							<button name="counter" type="button" disabled={pending()} onClick={updateState}>
								{ctx.state()}
							</button>
						</div>
						<Pokemon name={pokemon} />
					</div>
				</Suspense>
			</ErrorBoundary>
		</>
	);
}
