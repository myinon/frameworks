import type { JSXElement, ParentProps } from "solid-js";

type WheelProps = {
	wheelId: number;
	item: string | null;
};

export default function Wheel(props: ParentProps<WheelProps>): JSXElement {
	return (
		<>
			<div class="wheel">
				<h2 class="title">Wheel {props.wheelId}</h2>
				<p class="item">{props.item || "\u200b"}</p>
			</div>
		</>
	);
}
