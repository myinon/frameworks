import type { JSXElement } from "solid-js";
import TodoForm from "@solid/components/todos/form";
import DynamicHeading from "@solid/components/todos/heading";
import TodoList from "@solid/components/todos/list";
import styles from "@solid/components/todos/todos.css?inline";
import TodoContext from "@solid/context/todos";

export default function Todos(): JSXElement {
	return (
		<TodoContext>
			<style>{styles}</style>
			<DynamicHeading />
			<TodoForm />
			<TodoList />
		</TodoContext>
	);
}
