import { createComputed, createSignal, For, type JSXElement } from "solid-js";
import type { TodoItem, TodoList } from "@/types/todos";
import { useTodoContext } from "@solid/context/todos";

export default function TodoList(): JSXElement {
	const [state, { removeTodo, markTodoAsDone, broadcastHideCompletedTodosMessage, setState }] = useTodoContext(),
		[filteredTodos, setFilteredTodos] = createSignal<TodoList>(null as unknown as TodoList);

	createComputed(() => {
		setFilteredTodos(state.todos.filter((todo: TodoItem) => (state.hideCompleted ? !todo.done : true)));
	});

	return (
		<>
			<ul>
				<For each={filteredTodos()}>
					{(item) => (
						<li>
							<label>
								<input
									type="checkbox"
									id={item.id}
									name={item.id}
									checked={item.done}
									onChange={(e: Event) => markTodoAsDone(item.id, (e.target as HTMLInputElement).checked)}
								/>
								<span classList={{ done: item.done }}>{item.text}</span>
							</label>
							<button type="button" onClick={() => removeTodo(item.id)}>
								<span>🗙</span>
							</button>
						</li>
					)}
				</For>
			</ul>
			<button
				type="button"
				onClick={() => {
					setState("hideCompleted", !state.hideCompleted);
					broadcastHideCompletedTodosMessage(state.hideCompleted);
				}}
			>
				{state.hideCompleted ? "Show All" : "Hide Completed"}
			</button>
		</>
	);
}
