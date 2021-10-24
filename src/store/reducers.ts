import { AnyAction } from "redux";
import { CURRENCIES, CURRENCY_PAIRS } from "../lib/model";
import { DELETE_TILE } from "./actions";

const initialState = {
  currencies: CURRENCIES,
  currencyPairs: CURRENCY_PAIRS,
  tiles: CURRENCY_PAIRS.map((currencyPair) => ({
    ...currencyPair,
    id: `${currencyPair.ccy1}${currencyPair.ccy2}`
  }))
};

export type AppState = typeof initialState;

export default function reducers(
  state: AppState = initialState,
  action: AnyAction
) {
  switch (action.type) {
    case DELETE_TILE: {
      const { tileId } = action;
      const { tiles } = state;

      const remainingTiles = tiles.filter(({ id }) => id !== tileId);

      return {
        ...state,
        tiles: remainingTiles
      };
    }
    default:
      return state;
  }
}
