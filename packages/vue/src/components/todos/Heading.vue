<script setup lang="ts">
type HeadingProps = {
	level: number;
};

const props = defineProps<HeadingProps>();
</script>

<template>
	<component :is="`h${props.level}`" :id="props.level">
		<slot />
	</component>
</template>

<style scoped>
h3 {
	font-size: 1.8em;
}
</style>
