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
          ccy1: ccy[cp.ccy1],
          ccy2: ccy[cp.ccy2],
          dps: cp.dps
        } as TileModel)
    )
);
