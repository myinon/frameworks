import {
	createContext,
	createEffect,
	createUniqueId,
	onCleanup,
	onMount,
	useContext,
	type JSXElement,
	type ParentProps,
} from "solid-js";
import { createStore, produce, type SetStoreFunction } from "solid-js/store";
import type {
	BroadcastData,
	BroadcastAddTodoData,
	BroadcastRemoveTodoData,
	BroadcastMarkTodoAsDoneData,
	BroadcastHideCompletedTodosData,
	BroadcastHeadingData,
} from "@/types/broadcast";
import type { TodoItem, TodoState, TodoUpdateState } from "@/types/todos";

export interface TodoUpdateStateSolid extends TodoUpdateState {
	setState: SetStoreFunction<TodoState>;
}

const Context = createContext<[TodoState, TodoUpdateStateSolid]>([
	{ todos: null as never, hideCompleted: false, heading: 2 },
	{
		addTodo: undefined as never,
		removeTodo: undefined as never,
		markTodoAsDone: undefined as never,
		broadcastHideCompletedTodosMessage: undefined as never,
		broadcastHeadingChangedMessage: undefined as never,
		setState: undefined as never,
	},
]);

export default function TodoContext(props: ParentProps): JSXElement {
	let broadcast: BroadcastChannel,
		controller: AbortController,
		sessionData = sessionStorage.getItem("solidjs-todos");

	const [state, setState] = createStore<TodoState>(
		sessionData !== null
			? (JSON.parse(sessionData) as TodoState)
			: {
					todos: [
						{ id: createUniqueId(), text: "Learn HTML", done: true },
						{ id: createUniqueId(), text: "Learn JavaScript", done: true },
						{ id: createUniqueId(), text: "Learn SolidJS", done: false },
					],
					hideCompleted: false,
					heading: 2,
			  }
	);

	function addTodo(text: string) {
		const todo: TodoItem = {
			id: createUniqueId(),
			text,
			done: false,
		};

		setState(
			produce(({ todos }) => {
				todos.push(todo);
			})
		);

		broadcast.postMessage({ type: "add", add: todo } as BroadcastAddTodoData);
	}

	function removeTodo(todoId: string, send = true) {
		setState(
			produce(({ todos }) => {
				const todoIndex = todos.findIndex((todo: TodoItem) => todo.id === todoId);

				if (todoIndex >= 0) {
					todos.splice(todoIndex, 1);

					if (send) {
						broadcast.postMessage({ type: "remove", remove: todoId } as BroadcastRemoveTodoData);
					}
				}
			})
		);
	}

	function markTodoAsDone(todoId: string, checked: boolean, send = true) {
		setState(
			produce(({ todos }) => {
				const todo = todos.find((todo: TodoItem) => todo.id === todoId);

				if (todo) {
					todo.done = checked;

					if (send) {
						broadcast.postMessage({ type: "mark", mark: { id: todoId, checked } } as BroadcastMarkTodoAsDoneData);
					}
				}
			})
		);
	}

	function broadcastHideCompletedTodosMessage(hide: boolean) {
		broadcast.postMessage({ type: "hide", hide } as BroadcastHideCompletedTodosData);
	}

	function broadcastHeadingChangedMessage(heading: number) {
		broadcast.postMessage({ type: "heading", heading } as BroadcastHeadingData);
	}

	const functions = Object.freeze({
		addTodo,
		removeTodo,
		markTodoAsDone,
		broadcastHideCompletedTodosMessage,
		broadcastHeadingChangedMessage,
		setState,
	}) as TodoUpdateStateSolid;

	createEffect(() => {
		sessionStorage.setItem("solidjs-todos", JSON.stringify(state));
	});

	onMount(() => {
		broadcast = new BroadcastChannel("solidjs_todo_list");
		controller = new AbortController();

		broadcast.addEventListener(
			"message",
			(e: MessageEvent<BroadcastData>) => {
				const msg = e.data;

				switch (msg.type) {
					case "add":
						{
							const todo = (msg as BroadcastAddTodoData).add;
							setState(
								produce(({ todos }) => {
									todos.push(todo);
								})
							);
						}
						break;
					case "remove":
						removeTodo((msg as BroadcastRemoveTodoData).remove, false);
						break;
					case "mark":
						{
							const { id, checked } = (msg as BroadcastMarkTodoAsDoneData).mark;
							markTodoAsDone(id, checked, false);
						}
						break;
					case "hide":
						setState("hideCompleted", (msg as BroadcastHideCompletedTodosData).hide);
						break;
					case "heading":
						setState("heading", (msg as BroadcastHeadingData).heading);
						break;
					default:
						break;
				}
			},
			{ passive: true, signal: controller.signal }
		);
	});

	onCleanup(() => {
		broadcast?.close?.();
		controller?.abort?.();
	});

	return <Context.Provider value={[state, functions]}>{props.children}</Context.Provider>;
}

export function useTodoContext() {
	return useContext(Context);
}
