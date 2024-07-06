import { createSelector, For, type JSXElement, type ParentProps } from "solid-js";
import { Dynamic } from "solid-js/web";
import { useTodoContext } from "@solid/context/todos";

type HeadingProps = {
	level: number;
};

function Heading(props: ParentProps<HeadingProps>): JSXElement {
	return (
		<>
			<Dynamic component={`h${props.level}`} id={props.level}>
				{props.children}
			</Dynamic>
		</>
	);
}

export default function DynamicHeading(): JSXElement {
	const [state, { broadcastHeadingChangedMessage, setState }] = useTodoContext(),
		isSelected = createSelector<number>(() => state.heading);

	return (
		<>
			<div>
				<select
					name="heading"
					onChange={(e: Event) => {
						setState("heading", Number((e.target as HTMLSelectElement).value));
						broadcastHeadingChangedMessage(state.heading);
					}}
				>
					<For each={[1, 2, 3]}>
						{(item) => (
							<option value={item} selected={isSelected(item)}>
								Heading {item}
							</option>
						)}
					</For>
				</select>
				<header>
					<Heading level={state.heading}>Test, test</Heading>
				</header>
			</div>
		</>
	);
}
