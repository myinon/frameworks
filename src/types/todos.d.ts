export type TodoItem = {
	id: string;
	text: string;
	done: boolean;
};

export type TodoList = TodoItem[];

export type TodoState = {
	todos: TodoList;
	hideCompleted: boolean;
	heading: number;
};

export interface TodoUpdateState {
	addTodo: (text: string) => void;
	removeTodo: (todoId: string) => void;
	markTodoAsDone: (todoId: string, checked: boolean) => void;
	broadcastHideCompletedTodosMessage: (hide: boolean) => void;
	broadcastHeadingChangedMessage: (heading: number) => void;
}
