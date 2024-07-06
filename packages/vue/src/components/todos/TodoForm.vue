<script setup lang="ts">
import { inject, ref } from "vue";
import type { TodoUpdateState } from "@/types/todos";
import { kUpdateState } from "@vuejs/context/todos";

const newTodo = ref(""),
	{ addTodo } = inject<TodoUpdateState>(kUpdateState)!;

function submitHandler(e: Event) {
	addTodo(newTodo.value);
	newTodo.value = "";

	(e.target as HTMLFormElement).newTodo?.focus?.({ preventScroll: true });
}
</script>

<template>
	<form @submit.prevent.stop="submitHandler">
		<input type="text" name="newTodo" v-model="newTodo" />
		<button type="submit">Add Todo</button>
	</form>
</template>

<style scoped>
form {
	display: block flex;
	gap: 0.5rem;
}

input[type="text"] {
	text-indent: 4px;
}
</style>
