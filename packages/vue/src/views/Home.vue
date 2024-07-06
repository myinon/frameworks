<template>
	<header>
		<h1>🏠 Home Is Where The Heart Is ❤️</h1>
	</header>
	<nav>
		<ul>
			<li>
				<router-link to="/slot-machine">Frontend Slot Machine</router-link>
			</li>
			<li>
				<router-link to="/todos">Todo List</router-link>
			</li>
			<li>
				<router-link to="/suspense">Vue Suspense + Transition</router-link>
			</li>
		</ul>
	</nav>
	<img src="@/assets/vue.svg" class="logo" alt="Vue logo" />
</template>

<style scoped>
nav > ul {
	list-style-type: none;
	padding-inline-start: 0;
}

.logo {
	vertical-align: top;
	padding: 1.5em;
	transition: filter 0.2s;
	block-size: 8em;
	will-change: filter;

	&:hover {
		filter: drop-shadow(0 0 2em #42b883aa);
	}
}
</style>
