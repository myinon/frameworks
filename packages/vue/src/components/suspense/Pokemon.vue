<script setup lang="ts">
import { onUnmounted, ref, watch } from "vue";

type PokemonProps = {
	name: string;
};

type PokemonEmits = {
	loading: [value: boolean];
};

let controller: AbortController = new AbortController();

const props = defineProps<PokemonProps>(),
	emit = defineEmits<PokemonEmits>(),
	cache = new Map<string, any>(),
	data = ref<any>(null),
	stopCatching = watch(
		() => props.name,
		async (name: string) => {
			controller?.abort?.("Changing pokémon");
			controller = new AbortController();

			data.value = await fetchPokemon(name);
		}
	);

async function fetchPokemon(key: string): Promise<any> {
	const { promise, resolve } = Promise.withResolvers<AbortController>();

	emit("loading", true);
	setTimeout(
		(previousController: AbortController) => {
			resolve(previousController);
		},
		2_000,
		controller
	);

	const previousController: AbortController = await promise;

	if (!previousController.signal.aborted) {
		if (cache.has(key)) {
			emit("loading", false);
			return cache.get(key);
		}

		return fetch(`https://pokeapi.co/api/v2/pokemon/${key}`, {
			signal: controller.signal,
		})
			.then((response: Response) => response.json())
			.then((json: any) => {
				cache.set(key, json);
				emit("loading", false);

				return json;
			});
	} else {
		return data.value;
	}
}

onUnmounted(() => {
	stopCatching();
	controller?.abort?.();
});

data.value = await fetchPokemon(props.name);
</script>

<template>
	<div v-show="data?.name">
		<slot />
	</div>
	<p>{{ data?.name }}</p>
	<img :src="data?.sprites?.front_default" :alt="`${data?.name} front default sprite`" width="96" height="96" />
	<!-- <pre>{{ JSON.stringify(data, null, 2) }}</pre> -->
</template>

<style scoped>
pre {
	overflow: auto;
	text-align: start;
	max-block-size: 400px;
	max-inline-size: 600px;
	overscroll-behavior: contain;
}
</style>
