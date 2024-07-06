import { css, html, unsafeCSS, LitElement, type CSSResultGroup, type PropertyValueMap, type TemplateResult } from "lit";
import { customElement, eventOptions, property } from "lit/decorators.js";
import { cache } from "lit/directives/cache.js";
import { map } from "lit/directives/map.js";
import { html as unsafeHTML, unsafeStatic } from "lit/static-html.js";
import { consume } from "@lit/context";
import type { TodoState } from "@/types/todos";
import { kState } from "@lithtml/context/todos";
import boxSizingStyles from "@lithtml/styles/box-sizing.css?inline";
import headingStyles from "@lithtml/styles/headings.css?inline";

@customElement("lit-heading")
class LitHeading extends LitElement {
	static styles: CSSResultGroup = [
		unsafeCSS(boxSizingStyles),
		unsafeCSS(headingStyles),
		css`
			:host {
				contain: layout;
				display: block;

				h3 {
					font-size: 1.8em;
				}
			}
		`,
	];

	@property({ attribute: true, reflect: true, type: Number })
	public level = 2;

	protected override update(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
		if (_changedProperties.has("level")) {
			let oldLevel = _changedProperties.get("level");

			if (Number.isNaN(oldLevel) || oldLevel <= 0 || oldLevel > 3) {
				oldLevel = 2;
			}

			if (Number.isNaN(this.level) || this.level <= 0 || this.level > 3) {
				this.level = oldLevel;
			}

			this.dispatchEvent(new CustomEvent<number>("heading", { bubbles: true, composed: true, detail: this.level }));
		}

		super.update(_changedProperties);
	}

	render(): TemplateResult {
		const tagName = unsafeStatic(`h${this.level}`);
		return html`${cache(unsafeHTML`<${tagName} id="${this.level}"><slot></slot></${tagName}>`)}`;
	}
}

@customElement("lit-dynamic-heading")
export default class LitDynamicHeading extends LitElement {
	static styles: CSSResultGroup = [
		unsafeCSS(boxSizingStyles),
		css`
			:host {
				contain: layout;
				display: block;
			}
		`,
	];

	@consume({ context: kState, subscribe: true })
	private _data!: TodoState;

	@eventOptions({ passive: true })
	private _setHeading(e: Event) {
		this.dispatchEvent(
			new CustomEvent<number>("heading", {
				bubbles: true,
				composed: true,
				detail: Number((e.target as HTMLSelectElement).value),
			})
		);
	}

	render(): TemplateResult {
		return html`
			<select name="heading" @change=${this._setHeading}>
				${cache(
					map(
						[1, 2, 3],
						(item) => html`<option value="${item}" .selected=${this._data?.heading === item}>Heading ${item}</option>`
					)
				)}
			</select>
			<header>
				<lit-heading level="${this._data?.heading}">Test, test</lit-heading>
			</header>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"lit-heading": LitHeading;
		"lit-dynamic-heading": LitDynamicHeading;
	}
}
