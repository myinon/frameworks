import {
	createRenderEffect,
	createSignal,
	on,
	onCleanup,
	onMount,
	For,
	type JSXElement,
} from "solid-js";
import { createStore, produce } from "solid-js/store";
import type { BroadcastData, BroadcastSlotItemsData, BroadcastDebugData } from "@/types/broadcast";
import type { State } from "@/types/game";
import styles from "@solid/components/slots/game.css?inline";
import Wheel from "@solid/components/slots/wheel";

export default function Game(): JSXElement {
	const [state, setState] = createStore<State>({
			items: ["🐎", "🏇", "🎠", "🐴", "❌"],
			numberOfSlots: 3,
			slotItems: new Array(3).fill(null),
		}),
		[gameStopStatus, setGameStopStatus] = createSignal(false),
		[status, setStatus] = createSignal("");

	let broadcast: BroadcastChannel,
		controller: AbortController,
		debugSelectElement: HTMLSelectElement,
		timeoutId = -1;

	function selectItems() {
		setState(
			produce(({ items, slotItems }) => {
				slotItems.forEach((_, idx, arr) => {
					const randomIndex = Math.floor(Math.random() * items.length);
					arr[idx] = items[randomIndex];
				});
			})
		);

		debugSelectElement.selectedIndex = 0;
		broadcast.postMessage({ type: "slotItems", slotItems: [...state.slotItems] } as BroadcastSlotItemsData);
	}

	function debugSlotItems(e: Event) {
		const el = e.target as HTMLSelectElement;

		setState(
			produce(({ slotItems }) => {
				slotItems.fill(el.value);
			})
		);

		broadcast.postMessage({ type: "debug", debugItem: el.value } as BroadcastDebugData);
	}

	createRenderEffect(() => {
		const allMatch = state.slotItems.every((v, _, arr) => v === arr[0]);

		if (!allMatch) {
			return setStatus("Try again!");
		}

		const first = state.slotItems[0];

		if (first === state.items.at(-1)) {
			setGameStopStatus(true);
			return setStatus("You lose!");
		} else if (first !== null) {
			setGameStopStatus(true);
			return setStatus("You win!");
		} else {
			return setStatus("");
		}
	});

	createRenderEffect(
		on(
			gameStopStatus,
			(value) => {
				if (value) {
					clearTimeout(timeoutId);

					timeoutId = setTimeout(() => {
						setGameStopStatus(false);
					}, 3_000);
				}

				return value;
			},
			{ defer: true }
		),
		false
	);

	onMount(() => {
		broadcast = new BroadcastChannel("solidjs_frontend_slot_machine");
		controller = new AbortController();

		broadcast.addEventListener(
			"message",
			(e: MessageEvent<BroadcastData>) => {
				const msg = e.data;

				switch (msg.type) {
					case "slotItems":
						{
							const slotItemsBC = (msg as BroadcastSlotItemsData).slotItems;

							if (slotItemsBC.length < state.numberOfSlots) {
								break;
							}

							setState(
								produce(({ numberOfSlots, slotItems }) => {
									for (let i = 0; i < numberOfSlots; i++) {
										slotItems[i] = slotItemsBC[i];
									}
								})
							);
						}
						break;
					case "debug":
						{
							const debugItem = (msg as BroadcastDebugData).debugItem;

							if (!state.items.includes(debugItem)) {
								break;
							}

							debugSelectElement.value = debugItem;

							setState(
								produce(({ slotItems }) => {
									slotItems.fill(debugItem);
								})
							);
						}
						break;
					default:
						break;
				}
			},
			{ passive: true, signal: controller.signal }
		);
	});

	onCleanup(() => {
		clearTimeout(timeoutId);

		broadcast?.close?.();
		controller?.abort?.();
	});

	return (
		<>
			<style>{styles}</style>
			<style>
				{`.wheel-grid {
					grid-template-columns: repeat(${state.numberOfSlots}, 1fr);
				}`}
			</style>
			<header>
				<h1>Frontend Slot Machine</h1>
			</header>
			<section class="wheel-grid">
				<For each={state.slotItems}>{(item, index) => <Wheel wheelId={index() + 1} item={item} />}</For>
			</section>
			<button type="button" disabled={gameStopStatus()} onClick={selectItems}>
				Spin the wheel!
			</button>
			<p>{status() || "\u200b"}</p>
			<section class="debug">
				<fieldset>
					<legend>For the Cheaters</legend>
					<select ref={debugSelectElement!} name="selfService" onChange={debugSlotItems}>
						<option value="" selected disabled>
							Select an item
						</option>
						<For each={state.items}>{(item) => <option value={item}>{item}</option>}</For>
					</select>
				</fieldset>
			</section>
		</>
	);
}
