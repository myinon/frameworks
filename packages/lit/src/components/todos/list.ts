import { css, html, unsafeCSS, LitElement, type CSSResultGroup, type TemplateResult } from "lit";
import { customElement, eventOptions } from "lit/decorators.js";
import { cache } from "lit/directives/cache.js";
import { classMap } from "lit/directives/class-map.js";
import { repeat } from "lit/directives/repeat.js";
import { consume } from "@lit/context";
import type { MarkTodoAsDoneDetail } from "@/types/broadcast";
import type { TodoItem, TodoList, TodoState } from "@/types/todos";
import { kState } from "@lithtml/context/todos";
import boxSizingStyles from "@lithtml/styles/box-sizing.css?inline";
import buttonStyles from "@lithtml/styles/button.css?inline";

@customElement("lit-todo-list")
export default class LitTodoList extends LitElement {
	static styles: CSSResultGroup = [
		unsafeCSS(boxSizingStyles),
		unsafeCSS(buttonStyles),
		css`
			:host {
				contain: layout;
				display: block;
			}

			ul {
				display: block grid;
				gap: 0.625rem 0.25rem;
				grid-template-columns:
					[checkbox-left] auto
					[checkbox-right label-left] 1fr
					[label-right button-left] auto
					[button-right];
				list-style-type: none;
				padding-inline-start: 0;
				text-align: start;

				> li {
					align-items: safe center;
					display: block grid;
					grid-column: checkbox-left / button-right;
					grid-template-columns: subgrid;

					label {
						display: block grid;
						grid-column: checkbox-left / label-right;
						grid-template-columns: subgrid;
					}

					button > span {
						position: relative;
						inset-block-start: -1px;
						pointer-events: none;
					}
				}
			}

			.done {
				text-decoration: line-through;
			}
		`,
	];

	@consume({ context: kState, subscribe: true })
	private _data!: TodoState;

	private get _filteredTodos(): TodoList | undefined {
		return this._data?.todos?.filter?.((todo: TodoItem) => (this._data?.hideCompleted ? !todo.done : true));
	}

	@eventOptions({ passive: true })
	private _handleMarkTodoAsDone(e: Event) {
		const input = e.target as HTMLInputElement;

		this.dispatchEvent(
			new CustomEvent<MarkTodoAsDoneDetail>("mark", {
				bubbles: true,
				composed: true,
				detail: {
					id: input.id,
					checked: input.checked,
				},
			})
		);
	}

	@eventOptions({ passive: true })
	private _handleRemoveTodo(e: Event) {
		const target = e.target as HTMLElement;

		if (target.tagName === "BUTTON") {
			const id = target.dataset.key;
			this.dispatchEvent(new CustomEvent<string>("remove", { bubbles: true, composed: true, detail: id }));
		}
	}

	@eventOptions({ passive: true })
	private _handleHideCompletedTodos() {
		this.dispatchEvent(
			new CustomEvent<boolean>("hide", { bubbles: true, composed: true, detail: !this._data?.hideCompleted })
		);
	}

	render(): TemplateResult {
		return html`
			<ul @click=${this._handleRemoveTodo} @change=${this._handleMarkTodoAsDone}>
				${cache(
					repeat(
						this._filteredTodos as Iterable<TodoItem>,
						(item) => item.id,
						(item) =>
							html`
								<li>
									<label>
										<input type="checkbox" id="${item.id}" name="${item.id}" .checked=${item.done} />
										<span class="${classMap({ done: item.done })}">${item.text}</span>
									</label>
									<button type="button" data-key="${item.id}">
										<span>🗙</span>
									</button>
								</li>
							`
					)
				)}
			</ul>
			<button type="button" @click=${this._handleHideCompletedTodos}>
				${this._data?.hideCompleted ? "Show All" : "Hide Completed"}
			</button>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"lit-todo-list": LitTodoList;
	}
}
