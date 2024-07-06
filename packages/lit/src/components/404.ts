import { css, html, unsafeCSS, LitElement, type CSSResultGroup, type TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import boxSizingStyles from "@lithtml/styles/box-sizing.css?inline";
import headingStyles from "@lithtml/styles/headings.css?inline";

@customElement("lit-not-found")
export default class LitNotFound extends LitElement {
	static styles: CSSResultGroup = [
		unsafeCSS(boxSizingStyles),
		unsafeCSS(headingStyles),
		css`
			:host {
				contain: layout;
				display: block;
			}

			h1 {
				margin-block: 0;
			}
		`,
	];

	render(): TemplateResult {
		return html`<header><h1>404 | Page Not Found</h1></header>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"lit-not-found": LitNotFound;
	}
}
