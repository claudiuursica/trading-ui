import { isNil, isNumber, isString } from "lodash";
import { CurrencyPair, isCcyPair } from "./model";
import { roundToDps } from "./rates-api";

/* TODO: Make this function stronly typed */

/* Rounds a either a string or number price to the given decimal places.
    price:          (number\number - the price to format
    dpsOrCcyPair:   (string\CurrencyPair) - number of decimal place to format

  roundPriceToDps(price, dps)
  roundPriceToDps(price, ccyPair)
    
*/
export function roundPriceToDps(
  price,
  dpsOrCcyPair,
) {
  if (isNumber(price) && isNumber(dpsOrCcyPair)) {
    return roundToDps(price, dpsOrCcyPair).toFixed(dpsOrCcyPair);
  } else if (isString(price) && isCcyPair(dpsOrCcyPair)) {
    const priceAsNumber = Number.parseFloat(price);
    return roundToDps(priceAsNumber, dpsOrCcyPair.dps).toString();
  } else {
    throw new Error("Dps must be a number or CurrencyPair");
  }
}
