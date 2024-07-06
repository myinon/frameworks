<script setup lang="ts">
type WheelProps = {
	wheelId: number;
	item: string | null;
};

const props = defineProps<WheelProps>();
</script>

<template>
	<div class="wheel">
		<h2 class="title">Wheel {{ props.wheelId }}</h2>
		<p class="item">{{ props.item || "&ZeroWidthSpace;" }}</p>
	</div>
</template>

<style scoped>
.wheel {
	text-align: center;

	.title {
		line-height: 1;
	}

	.item {
		margin-block: 0.4688em;
		font-size: 4rem;
		user-select: none;
	}
}
</style>
