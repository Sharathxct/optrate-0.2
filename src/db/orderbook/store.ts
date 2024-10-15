interface user_orders {
  [userId: string]: number;
}

interface orders {
  total: number;
  orders: user_orders;
}

interface ordersType {
  [price: string]: orders;
}

interface orderbook {
  [stockId: string]: {
    'yes': ordersType;
    'no': ordersType;
  };
}

export const ORDERBOOK: orderbook = {

}
