import { createSignal, type JSXElement } from "solid-js";
// @ts-ignore
import model from "@solid/components/todos/model";
import { useTodoContext } from "@solid/context/todos";

export default function TodoForm(): JSXElement {
	const [, { addTodo }] = useTodoContext(),
		[newTodo, setNewTodo] = createSignal("");

	function submitHandler(e: SubmitEvent) {
		e.preventDefault();
		e.stopPropagation();

		addTodo(newTodo());
		setNewTodo("");

		(e.target as HTMLFormElement).newTodo?.focus?.({ preventScroll: true });
	}

	return (
		<>
			<form onSubmit={submitHandler}>
				<input type="text" name="newTodo" use:model={[newTodo, setNewTodo]} />
				<button type="submit">Add Todo</button>
			</form>
		</>
	);
}
