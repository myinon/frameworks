import type { JSXElement } from "solid-js";

export default function NotFound(): JSXElement {
	return (
		<>
			<style>{`h1 { margin-block: 0 }`}</style>
			<header>
				<h1>404 | Page Not Found</h1>
			</header>
		</>
	);
}
