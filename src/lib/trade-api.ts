export type TradeType = "MARKET" | "LIMIT" | "STOP";

export interface TradeRequest {
  tradeType: TradeType;
}

export type TradeResponseStatus = "SUCCESS" | "ERROR";

export interface TradeResponse {
  status: TradeResponseStatus;
  tradeType: TradeType;
}

export function executeTrade(
  tradeRequest: TradeRequest
): Promise<TradeResponse> {
  const { tradeType } = tradeRequest;
  return new Promise((res) => {
    setTimeout(
      () =>
        res({
          status: "SUCCESS",
          tradeType
        }),
      1000
    );
  });
}
