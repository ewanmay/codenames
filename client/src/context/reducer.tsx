import { State } from "./types";

export const reducer = (state: State, action: Record<string, any>): State => {
  switch (action.type) {
    case "ACTION_TYPE_1": {
      return state;
    };
    case "ACTION_TYPE_2": {
      return state;
    };
    default: {
      return state;
    }
  }
}