import { createContext } from "@lit/context";
import type { TodoState } from "@/types/todos";

export const kState = createContext<TodoState>(Symbol("todo_list_state"));
