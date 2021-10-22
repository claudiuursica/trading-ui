import { has } from "lodash";

export type CurrencyCode = "gbp" | "usd" | "eur";

// StreamingPrice maybe number (price), string (error) or undefined (stream has stopped)
export type StreamingPrice = number | string | undefined;

export interface Currency {
  code: CurrencyCode;
  name: string;
  symbol: string;
}

export const CURRENCIES: { [code in CurrencyCode]: Currency } = {
  gbp: {
    code: "gbp",
    name: "GBP",
    symbol: "£"
  },
  eur: {
    code: "eur",
    name: "EUR",
    symbol: "€"
  },
  usd: {
    code: "usd",
    name: "USD",
    symbol: "$"
  }
};

export interface CurrencyPair {
  base: keyof typeof CURRENCIES;
  terms: keyof typeof CURRENCIES;
  dps: number;
}

export function isCcyPair(obj: any): obj is CurrencyPair {
  return has(obj, "base") && has(obj, "terms") && has(obj, "dps");
}

export const CURRENCY_PAIRS: CurrencyPair[] = [
  { base: "gbp", terms: "usd", dps: 4 },
  { base: "eur", terms: "usd", dps: 4 },
  { base: "eur", terms: "gbp", dps: 4 }
];

export interface TileModel {
  id: string;
  base: Currency;
  terms: Currency;
  dps: number;
}
