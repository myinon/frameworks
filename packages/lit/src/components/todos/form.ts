import { css, html, unsafeCSS, LitElement, type CSSResultGroup, type TemplateResult } from "lit";
import { customElement, eventOptions } from "lit/decorators.js";
import boxSizingStyles from "@lithtml/styles/box-sizing.css?inline";
import buttonStyles from "@lithtml/styles/button.css?inline";

@customElement("lit-todo-form")
export default class LitTodoForm extends LitElement {
	static styles: CSSResultGroup = [
		unsafeCSS(boxSizingStyles),
		unsafeCSS(buttonStyles),
		css`
			:host {
				contain: layout;
				display: block;
			}

			form {
				display: block flex;
				gap: 0.5rem;
			}

			input[type="text"] {
				text-indent: 4px;
			}
		`,
	];

	@eventOptions({ passive: false })
	private _handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		e.stopImmediatePropagation();

		const newTodo = (e.target as HTMLFormElement).newTodo;
		this.dispatchEvent(new CustomEvent<string>("add", { bubbles: true, composed: true, detail: newTodo.value }));

		newTodo.value = "";
		newTodo.focus({ preventScroll: true });
	}

	render(): TemplateResult {
		return html`
			<form @submit=${this._handleSubmit}>
				<input type="text" name="newTodo" />
				<button type="submit">Add Todo</button>
			</form>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"lit-todo-form": LitTodoForm;
	}
}
