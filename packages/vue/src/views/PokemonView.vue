<script setup lang="ts">
import { onErrorCaptured, ref } from "vue";
import Pokemon from "@vuejs/components/suspense/Pokemon.vue";

const pokemonName = ref("ditto"),
	count = ref(1),
	isPending = ref(false),
	error = ref<Error | null>(null);

function increment() {
	count.value += 1;
	pokemonName.value = (count.value & 1) === 0 ? "pikachu" : "ditto";
}

function setPending(value: boolean) {
	isPending.value = value;
}

onErrorCaptured((err: Error) => {
	error.value = err;
});
</script>

<template>
	<suspense>
		<template #default>
			<div v-if="error === null" :class="['pokemon', { pending: isPending }]">
				<pokemon :name="pokemonName" @loading="setPending">
					<button name="counter" type="button" :disabled="isPending" @click="increment">{{ count }}</button>
				</pokemon>
			</div>
			<p v-else>Error happened: {{ error }}</p>
		</template>

		<template #fallback>
			<p>Loading&hellip;</p>
		</template>
	</suspense>
</template>

<style scoped>
.pokemon {
	transition: opacity 0.8s;

	&.pending {
		opacity: 50%;
	}
}
</style>
