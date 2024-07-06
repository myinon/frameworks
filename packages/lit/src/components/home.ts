import { css, html, unsafeCSS, LitElement, type CSSResultGroup, type TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import logo from "@/assets/lit.svg?url";
import boxSizingStyles from "@lithtml/styles/box-sizing.css?inline";
import headingStyles from "@lithtml/styles/headings.css?inline";

@customElement("lit-home")
export default class LitHome extends LitElement {
	static styles: CSSResultGroup = [
		unsafeCSS(boxSizingStyles),
		unsafeCSS(headingStyles),
		css`
			:host {
				contain: layout;
				display: block;
			}

			nav > ul {
				list-style-type: none;
				padding-inline-start: 0;
			}

			.logo {
				block-size: 8em;
				padding: 1.5em;
				transition: filter 0.2s;
				vertical-align: top;
				will-change: filter;

				&:hover {
					filter: drop-shadow(0 0 2em #325cffaa);
				}
			}
		`,
	];

	render(): TemplateResult {
		return html`
			<header>
				<h1>🏠 Home Is Where The Heart Is ❤️</h1>
			</header>
			<nav aria-label="Main navigation">
				<ul>
					<li>
						<a href="/slot-machine">Frontend Slot Machine</a>
					</li>
					<li>
						<a href="/todos">Todo List</a>
					</li>
					<li>
						<a href="/suspense">Lit Async + Transition</a>
					</li>
				</ul>
			</nav>
			<img src=${logo} class="logo" alt="Lit logo" />
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"lit-home": LitHome;
	}
}
