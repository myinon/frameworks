import { css, html, unsafeCSS, LitElement, type CSSResultGroup, type PropertyValueMap, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { Task } from "@lit/task";
import boxSizingStyles from "@lithtml/styles/box-sizing.css?inline";

@customElement("lit-pokemon")
export default class LitPokemon extends LitElement {
	static styles: CSSResultGroup = [
		unsafeCSS(boxSizingStyles),
		css`
			:host {
				contain: layout;
				display: block;
				transition: opacity 0.8s;

				pre {
					max-block-size: 400px;
					max-inline-size: 600px;
					overflow: auto;
					overscroll-behavior: contain;
					text-align: start;
				}
			}

			:host([is-pending]) {
				opacity: 50%;
			}
		`,
	];

	@property({ attribute: "is-pending", reflect: true, type: Boolean })
	isPending = false;

	@property({ attribute: "pokemon-name", reflect: true, type: String })
	pokemonName = "";

	@state()
	private _initialLoad = true;

	private _cache = new Map<string, any>();

	private _dataTask = new Task<readonly string[], any>(this, {
		task: async ([key], { signal }: { signal: AbortSignal }) => {
			const { promise, resolve } = Promise.withResolvers<void>();

			setTimeout(resolve, 2_000);
			await promise;

			if (!signal.aborted) {
				if (this._cache.has(key)) {
					return this._cache.get(key);
				}

				return fetch(`https://pokeapi.co/api/v2/pokemon/${key}`, { signal })
					.then((response: Response) => response.json())
					.then((json: any) => {
						this._cache.set(key, json);
						this._initialLoad = false;
						return json;
					});
			}
		},
		args: () => [this.pokemonName],
	});

	private _getTemplate(data: any): TemplateResult {
		const name: string = data?.name ?? "";

		return html`
			<p>${name}</p>
			<img src="${data?.sprites?.front_default}" alt="${name} front default sprite" width="96" height="96" />
			<!-- <pre>${JSON.stringify(data, null, 2)}</pre> -->
		`;
	}

	protected override updated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
		const pending = _changedProperties.get("isPending");

		if (typeof pending === "boolean") {
			this.dispatchEvent(
				new CustomEvent<boolean>("pending", { bubbles: true, composed: true, detail: this.isPending })
			);
		}

		super.updated(_changedProperties);
	}

	render(): TemplateResult | undefined {
		return this._dataTask.render({
			pending: () => {
				this.isPending = !this._initialLoad;

				return this._initialLoad
					? html`<p>Loading&hellip;</p>`
					: html`<slot></slot>${this._getTemplate(this._dataTask.value)}`;
			},
			complete: (value: any) => {
				this.isPending = false;
				return html`<slot></slot>${this._getTemplate(value)}`;
			},
			error: (e: unknown) => {
				return html`<p>Error happened: ${e}</p>`;
			},
		});
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"lit-pokemon": LitPokemon;
	}
}
