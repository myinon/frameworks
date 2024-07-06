import { resolve } from "node:path";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [solidPlugin(), vue()],
	server: {
		port: 5173,
	},
	build: {
		target: "esnext",
		rollupOptions: {
			input: {
				lithtml: resolve(__dirname, "packages/lit/index.html"),
				solidjs: resolve(__dirname, "packages/solid-js/index.html"),
				vuejs: resolve(__dirname, "packages/vue/index.html"),
			},
		},
	},
	resolve: {
		alias: {
			"@": resolve(__dirname, "src"),
			"@lithtml": resolve(__dirname, "packages/lit/src"),
			"@solid": resolve(__dirname, "packages/solid-js/src"),
			"@vuejs": resolve(__dirname, "packages/vue/src"),
		},
		conditions: ["browser", "development"],
	},
});
