import type { JSXElement } from "solid-js";
import Counter from "@solid/components/suspense/counter";
import styles from "@solid/components/suspense/pokemon/pokemon.css?inline";
import PokemonContext from "@solid/context/pokemon";

export default function PokemonSuspense(): JSXElement {
	return (
		<>
			<PokemonContext>
				<style>{styles}</style>
				<Counter />
			</PokemonContext>
		</>
	);
}
