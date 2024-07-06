import { A, Router, Route } from "@solidjs/router";
import { lazy, type JSXElement } from "solid-js";
import { render } from "solid-js/web";
import logo from "@/assets/solid.svg?url";
import styles from "@solid/home.css?inline";
import "@solid/main.css";

function Home(): JSXElement {
	return (
		<>
			<style>{styles}</style>
			<header>
				<h1>🏠 Home Is Where The Heart Is ❤️</h1>
			</header>
			<nav aria-label="Main navigation">
				<ul>
					<li>
						<A href="/slot-machine">Frontend Slot Machine</A>
					</li>
					<li>
						<A href="/todos">Todo List</A>
					</li>
					<li>
						<A href="/suspense">Solid Suspense + Transition</A>
					</li>
				</ul>
			</nav>
			<img src={logo} class="logo" alt="Solid logo" />
		</>
	);
}

render(
	() => (
		<main class="content">
			<Router>
				<Route path="/" component={Home} />
				<Route path="/slot-machine" component={lazy(() => import("@solid/components/slots"))} />
				<Route path="/suspense" component={lazy(() => import("@solid/components/suspense"))} />
				<Route path="/todos" component={lazy(() => import("@solid/components/todos"))} />
				<Route path="*404" component={lazy(() => import("@solid/components/404"))} />
			</Router>
		</main>
	),
	document.getElementById("root")! as HTMLElement
);
