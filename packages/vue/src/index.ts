import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import Root from "@vuejs/Root.vue";
import "@vuejs/main.css";

const routes = [
		{ path: "/", component: () => import("@vuejs/views/Home.vue") },
		{ path: "/slot-machine", component: () => import("@vuejs/views/Game.vue") },
		{ path: "/suspense", component: () => import("@vuejs/views/PokemonView.vue") },
		{ path: "/todos", component: () => import("@vuejs/views/Todos.vue") },
		{ path: "/:catchAll(.*)*", component: () => import("@vuejs/views/404.vue") },
	],
	router = createRouter({
		history: createWebHistory(),
		routes,
	});

createApp(Root).use(router).mount("#root");
