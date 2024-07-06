import { css, html, unsafeCSS, LitElement, type CSSResultGroup, type PropertyValueMap, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { consume } from "@lit/context";
import type { SlotItemDetail } from "@/types/broadcast";
import type { State } from "@/types/game";
import { kState } from "@lithtml/context/game";
import boxSizingStyles from "@lithtml/styles/box-sizing.css?inline";
import headingStyles from "@lithtml/styles/headings.css?inline";

@customElement("lit-wheel")
export default class LitWheel extends LitElement {
	static styles: CSSResultGroup = [
		unsafeCSS(boxSizingStyles),
		unsafeCSS(headingStyles),
		css`
			:host {
				contain: layout;
				display: block;

				.title {
					line-height: 1;
				}

				.item {
					font-size: 4rem;
					margin-block: 0.46875em;
					user-select: none;
				}
			}
		`,
	];

	@property({ attribute: "wheel-id", reflect: true, type: Number })
	public wheelId = 0;

	@property({ attribute: true, reflect: true, type: String })
	public item: string = "";

	@consume({ context: kState })
	private _data!: State;

	protected override update(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
		if (_changedProperties.has("wheelId")) {
			let oldId = _changedProperties.get("wheelId") as number;

			if (isNaN(oldId) || oldId < 0) {
				oldId = 0;
			}

			if (oldId > 0) {
				this.wheelId = oldId;
			}
		} else if (_changedProperties.has("item")) {
			let oldItem = _changedProperties.get("item") as string | null;

			if (oldItem !== null && !this._data.items.includes(oldItem)) {
				oldItem = null;
			}

			if (this.item !== null && !this._data.items.includes(this.item)) {
				this.item = oldItem as string;
			}

			this.dispatchEvent(
				new CustomEvent<SlotItemDetail>("item", {
					bubbles: true,
					composed: true,
					detail: {
						id: this.wheelId,
						item: this.item,
					},
				})
			);
		}

		super.update(_changedProperties);
	}

	render(): TemplateResult {
		return html`
			<h2 class="title">Wheel ${this.wheelId}</h2>
			<p class="item">${this.item || "\u200b"}</p>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"lit-wheel": LitElement;
	}
}
