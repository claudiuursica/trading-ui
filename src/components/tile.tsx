import React, { useEffect, useState } from "react";
import { TileModel, StreamingPrice } from "../lib/model";
import { Price } from "./price";
import subscribeToRateStream from "../lib/rates-api";
import { executeTrade, TradeRequest } from "../lib/trade-api";
import { createDeleteAction } from "../store/actions";
import { useDispatch } from "react-redux";

interface TileProps {
  tile: TileModel;
}

export const Tile: React.FC<TileProps> = ({ tile }) => {
  const [price, setPrice] = useState<StreamingPrice>(0);

  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = subscribeToRateStream(
      tile.base.code,
      tile.terms.code,
      (price) => {
        setPrice(price);
      }
    );

    return function cleanup() {
      unsubscribe();
    };
  }, [tile]);

  const closeButtonClick = () => {
    const { id } = tile;
    dispatch(createDeleteAction(id));
  };

  const executeTradeClick = () => {
    const req: TradeRequest = {
      tradeType: "SPT"
    };

    executeTrade(req).then((res) => {
      // TODO: Use typescript to guarantee that req.tradeType always
      // matches the res.tradeType, eliminating the need
      // for this check
      if (res.tradeType !== req.tradeType) {
        throw new Error("Wrong trade type received");
      } else {
        alert(`${res.tradeType} Trade Successful`);
      }
    });
  };

  return (
    <div className="tile">
      <button className="close-btn" onClick={closeButtonClick}>
        X
      </button>
      <h1>
        {tile.base.name}/{tile.terms.name}
      </h1>

      <Price price={price} dps={tile.dps} />
      <button type="button" onClick={executeTradeClick}>
        Trade SPT
      </button>
    </div>
  );
};
