import { createResource, type Accessor, type JSXElement, type ParentProps } from "solid-js";
import { usePokemonContext, type PokemonContextType } from "@solid/context/pokemon";

type PokemonProps = {
	name: Accessor<string>;
};

export default function Pokemon(props: ParentProps<PokemonProps>): JSXElement {
	const ctx: PokemonContextType = usePokemonContext(),
		cache = new Map<string, any>(),
		[data] = createResource<any, string>(props.name, async (key: string, { value }) => {
			ctx.abort();

			const { promise, resolve } = Promise.withResolvers<AbortController>();

			setTimeout(
				(previousController: AbortController) => {
					resolve(previousController);
				},
				2_000,
				ctx.controller
			);

			const previousController: AbortController = await promise;

			if (!previousController.signal.aborted) {
				if (cache.has(key)) {
					return cache.get(key);
				}

				return fetch(`https://pokeapi.co/api/v2/pokemon/${key}`, {
					signal: ctx.controller.signal,
				})
					.then((response: Response) => response.json())
					.then((json: any) => {
						cache.set(key, json);
						return json;
					});
			} else {
				return value;
			}
		});

	return (
		<>
			<p>{data()?.name}</p>
			<img src={data()?.sprites?.front_default} alt={`${data()?.name} front default sprite`} width="96" height="96" />
			{/* <pre>{JSON.stringify(data(), null, 2)}</pre> */}
		</>
	);
}
