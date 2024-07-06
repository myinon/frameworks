<script setup lang="ts">
import { computed, inject } from "vue";
import type { TodoItem, TodoList, TodoState, TodoUpdateState } from "@/types/todos";
import { kState, kUpdateState } from "@vuejs/context/todos";

const state = inject<TodoState>(kState)!,
	{ removeTodo, markTodoAsDone, broadcastHideCompletedTodosMessage } = inject<TodoUpdateState>(kUpdateState)!,
	filteredTodos = computed<TodoList>(() =>
		state.todos.filter((todo: TodoItem) => (state.hideCompleted ? !todo.done : true))
	);

function hideCompleted() {
	state.hideCompleted = !state.hideCompleted;
	broadcastHideCompletedTodosMessage(state.hideCompleted);
}
</script>

<template>
	<ul>
		<li v-for="item in filteredTodos" :key="item.id">
			<label>
				<input
					type="checkbox"
					:id="item.id"
					:name="item.id"
					:checked="item.done"
					@change="markTodoAsDone(item.id, ($event.target as HTMLInputElement).checked)"
				/>
				<span :class="{ done: item.done }">{{ item.text }}</span>
			</label>
			<button type="button" @click="removeTodo(item.id)"><span>🗙</span></button>
		</li>
	</ul>
	<button type="button" @click="hideCompleted">
		{{ state.hideCompleted ? "Show All" : "Hide Completed" }}
	</button>
</template>

<style scoped>
ul {
	display: block grid;
	grid-template-columns:
		[checkbox-left] auto
		[checkbox-right label-left] 1fr
		[label-right button-left] auto
		[button-right];
	gap: 0.625rem 0.25rem;
	list-style-type: none;
	text-align: start;
	padding-inline-start: 0;

	> li {
		display: block grid;
		grid-template-columns: subgrid;
		grid-column: checkbox-left / button-right;
		align-items: safe center;

		label {
			display: block grid;
			grid-template-columns: subgrid;
			grid-column: checkbox-left / label-right;
		}

		button > span {
			position: relative;
			pointer-events: none;
			inset-block-start: -1px;
		}
	}
}

.done {
	text-decoration: line-through;
}
</style>
