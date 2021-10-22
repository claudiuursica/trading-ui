import { CurrencyCode, StreamingPrice } from "../lib/model";
import { without, isNil } from "lodash";
export type RateSubscriptionCallback = (value: StreamingPrice) => void;

const subscriptions: {
  [ccyPair: string]: {
    pollId?: unknown;
    lastRate?: number | string;
    callbacks: RateSubscriptionCallback[];
  };
} = {};

const API_URL =
  "https://free.currconv.com/api/v7/convert?q={CCYPAIR}&compact=ultra&apiKey=36de3c133c6e2fc21b48";
const POLL_INTERVAL_MS = 2000;
const USE_FAKE_STREAM = true;
const FAILURE_RATE = 0;

async function fetchRate(currencyPair: string): Promise<number> {
  if (USE_FAKE_STREAM) {
    // Using fake stream which randomly generates rates
    return new Promise<number>((res, rej) => {
      setTimeout(
        () =>
          Math.random() < FAILURE_RATE ? rej("error") : res(Math.random() + 1),
        200
      );
    });
  }
  const ccyKey = currencyPair.toUpperCase();
  const ccyUrl = API_URL.replace("{CCYPAIR}", ccyKey);

  const response = await fetch(ccyUrl);
  if (response.ok) {
    const responseData = await response.json();
    const rate = responseData[ccyKey];
    if (isNil(rate) || Number.isNaN(rate)) {
      throw new Error("Invalid Response Data");
    }
    return rate;
  } else {
    throw new Error(`${response.status} ${response.statusText}`);
  }
}

function getOrCreateSubscription(ccyPair: string) {
  if (!subscriptions[ccyPair]) {
    subscriptions[ccyPair] = { callbacks: [] };
  }
  return subscriptions[ccyPair];
}

/*
 * Re-entrant, multiplexed subscription function. This function supports
 * multiple concurrent subscriptions. This is useful because React components
 * should be self contained and re-usable. An application should not break
 * if a component is used more than once.
 **/
export default function subscribeToRateStream(
  sellCcy: CurrencyCode,
  buyCcy: CurrencyCode,
  callback: RateSubscriptionCallback,
  pollInterval = POLL_INTERVAL_MS
): () => void {
  const ccyPair = `${buyCcy}_${sellCcy}`.toUpperCase();

  console.log(`rate-subscription>INFO> subscribing to stream "${ccyPair}"`);
  // get or create a subscription record
  const subscription = getOrCreateSubscription(ccyPair);

  // add this callback to the callbacks list
  subscription.callbacks.push(callback);

  // if there is a last price then call back immediately iwth
  // the most recent rate, to save having to wait for the next
  // poll
  if (subscription.lastRate) {
    callback(subscription.lastRate);
  }

  // if poll has not started on this subscription then start it
  if (!subscription.pollId) {
    // define the polling callback
    const pollHandler = async () => {
      //   console.log(`rate-api>LOG> fetching latest ${ccyPair}`);
      let rate: StreamingPrice = undefined;
      try {
        rate = await fetchRate(ccyPair);
        console.log(`rate-api>LOG> ${ccyPair} received`);
      } catch (err) {
        rate = `${err}`;
        console.error(`rate-api>ERROR> failed to retrieve ${ccyPair} ${err}`);
      }

      // record the rate and invoke all callbacks
      subscription.lastRate = rate;
      subscription.callbacks.forEach((cb) => cb(rate));

      // schedule the next poll
      subscription.pollId = setTimeout(pollHandler, pollInterval);
    };

    // schedule first request on next cycle
    subscription.pollId = setTimeout(pollHandler, 0);
  }

  // return the dispose function
  return () => {
    // remove the callback from the callbacks list
    subscription.callbacks = without(subscription.callbacks, callback);

    // callback the callback with undefined to indicate the stream is closed
    callback(undefined);

    //if no further subscriptions remain then clear the polling timeout
    if (subscription.callbacks.length === 0) {
      console.log(`rate-api>INFO> unsubscribing from stream "${ccyPair}"`);
      clearTimeout(subscription.pollId as any);
      subscription.pollId = undefined;
      subscription.lastRate = undefined;
    }
  };
}

export function isRateValid(rate: StreamingPrice) {
  return typeof rate === "number";
}
export function roundToDps(value: number, dps: number): number {
  const factor = Math.pow(10, dps);
  return Math.round(value * factor) / factor;
}
