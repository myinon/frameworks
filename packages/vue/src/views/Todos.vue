<script setup lang="ts">
import { onMounted, onUnmounted, provide, reactive, readonly, watchPostEffect } from "vue";
import type {
	BroadcastData,
	BroadcastAddTodoData,
	BroadcastRemoveTodoData,
	BroadcastMarkTodoAsDoneData,
	BroadcastHideCompletedTodosData,
	BroadcastHeadingData,
} from "@/types/broadcast";
import type { TodoItem, TodoState, TodoUpdateState } from "@/types/todos";
import DynamicHeading from "@vuejs/components/todos/DynamicHeading.vue";
import TodoForm from "@vuejs/components/todos/TodoForm.vue";
import TodoList from "@vuejs/components/todos/TodoList.vue";
import { kState, kUpdateState } from "@vuejs/context/todos";

let broadcast: BroadcastChannel,
	controller: AbortController,
	sessionData = sessionStorage.getItem("vuejs-todos");

const state = reactive<TodoState>(
		sessionData !== null
			? (JSON.parse(sessionData) as TodoState)
			: {
					todos: [
						{ id: crypto.randomUUID(), text: "Learn HTML", done: true },
						{ id: crypto.randomUUID(), text: "Learn JavaScript", done: true },
						{ id: crypto.randomUUID(), text: "Learn VueJS", done: false },
					],
					hideCompleted: false,
					heading: 2,
			  }
	),
	stopSaving = watchPostEffect(() => {
		sessionStorage.setItem("vuejs-todos", JSON.stringify(state));
	});

function addTodo(text: string) {
	const todo: TodoItem = {
		id: crypto.randomUUID(),
		text,
		done: false,
	};

	state.todos.push(todo);
	broadcast.postMessage({ type: "add", add: todo } as BroadcastAddTodoData);
}

function removeTodo(todoId: string, send = true) {
	const todoIndex = state.todos.findIndex((todo: TodoItem) => todo.id === todoId);

	if (todoIndex >= 0) {
		state.todos.splice(todoIndex, 1);

		if (send) {
			broadcast.postMessage({ type: "remove", remove: todoId } as BroadcastRemoveTodoData);
		}
	}
}

function markTodoAsDone(todoId: string, checked: boolean, send = true) {
	const todo = state.todos.find((todo: TodoItem) => todo.id === todoId);

	if (todo) {
		todo.done = checked;

		if (send) {
			broadcast.postMessage({ type: "mark", mark: { id: todoId, checked } } as BroadcastMarkTodoAsDoneData);
		}
	}
}

function broadcastHideCompletedTodosMessage(hide: boolean) {
	broadcast.postMessage({ type: "hide", hide } as BroadcastHideCompletedTodosData);
}

function broadcastHeadingChangedMessage(heading: number) {
	broadcast.postMessage({ type: "heading", heading } as BroadcastHeadingData);
}

const functions = readonly<TodoUpdateState>({
	addTodo,
	removeTodo,
	markTodoAsDone,
	broadcastHideCompletedTodosMessage,
	broadcastHeadingChangedMessage,
});

provide<TodoState>(kState, state);
provide<TodoUpdateState>(kUpdateState, functions);

onMounted(() => {
	broadcast = new BroadcastChannel("vuejs_todo_list");
	controller = new AbortController();

	broadcast.addEventListener(
		"message",
		(e: MessageEvent<BroadcastData>) => {
			const msg = e.data;

			switch (msg.type) {
				case "add":
					{
						const todo = (msg as BroadcastAddTodoData).add;
						state.todos.push(todo);
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
					state.hideCompleted = (msg as BroadcastHideCompletedTodosData).hide;
					break;
				case "heading":
					state.heading = (msg as BroadcastHeadingData).heading;
					break;
				default:
					break;
			}
		},
		{ passive: true, signal: controller.signal }
	);
});

onUnmounted(() => {
	stopSaving();

	broadcast?.close?.();
	controller?.abort?.();
});
</script>

<template>
	<dynamic-heading />
	<todo-form />
	<todo-list />
</template>
