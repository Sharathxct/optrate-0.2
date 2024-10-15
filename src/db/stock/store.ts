interface stock_quant {
  quantity: number;
  locked: number;
}

interface stock_type {
  yes: stock_quant;
  no: stock_quant;
}

interface UserStocksBalance {
  [stockId: string]: stock_type;
}

interface StockBalances {
  [userId: string]: UserStocksBalance;
}

export const STOCK_BALANCES: StockBalances = {

}
