<template>
	<router-view v-slot="{ Component }">
		<keep-alive>
			<main class="content">
				<component :is="Component" />
			</main>
		</keep-alive>
	</router-view>
</template>
