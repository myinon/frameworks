import { createContext } from "@lit/context";
import type { State } from "@/types/game";

export const kState = createContext<State>(Symbol("slot_machine_state"));
