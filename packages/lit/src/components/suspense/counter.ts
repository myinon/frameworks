import { css, html, unsafeCSS, LitElement, type CSSResultGroup, type TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";
import "@lithtml/components/suspense/pokemon";
import boxSizingStyles from "@lithtml/styles/box-sizing.css?inline";
import buttonStyles from "@lithtml/styles/button.css?inline";

@customElement("lit-counter")
export default class LitCounter extends LitElement {
	static styles: CSSResultGroup = [
		unsafeCSS(boxSizingStyles),
		unsafeCSS(buttonStyles),
		css`
			:host {
				contain: layout;
				display: block;
			}
		`,
	];

	@state()
	private _counter = 1;

	@state()
	private _name = "ditto";

	private _isPending = false;

	private _updateState(): void {
		this._counter += 1;
		this._name = (this._counter & 1) === 0 ? "pikachu" : "ditto";
	}

	render(): TemplateResult {
		return html`
			<lit-pokemon
				pokemon-name="${this._name}"
				@pending=${(e: CustomEvent<boolean>) => {
					const previousValue = this._isPending;

					this._isPending = e.detail;
					this.requestUpdate("_isPending", previousValue);

					e.stopImmediatePropagation();
				}}
			>
				<div>
					<button name="counter" type="button" ?disabled=${this._isPending} @click=${this._updateState}>
						${this._counter}
					</button>
				</div>
			</lit-pokemon>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"lit-counter": LitCounter;
	}
}
