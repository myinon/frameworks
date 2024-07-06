import { css, html, unsafeCSS, LitElement, type CSSResultGroup, type TemplateResult } from "lit";
import { customElement, eventOptions } from "lit/decorators.js";
import { ContextProvider } from "@lit/context";
import type {
	BroadcastData,
	BroadcastAddTodoData,
	BroadcastRemoveTodoData,
	BroadcastMarkTodoAsDoneData,
	BroadcastHideCompletedTodosData,
	BroadcastHeadingData,
	MarkTodoAsDoneDetail,
} from "@/types/broadcast";
import type { TodoItem, TodoState } from "@/types/todos";
import { kState } from "@lithtml/context/todos";
import "@lithtml/components/todos/heading";
import "@lithtml/components/todos/form";
import "@lithtml/components/todos/list";
import boxSizingStyles from "@lithtml/styles/box-sizing.css?inline";

@customElement("lit-todo")
export default class LitTodo extends LitElement {
	static styles: CSSResultGroup = [
		unsafeCSS(boxSizingStyles),
		css`
			:host {
				contain: layout;
				display: block;
			}
		`,
	];

	private _data: TodoState;
	private _broadcast!: BroadcastChannel;
	private _controller!: AbortController;
	private _provider: ContextProvider<typeof kState>;

	constructor() {
		super();

		const sessionData = sessionStorage.getItem("lit-todos");

		if (sessionData !== null) {
			this._data = JSON.parse(sessionData) as TodoState;
		} else {
			this._data = {
				todos: [
					{ id: crypto.randomUUID(), text: "Learn HTML", done: true },
					{ id: crypto.randomUUID(), text: "Learn JavaScript", done: true },
					{ id: crypto.randomUUID(), text: "Learn Lit", done: false },
				],
				hideCompleted: false,
				heading: 2,
			};

			sessionStorage.setItem("lit-todos", JSON.stringify(this._data));
		}

		this._provider = new ContextProvider(this, { context: kState, initialValue: this._data });
	}

	private _updateData() {
		this._provider.setValue(this._data, true);
		sessionStorage.setItem("lit-todos", JSON.stringify(this._data));
	}

	private _removeTodo(id: string, send = true) {
		const todoIndex = this._data.todos.findIndex((todo: TodoItem) => todo.id === id);

		if (todoIndex >= 0) {
			this._data.todos.splice(todoIndex, 1);
			this._updateData();

			if (send) {
				this._broadcast.postMessage({ type: "remove", remove: id } as BroadcastRemoveTodoData);
			}
		}
	}

	private _markTodoAsDone({ id, checked }: MarkTodoAsDoneDetail, send = true) {
		const todo = this._data.todos.find((todo: TodoItem) => todo.id === id);

		if (todo) {
			todo.done = checked;
			this._updateData();

			if (send) {
				this._broadcast.postMessage({ type: "mark", mark: { id, checked } } as BroadcastMarkTodoAsDoneData);
			}
		}
	}

	private _hideCompletedTodos(hide: boolean, send = true) {
		if (this._data.hideCompleted !== hide) {
			this._data.hideCompleted = hide;
			this._updateData();

			if (send) {
				this._broadcast.postMessage({ type: "hide", hide } as BroadcastHideCompletedTodosData);
			}
		}
	}

	private _setHeading(heading: number, send = true) {
		if (this._data.heading !== heading) {
			this._data.heading = heading;
			this._updateData();

			if (send) {
				this._broadcast.postMessage({ type: "heading", heading } as BroadcastHeadingData);
			}
		}
	}

	@eventOptions({ passive: true })
	private _handleAddTodo(e: CustomEvent<string>) {
		const text = e.detail,
			todo: TodoItem = {
				id: crypto.randomUUID(),
				text,
				done: false,
			};

		this._data.todos.push(todo);
		this._updateData();

		this._broadcast.postMessage({ type: "add", add: todo } as BroadcastAddTodoData);
		e.stopImmediatePropagation();
	}

	@eventOptions({ passive: true })
	private _handleRemoveTodo(e: CustomEvent<string>) {
		this._removeTodo(e.detail);
		e.stopImmediatePropagation();
	}

	@eventOptions({ passive: true })
	private _handleMarkTodoAsDone(e: CustomEvent<MarkTodoAsDoneDetail>) {
		this._markTodoAsDone(e.detail);
		e.stopImmediatePropagation();
	}

	@eventOptions({ passive: true })
	private _handleHideCompletedTodos(e: CustomEvent<boolean>) {
		this._hideCompletedTodos(e.detail);
		e.stopImmediatePropagation();
	}

	@eventOptions({ passive: true })
	private _handleHeading(e: CustomEvent<number>) {
		this._setHeading(e.detail);
		e.stopImmediatePropagation();
	}

	override connectedCallback(): void {
		super.connectedCallback();

		if (this.isConnected) {
			this._controller?.abort?.();

			this._broadcast = new BroadcastChannel("lit_todo_list");
			this._controller = new AbortController();

			this._broadcast.addEventListener(
				"message",
				(e: MessageEvent<BroadcastData>) => {
					const msg = e.data;

					switch (msg.type) {
						case "add":
							{
								const todo = (msg as BroadcastAddTodoData).add;

								this._data.todos.push(todo);
								this._updateData();
							}
							break;
						case "remove":
							this._removeTodo((msg as BroadcastRemoveTodoData).remove, false);
							break;
						case "mark":
							this._markTodoAsDone((msg as BroadcastMarkTodoAsDoneData).mark, false);
							break;
						case "hide":
							this._hideCompletedTodos((msg as BroadcastHideCompletedTodosData).hide, false);
							break;
						case "heading":
							this._setHeading((msg as BroadcastHeadingData).heading, false);
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

		this._broadcast?.close?.();
		this._controller?.abort?.();
	}

	render(): TemplateResult {
		return html`
			<lit-dynamic-heading @heading=${this._handleHeading}></lit-dynamic-heading>
			<lit-todo-form @add=${this._handleAddTodo}></lit-todo-form>
			<lit-todo-list
				@remove=${this._handleRemoveTodo}
				@mark=${this._handleMarkTodoAsDone}
				@hide=${this._handleHideCompletedTodos}
			></lit-todo-list>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"lit-todo": LitTodo;
	}
}
