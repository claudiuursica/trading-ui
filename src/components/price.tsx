import React from "react";
import { StreamingPrice } from "../lib/model";
import { roundPriceToDps } from "../lib/format";

interface PriceProps {
  price?: StreamingPrice;
  dps: number;
}

export const Price: React.FC<PriceProps> = ({ price, dps }) => {
  return <div className="price">{price && roundPriceToDps(price, dps)}</div>;
};
