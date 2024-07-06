import { css, html, unsafeCSS, LitElement, type CSSResultGroup, type TemplateResult } from "lit";
import { customElement, eventOptions, state } from "lit/decorators.js";
import { cache } from "lit/directives/cache.js";
import { map } from "lit/directives/map.js";
import { createRef, ref, type Ref } from "lit/directives/ref.js";
import { provide } from "@lit/context";
import type { BroadcastData, BroadcastDebugData, BroadcastSlotItemsData, SlotItemDetail } from "@/types/broadcast";
import type { State } from "@/types/game";
import "@lithtml/components/slots/wheel";
import { kState } from "@lithtml/context/game";
import boxSizingStyles from "@lithtml/styles/box-sizing.css?inline";
import buttonStyles from "@lithtml/styles/button.css?inline";
import headingStyles from "@lithtml/styles/headings.css?inline";

@customElement("lit-game")
export default class LitGame extends LitElement {
	static styles: CSSResultGroup = [
		unsafeCSS(boxSizingStyles),
		unsafeCSS(headingStyles),
		unsafeCSS(buttonStyles),
		css`
			:host {
				contain: layout;
				display: block;
			}

			.wheel-grid {
				column-gap: 0.5rem;
				display: block grid;

				& + button {
					inline-size: 100%;
				}

				::slotted(:where(:not(lit-wheel), lit-wheel:nth-of-type(n + 4))) {
					display: none;
				}
			}

			.debug {
				text-align: start;

				fieldset {
					background-color: var(--btn-bg-color);
					border-color: var(--border-color);
					border-radius: var(--border-radius);
					border-width: var(--border-width);
					font-family: inherit;
					font-size: 1em;
					font-weight: 500;
					transition: var(--border-transition);

					&:hover {
						border-color: var(--btn-hover-color);
					}
				}
			}
		`,
	];

	@state()
	private _disableSpinButton = false;

	@provide({ context: kState })
	private _data: State;

	private _status: string;
	private _debugSelectElement: Ref<HTMLSelectElement>;
	private _timeoutId!: number;
	private _broadcast!: BroadcastChannel;
	private _controller!: AbortController;

	constructor() {
		super();

		this._data = {
			items: Object.freeze(["🐎", "🏇", "🎠", "🐴", "❌"]),
			numberOfSlots: 3,
			slotItems: new Array(3).fill(null),
		};

		this._status = "";
		this._debugSelectElement = createRef<HTMLSelectElement>();
	}

	private _delayRestart() {
		clearTimeout(this._timeoutId);

		this._disableSpinButton = true;
		this._timeoutId = setTimeout(() => {
			this._disableSpinButton = false;
		}, 3_000);
	}

	private _updateStatus() {
		const allMatch = this._data.slotItems.every((v, _, arr) => v === arr[0]);

		if (!allMatch) {
			return (this._status = "Try again!");
		}

		const first = this._data.slotItems[0];

		if (first === this._data.items.at(-1)) {
			this._delayRestart();
			this._status = "You lose!";
		} else if (first !== null) {
			this._delayRestart();
			this._status = "You win!";
		} else {
			this._status = "";
		}
	}

	@eventOptions({ passive: true })
	private _selectItems() {
		this._data.slotItems.forEach((_, idx, arr) => {
			const randomIndex = Math.floor(Math.random() * this._data.items.length);
			arr[idx] = this._data.items[randomIndex];
		});

		this._updateStatus();
		this.requestUpdate();

		this._debugSelectElement.value!.selectedIndex = 0;
		this._broadcast.postMessage({ type: "slotItems", slotItems: [...this._data.slotItems] } as BroadcastSlotItemsData);
	}

	@eventOptions({ passive: true })
	private _debugSlotItems(e: Event) {
		const el = e.target as HTMLSelectElement;

		this._data.slotItems.fill(el.value);
		this._updateStatus();
		this.requestUpdate();

		this._broadcast.postMessage({ type: "debug", debugItem: el.value } as BroadcastDebugData);
	}

	@eventOptions({ passive: true })
	private _handleItem(e: CustomEvent<SlotItemDetail>) {
		const { id, item } = e.detail;

		if (id > 0 && id <= this._data.numberOfSlots) {
			this._data.slotItems[id - 1] = item;
			this._updateStatus();
			this.requestUpdate();
		}
	}

	override connectedCallback(): void {
		super.connectedCallback();

		if (this.isConnected) {
			this._controller?.abort?.();

			this._broadcast = new BroadcastChannel("lit_frontend_slot_machine");
			this._controller = new AbortController();

			this._broadcast.addEventListener(
				"message",
				(e: MessageEvent<BroadcastData>) => {
					const msg = e.data;

					switch (msg.type) {
						case "slotItems":
							{
								const slotItemsBC = (msg as BroadcastSlotItemsData).slotItems;

								if (slotItemsBC.length < this._data.numberOfSlots) {
									break;
								}

								for (let i = 0; i < this._data.numberOfSlots; i++) {
									this._data.slotItems[i] = slotItemsBC[i];
								}

								this._updateStatus();
								this.requestUpdate();
							}
							break;
						case "debug":
							{
								const debugItem = (msg as BroadcastDebugData).debugItem;

								if (!this._data.items.includes(debugItem)) {
									break;
								}

								this._debugSelectElement.value!.value = debugItem;
								this._data.slotItems.fill(debugItem);

								this._updateStatus();
								this.requestUpdate();
							}
							break;
						default:
							break;
					}
				},
				{ passive: true, signal: this._controller.signal }
			);
		}
	}

	override disconnectedCallback(): void {
		super.disconnectedCallback();
		clearTimeout(this._timeoutId);

		this._broadcast?.close?.();
		this._controller?.abort?.();
	}

	render(): TemplateResult {
		return html`
			<style>
				.wheel-grid {
					grid-template-columns: repeat(${this._data.numberOfSlots}, 1fr);
				}
			</style>
			<header>
				<h1>Frontend Slot Machine</h1>
			</header>
			<section class="wheel-grid">
				${cache(
					map(
						this._data.slotItems,
						(item, index) =>
							html`<lit-wheel wheel-id="${index + 1}" item="${item}" @item=${this._handleItem}></lit-wheel>`
					)
				)}
			</section>
			<button type="button" ?disabled=${this._disableSpinButton} @click=${this._selectItems}>Spin the wheel!</button>
			<p>${this._status || "\u200b"}</p>
			<section class="debug">
				<fieldset>
					<legend>For the Cheaters</legend>
					<select ${ref(this._debugSelectElement)} name="selfService" @change=${this._debugSlotItems}>
						<option value="" selected disabled>Select an item</option>
						${cache(map(this._data.items, (item) => html`<option value="${item}">${item}</option>`))}
					</select>
				</fieldset>
			</section>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"lit-game": LitGame;
	}
}
