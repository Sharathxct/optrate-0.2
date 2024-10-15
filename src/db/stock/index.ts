import { STOCK_BALANCES } from "./store";

export function addUserInStock(userId: string) {
  if (STOCK_BALANCES[userId]) {
    throw new Error('User already exists');
  }
  STOCK_BALANCES[userId] = {};
}

export function addStockInUser(userId: string, stock_id: string) {
  if (!STOCK_BALANCES[userId]) {
    addUserInStock(userId);
  }
  STOCK_BALANCES[userId][stock_id] = {
    "yes": {
      quantity: 0,
      locked: 0,
    },
    "no": {
      quantity: 0,
      locked: 0,
    }
  }
}

export function topupStock(userId: string, stock_id: string, stock_type: string, quantity: number) {
  if (stock_type !== "yes" && stock_type !== "no") {
    throw new Error('Invalid stock type. Use "yes" or "no".');
  }
  if (!STOCK_BALANCES[userId]) {
    addUserInStock(userId);
  }
  if (!STOCK_BALANCES[userId].hasOwnProperty(stock_id)) {
    addStockInUser(userId, stock_id);
  }
  const old_stock = STOCK_BALANCES[userId][stock_id][stock_type].quantity;
  STOCK_BALANCES[userId][stock_id][stock_type].quantity = old_stock + quantity;
}

export function deductStock(userId: string, stock_id: string, stock_type: string, quantity: number) {
  if (stock_type !== "yes" && stock_type !== "no") {
    throw new Error('Invalid stock type. Use "yes" or "no".');
  }
  if (!STOCK_BALANCES[userId]) {
    throw new Error('Invalid user id');
  }
  if (!STOCK_BALANCES[userId].hasOwnProperty(stock_id)) {
    throw new Error('Stocks not present');
  }
  const old_stock = STOCK_BALANCES[userId][stock_id][stock_type].quantity;
  if (old_stock < quantity) {
    throw new Error('Stocks insufficient');
  }

  STOCK_BALANCES[userId][stock_id][stock_type].quantity = old_stock + quantity;
}

export function lockStock(userId: string, stock_id: string, stock_type: string, quantity: number) {
  if (stock_type !== "yes" && stock_type !== "no") {
    throw new Error('Invalid stock type. Use "yes" or "no".');
  }
  if (!STOCK_BALANCES[userId]) {
    throw new Error('Invalid user id');
  }
  if (!STOCK_BALANCES[userId].hasOwnProperty(stock_id)) {
    throw new Error('Stocks not present');
  }
  const old_stock = STOCK_BALANCES[userId][stock_id][stock_type].quantity;
  if (old_stock < quantity) {
    throw new Error('Stocks insufficient');
  }

  STOCK_BALANCES[userId][stock_id][stock_type].quantity = old_stock - quantity;
  STOCK_BALANCES[userId][stock_id][stock_type].locked += quantity;
}

export function unlockStock(userId: string, stock_id: string, stock_type: string, quantity: number) {
  if (stock_type !== "yes" && stock_type !== "no") {
    throw new Error('Invalid stock type. Use "yes" or "no".');
  }
  if (!STOCK_BALANCES[userId]) {
    throw new Error('Invalid user id');
  }
  if (!STOCK_BALANCES[userId].hasOwnProperty(stock_id)) {
    throw new Error('Stocks not present');
  }
  const locked_stock = STOCK_BALANCES[userId][stock_id][stock_type].locked;
  if (locked_stock < quantity) {
    throw new Error('Stocks insufficient');
  }
  STOCK_BALANCES[userId][stock_id][stock_type].locked = locked_stock - quantity;
  STOCK_BALANCES[userId][stock_id][stock_type].quantity += quantity;
}

export function getStockBalance(userId: string, stockId: string, stock_type: string) {
  if (stock_type !== "yes" && stock_type !== "no") {
    throw new Error('Invalid stock type. Use "yes" or "no".');
  }
  if (!STOCK_BALANCES[userId]) {
    throw new Error('Invalid user id');
  }
  if (!STOCK_BALANCES[userId].hasOwnProperty(stockId)) {
    throw new Error('Stocks not present');
  }

  return STOCK_BALANCES[userId][stockId][stock_type]['quantity'];
}

export default STOCK_BALANCES;
