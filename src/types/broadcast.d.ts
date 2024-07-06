type BroadcastTypes = "slotItems" | "debug" | "add" | "remove" | "mark" | "hide" | "heading";

export interface BroadcastData {
	type: BroadcastTypes;
}

export type SlotItemDetail = {
	id: number;
	item: string;
};

export interface BroadcastSlotItemsData extends BroadcastData {
	slotItems: string[];
}

export interface BroadcastDebugData extends BroadcastData {
	debugItem: string;
}

export interface BroadcastAddTodoData extends BroadcastData {
	add: TodoItem;
}

export interface BroadcastRemoveTodoData extends BroadcastData {
	remove: string;
}

export type MarkTodoAsDoneDetail = {
	id: string;
	checked: boolean;
};

export interface BroadcastMarkTodoAsDoneData extends BroadcastData {
	mark: MarkTodoAsDoneDetail;
}

export interface BroadcastHideCompletedTodosData extends BroadcastData {
	hide: boolean;
}

export interface BroadcastHeadingData extends BroadcastData {
	heading: number;
}
