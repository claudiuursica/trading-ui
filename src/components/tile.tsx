import React, { useEffect, useState } from "react";
import { TileModel, StreamingPrice } from "../lib/model";
import { Price } from "./price";
import subscribeToRateStream from "../lib/rates-api";
import { executeTrade, TradeRequest, TradeResponse } from "../lib/trade-api";
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
      tile.ccy1.code,
      tile.ccy2.code,
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

  const handleTradeRequest = () => {
    const req: TradeRequest = {
      tradeType: "MARKET"
    };

    executeTrade(req).then((result: TradeResponse) => {
      const { status, tradeType } = result;
      if (status !== "SUCCESS") {
        throw new Error("Wrong trade type received");
      } else {
        alert(`${tradeType} Trade Successful`);
      }
    });
  };

  return (
    <div className="tile">
      <button className="close-btn" onClick={closeButtonClick}>
        X
      </button>
      <h1>
        {tile.ccy1.name}/{tile.ccy2.name}
      </h1>

      <Price price={price} dps={tile.dps} />
      <button type="button" onClick={handleTradeRequest}>
        Trade SPT
      </button>
    </div>
  );
};
