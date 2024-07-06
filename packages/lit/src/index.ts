import { css, html, unsafeCSS, LitElement, type CSSResultGroup, type TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { Router } from "@lit-labs/router";
import boxSizingStyles from "@lithtml/styles/box-sizing.css?inline";

declare module globalThis {
	var URLPattern: any;
}

if (!globalThis.URLPattern) {
	await import("urlpattern-polyfill");
}

@customElement("lit-main")
export default class LitMain extends LitElement {
	static styles: CSSResultGroup = [
		unsafeCSS(boxSizingStyles),
		css`
			:host {
				contain: layout;
				display: block;
			}

			.content {
				margin-inline: auto;
				max-inline-size: max-content;
			}
		`,
	];

	private _router = new Router(this, [
		{
			path: "/",
			render: () => html`<lit-home></lit-home>`,
			enter: async () => {
				await import("@lithtml/components/home");
				return true;
			},
		},
		{
			path: "/slot-machine",
			render: () => html`<lit-game></lit-game>`,
			enter: async () => {
				await import("@lithtml/components/slots")
				return true;
			}
		},
		{
			path: "/suspense",
			render: () => html`<lit-counter></lit-counter>`,
			enter: async () => {
				await import("@lithtml/components/suspense/counter");
				return true;
			},
		},
		{
			path: "/todos",
			render: () => html`<lit-todo></lit-todo>`,
			enter: async () => {
				await import("@lithtml/components/todos");
				return true;
			}
		},
		{
			path: "/*",
			render: () => html`<lit-not-found></lit-not-found>`,
			enter: async () => {
				await import("@lithtml/components/404");
				return true;
			},
		},
	]);

	render(): TemplateResult {
		return html`<main class="content">${this._router.outlet()}</main>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"lit-main": LitMain;
	}
}
