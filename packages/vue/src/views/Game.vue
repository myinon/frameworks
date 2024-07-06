<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref, watch } from "vue";
import type { BroadcastData, BroadcastSlotItemsData, BroadcastDebugData } from "@/types/broadcast";
import type { State } from "@/types/game";
import Wheel from "@vuejs/components/slots/Wheel.vue";

let broadcast: BroadcastChannel,
	controller: AbortController,
	debugSelectElement = ref<HTMLSelectElement>();

const state = reactive<State>({
		items: ["🐎", "🏇", "🎠", "🐴", "❌"],
		numberOfSlots: 3,
		slotItems: new Array(3).fill(null),
	}),
	gameStopStatus = ref(false),
	status = computed(() => {
		const allMatch = state.slotItems.every((v, _, arr) => v === arr[0]);

		if (!allMatch) {
			return "Try again!";
		}

		const first = state.slotItems[0];

		if (first === state.items.at(-1)) {
			gameStopStatus.value = true;
			return "You lose!";
		} else if (first !== null) {
			gameStopStatus.value = true;
			return "You win!";
		} else {
			return "";
		}
	}),
	stopReenableGame = watch(gameStopStatus, (value, _, onCleanup) => {
		if (value) {
			let timeoutId = -1;

			onCleanup(() => {
				clearTimeout(timeoutId);
			});

			timeoutId = setTimeout(() => {
				gameStopStatus.value = false;
			}, 3_000);
		}
	});

function selectItems() {
	state.slotItems.forEach((_, idx, arr) => {
		const randomIndex = Math.floor(Math.random() * state.items.length);
		arr[idx] = state.items[randomIndex];
	});

	debugSelectElement.value!.selectedIndex = 0;
	broadcast.postMessage({ type: "slotItems", slotItems: [...state.slotItems] } as BroadcastSlotItemsData);
}

function debugSlotItems(e: Event) {
	const el = e.target as HTMLSelectElement;
	state.slotItems.fill(el.value);

	broadcast.postMessage({ type: "debug", debugItem: el.value } as BroadcastDebugData);
}

onMounted(() => {
	broadcast = new BroadcastChannel("vuejs_frontend_slot_machine");
	controller = new AbortController();

	broadcast.addEventListener(
		"message",
		(e: MessageEvent<BroadcastData>) => {
			const msg = e.data;

			switch (msg.type) {
				case "slotItems":
					{
						const slotItems = (msg as BroadcastSlotItemsData).slotItems;

						if (slotItems.length < state.numberOfSlots) {
							break;
						}

						for (let i = 0; i < state.numberOfSlots; i++) {
							state.slotItems[i] = slotItems[i];
						}
					}
					break;
				case "debug":
					{
						const debugItem = (msg as BroadcastDebugData).debugItem;

						if (!state.items.includes(debugItem)) {
							break;
						}

						debugSelectElement.value!.value = debugItem;
						state.slotItems.fill(debugItem);
					}
					break;
				default:
					break;
			}
		},
		{ passive: true, signal: controller.signal }
	);
});

onUnmounted(() => {
	stopReenableGame();

	broadcast?.close?.();
	controller?.abort?.();
});
</script>

<template>
	<header>
		<h1>Frontend Slot Machine</h1>
	</header>
	<section class="wheel-grid">
		<wheel v-for="(item, idx) in state.slotItems" :key="idx" :wheelId="idx + 1" :item="item" />
	</section>
	<button type="button" :disabled="gameStopStatus" @click="selectItems">Spin the wheel!</button>
	<p>{{ status || "&ZeroWidthSpace;" }}</p>
	<section class="debug">
		<fieldset>
			<legend>For the Cheaters</legend>
			<select ref="debugSelectElement" name="selfService" @change="debugSlotItems">
				<option value="" selected disabled>Select an item</option>
				<option v-for="(item, idx) in state.items" :key="idx" :value="item">{{ item }}</option>
			</select>
		</fieldset>
	</section>
</template>

<style scoped>
.wheel-grid {
	display: block grid;
	grid-template-columns: repeat(v-bind("state.numberOfSlots"), 1fr);
	column-gap: 0.5rem;

	& + button {
		inline-size: 100%;
	}
}

.debug {
	text-align: start;

	fieldset {
		border-width: var(--border-width);
		border-color: var(--border-color);
		border-radius: var(--border-radius);
		background-color: var(--btn-bg-color);
		font-weight: 500;
		font-size: 1em;
		font-family: inherit;
		transition: var(--border-transition);

		&:hover {
			border-color: var(--btn-hover-color);
		}
	}
}
</style>
