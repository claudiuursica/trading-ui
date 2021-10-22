import { createStore } from "redux";
import reducers from "./reducers";

export const createReduxStore = () => {
  return createStore(reducers);
};
