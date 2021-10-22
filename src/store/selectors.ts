import { createSelector } from "reselect";
import { AppState } from "./reducers";
import { CurrencyCode, TileModel } from "../lib/model";

export const selectCurrencyById = (id: CurrencyCode) => (state: AppState) =>
  state.currencies[id];

export const selectTiles = createSelector(
  (state: AppState) => state.tiles,
  (state: AppState) => state.currencies,
  (tiles, ccy) =>
    tiles.map(
      (cp) =>
        ({
          id: cp.id,
          base: ccy[cp.base],
          terms: ccy[cp.terms],
          dps: cp.dps
        } as TileModel)
    )
);
