<script setup lang="ts">
import { inject, watch } from "vue";
import type { TodoState, TodoUpdateState } from "@/types/todos";
import Heading from "@vuejs/components/todos/Heading.vue";
import { kState, kUpdateState } from "@vuejs/context/todos";

const state = inject<TodoState>(kState)!,
	{ broadcastHeadingChangedMessage } = inject<TodoUpdateState>(kUpdateState)!;

watch(() => state.heading, broadcastHeadingChangedMessage);
</script>

<template>
	<div>
		<select name="heading" v-model="state.heading">
			<option v-for="(item, index) in [1, 2, 3]" :key="index" :value="item">Heading {{ item }}</option>
		</select>
		<header>
			<heading :level="state.heading">Test, test</heading>
		</header>
	</div>
</template>
