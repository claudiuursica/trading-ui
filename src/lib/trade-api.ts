export interface TradeRequest {
  tradeType: string; //Can be "SPT" or "FWD"
}

export interface TradeResponse {
  tradeType: string; //Can be "SPT" or "FWD"
}

export function executeTrade(trade: TradeRequest): Promise<TradeResponse> {
  return new Promise((res) => {
    setTimeout(
      () =>
        res({
          // With correct types typescript should flag this as the bug
          tradeType: "FWD"
        }),
      1000
    );
  });
}
